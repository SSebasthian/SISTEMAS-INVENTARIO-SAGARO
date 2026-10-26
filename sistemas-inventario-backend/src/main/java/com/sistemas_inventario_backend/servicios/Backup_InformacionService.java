package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.DTOs.Respuesta.Backup_InformacionRespuesta;
import com.sistemas_inventario_backend.entidades.Backup_Informacion;
import com.sistemas_inventario_backend.entidades.Software;
import com.sistemas_inventario_backend.repositorios.Backup_InformacionRepository;
import com.sistemas_inventario_backend.repositorios.EquipoDeComputo_BackupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class Backup_InformacionService {

    private final Backup_InformacionRepository repository;
    private final SoftwareService softwareService;
    private final EquipoDeComputo_BackupRepository equipoDeComputoBackupRepository;


    public List<Backup_Informacion> listarActivos() {
        return repository.findByActivoTrue();
    }

    public List<Backup_Informacion> listarTodos() {
        return repository.findAll();
    }


    public List<Backup_InformacionRespuesta> listarPorTipo(String tipo) {
        List<Backup_Informacion> lista = repository.findByTipoAndActivoTrue(tipo);
        return lista.stream().map(info -> {
            boolean enUso = equipoDeComputoBackupRepository
                    .existsByBackupInformacionCodigoAndActivoTrue(info.getCodigo());
            return new Backup_InformacionRespuesta(info, enUso);
        }).collect(Collectors.toList());
    }

    public Backup_Informacion obtenerPorCodigo(Long codigo) {
        return repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Informacion de backup no encontrada"));
    }

    public List<Backup_Informacion> listarPorSoftware(Long softwareCodigo) {
        return repository.findBySoftwareCodigoAndActivoTrue(softwareCodigo);
    }

    public List<Backup_InformacionRespuesta> listarPorSoftwareYTipo(Long softwareCodigo, String tipo) {
        List<Backup_Informacion> lista = repository.findBySoftwareCodigoAndTipoAndActivoTrue(softwareCodigo, tipo);
        return lista.stream().map(info -> {
            boolean enUso = equipoDeComputoBackupRepository.existsByBackupInformacionCodigoAndActivoTrue(info.getCodigo());
            return new Backup_InformacionRespuesta(info, enUso);
        }).collect(Collectors.toList());
    }


    @Transactional
    public Backup_Informacion guardar(Backup_Informacion info) {
        try {
            if (info.getSoftware() == null || info.getSoftware().getCodigo() == null) {
                throw new RuntimeException("Debe asignar un software de backup");
            }
            if (info.getTipo() == null || info.getTipo().trim().isEmpty()) {
                throw new RuntimeException("Debe especificar el tipo (EQUIPO o CORREO)");
            }

            Software software = softwareService.obtenerPorCodigo(info.getSoftware().getCodigo());
            info.setSoftware(software);
            info.setActivo(true);
            validarDiaSegunFrecuencia(info);
            return repository.save(info);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Ya existe una configuracion de backup con el nombre: " + info.getNombre());
        }
    }

    @Transactional
    public Backup_Informacion actualizar(Long codigo, Backup_Informacion datos) {
        try {
            Backup_Informacion existente = obtenerPorCodigo(codigo);
            existente.setNombre(datos.getNombre());
            existente.setFrecuencia(datos.getFrecuencia());
            existente.setUbicacion(datos.getUbicacion());
            existente.setUbicacionExcluida(datos.getUbicacionExcluida());
            existente.setDia(datos.getDia());
            existente.setHora(datos.getHora());
            existente.setActivo(datos.getActivo());
            existente.setTipo(datos.getTipo());

            if (datos.getSoftware() != null && datos.getSoftware().getCodigo() != null) {
                Software software = softwareService.obtenerPorCodigo(datos.getSoftware().getCodigo());
                existente.setSoftware(software);
            }
            validarDiaSegunFrecuencia(existente);
            return repository.save(existente);
        } catch (DataIntegrityViolationException e) {
            throw new RuntimeException("Ya existe otra configuracion con el nombre: " + datos.getNombre());
        }
    }


    @Transactional
    public void desactivar(Long codigo) {
        Backup_Informacion existente = obtenerPorCodigo(codigo);
        existente.setActivo(false);
        repository.save(existente);
    }


    private void validarDiaSegunFrecuencia(Backup_Informacion info) {
        String frecuencia = info.getFrecuencia();
        Integer dia = info.getDia();
        if (frecuencia != null && dia != null) {
            if ("DIARIO".equalsIgnoreCase(frecuencia)) {
                info.setDia(null);
            } else if ("SEMANAL".equalsIgnoreCase(frecuencia)) {
                if (dia < 1 || dia > 7) {
                    throw new RuntimeException("Para frecuencia SEMANAL, el dia debe ser un numero entre 1 y 7");
                }
            } else if ("MENSUAL".equalsIgnoreCase(frecuencia) || "MANUAL".equalsIgnoreCase(frecuencia)) {
                if (dia < 1 || dia > 30) {
                    throw new RuntimeException("Para frecuencia " + frecuencia + ", el dia debe ser un numero entre 1 y 30");
                }
            } else {
                throw new RuntimeException("Frecuencia no valida: " + frecuencia);
            }
        }
    }

    // BUSQUEDA POR CRITERIOS (con tipo y hora)
    public Backup_Informacion buscarPorCriterios(
            String nombre,
            String frecuencia,
            String ubicacion,
            String ubicacionExcluida,
            Integer dia,
            LocalTime hora,
            Long backupCodigo,
            String tipo) {
        return repository.buscarPorCriterios(
                nombre, frecuencia, ubicacion, ubicacionExcluida, dia, hora, backupCodigo, tipo
        ).orElse(null);
    }


}