package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.PlataformaRol;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlataformaRolRepository extends JpaRepository<PlataformaRol, Long> {
    List<PlataformaRol> findByPlataformaCodigo(Long plataformaCodigo);
}