package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.DispositivoTecnologico_SO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface DispositivoTecnologico_SORepository extends JpaRepository<DispositivoTecnologico_SO, Long> {

    // Obtener SO por categoria (COMPUTADOR, TELEFONO)
    List<DispositivoTecnologico_SO> findByCategoriaAndActivoTrue(String categoria);
}
