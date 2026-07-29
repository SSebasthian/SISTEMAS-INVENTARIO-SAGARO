package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.DTOs.Respuesta.Backup_InformacionRespuesta;
import com.sistemas_inventario_backend.entidades.Backup;
import com.sistemas_inventario_backend.entidades.Backup_Informacion;
import com.sistemas_inventario_backend.repositorios.Backup_InformacionRepository;
import com.sistemas_inventario_backend.repositorios.BackupRepository;
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
    private final BackupRepository backupRepository;
    private final EquipoDeComputo_BackupRepository equipoDeComputoBackupRepository;


    public List<Backup_Informacion> listarActivos() {
        return repository.findByActivoTrue();
    }

    public List<Backup_Informacion> listarPorBackup(Long backupCodigo) {
        return repository.findByBackupCodigoAndActivoTrue(backupCodigo);
    }

    //  NUEVO: listar por backup y tipo
    public List<Backup_InformacionRespuesta> listarPorBackupYTipo(Long backupCodigo, String tipo) {
        List<Backup_Informacion> lista = repository.findByBackupCodigoAndTipoAndActivoTrue(backupCodigo, tipo);
        return lista.stream().map(info -> {
            boolean enUso = equipoDeComputoBackupRepository.existsByBackupInformacionCodigoAndActivoTrue(info.getCodigo());
            return new Backup_InformacionRespuesta(info, enUso);
        }).collect(Collectors.toList());
    }


    public List<Backup_Informacion> listarTodos() {
        return repository.findAll();
    }

    public Backup_Informacion obtenerPorCodigo(Long codigo) {
        return repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Informacion de backup no encontrada"));
    }

    @Transactional
    public Backup_Informacion guardar(Backup_Informacion info) {
        try {
            if (info.getBackup() == null || info.getBackup().getCodigo() == null) {
                throw new RuntimeException("Debe asignar un backup");
            }
            if (info.getTipo() == null || info.getTipo().trim().isEmpty()) {
                throw new RuntimeException("Debe especificar el tipo (EQUIPO o CORREO)");
            }

            Backup backup = backupRepository.findById(info.getBackup().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Backup no encontrado"));
            info.setBackup(backup);
            info.setActivo(true);
            this.validarDiaSegunFrecuencia(info);
            return repository.save(info);
        } catch (DataIntegrityViolationException e) {
            // Capturar violacion de unicidad (nombre duplicado)
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

            if (datos.getBackup() != null && datos.getBackup().getCodigo() != null) {
                Backup backup = backupRepository.findById(datos.getBackup().getCodigo())
                        .orElseThrow(() -> new RuntimeException("Backup no encontrado"));
                existente.setBackup(backup);
            }
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