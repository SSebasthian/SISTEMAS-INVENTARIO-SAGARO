package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.DTOs.Solicitud.AsignacionesSolicitud;
import com.sistemas_inventario_backend.DTOs.Respuesta.AsignacionesRespuesta;
import com.sistemas_inventario_backend.entidades.*;
import com.sistemas_inventario_backend.repositorios.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AsignacionesService {

    private final AsignacionesRepository asignacionRepository;
    private final EmpleadoRepository empleadoRepository;
    private final AreaRepository areaRepository;
    private final EquipoDeComputoRepository equipoDeComputoRepository;
    private final DispositivoMovilRepository dispositivoMovilRepository;
    private final ImpresoraRepository impresoraRepository;
    private final CatalogoRepository catalogoRepository;
    private final DispositivoTecnologico_TipoRepository tipoRepository;

    // ========== ASIGNAR ==========

    @Transactional
    public AsignacionesRespuesta asignar(AsignacionesSolicitud solicitud) {
        validarExistenciaActivo(solicitud.getCatalogoCodigo(), solicitud.getSerialActivo());

        Catalogo catalogo = catalogoRepository.findById(solicitud.getCatalogoCodigo())
                .orElseThrow(() -> new RuntimeException("Catálogo no válido"));

        DispositivoTecnologico_Tipo tipo = null;
        if (solicitud.getTipoCodigo() != null) {
            tipo = tipoRepository.findById(solicitud.getTipoCodigo())
                    .orElseThrow(() -> new RuntimeException("Tipo no válido"));
        }

        if (asignacionRepository.existsBySerialActivoAndActivoTrue(solicitud.getSerialActivo())) {
            throw new RuntimeException("El serial ya está asignado activamente");
        }

        Asignaciones asignacion = new Asignaciones();
        asignacion.setCatalogo(catalogo);
        asignacion.setTipo(tipo);
        asignacion.setSerialActivo(solicitud.getSerialActivo());
        asignacion.setFechaAsignacion(solicitud.getFechaAsignacion() != null ? solicitud.getFechaAsignacion() : LocalDateTime.now());
        asignacion.setObservaciones(solicitud.getObservaciones());
        asignacion.setActivo(true);

        if (solicitud.getCatalogoCodigo() == 3L) { // Impresora
            Area area = areaRepository.findById(solicitud.getAreaCodigo())
                    .orElseThrow(() -> new RuntimeException("Área no encontrada"));
            asignacion.setArea(area);
            asignacion.setEmpleado(null);
        } else { // Equipo o móvil
            Empleado empleado = empleadoRepository.findById(solicitud.getEmpleadoCedula())
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
            asignacion.setEmpleado(empleado);
            asignacion.setArea(null);
        }

        Asignaciones guardada = asignacionRepository.save(asignacion);
        return convertirADTO(guardada);
    }


    // ========== DEVOLVER ==========
    @Transactional
    public void devolver(Long asignacionId, String observacionesDevolucion) {
        Asignaciones asignacion = asignacionRepository.findById(asignacionId)
                .orElseThrow(() -> new RuntimeException("Asignacion no encontrada con ID: " + asignacionId));

        asignacion.setActivo(false);
        asignacion.setFechaDevolucion(LocalDateTime.now());

        if (observacionesDevolucion != null && !observacionesDevolucion.isEmpty()) {
            String obsAnterior = asignacion.getObservaciones();
            asignacion.setObservaciones(obsAnterior != null ?
                    obsAnterior + " | DEVOLUCIÓN: " + observacionesDevolucion :
                    "DEVOLUCIÓN: " + observacionesDevolucion);
        }

        asignacionRepository.save(asignacion);
    }


    // ========== CONSULTAS ==========
    public boolean estaAsignado(String serialActivo) {
        return asignacionRepository.existsBySerialActivoAndActivoTrue(serialActivo);
    }

    public AsignacionesRespuesta obtenerAsignacionActual(String serialActivo) {
        Asignaciones asignacion = asignacionRepository.findFirstBySerialActivoAndActivoTrue(serialActivo);
        return asignacion != null ? convertirADTO(asignacion) : null;
    }

    public List<AsignacionesRespuesta> obtenerHistorialCompleto(String serialActivo) {
        return asignacionRepository.findBySerialActivoOrderByFechaAsignacionDesc(serialActivo)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    public List<AsignacionesRespuesta> obtenerAsignacionesPorEmpleado(String cedula) {
        return asignacionRepository.findByEmpleadoCedulaOrderByFechaAsignacionDesc(cedula)
                .stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    // ========== METODOS PRIVADOS ==========
    private void validarExistenciaActivo(Long catalogoCodigo, String serial) {
        if (catalogoCodigo == 1L) { // EQUIPO DE COMPUTO
            if (!equipoDeComputoRepository.existsById(serial))
                throw new RuntimeException("El equipo de cómputo con serial " + serial + " no existe");
        } else if (catalogoCodigo == 2L) { // DISPOSITIVO MOVIL
            if (!dispositivoMovilRepository.existsById(serial))
                throw new RuntimeException("El dispositivo móvil con serial " + serial + " no existe");
        } else if (catalogoCodigo == 3L) { // IMPRESORA
            if (!impresoraRepository.existsById(serial))
                throw new RuntimeException("La impresora con serial " + serial + " no existe");
        } else {
            throw new RuntimeException("Catálogo no válido: " + catalogoCodigo);
        }
    }

    private AsignacionesRespuesta convertirADTO(Asignaciones a) {
        AsignacionesRespuesta dto = new AsignacionesRespuesta();
        dto.setCodigo(a.getCodigo());
        dto.setCatalogoCodigo(a.getCatalogo().getCodigo());
        dto.setCatalogoNombre(a.getCatalogo().getNombre());
        dto.setSerialActivo(a.getSerialActivo());
        dto.setFechaAsignacion(a.getFechaAsignacion());
        dto.setFechaDevolucion(a.getFechaDevolucion());
        dto.setObservaciones(a.getObservaciones());
        dto.setActivo(a.getActivo());

        if (a.getTipo() != null) {
            dto.setTipoCodigo(a.getTipo().getCodigo());
            dto.setTipoDescripcion(a.getTipo().getDescripcion());
        }

        if (a.getEmpleado() != null) {
            dto.setEmpleadoCedula(a.getEmpleado().getCedula());
            dto.setEmpleadoNombre(a.getEmpleado().getNombre());
            dto.setEmpleadoApellido(a.getEmpleado().getApellido());
        }

        if (a.getArea() != null) {
            dto.setAreaCodigo(a.getArea().getCodigo());
            dto.setAreaDescripcion(a.getArea().getDescripcion());
        }

        return dto;
    }
}
