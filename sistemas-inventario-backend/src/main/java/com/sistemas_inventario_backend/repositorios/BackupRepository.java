package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Backup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BackupRepository extends JpaRepository<Backup, Long> {
    List<Backup> findByActivoTrue();
}