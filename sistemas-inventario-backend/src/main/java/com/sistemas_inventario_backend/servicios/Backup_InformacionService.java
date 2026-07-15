package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.Backup;
import com.sistemas_inventario_backend.entidades.Backup_Informacion;
import com.sistemas_inventario_backend.repositorios.Backup_InformacionRepository;
import com.sistemas_inventario_backend.repositorios.BackupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class Backup_InformacionService {

    private final Backup_InformacionRepository repository;
    private final BackupRepository backupRepository;

    public List<Backup_Informacion> listarActivos() {
        return repository.findByActivoTrue();
    }

    public List<Backup_Informacion> listarPorBackup(Long backupCodigo) {
        return repository.findByBackupCodigoAndActivoTrue(backupCodigo);
    }

    //  NUEVO: listar por backup y tipo
    public List<Backup_Informacion> listarPorBackupYTipo(Long backupCodigo, String tipo) {
        return repository.findByBackupCodigoAndTipoAndActivoTrue(backupCodigo, tipo);
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
        if (info.getBackup() == null || info.getBackup().getCodigo() == null) {
            throw new RuntimeException("Debe asignar un backup");
        }
        //  Validar que el tipo esté presente
        if (info.getTipo() == null || info.getTipo().trim().isEmpty()) {
            throw new RuntimeException("Debe especificar el tipo (EQUIPO o CORREO)");
        }

        Backup backup = backupRepository.findById(info.getBackup().getCodigo())
                .orElseThrow(() -> new RuntimeException("Backup no encontrado"));
        info.setBackup(backup);
        info.setActivo(true);
        this.validarDiaSegunFrecuencia(info);
        return repository.save(info);
    }

    @Transactional
    public Backup_Informacion actualizar(Long codigo, Backup_Informacion datos) {
        Backup_Informacion existente = obtenerPorCodigo(codigo);
        existente.setNombre(datos.getNombre());
        existente.setFrecuencia(datos.getFrecuencia());
        existente.setUbicacion(datos.getUbicacion());
        existente.setUbicacionExcluida(datos.getUbicacionExcluida());
        existente.setDia(datos.getDia());
        existente.setHora(datos.getHora());  //  actualizar hora
        existente.setActivo(datos.getActivo());
        existente.setTipo(datos.getTipo());  //  actualizar tipo

        if (datos.getBackup() != null && datos.getBackup().getCodigo() != null) {
            Backup backup = backupRepository.findById(datos.getBackup().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Backup no encontrado"));
            existente.setBackup(backup);
        }
        return repository.save(existente);
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