package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.DTOs.EmpleadoSolicitud;
import com.sistemas_inventario_backend.entidades.Area;
import com.sistemas_inventario_backend.entidades.Cargo;
import com.sistemas_inventario_backend.entidades.Empleado;
import com.sistemas_inventario_backend.repositorios.AreaRepository;
import com.sistemas_inventario_backend.repositorios.CargoRepository;
import com.sistemas_inventario_backend.repositorios.EmpleadoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;



@Service
@RequiredArgsConstructor
public class EmpleadoService {


    private final EmpleadoRepository empleadoRepository;
    private final AreaRepository areaRepository;
    private final CargoRepository cargoRepository;

    @Transactional
    public Empleado registrarEmpleado(EmpleadoSolicitud solicitud) {
        // 1. Verificar si ya existe empleado con esa cédula
        if (empleadoRepository.existsById(solicitud.getCedula())) {
            throw new RuntimeException("Ya existe un empleado con la cedula: " + solicitud.getCedula());
        }

        // 2. Obtener el área
        Area area = areaRepository.findById(solicitud.getAreaCodigo())
                .orElseThrow(() -> new RuntimeException("Area no encontrada con codigo: " + solicitud.getAreaCodigo()));

        // 3. Obtener el cargo
        Cargo cargo = cargoRepository.findById(solicitud.getCargoCodigo())
                .orElseThrow(() -> new RuntimeException("Cargo no encontrado con codigo: " + solicitud.getCargoCodigo()));

        // 4. Validación central: el cargo debe estar asociado al área (ManyToMany)
        if (!area.getCargos().contains(cargo)) {
            throw new RuntimeException(
                    String.format("El cargo '%s' no pertenece al area '%s'",
                            cargo.getDescripcion(),
                            area.getDescripcion())
            );
        }

        // 5. Construir y guardar el empleado
        Empleado empleado = new Empleado();
        empleado.setCedula(solicitud.getCedula());
        empleado.setNombre(solicitud.getNombre());
        empleado.setApellido(solicitud.getApellido());
        empleado.setFechaIngreso(solicitud.getFechaIngreso());
        empleado.setActivo(true);
        empleado.setFechaRetiro(null);
        empleado.setArea(area);
        empleado.setCargo(cargo);

        return empleadoRepository.save(empleado);
    }
}

