package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.DispositivoTecnologico_Marca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface DispositivoTecnologico_MarcaRepository    extends JpaRepository<DispositivoTecnologico_Marca, Long> {
    // Marcas por tipo
    List<DispositivoTecnologico_Marca> findByTipoCodigoAndActivoTrue(Long tipoCodigo);

    // También puedes filtrar por catálogo a través del tipo
    @Query("SELECT m FROM DispositivoTecnologico_Marca m WHERE m.tipo.catalogo.codigo = :catalogoCodigo AND m.activo = true")
    List<DispositivoTecnologico_Marca> findByCatalogoCodigo(@Param("catalogoCodigo") Long catalogoCodigo);
}