package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.DispositivoTecnologico_Tipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;


public interface DispositivoTecnologico_TipoRepository extends JpaRepository<DispositivoTecnologico_Tipo, Long>{

    // Obtener categorías unicas
    @Query("SELECT DISTINCT t.categoria FROM DispositivoTecnologico_Tipo t WHERE t.activo = true")
    List<String> findDistinctCategorias();

    // Buscar tipos por categoria
    List<DispositivoTecnologico_Tipo> findByCategoriaAndActivoTrue(String categoria);
}
