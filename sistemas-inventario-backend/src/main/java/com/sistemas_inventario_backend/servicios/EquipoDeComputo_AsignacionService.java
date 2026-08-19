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
public class EquipoDeComputo_AsignacionService {

    private final EquipoDeComputo_AsignacionRepository asignacionRepository;
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
    private final EquipoDeComputo_DetalleService detalleService;
    private final IPRepository ipRepository;


    // Inyectar servicio de backup
    private final EquipoDeComputo_BackupService equipoDeComputoBackupService;
    private final EquipoDeComputo_SoftwareService equipoDeComputoSoftwareService;


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

        EquipoDeComputo_Asignacion asignacion = new EquipoDeComputo_Asignacion();
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

        EquipoDeComputo_Asignacion guardada = asignacionRepository.save(asignacion);

        // Si viene detalle, guardarlo asociado a la asignacion
        if (solicitud.getDetalle() != null) {
            EquipoDeComputo_Detalle detalle = solicitud.getDetalle();
            detalle.setAsignacion(guardada);
            detalle.setEquipo(equipoDeComputoRepository.findById(guardada.getSerialActivo()).orElse(null));
            detalle.setActivo(true);

            // Pasar la IP y el tipoCodigo
            Integer ipNumero = solicitud.getIp();
            Long tipoCodigo = solicitud.getTipoCodigo();

            detalleService.guardar(guardada.getSerialActivo(), detalle, ipNumero, tipoCodigo);
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
                AsignacionesSolicitud.BackupData bd = cb.getBackupData();

                // 1. Verificar si ya existe una configuracion igual
                Backup_Informacion existente = null;
                try {
                    existente = backupInformacionService.buscarPorCriterios(
                            bd.getNombre(),
                            bd.getFrecuencia(),
                            String.join(";", bd.getUbicaciones()),
                            String.join(";", bd.getUbicacionesExcluidas()),
                            bd.getDia(),
                            bd.getHora() != null ? java.time.LocalTime.parse(bd.getHora()) : null,
                            bd.getBackupCodigo(),
                            bd.getTipo()  // "CORREO"
                    );
                } catch (Exception e) {
                    // Si falla la busqueda, no importa, se creará uno nuevo
                }

                Long backupInfoCodigo;
                if (existente != null) {
                    // REUTILIZAR el existente
                    backupInfoCodigo = existente.getCodigo();
                } else {
                    // CREAR NUEVO
                    Backup backupPrograma = backupService.obtenerPorCodigo(bd.getBackupCodigo());
                    Backup_Informacion backupInfo = new Backup_Informacion();
                    backupInfo.setNombre(bd.getNombre());
                    backupInfo.setFrecuencia(bd.getFrecuencia());
                    backupInfo.setUbicacion(String.join(";", bd.getUbicaciones()));
                    backupInfo.setUbicacionExcluida(String.join(";", bd.getUbicacionesExcluidas()));
                    backupInfo.setDia(bd.getDia());
                    backupInfo.setBackup(backupPrograma);
                    backupInfo.setActivo(true);
                    backupInfo.setTipo(bd.getTipo());
                    if (bd.getHora() != null && !bd.getHora().isEmpty()) {
                        backupInfo.setHora(java.time.LocalTime.parse(bd.getHora()));
                    }
                    Backup_Informacion nueva = backupInformacionService.guardar(backupInfo);
                    backupInfoCodigo = nueva.getCodigo();
                }

                // Guardar relacion en equipodecomputo_backup (reutiliza el codigo)
                equipoDeComputoBackupService.guardarBackup(
                        guardada.getSerialActivo(),
                        backupInfoCodigo,
                        guardada.getConsecutivo(),
                        cb.getCorreoCodigo()
                );
            }
        }

        if (solicitud.getSoftwares() != null && !solicitud.getSoftwares().isEmpty()) {
            for (AsignacionesSolicitud.SoftwareAsignacion sa : solicitud.getSoftwares()) {
                equipoDeComputoSoftwareService.asignarSoftware(
                        guardada.getSerialActivo(),
                        sa.getSoftwareCodigo(),
                        guardada.getConsecutivo(),
                        sa.getPoliticaCodigo()
                );
            }
        }

        return convertirADTO(guardada);
    }

    // ========== DEVOLVER ==========
    @Transactional
    public void devolver(Long asignacionId, LocalDate fechaDevolucion, String observacionesDevolucion) {
        EquipoDeComputo_Asignacion asignacion = asignacionRepository.findById(asignacionId)
                .orElseThrow(() -> new RuntimeException("Asignacion no encontrada con ID: " + asignacionId));

        asignacion.setActivo(false);
        asignacion.setFechaDevolucion(fechaDevolucion != null ? fechaDevolucion : LocalDate.now());

        // Reemplazar directamente, no concatenar
        if (observacionesDevolucion != null && !observacionesDevolucion.isEmpty()) {
            asignacion.setObservaciones(observacionesDevolucion);
        }

        // Desactivar detalle y liberar IP
        EquipoDeComputo_Detalle detalle = detalleRepository.findByAsignacionConsecutivo(asignacionId).orElse(null);
        if (detalle != null) {
            // Liberar la IP
            if (detalle.getIp() != null) {
                IP ip = detalle.getIp();
                ip.setActivo(false);
                ip.setCatalogoCodigo(1L);
                ip.setDispositivoTipoCodigo(null);
                ipRepository.save(ip);
            }
            detalle.setActivo(false);
            detalleRepository.save(detalle);
        }

        // Desactivar todos los backups de esta asignacion
        equipoDeComputoBackupService.desactivarBackupsPorAsignacion(asignacionId);

        // Desactivar todos los software de esta asignacion
        equipoDeComputoSoftwareService.desactivarSoftwarePorAsignacion(asignacionId);


        asignacionRepository.save(asignacion);
    }

    // ========== CONSULTAS ==========
    public boolean estaAsignado(String serialActivo) {
        return asignacionRepository.existsBySerialActivoAndActivoTrue(serialActivo);
    }

    public AsignacionesRespuesta obtenerAsignacionActual(String serialActivo) {
        EquipoDeComputo_Asignacion asignacion = asignacionRepository.findFirstBySerialActivoAndActivoTrue(serialActivo);
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


    public EquipoDeComputo_Asignacion obtenerPorConsecutivo(Long consecutivo) {
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

    private AsignacionesRespuesta convertirADTO(EquipoDeComputo_Asignacion a) {
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
        List<EquipoDeComputo_Asignacion> asignaciones = asignacionRepository.findByEmpleadoCedulaAndActivoTrue(cedula);

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

            // Obtener marca y modelo segun el catalogo
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
