package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.Backup;
import com.sistemas_inventario_backend.entidades.Backup_Informacion;
import com.sistemas_inventario_backend.repositorios.Backup_InformacionRepository;
import com.sistemas_inventario_backend.repositorios.BackupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    public List<Backup_Informacion> listarTodos() {
        return repository.findAll();
    }

    public Backup_Informacion obtenerPorCodigo(Long codigo) {
        return repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Información de backup no encontrada"));
    }

    @Transactional
    public Backup_Informacion guardar(Backup_Informacion info) {
        if (info.getBackup() == null || info.getBackup().getCodigo() == null) {
            throw new RuntimeException("Debe asignar un backup");
        }
        Backup backup = backupRepository.findById(info.getBackup().getCodigo())
                .orElseThrow(() -> new RuntimeException("Backup no encontrado"));
        info.setBackup(backup);
        info.setActivo(true);
        // Validar dia según frecuencia
        if (info.getFrecuencia() != null && info.getDia() != null) {
            if ("SEMANAL".equalsIgnoreCase(info.getFrecuencia()) && (info.getDia() < 1 || info.getDia() > 7)) {
                throw new RuntimeException("Para frecuencia SEMANAL, el dia debe ser 1-7");
            }
            if ("MENSUAL".equalsIgnoreCase(info.getFrecuencia()) && (info.getDia() < 1 || info.getDia() > 31)) {
                throw new RuntimeException("Para frecuencia MENSUAL, el dia debe ser 1-31");
            }
        }
        this.validarDiaSegunFrecuencia(info);
        return repository.save(info);
    }

    @Transactional
    public Backup_Informacion actualizar(Long codigo, Backup_Informacion datos) {
        Backup_Informacion existente = obtenerPorCodigo(codigo);

        // Actualizar campos simples
        existente.setNombre(datos.getNombre());
        existente.setFrecuencia(datos.getFrecuencia());
        existente.setUbicacion(datos.getUbicacion());
        existente.setUbicacionExcluida(datos.getUbicacionExcluida()); // si existe
        existente.setDia(datos.getDia());
        existente.setActivo(datos.getActivo());

        // Actualizar la relacion con el programa (backup)
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
                // Si es DIARIO, el dia debe ser null (no aplica)
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

}
