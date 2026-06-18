package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Plataforma;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PlataformaRepository extends JpaRepository<Plataforma, Long> {
    List<Plataforma> findByActivoTrue();
    Optional<Plataforma> findByDescripcion(String descripcion);

    List<Plataforma> findByRecursoTipoCodigoAndActivoTrue(Long recursoTipoCodigo);

}
