package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Software;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SoftwareRepository extends JpaRepository<Software, Long> {
    List<Software> findByActivoTrue();

    List<Software> findByTipo_CodigoAndActivoTrue(Long tipoCodigo);
}