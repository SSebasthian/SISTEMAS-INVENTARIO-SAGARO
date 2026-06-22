package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Backup_Informacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface Backup_InformacionRepository extends JpaRepository<Backup_Informacion, Long> {
    List<Backup_Informacion> findByActivoTrue();
    List<Backup_Informacion> findByBackupCodigoAndActivoTrue(Long backupCodigo);
}