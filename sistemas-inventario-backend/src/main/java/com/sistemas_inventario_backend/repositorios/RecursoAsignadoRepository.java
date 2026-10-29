package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Recurso;
import com.sistemas_inventario_backend.entidades.RecursoAsignado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecursoAsignadoRepository extends JpaRepository<RecursoAsignado, Long> {

    List<RecursoAsignado> findByEmpleadoCedulaAndActivoTrue(String cedula);

    List<RecursoAsignado> findByRecursoAndRecursoCodigoAsignadoAndActivoTrue(
            Recurso recurso,
            String recursoCodigoAsignado
    );


    // Metodo para verificar si está asignado
    @Query("SELECT COUNT(ra) > 0 FROM RecursoAsignado ra " +
            "WHERE ra.recurso.codigo = :recursoCodigo " +
            "AND ra.recursoCodigoAsignado = :codigoAsignado " +
            "AND ra.activo = true")
    boolean existeAsignacionActivaPorRecursoYCodigo(
            @Param("recursoCodigo") Long recursoCodigo,
            @Param("codigoAsignado") String codigoAsignado
    );
}