package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.DTOs.EmpleadoSolicitud;
import com.sistemas_inventario_backend.entidades.Area;
import com.sistemas_inventario_backend.entidades.Cargo;
import com.sistemas_inventario_backend.entidades.Empleado;
import com.sistemas_inventario_backend.repositorios.AreaRepository;
import com.sistemas_inventario_backend.servicios.EmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/registrar/empleado")
@RequiredArgsConstructor
public class EmpleadoController {

    private final AreaRepository areaRepository;
    private final EmpleadoService empleadoService;


    // Endpoint 1: Listar todas las áreas (para el primer combo)
    @GetMapping("/areas")
    public List<Area> listarAreas() {
        return areaRepository.findAll();
    }

    // Endpoint 2: Obtener los cargos asociados a un área específica (para el segundo combo)
    @GetMapping("/areas/{areaCodigo}/cargos")
    public Set<Cargo> listarCargosPorArea(@PathVariable Long areaCodigo) {
        // Usamos el método personalizado con JOIN FETCH para evitar LazyInitializationException
        Area area = areaRepository.findByIdWithCargos(areaCodigo)
                .orElseThrow(() -> new RuntimeException("Área no encontrada con código: " + areaCodigo));
        return area.getCargos();
    }

    // Endpoint 3: Registrar un nuevo empleado
    @PostMapping("/agregar")
    public Empleado registrarEmpleado(@RequestBody EmpleadoSolicitud solicitud) {
        return empleadoService.registrarEmpleado(solicitud);
    }
}

/////////////////////////////////////////////////////////////////////////////////
////////////////////////// COMO PROBAR EN POSTMAN  //////////////////////////////
/////////////////////////////////////////////////////////////////////////////////

/*
Listar todas las áreas
Metodo: GET
URL: http://localhost:8080/registrar/empleado/areas



Obtener cargos de un area especifica (para el combo en cascada)
Metodo: GET
URL: http://localhost:8080/registrar/empleado/areas/1/cargos



Registrar un empleado (con relaciones válidas)
Metodo: POST
URL: http://localhost:8080/registrar/empleado/agrega
{
    "cedula": "12345678",
    "nombre": "Juan",
    "apellido": "Perez",
    "fechaIngreso": "2025-03-20",
    "areaCodigo": 1,
    "cargoCodigo": 1
}




 */