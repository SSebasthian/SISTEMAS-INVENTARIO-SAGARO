package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.RecursoAsignado;
import com.sistemas_inventario_backend.servicios.RecursoAsignadoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/asignaciones/recursos")
@RequiredArgsConstructor
public class RecursoAsignadoController {

    private final RecursoAsignadoService service;

    @PostMapping
    public ResponseEntity<?> asignar(@RequestBody Map<String, Object> request) {
        try {
            String cedula = (String) request.get("empleadoCedula");
            String nombreRecurso = (String) request.get("tipo"); // "TELEFONO", "CORREO", "CUENTA"
            Long recursoTipoId = Long.valueOf(request.get("recursoTipoId").toString());
            Long recursoId = Long.valueOf(request.get("recursoId").toString());
            LocalDate fecha = request.get("fechaAsignacion") != null ?
                    LocalDate.parse((String) request.get("fechaAsignacion")) : null;
            String obs = (String) request.get("observaciones");

            RecursoAsignado asignacion = service.asignar(cedula, nombreRecurso, recursoId,recursoTipoId, fecha, obs);
            return ResponseEntity.ok(asignacion);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/devolver")
    public ResponseEntity<?> devolver(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        try {
            LocalDate fecha = body != null && body.get("fechaDevolucion") != null ?
                    LocalDate.parse(body.get("fechaDevolucion")) : null;
            String obs = body != null ? body.get("observaciones") : null;
            service.devolver(id, fecha, obs);
            return ResponseEntity.ok(Map.of("mensaje", "Recurso devuelto correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/empleado/{cedula}")
    public ResponseEntity<?> listarPorEmpleado(@PathVariable String cedula) {
        try {
            List<RecursoAsignado> lista = service.listarActivasPorEmpleado(cedula);
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
