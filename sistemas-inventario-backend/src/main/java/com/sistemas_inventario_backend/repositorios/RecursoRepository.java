package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Recurso;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface RecursoRepository extends JpaRepository<Recurso, Long> {
    Optional<Recurso> findByNombre(String nombre);
}