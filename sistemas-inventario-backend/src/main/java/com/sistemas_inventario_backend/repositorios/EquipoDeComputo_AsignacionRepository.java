package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.EquipoDeComputo_Asignacion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface EquipoDeComputo_AsignacionRepository extends JpaRepository<EquipoDeComputo_Asignacion, Long> {

    // Asignaciones activas de un empleado
    List<EquipoDeComputo_Asignacion> findByEmpleadoCedulaAndActivoTrue(String cedula);

    // Verificar si un serial tiene asignación activa
    boolean existsBySerialActivoAndActivoTrue(String serialActivo);

    // Obtener asignacion activa de un serial
    EquipoDeComputo_Asignacion findFirstBySerialActivoAndActivoTrue(String serialActivo);

    // Historial completo de un activo (del mas reciente al mas antiguo)
    List<EquipoDeComputo_Asignacion> findBySerialActivoOrderByFechaAsignacionDesc(String serialActivo);

    // Todas las asignaciones de un empleado (historial completo)
    List<EquipoDeComputo_Asignacion> findByEmpleadoCedulaOrderByFechaAsignacionDesc(String cedula);
}