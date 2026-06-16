package com.sistemas_inventario_backend.repositorios;
import com.sistemas_inventario_backend.entidades.Recurso_Tipo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface Recurso_TipoRepository  extends JpaRepository<Recurso_Tipo, Long> {

    List<Recurso_Tipo> findByActivoTrue();

    List<Recurso_Tipo> findByRecursoCodigoAndActivoTrue(Long recursoCodigo);
}