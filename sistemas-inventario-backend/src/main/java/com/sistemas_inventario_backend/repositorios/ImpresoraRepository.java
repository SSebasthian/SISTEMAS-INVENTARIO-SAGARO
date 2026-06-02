package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Impresora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

@Repository
public interface ImpresoraRepository extends JpaRepository<Impresora, String> {


    // Buscar por serial (busqueda parcial)
    List<Impresora> findBySerialContainingIgnoreCase(String serial);

    // Buscar por factura (búsqueda parcial)
    List<Impresora> findByFacturaCompraContainingIgnoreCase(String facturaCompra);


    // Buscar por marca
    @Query("SELECT i FROM Impresora i WHERE LOWER(i.marca.descripcion) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Impresora> findByMarcaDescripcionContainingIgnoreCase(@Param("termino") String termino);

    // Buscar por modelo
    @Query("SELECT i FROM Impresora i WHERE LOWER(i.modelo.descripcion) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Impresora> findByModeloDescripcionContainingIgnoreCase(@Param("termino") String termino);

    // Buscar por propiedad
    List<Impresora> findByPropiedadContainingIgnoreCase(String propiedad);

    // Búsqueda combinada en serial, marca, modelo, factura, tipo o propiedad
    @Query("SELECT i FROM Impresora i WHERE " +
            "LOWER(i.serial) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(i.marca.descripcion) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(i.modelo.descripcion) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(i.propiedad) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(i.facturaCompra) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(i.tipoRecarga) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<Impresora> buscarPorTermino(@Param("termino") String termino);
}