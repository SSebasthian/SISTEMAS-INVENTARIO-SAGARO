package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.CorreosCorporativos;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CorreoCorporativoRepository extends JpaRepository<CorreosCorporativos, Long> {

    Optional<CorreosCorporativos> findByDireccion(String direccion);
    List<CorreosCorporativos> findByActivoTrue();

    List<CorreosCorporativos> findByDireccionContainingIgnoreCase(String direccion);

}