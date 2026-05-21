package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.DispositivoMovil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface DispositivoMovilRepository extends JpaRepository<DispositivoMovil, String> {

    // Buscar por serial (busqueda parcial)
    List<DispositivoMovil> findBySerialContainingIgnoreCase(String serial);

    // Buscar por marca
    @Query("SELECT d FROM DispositivoMovil d WHERE LOWER(d.marca.descripcion) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<DispositivoMovil> findByMarcaDescripcionContainingIgnoreCase(@Param("termino") String termino);

    // Buscar por modelo
    @Query("SELECT d FROM DispositivoMovil d WHERE LOWER(d.modelo.descripcion) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<DispositivoMovil> findByModeloDescripcionContainingIgnoreCase(@Param("termino") String termino);

    // Buscar por IMEI
    List<DispositivoMovil> findByImei1ContainingIgnoreCaseOrImei2ContainingIgnoreCase(String imei1, String imei2);

    // Búsqueda combinada en serial, marca, modelo o IMEI
    @Query("SELECT d FROM DispositivoMovil d WHERE " +
            "LOWER(d.serial) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(d.marca.descripcion) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(d.modelo.descripcion) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(d.imei1) LIKE LOWER(CONCAT('%', :termino, '%')) OR " +
            "LOWER(d.imei2) LIKE LOWER(CONCAT('%', :termino, '%'))")
    List<DispositivoMovil> buscarPorTermino(@Param("termino") String termino);
}