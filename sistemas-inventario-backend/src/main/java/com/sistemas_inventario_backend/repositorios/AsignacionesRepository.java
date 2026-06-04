package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Asignaciones;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface AsignacionesRepository extends JpaRepository<Asignaciones, Long> {

    // Asignaciones activas de un empleado
    List<Asignaciones> findByEmpleadoCedulaAndActivoTrue(String cedula);

    // Verificar si un serial tiene asignación activa
    boolean existsBySerialActivoAndActivoTrue(String serialActivo);

    // Obtener asignacion activa de un serial
    Asignaciones findFirstBySerialActivoAndActivoTrue(String serialActivo);

    // Historial completo de un activo (del mas reciente al mas antiguo)
    List<Asignaciones> findBySerialActivoOrderByFechaAsignacionDesc(String serialActivo);

    // Todas las asignaciones de un empleado (historial completo)
    List<Asignaciones> findByEmpleadoCedulaOrderByFechaAsignacionDesc(String cedula);
}