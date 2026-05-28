package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.DTOs.EmpleadoSolicitud;
import com.sistemas_inventario_backend.entidades.Area;
import com.sistemas_inventario_backend.entidades.Cargo;
import com.sistemas_inventario_backend.entidades.Empleado;
import com.sistemas_inventario_backend.repositorios.AreaRepository;
import com.sistemas_inventario_backend.repositorios.CargoRepository;
import com.sistemas_inventario_backend.repositorios.EmpleadoRepository;
import com.sistemas_inventario_backend.servicios.EmpleadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/registrar/empleado")
@RequiredArgsConstructor
public class EmpleadoController {

    private final AreaRepository areaRepository;
    private final CargoRepository cargoRepository;
    private final EmpleadoService empleadoService;
    private final EmpleadoRepository empleadoRepository;

    //============================================================
    // Endpoint 1: Listar todas las áreas (para el primer combo)
    //============================================================

    @GetMapping("/areas")
    public List<Area> listarAreas() {
        return areaRepository.findAll();
    }


    //======================================================================================
    // Endpoint 2: Obtener los cargos asociados a un área específica (para el segundo combo)
    //======================================================================================

    @GetMapping("/areas/{areaCodigo}/cargos")
    public Set<Cargo> listarCargosPorArea(@PathVariable Long areaCodigo) {
        // Usamos el método personalizado con JOIN FETCH para evitar LazyInitializationException
        Area area = areaRepository.findByIdWithCargos(areaCodigo)
                .orElseThrow(() -> new RuntimeException("Área no encontrada con código: " + areaCodigo));
        return area.getCargos();
    }


    //========================================
    // Endpoint 3: Registrar un nuevo empleado
    //========================================

    @PostMapping("/agregar")
    public ResponseEntity<?> registrarEmpleado(@RequestBody EmpleadoSolicitud solicitud) {
        try {
            Empleado empleado = empleadoService.registrarEmpleado(solicitud);
            return ResponseEntity.ok(empleado);
        } catch (RuntimeException e) {
            // Si el mensaje contiene "Ya existe un empleado" podemos enviar un 400 con el mensaje
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ========== ENDPOINTS PARA CREAR ÁREA Y CARGO ==========


    //=================================
    // Endpoint 4: Crear una nueva área
    //=================================

    @PostMapping("/areas/crear")
    public ResponseEntity<?> crearArea(@RequestBody Map<String, String> request) {
        String descripcion = request.get("descripcion");

        // Validar que no exista
        List<Area> areasExistentes = areaRepository.findAll();
        boolean existe = areasExistentes.stream()
                .anyMatch(area -> area.getDescripcion().equalsIgnoreCase(descripcion));

        if (existe) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Ya existe un área con esa descripción"));
        }

        // Crear nueva área
        Area nuevaArea = new Area();
        nuevaArea.setDescripcion(descripcion);
        nuevaArea.setActivo(true);

        Area guardada = areaRepository.save(nuevaArea);
        return ResponseEntity.ok(guardada);
    }


    //=============================================
    // Endpoint 5: Obtener TODOS los cargos globales
    //=============================================

    @GetMapping("/cargos/todos")
    public List<Cargo> listarTodosLosCargos() {
        return cargoRepository.findAll();
    }

    //=======================================================
    // Endpoint 6: Crear un nuevo cargo y asociarlo a un área
    //=======================================================

    @PostMapping("/cargos/crear")
    public ResponseEntity<?> crearCargo(@RequestBody Map<String, Object> request) {
        try {
            String descripcion = (String) request.get("descripcion");
            Long areaCodigo = Long.valueOf(request.get("areaCodigo").toString());

            System.out.println("📝 Procesando cargo: " + descripcion + " para área: " + areaCodigo);

            if (descripcion == null || descripcion.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "La descripción del cargo es requerida"));
            }

            // Limpiar la descripción
            String descripcionLimpia = descripcion.trim().toLowerCase();

            // Obtener el área
            Area area = areaRepository.findById(areaCodigo)
                    .orElseThrow(() -> new RuntimeException("Área no encontrada"));

            // 1. Buscar si el cargo ya existe GLOBALMENTE (en cualquier área)
            Optional<Cargo> cargoExistente = cargoRepository.findByDescripcionIgnoreCase(descripcionLimpia);

            Cargo cargo;

            if (cargoExistente.isPresent()) {
                // El cargo ya existe globalmente, lo reutilizamos
                cargo = cargoExistente.get();
                System.out.println("Cargo existente encontrado: " + cargo.getDescripcion());
            } else {
                // El cargo no existe, lo creamos nuevo
                cargo = new Cargo();
                cargo.setDescripcion(descripcionLimpia);
                cargo.setActivo(true);
                cargo = cargoRepository.save(cargo);
                System.out.println("Nuevo cargo creado: " + cargo.getDescripcion());
            }

            // 2. Verificar si el cargo ya está asociado a esta área
            // Solución: Usar el ID del cargo (que es final)
            final Long cargoId = cargo.getCodigo();
            boolean yaAsociado = area.getCargos().stream()
                    .anyMatch(c -> c.getCodigo().equals(cargoId));

            if (yaAsociado) {
                // Ya está asociado, solo informar
                return ResponseEntity.ok(Map.of(
                        "codigo", cargo.getCodigo(),
                        "descripcion", cargo.getDescripcion(),
                        "mensaje", "El cargo ya estaba asociado a esta área"
                ));
            }

            // 3. Asociar el cargo al área
            area.getCargos().add(cargo);
            areaRepository.save(area);
            System.out.println("🔗 Cargo asociado al área: " + area.getDescripcion());

            return ResponseEntity.ok(Map.of(
                    "codigo", cargo.getCodigo(),
                    "descripcion", cargo.getDescripcion(),
                    "mensaje", "Cargo asociado exitosamente"
            ));

        } catch (Exception e) {
            System.err.println("Error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Error interno: " + e.getMessage()));
        }
    }


    // ========== METODO PARA EDITAR ==========

    @PutMapping("/editar/{cedula}")
    public ResponseEntity<?> editarEmpleado(@PathVariable String cedula, @RequestBody EmpleadoSolicitud solicitud) {
        try {
            Empleado empleadoEditado = empleadoService.editarEmpleado(cedula, solicitud);
            return ResponseEntity.ok(empleadoEditado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ========== METODO PARA OBTENER POR CEDULA ==========

    @GetMapping("/{cedula}")
    public ResponseEntity<?> obtenerPorCedula(@PathVariable String cedula) {
        try {
            Empleado empleado = empleadoService.obtenerPorCedula(cedula);
            return ResponseEntity.ok(empleado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // ========== METODO PARA LISTAR TODOS ==========

    @GetMapping("/listar")
    public List<Empleado> listarTodos() {
        return empleadoRepository
                .findAllByOrderByAreaCodigoAscCargoCodigoAsc();
    }

    // ========== ENDPOINT PARA BUSCAR EMPLEADOS POR CEDULA NOMBRE O APELLIDO ==========

    @GetMapping("/buscar")
    public ResponseEntity<?> buscarEmpleados(@RequestParam String termino) {
        try {
            List<Empleado> empleados = empleadoRepository.buscarPorCedulaONombre(termino);
            return ResponseEntity.ok(empleados);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}

/// //////////////////////////////////////////////////////////////////////////////
/// /////////////////////// COMO PROBAR EN POSTMAN  //////////////////////////////
/// //////////////////////////////////////////////////////////////////////////////

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