package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.SistemaOperativo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface SistemaOperativoRepository extends JpaRepository<SistemaOperativo, Long> {

    // Buscar SO por catálogo
    List<SistemaOperativo> findByCatalogoCodigoAndActivoTrue(Long catalogoCodigo);

}