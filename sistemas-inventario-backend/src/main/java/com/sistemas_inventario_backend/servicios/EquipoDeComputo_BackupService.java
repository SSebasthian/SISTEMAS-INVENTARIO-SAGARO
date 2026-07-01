package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.*;
import com.sistemas_inventario_backend.repositorios.EquipoDeComputo_AsignacionesRepository;
import com.sistemas_inventario_backend.repositorios.EquipoDeComputo_BackupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipoDeComputo_BackupService {

    private final EquipoDeComputo_BackupRepository repository;
    private final Backup_InformacionService backupInformacionService;
    private final EquipoDeComputo_AsignacionesRepository equipoDeComputoAsignacionesRepository;

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

        Backup_Informacion backupInfo = backupInformacionService.obtenerPorCodigo(backupInformacionCodigo);
        EquipoDeComputo_Asignaciones asignacion = equipoDeComputoAsignacionesRepository.findById(asignacionConsecutivo)
                .orElseThrow(() ->
                        new RuntimeException("Asignacion no encontrada"));
        CorreosCorporativos correo = (correoCodigo != null) ? correoService.obtenerPorCodigo(correoCodigo) : null;

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
}


