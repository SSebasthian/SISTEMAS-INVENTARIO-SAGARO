package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.EquipoDeComputo_Detalle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EquipoDeComputo_DetalleRepository extends JpaRepository<EquipoDeComputo_Detalle, Long> {
    Optional<EquipoDeComputo_Detalle> findByEquipoSerial(String serial);
    Optional<EquipoDeComputo_Detalle> findByIp(Integer ip);

    Optional<EquipoDeComputo_Detalle> findByEquipoSerialAndActivoTrue(String serial);
    Optional<EquipoDeComputo_Detalle> findByAsignacionConsecutivo(Long consecutivo);
}