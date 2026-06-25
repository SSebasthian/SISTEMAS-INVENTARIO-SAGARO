package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Software;
import com.sistemas_inventario_backend.entidades.Software_Tipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface Software_TipoRepository extends JpaRepository<Software_Tipo, Long> {
    List<Software_Tipo> findByActivoTrue();

}