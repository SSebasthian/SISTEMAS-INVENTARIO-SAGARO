package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Recurso;
import com.sistemas_inventario_backend.entidades.RecursoAsignado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RecursoAsignadoRepository extends JpaRepository<RecursoAsignado, Long> {

    List<RecursoAsignado> findByEmpleadoCedulaAndActivoTrue(String cedula);

    List<RecursoAsignado> findByRecursoAndRecursoCodigoAsignadoAndActivoTrue(
            Recurso recurso,
            String recursoCodigoAsignado
    );
}