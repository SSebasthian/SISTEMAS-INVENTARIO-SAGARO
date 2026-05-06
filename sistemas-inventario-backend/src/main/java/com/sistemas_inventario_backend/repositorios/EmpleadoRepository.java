package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Empleado;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;


// Repositorio para la entidad Empleado
// La clave primaria es String (cédula)
public interface EmpleadoRepository extends JpaRepository<Empleado, String> {


    // Metodo derivado de Spring Data JPA
    // Busca todos los empleados donde activo = true
    List<Empleado> findByActivoTrue();   // empleados activos

    // Metodo derivado
    // Busca empleados que aún NO tienen fecha de retiro (siguen activos en la empresa)
    List<Empleado> findByFechaRetiroIsNull();
}
