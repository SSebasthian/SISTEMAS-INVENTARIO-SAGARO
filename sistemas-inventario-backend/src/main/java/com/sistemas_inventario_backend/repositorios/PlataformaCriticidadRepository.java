package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.PlataformaCriticidad;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlataformaCriticidadRepository extends JpaRepository<PlataformaCriticidad, Long> {
    List<PlataformaCriticidad> findByActivoTrue();
}