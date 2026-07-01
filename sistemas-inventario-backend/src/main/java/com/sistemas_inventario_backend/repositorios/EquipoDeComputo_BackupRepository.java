package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.EquipoDeComputo_Backup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface  EquipoDeComputo_BackupRepository extends JpaRepository<EquipoDeComputo_Backup, Long> {

    List<EquipoDeComputo_Backup> findBySerialAndAsignacionConsecutivoAndActivoTrue(String serial, Long asignacionConsecutivo);

    List<EquipoDeComputo_Backup> findBySerialAndActivoTrue(String serial);

    List<EquipoDeComputo_Backup> findBySerialAndActivoTrueAndCorreoIsNotNull(String serial);

    List<EquipoDeComputo_Backup> findBySerialAndActivoTrueAndCorreoIsNull(String serial);

    List<EquipoDeComputo_Backup> findByAsignacionConsecutivoAndActivoTrue(Long asignacionConsecutivo);

}