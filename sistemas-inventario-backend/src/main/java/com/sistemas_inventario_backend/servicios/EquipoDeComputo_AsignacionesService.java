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
public class EquipoDeComputo_AsignacionesService {

    private final EquipoDeComputo_AsignacionesRepository asignacionRepository;
    private final EmpleadoRepository empleadoRepository;
    private final AreaRepository areaRepository;
    private final EquipoDeComputoRepository equipoDeComputoRepository;
    private final DispositivoMovilRepository dispositivoMovilRepository;
    private final ImpresoraRepository impresoraRepository;
    private final CatalogoRepository catalogoRepository;
    private final DispositivoTecnologico_TipoRepository tipoRepository;
    private final EquipoDeComputo_DetalleRepository detalleRepository;
    private final BackupService backupService;
    private final Backup_InformacionService backupInformacionService;

    // Inyectar servicio de backup
    private final EquipoDeComputo_BackupService equipoDeComputoBackupService;

    // ========== ASIGNAR ==========

    @Transactional
    public AsignacionesRespuesta asignar(AsignacionesSolicitud solicitud) {
        validarExistenciaActivo(solicitud.getCatalogoCodigo(), solicitud.getSerialActivo());

        Catalogo catalogo = catalogoRepository.findById(solicitud.getCatalogoCodigo())
                .orElseThrow(() -> new RuntimeException("Catalogo no valido"));

        DispositivoTecnologico_Tipo tipo = null;
        if (solicitud.getTipoCodigo() != null) {
            tipo = tipoRepository.findById(solicitud.getTipoCodigo())
                    .orElseThrow(() -> new RuntimeException("Tipo no valido"));
        }

        if (asignacionRepository.existsBySerialActivoAndActivoTrue(solicitud.getSerialActivo())) {
            throw new RuntimeException("El serial ya esta asignado activamente");
        }

        EquipoDeComputo_Asignaciones asignacion = new EquipoDeComputo_Asignaciones();
        asignacion.setCatalogo(catalogo);
        asignacion.setTipo(tipo);
        asignacion.setSerialActivo(solicitud.getSerialActivo());
        asignacion.setFechaAsignacion(solicitud.getFechaAsignacion() != null ?
                solicitud.getFechaAsignacion() : LocalDate.now());
        asignacion.setObservaciones(solicitud.getObservaciones());
        asignacion.setActivo(true);

        // SIEMPRE guardar el area
        if (solicitud.getAreaCodigo() != null) {
            Area area = areaRepository.findById(solicitud.getAreaCodigo())
                    .orElseThrow(() -> new RuntimeException("Area no encontrada"));
            asignacion.setArea(area);
        } else {
            throw new RuntimeException("El area es requerida para la asignacion");
        }

        // Guardar empleado si existe (puede ser null)
        if (solicitud.getEmpleadoCedula() != null && !solicitud.getEmpleadoCedula().isEmpty()) {
            Empleado empleado = empleadoRepository.findById(solicitud.getEmpleadoCedula())
                    .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));
            asignacion.setEmpleado(empleado);
        } else {
            asignacion.setEmpleado(null);
        }

        EquipoDeComputo_Asignaciones guardada = asignacionRepository.save(asignacion);

        // Si viene detalle, guardarlo asociado a la asignacion
        if (solicitud.getDetalle() != null) {
            EquipoDeComputo_Detalle detalle = solicitud.getDetalle();
            detalle.setAsignacion(guardada);
            detalle.setEquipo(equipoDeComputoRepository.findById(guardada.getSerialActivo()).orElse(null));
            detalle.setActivo(true);
            detalleRepository.save(detalle);
        }

        // Guardar backups si vienen en la solicitud
        if (solicitud.getBackups() != null && !solicitud.getBackups().isEmpty()) {
            for (AsignacionesSolicitud.BackupAsignacion b : solicitud.getBackups()) {
                equipoDeComputoBackupService.guardarBackup(
                        guardada.getSerialActivo(),
                        b.getBackupInformacionCodigo(),
                        guardada.getConsecutivo(),
                        b.getCorreoCodigo()
                );
            }
        }

        // Crear backup_informacion y luego guardar en equipodecomputo_backup
        if (solicitud.getCorreosConBackup() != null && !solicitud.getCorreosConBackup().isEmpty()) {
            for (AsignacionesSolicitud.CorreoConBackup cb : solicitud.getCorreosConBackup()) {
                // Obtener el programa de backup
                Backup backupPrograma = backupService.obtenerPorCodigo(cb.getBackupData().getBackupCodigo());

                // Crear backup_informacion
                Backup_Informacion backupInfo = new Backup_Informacion();
                backupInfo.setNombre(cb.getBackupData().getNombre());
                backupInfo.setFrecuencia(cb.getBackupData().getFrecuencia());
                backupInfo.setUbicacion(String.join(";", cb.getBackupData().getUbicaciones()));
                backupInfo.setUbicacionExcluida(String.join(";", cb.getBackupData().getUbicacionesExcluidas()));
                backupInfo.setDia(cb.getBackupData().getDia());
                backupInfo.setBackup(backupPrograma);
                backupInfo.setActivo(true);

                // Guardar backup_informacion
                Backup_Informacion nueva = backupInformacionService.guardar(backupInfo);

                // Guardar relacion en equipodecomputo_backup
                equipoDeComputoBackupService.guardarBackup(
                        guardada.getSerialActivo(),
                        nueva.getCodigo(),
                        guardada.getConsecutivo(),
                        cb.getCorreoCodigo()
                );
            }
        }

        return convertirADTO(guardada);
    }

    // ========== DEVOLVER ==========
    @Transactional
    public void devolver(Long asignacionId, LocalDate fechaDevolucion, String observacionesDevolucion) {
        EquipoDeComputo_Asignaciones asignacion = asignacionRepository.findById(asignacionId)
                .orElseThrow(() -> new RuntimeException("Asignacion no encontrada con ID: " + asignacionId));

        asignacion.setActivo(false);
        asignacion.setFechaDevolucion(fechaDevolucion != null ? fechaDevolucion : LocalDate.now());

        // Reemplazar directamente, no concatenar
        if (observacionesDevolucion != null && !observacionesDevolucion.isEmpty()) {
            asignacion.setObservaciones(observacionesDevolucion);
        }

        // Desactivar detalle
        EquipoDeComputo_Detalle detalle = detalleRepository.findByAsignacionConsecutivo(asignacionId)
                .orElse(null);
        if (detalle != null) {
            detalle.setActivo(false);
            detalleRepository.save(detalle);
        }

        // Desactivar todos los backups de esta asignacion
        equipoDeComputoBackupService.desactivarBackupsPorAsignacion(asignacionId);

        asignacionRepository.save(asignacion);
    }

    // ========== CONSULTAS ==========
    public boolean estaAsignado(String serialActivo) {
        return asignacionRepository.existsBySerialActivoAndActivoTrue(serialActivo);
    }

    public AsignacionesRespuesta obtenerAsignacionActual(String serialActivo) {
        EquipoDeComputo_Asignaciones asignacion = asignacionRepository.findFirstBySerialActivoAndActivoTrue(serialActivo);
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


    public EquipoDeComputo_Asignaciones obtenerPorConsecutivo(Long consecutivo) {
        return asignacionRepository.findById(consecutivo)
                .orElseThrow(() -> new RuntimeException("Asignacion no encontrada con consecutivo: " + consecutivo));
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
            throw new RuntimeException("Catalogo no valido: " + catalogoCodigo);
        }
    }

    private AsignacionesRespuesta convertirADTO(EquipoDeComputo_Asignaciones a) {
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

    // OBTENER ASIGNACIONES POR EMPLEADO CON DETALLE
    public List<AsignacionPorEmpleado> obtenerAsignacionesPorEmpleadoConDetalle(String cedula) {
        List<EquipoDeComputo_Asignaciones> asignaciones = asignacionRepository.findByEmpleadoCedulaAndActivoTrue(cedula);

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

            // Obtener marca y modelo según el catalogo
            if (a.getCatalogo().getCodigo() == 1L) { // Equipo
                equipoDeComputoRepository.findById(a.getSerialActivo()).ifPresent(eq -> {
                    if (eq.getMarca() != null) dto.setMarca(eq.getMarca().getDescripcion());
                    if (eq.getModelo() != null) dto.setModelo(eq.getModelo().getDescripcion());
                });
            } else if (a.getCatalogo().getCodigo() == 2L) { // Movil
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
