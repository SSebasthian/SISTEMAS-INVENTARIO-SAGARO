package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.EquipoDeComputo_Asignaciones;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EquipoDeComputo_AsignacionesRepository extends JpaRepository<EquipoDeComputo_Asignaciones, Long> {

    // Asignaciones activas de un empleado
    List<EquipoDeComputo_Asignaciones> findByEmpleadoCedulaAndActivoTrue(String cedula);

    // Verificar si un serial tiene asignación activa
    boolean existsBySerialActivoAndActivoTrue(String serialActivo);

    // Obtener asignacion activa de un serial
    EquipoDeComputo_Asignaciones findFirstBySerialActivoAndActivoTrue(String serialActivo);

    // Historial completo de un activo (del mas reciente al mas antiguo)
    List<EquipoDeComputo_Asignaciones> findBySerialActivoOrderByFechaAsignacionDesc(String serialActivo);

    // Todas las asignaciones de un empleado (historial completo)
    List<EquipoDeComputo_Asignaciones> findByEmpleadoCedulaOrderByFechaAsignacionDesc(String cedula);
}