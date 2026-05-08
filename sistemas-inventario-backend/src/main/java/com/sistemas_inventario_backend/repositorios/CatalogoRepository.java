package com.sistemas_inventario_backend.repositorios;


import com.sistemas_inventario_backend.entidades.Catalogo;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CatalogoRepository extends JpaRepository<Catalogo, Long> {
    List<Catalogo> findByActivoTrue();
}