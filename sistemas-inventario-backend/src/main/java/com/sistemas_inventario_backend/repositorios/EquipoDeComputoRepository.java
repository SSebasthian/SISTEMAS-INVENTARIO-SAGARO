package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.EquipoDeComputo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EquipoDeComputoRepository extends JpaRepository<EquipoDeComputo, String> {


}
