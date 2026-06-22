package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.Antivirus;
import com.sistemas_inventario_backend.servicios.AntivirusService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/antivirus")
@RequiredArgsConstructor
public class AntivirusController {


    private final AntivirusService service;

    @GetMapping("/activos")
    public List<Antivirus> listarActivos() {
        return service.listarActivos();
    }

    @GetMapping
    public List<Antivirus> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<?> obtener(@PathVariable Long codigo) {
        try {
            Antivirus antivirus = service.obtenerPorCodigo(codigo);
            return ResponseEntity.ok(antivirus);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Antivirus antivirus) {
        try {
            Antivirus nuevo = service.guardar(antivirus);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<?> actualizar(@PathVariable Long codigo, @RequestBody Antivirus datos) {
        try {
            Antivirus actualizado = service.actualizar(codigo, datos);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{codigo}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long codigo) {
        try {
            service.desactivar(codigo);
            return ResponseEntity.ok(Map.of("mensaje", "Antivirus desactivado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}