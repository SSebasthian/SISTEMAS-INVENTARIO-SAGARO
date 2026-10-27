package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.*;
import com.sistemas_inventario_backend.repositorios.EquipoDeComputo_AsignacionRepository;
import com.sistemas_inventario_backend.repositorios.EquipoDeComputo_BackupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class EquipoDeComputo_BackupService {

    private final EquipoDeComputo_BackupRepository repository;
    private final Backup_InformacionService backupInformacionService;
    private final EquipoDeComputo_AsignacionRepository equipoDeComputoAsignacionesRepository;

    private final CorreoCorporativoService correoService;

    public List<EquipoDeComputo_Backup> listarPorSerialYAsignacion(String serial, Long asignacionConsecutivo) {
        return repository.findBySerialAndAsignacionConsecutivoAndActivoTrue(serial, asignacionConsecutivo);
    }

    public List<EquipoDeComputo_Backup> listarPorSerial(String serial) {
        return repository.findBySerialAndActivoTrue(serial);
    }

    public EquipoDeComputo_Backup obtenerPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de backup no encontrado"));
    }


    @Transactional
    public EquipoDeComputo_Backup guardarBackup(
            String serial,
            Long backupInformacionCodigo,
            Long asignacionConsecutivo,
            Long correoCodigo) {
        return guardarOReactivarBackup(serial, backupInformacionCodigo, asignacionConsecutivo, correoCodigo);
    }


    @Transactional
    public EquipoDeComputo_Backup guardarOReactivarBackup(

            String serial,
            Long backupInformacionCodigo,
            Long asignacionConsecutivo,
            Long correoCodigo) {

        Backup_Informacion backupInfo = backupInformacionService.obtenerPorCodigo(backupInformacionCodigo);
        EquipoDeComputo_Asignacion asignacion = equipoDeComputoAsignacionesRepository.findById(asignacionConsecutivo)
                .orElseThrow(() -> new RuntimeException("Asignacion no encontrada"));

        CorreosCorporativos correo = null;
        if (correoCodigo != null && correoCodigo != 0L) {
            correo = correoService.obtenerPorCodigo(correoCodigo);
        }

        // ¿Ya existe un registro (activo o inactivo) para esta combinacion?
        Optional<EquipoDeComputo_Backup> existente =
                repository.buscarExistente(serial, backupInformacionCodigo, asignacionConsecutivo, correoCodigo);

        if (existente.isPresent()) {
            // Reactivar
            EquipoDeComputo_Backup eb = existente.get();
            eb.setActivo(true);
            eb.setCorreo(correo); // por si cambió
            return repository.save(eb);
        }

        // Crear nuevo
        EquipoDeComputo_Backup eb = new EquipoDeComputo_Backup();
        eb.setSerial(serial);
        eb.setBackupInformacion(backupInfo);
        eb.setAsignacion(asignacion);
        eb.setCorreo(correo);
        eb.setActivo(true);
        return repository.save(eb);
    }


    @Transactional
    public void desactivarBackup(Long id) {
        EquipoDeComputo_Backup eb = obtenerPorId(id);
        eb.setActivo(false);
        repository.save(eb);
    }

    @Transactional
    public void desactivarBackupsPorAsignacion(Long asignacionConsecutivo) {
        List<EquipoDeComputo_Backup> backups = repository
                .findByAsignacionConsecutivoAndActivoTrue(asignacionConsecutivo);
        for (EquipoDeComputo_Backup eb : backups) {
            eb.setActivo(false);
            repository.save(eb);
        }
    }


    @Transactional
    public EquipoDeComputo_Backup actualizarBackupAsignado(Long id, Long backupInformacionCodigo) {
        EquipoDeComputo_Backup eb = obtenerPorId(id);
        Backup_Informacion backupInfo = backupInformacionService.obtenerPorCodigo(backupInformacionCodigo);
        eb.setBackupInformacion(backupInfo);
        return repository.save(eb);
    }

}


