package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.EquipoDeComputo_Detalle;
import com.sistemas_inventario_backend.servicios.EquipoDeComputo_DetalleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/equipos-detalle")
@RequiredArgsConstructor
public class EquipoDeComputo_DetalleController {

    private final EquipoDeComputo_DetalleService service;

    @GetMapping
    public List<EquipoDeComputo_Detalle> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/serial/{serial}")
    public ResponseEntity<?> obtenerPorSerial(@PathVariable String serial) {
        try {
            EquipoDeComputo_Detalle detalle = service.obtenerPorSerial(serial);
            return ResponseEntity.ok(detalle);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/ip/{ip}")
    public ResponseEntity<?> obtenerPorIp(@PathVariable Integer ip) {
        try {
            EquipoDeComputo_Detalle detalle = service.obtenerPorIp(ip);
            return ResponseEntity.ok(detalle);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{serial}")
    public ResponseEntity<?> guardar(@PathVariable String serial, @RequestBody EquipoDeComputo_Detalle detalle) {
        try {
            EquipoDeComputo_Detalle guardado = service.guardar(serial, detalle);
            return ResponseEntity.ok(guardado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{serial}")
    public ResponseEntity<?> eliminar(@PathVariable String serial) {
        try {
            service.eliminar(serial);
            return ResponseEntity.ok(Map.of("mensaje", "Detalle eliminado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
