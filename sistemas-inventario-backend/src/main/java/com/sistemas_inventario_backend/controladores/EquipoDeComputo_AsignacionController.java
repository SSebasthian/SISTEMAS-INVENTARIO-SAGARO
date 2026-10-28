package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.DTOs.Respuesta.AsignacionPorEmpleado;
import com.sistemas_inventario_backend.DTOs.Solicitud.AsignacionesSolicitud;
import com.sistemas_inventario_backend.DTOs.Respuesta.AsignacionesRespuesta;
import com.sistemas_inventario_backend.entidades.EquipoDeComputo_Detalle;
import com.sistemas_inventario_backend.servicios.EquipoDeComputo_AsignacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/asignaciones")
@RequiredArgsConstructor
public class EquipoDeComputo_AsignacionController {

    private final EquipoDeComputo_AsignacionService equipoDeComputoAsignacionesService;

    // ========== ASIGNAR ==========

    @PostMapping
    public ResponseEntity<?> asignar(@RequestBody AsignacionesSolicitud solicitud) {
        try {
            AsignacionesRespuesta respuesta = equipoDeComputoAsignacionesService.asignar(solicitud);
            return ResponseEntity.ok(respuesta);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    // ========== DEVOLVER ==========
    @PutMapping("/{id}/devolver")
    public ResponseEntity<?> devolver(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String observaciones = body != null ? body.get("observaciones") : null;
            String fechaDevolucionStr = body != null ? body.get("fechaDevolucion") : null;

            LocalDate fechaDevolucion = null;
            if (fechaDevolucionStr != null && !fechaDevolucionStr.isEmpty()) {
                fechaDevolucion = LocalDate.parse(fechaDevolucionStr);
            }

            equipoDeComputoAsignacionesService.devolver(id, fechaDevolucion, observaciones);
            return ResponseEntity.ok(Map.of("mensaje", "Devolucion registrada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    // ========== VERIFICAR SI ESTA ASIGNADO ==========
    @GetMapping("/{serial}/esta-asignado")
    public ResponseEntity<?> estaAsignado(@PathVariable String serial) {
        boolean asignado = equipoDeComputoAsignacionesService.estaAsignado(serial);
        return ResponseEntity.ok(Map.of(
                "serial", serial,
                "asignado", asignado
        ));
    }


    // ========== OBTENER ASIGNACION ACTUAL ==========
    @GetMapping("/{serial}/actual")
    public ResponseEntity<?> obtenerAsignacionActual(@PathVariable String serial) {
        AsignacionesRespuesta asignacion = equipoDeComputoAsignacionesService.obtenerAsignacionActual(serial);
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
        List<AsignacionesRespuesta> historial = equipoDeComputoAsignacionesService.obtenerHistorialCompleto(serial);
        Map<String, Object> respuesta = new HashMap<>();
        respuesta.put("serial", serial);
        respuesta.put("totalAsignaciones", historial.size());
        respuesta.put("historial", historial);
        return ResponseEntity.ok(respuesta);
    }


    // ========== OBTENER ASIGNACIONES DE UN EMPLEADO ==========
    @GetMapping("/empleado/{cedula}")
    public ResponseEntity<?> obtenerPorEmpleado(@PathVariable String cedula) {
        List<AsignacionesRespuesta> asignaciones = equipoDeComputoAsignacionesService.obtenerAsignacionesPorEmpleado(cedula);
        return ResponseEntity.ok(asignaciones);
    }


    // OBTENER ASIGNACIONES POR EMPLEADO

    @GetMapping("/empleado/{cedula}/detalle")
    public ResponseEntity<?> obtenerAsignacionesPorEmpleadoConDetalle(@PathVariable String cedula) {
        List<AsignacionPorEmpleado> asignaciones = equipoDeComputoAsignacionesService.obtenerAsignacionesPorEmpleadoConDetalle(cedula);
        return ResponseEntity.ok(asignaciones);
    }


    @PutMapping("/activos/detalle/{serial}")
    public ResponseEntity<?> actualizarDetalleEquipo(
            @PathVariable String serial,
            @RequestBody Map<String, Object> payload) {
        try {
            // Extraer detalle e ip del payload
            Map<String, Object> detalleMap = (Map<String, Object>) payload.get("detalle");
            Integer ipNumero = payload.get("ip") != null ? ((Number) payload.get("ip")).intValue() : null;

            // Convertir el mapa a un objeto Detalle (o usar un DTO específico)
            EquipoDeComputo_Detalle detalle = new EquipoDeComputo_Detalle();
            if (detalleMap != null) {
                detalle.setNombreEquipo((String) detalleMap.get("nombreEquipo"));
                detalle.setNombreUsuario((String) detalleMap.get("nombreUsuario"));
                detalle.setClaveUsuario((String) detalleMap.get("claveUsuario"));
                detalle.setNombreUsuarioAdministrador((String) detalleMap.get("nombreUsuarioAdministrador"));
                detalle.setClaveUsuarioAdministrador((String) detalleMap.get("claveUsuarioAdministrador"));
                detalle.setNombreUsuarioAdicional((String) detalleMap.get("nombreUsuarioAdicional"));
                detalle.setClaveUsuarioAdicional((String) detalleMap.get("claveUsuarioAdicional"));
            }

            equipoDeComputoAsignacionesService.actualizarDetalleEquipo(serial, detalle, ipNumero);
            return ResponseEntity.ok(Map.of("mensaje", "Detalle actualizado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }




}
