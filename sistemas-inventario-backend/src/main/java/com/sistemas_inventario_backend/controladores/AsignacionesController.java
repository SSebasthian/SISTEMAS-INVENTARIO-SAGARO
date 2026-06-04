package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.DTOs.Solicitud.AsignacionesSolicitud;
import com.sistemas_inventario_backend.DTOs.Respuesta.AsignacionesRespuesta;
import com.sistemas_inventario_backend.servicios.AsignacionesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/asignaciones")
@RequiredArgsConstructor
public class AsignacionesController {

    private final AsignacionesService asignacionesService;

    // ========== ASIGNAR ==========

    @PostMapping
    public ResponseEntity<?> asignar(@RequestBody AsignacionesSolicitud solicitud) {
        try {
            AsignacionesRespuesta respuesta = asignacionesService.asignar(solicitud);
            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    // ========== DEVOLVER ==========
    @PutMapping("/{id}/devolver")
    public ResponseEntity<?> devolver(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        try {
            String obs = body != null ? body.get("observaciones") : null;
            asignacionesService.devolver(id, obs);
            return ResponseEntity.ok(Map.of("mensaje", "Devolucion registrada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    // ========== VERIFICAR SI ESTA ASIGNADO ==========
    @GetMapping("/{serial}/esta-asignado")
    public ResponseEntity<?> estaAsignado(@PathVariable String serial) {
        boolean asignado = asignacionesService.estaAsignado(serial);
        return ResponseEntity.ok(Map.of(
                "serial", serial,
                "asignado", asignado
        ));
    }


    // ========== OBTENER ASIGNACION ACTUAL ==========
    @GetMapping("/{serial}/actual")
    public ResponseEntity<?> obtenerAsignacionActual(@PathVariable String serial) {
        AsignacionesRespuesta asignacion = asignacionesService.obtenerAsignacionActual(serial);
        if (asignacion == null) {
            return ResponseEntity.ok(Map.of(
                    "serial", serial,
                    "asignado", false,
                    "mensaje", "No tiene asignacion activa"
            ));
        }
        return ResponseEntity.ok(asignacion);
    }


    // ========== OBTENER HISTORIAL COMPLETO ==========
    @GetMapping("/{serial}/historial")
    public ResponseEntity<?> obtenerHistorial(@PathVariable String serial) {
        List<AsignacionesRespuesta> historial = asignacionesService.obtenerHistorialCompleto(serial);
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("serial", serial);
        respuesta.put("totalAsignaciones", historial.size());
        respuesta.put("historial", historial);
        return ResponseEntity.ok(respuesta);
    }


    // ========== OBTENER ASIGNACIONES DE UN EMPLEADO ==========
    @GetMapping("/empleado/{cedula}")
    public ResponseEntity<?> obtenerPorEmpleado(@PathVariable String cedula) {
        List<AsignacionesRespuesta> asignaciones = asignacionesService.obtenerAsignacionesPorEmpleado(cedula);
        return ResponseEntity.ok(asignaciones);
    }
}
