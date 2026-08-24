package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.DTOs.Solicitud.EmpleadoSolicitud;
import com.sistemas_inventario_backend.entidades.Area;
import com.sistemas_inventario_backend.entidades.Cargo;
import com.sistemas_inventario_backend.entidades.Empleado;
import com.sistemas_inventario_backend.repositorios.AreaRepository;
import com.sistemas_inventario_backend.repositorios.CargoRepository;
import com.sistemas_inventario_backend.repositorios.EmpleadoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmpleadoService {


    private final EmpleadoRepository empleadoRepository;
    private final AreaRepository areaRepository;
    private final CargoRepository cargoRepository;

    // ========== METODO PARA REGISTRAR ==========

    @Transactional
    public Empleado registrarEmpleado(EmpleadoSolicitud solicitud) {
        // 1. Verificar si ya existe empleado con esa cedula
        if (empleadoRepository.existsById(solicitud.getCedula())) {
            throw new RuntimeException("Ya existe la cedula: " + solicitud.getCedula());
        }

        // 2. Obtener el área
        Area area = areaRepository.findById(solicitud.getAreaCodigo())
                .orElseThrow(() -> new RuntimeException("Area no encontrada con codigo: " + solicitud.getAreaCodigo()));

        // 3. Obtener el cargo
        Cargo cargo = cargoRepository.findById(solicitud.getCargoCodigo())
                .orElseThrow(() -> new RuntimeException("Cargo no encontrado con codigo: " + solicitud.getCargoCodigo()));

        // 4. Validacion central: el cargo debe estar asociado al área (ManyToMany)
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


    // ========== METODO PARA EDITAR ==========

    @Transactional
    public Empleado editarEmpleado(String cedula, EmpleadoSolicitud solicitud) {

        // Buscar el empleado existente
        Empleado empleadoExistente = empleadoRepository.findById(cedula)
                .orElseThrow(() -> new RuntimeException("No se encontro un empleado con la cedula: " + cedula));

        // Obtener el área
        Area area = areaRepository.findById(solicitud.getAreaCodigo())
                .orElseThrow(() -> new RuntimeException("Area no encontrada con codigo: " + solicitud.getAreaCodigo()));

        // Obtener el cargo
        Cargo cargo = cargoRepository.findById(solicitud.getCargoCodigo())
                .orElseThrow(() -> new RuntimeException("Cargo no encontrado con codigo: " + solicitud.getCargoCodigo()));

        // Validacion: el cargo debe estar asociado al área
        if (!area.getCargos().contains(cargo)) {
            throw new RuntimeException(
                    String.format("El cargo '%s' no pertenece al area '%s'",
                            cargo.getDescripcion(),
                            area.getDescripcion())
            );
        }

        // Actualizar campos
        empleadoExistente.setNombre(solicitud.getNombre());
        empleadoExistente.setApellido(solicitud.getApellido());
        empleadoExistente.setFechaIngreso(solicitud.getFechaIngreso());
        empleadoExistente.setArea(area);
        empleadoExistente.setCargo(cargo);

        // Si se envía el campo activo, actualizarlo
        if (solicitud.getActivo() != null) {
            empleadoExistente.setActivo(solicitud.getActivo());
        }

        return empleadoRepository.save(empleadoExistente);
    }

    // ========== METODO PARA OBTENER POR CEDULA ==========

    public Empleado obtenerPorCedula(String cedula) {
        return empleadoRepository.findById(cedula)
                .orElseThrow(() -> new RuntimeException("No se encontro un empleado con la cedula: " + cedula));
    }

    // ========== METODO PARA LISTAR TODOS ==========
    public List<Empleado> listarTodos() {
        return empleadoRepository.findAll();
    }

}

