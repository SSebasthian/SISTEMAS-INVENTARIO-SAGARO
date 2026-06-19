package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.DTOs.Respuesta.AsignacionPorEmpleado;
import com.sistemas_inventario_backend.DTOs.Solicitud.AsignacionesSolicitud;
import com.sistemas_inventario_backend.DTOs.Respuesta.AsignacionesRespuesta;
import com.sistemas_inventario_backend.entidades.*;
import com.sistemas_inventario_backend.repositorios.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
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
    private final EquipoDeComputo_DetalleRepository detalleRepository;



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
        asignacion.setFechaAsignacion(solicitud.getFechaAsignacion() != null ?
                solicitud.getFechaAsignacion() : LocalDate.now());
        asignacion.setObservaciones(solicitud.getObservaciones());
        asignacion.setActivo(true);

        // SIEMPRE guardar el área
        if (solicitud.getAreaCodigo() != null) {
            Area area = areaRepository.findById(solicitud.getAreaCodigo())
                    .orElseThrow(() -> new RuntimeException("Área no encontrada"));
            asignacion.setArea(area);
        } else {
            throw new RuntimeException("El área es requerida para la asignación");
        }

        // Guardar empleado si existe (puede ser null)
        if (solicitud.getEmpleadoCedula() != null && !solicitud.getEmpleadoCedula().isEmpty()) {
            Empleado empleado = empleadoRepository.findById(solicitud.getEmpleadoCedula())
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
            asignacion.setEmpleado(empleado);
        } else {
            asignacion.setEmpleado(null);
        }

        Asignaciones guardada = asignacionRepository.save(asignacion);

        // Si viene detalle, guardarlo asociado a la asignación
        if (solicitud.getDetalle() != null) {
            EquipoDeComputo_Detalle detalle = solicitud.getDetalle();
            detalle.setAsignacion(guardada);
            detalle.setEquipo(equipoDeComputoRepository.findById(guardada.getSerialActivo()).orElse(null));
            detalle.setActivo(true);
            detalleRepository.save(detalle);
        }


        return convertirADTO(guardada);
    }


    // ========== DEVOLVER ==========
    @Transactional
    public void devolver(Long asignacionId, LocalDate fechaDevolucion, String observacionesDevolucion) {
        Asignaciones asignacion = asignacionRepository.findById(asignacionId)
                .orElseThrow(() -> new RuntimeException("Asignacion no encontrada con ID: " + asignacionId));

        asignacion.setActivo(false);
        asignacion.setFechaDevolucion(fechaDevolucion != null ? fechaDevolucion : LocalDate.now());

        // Reemplazar directamente, no concatenar
        if (observacionesDevolucion != null && !observacionesDevolucion.isEmpty()) {
            asignacion.setObservaciones(observacionesDevolucion);
        }


        EquipoDeComputo_Detalle detalle = detalleRepository.findByAsignacionConsecutivo(asignacionId)
                .orElse(null);
        if (detalle != null) {
            detalle.setActivo(false);
            detalleRepository.save(detalle);
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
                throw new RuntimeException("El equipo de computo con serial " + serial + " no existe");
        } else if (catalogoCodigo == 2L) { // DISPOSITIVO MOVIL
            if (!dispositivoMovilRepository.existsById(serial))
                throw new RuntimeException("El dispositivo movil con serial " + serial + " no existe");
        } else if (catalogoCodigo == 3L) { // IMPRESORA
            if (!impresoraRepository.existsById(serial))
                throw new RuntimeException("La impresora con serial " + serial + " no existe");
        } else {
            throw new RuntimeException("Catalogo no válido: " + catalogoCodigo);
        }
    }

    private AsignacionesRespuesta convertirADTO(Asignaciones a) {
        AsignacionesRespuesta dto = new AsignacionesRespuesta();
        dto.setConsecutivo(a.getConsecutivo());
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


    // OBTENER ASIGNACIONES POR EMPLEADO

    public List<AsignacionPorEmpleado> obtenerAsignacionesPorEmpleadoConDetalle(String cedula) {
        List<Asignaciones> asignaciones = asignacionRepository.findByEmpleadoCedulaAndActivoTrue(cedula);

        return asignaciones.stream().map(a -> {
            AsignacionPorEmpleado dto = new AsignacionPorEmpleado();
            dto.setAsignacionId(a.getConsecutivo());
            dto.setCatalogoCodigo(a.getCatalogo().getCodigo());
            dto.setCatalogoNombre(a.getCatalogo().getNombre());
            dto.setSerialActivo(a.getSerialActivo());
            dto.setFechaAsignacion(a.getFechaAsignacion());

            if (a.getTipo() != null) {
                dto.setTipoDescripcion(a.getTipo().getDescripcion());
            }

            // Obtener marca y modelo según el catálogo
            if (a.getCatalogo().getCodigo() == 1L) { // Equipo
                equipoDeComputoRepository.findById(a.getSerialActivo()).ifPresent(eq -> {
                    if (eq.getMarca() != null) dto.setMarca(eq.getMarca().getDescripcion());
                    if (eq.getModelo() != null) dto.setModelo(eq.getModelo().getDescripcion());
                });
            } else if (a.getCatalogo().getCodigo() == 2L) { // Móvil
                dispositivoMovilRepository.findById(a.getSerialActivo()).ifPresent(dm -> {
                    if (dm.getMarca() != null) dto.setMarca(dm.getMarca().getDescripcion());
                    if (dm.getModelo() != null) dto.setModelo(dm.getModelo().getDescripcion());
                });
            } else if (a.getCatalogo().getCodigo() == 3L) { // Impresora
                impresoraRepository.findById(a.getSerialActivo()).ifPresent(imp -> {
                    if (imp.getMarca() != null) dto.setMarca(imp.getMarca().getDescripcion());
                    if (imp.getModelo() != null) dto.setModelo(imp.getModelo().getDescripcion());
                });
            }

            return dto;
        }).collect(Collectors.toList());
    }
}
