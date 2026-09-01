package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.CorreosCorporativos;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface CorreoCorporativoRepository extends JpaRepository<CorreosCorporativos, Long> {

    Optional<CorreosCorporativos> findByDireccion(String direccion);

    List<CorreosCorporativos> findByActivoTrue();

    List<CorreosCorporativos> findByDireccionContainingIgnoreCase(String direccion);


    // Metodo para obtener correos disponibles (sin incluir codigo 0)
    @Query("SELECT c FROM CorreosCorporativos c " +
            "WHERE c.activo = true " +
            "AND c.recurso.codigo = 1 " +
            "AND NOT EXISTS (" +
            "    SELECT 1 FROM RecursoAsignado ra " +
            "    WHERE ra.activo = true " +
            "    AND ra.recurso.codigo = 1 " +
            "    AND CAST(ra.recursoCodigoAsignado AS long) = c.codigo" +
            ")")
    List<CorreosCorporativos> findCorreosDisponibles();


    // Metodo para obtener correos disponibles por recurso (sin incluir codigo 0)
    @Query("SELECT c FROM CorreosCorporativos c " +
            "WHERE c.activo = true " +
            "AND c.recurso.codigo = :recursoCodigo " +
            "AND NOT EXISTS (" +
            "    SELECT 1 FROM RecursoAsignado ra " +
            "    WHERE ra.activo = true " +
            "    AND ra.recurso.codigo = :recursoCodigo " +
            "    AND CAST(ra.recursoCodigoAsignado AS long) = c.codigo" +
            ")")
    List<CorreosCorporativos> findCorreosDisponiblesByRecurso(@Param("recursoCodigo") Long recursoCodigo);
}