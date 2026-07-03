package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.EquipoDeComputo_Software;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface EquipoDeComputo_SoftwareRepository extends JpaRepository<EquipoDeComputo_Software, Long> {
    List<EquipoDeComputo_Software> findByEquipoSerialAndActivoTrue(String serial);
    List<EquipoDeComputo_Software> findByAsignacionConsecutivo(Long asignacionConsecutivo);
    List<EquipoDeComputo_Software> findByEquipoSerial(String serial);

}