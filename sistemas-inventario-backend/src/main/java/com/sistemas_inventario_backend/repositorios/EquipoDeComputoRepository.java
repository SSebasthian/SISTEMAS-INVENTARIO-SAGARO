package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.EquipoDeComputo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

@Repository
public interface EquipoDeComputoRepository extends JpaRepository<EquipoDeComputo, String> {


    // Buscar por serial (busqueda parcial)
    List<EquipoDeComputo> findBySerialContainingIgnoreCase(String serial);

    // Buscar por marca
    @Query("SELECT e FROM EquipoDeComputo e WHERE LOWER(e.marca.descripcion) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<EquipoDeComputo> findByMarcaDescripcionContainingIgnoreCase(@Param("termino") String termino);

    // Buscar por modelo
    @Query("SELECT e FROM EquipoDeComputo e WHERE LOWER(e.modelo.descripcion) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<EquipoDeComputo> findByModeloDescripcionContainingIgnoreCase(@Param("termino") String termino);

    // Búsqueda combinada en serial, marca y modelo (para el buscador)
    @Query("SELECT e FROM EquipoDeComputo e WHERE " +
            "LOWER(e.serial) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(e.marca.descripcion) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(e.modelo.descripcion) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<EquipoDeComputo> buscarPorSerialMarcaModelo(@Param("termino") String termino);
}
