package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.EquipoDeComputo_Backup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface  EquipoDeComputo_BackupRepository extends JpaRepository<EquipoDeComputo_Backup, Long> {

    List<EquipoDeComputo_Backup> findBySerialAndAsignacionConsecutivoAndActivoTrue(String serial, Long asignacionConsecutivo);

    List<EquipoDeComputo_Backup> findBySerialAndActivoTrue(String serial);

    List<EquipoDeComputo_Backup> findBySerialAndActivoTrueAndCorreoIsNotNull(String serial);

    List<EquipoDeComputo_Backup> findBySerialAndActivoTrueAndCorreoIsNull(String serial);

    List<EquipoDeComputo_Backup> findByAsignacionConsecutivoAndActivoTrue(Long asignacionConsecutivo);

    boolean existsByBackupInformacionCodigoAndActivoTrue(Long backupInformacionCodigo);

    // Buscar sin importar si está activo o no
    Optional<EquipoDeComputo_Backup> findFirstBySerialAndBackupInformacionCodigoAndAsignacionConsecutivo(
            String serial,
            Long backupInformacionCodigo,
            Long asignacionConsecutivo
    );
}