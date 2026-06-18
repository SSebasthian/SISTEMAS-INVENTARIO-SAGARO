package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.CuentasCorporativas;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CuentasCorporativasRepository  extends JpaRepository<CuentasCorporativas, Long> {

    // Listar solo las cuentas activas
    List<CuentasCorporativas> findByActivoTrue();
}