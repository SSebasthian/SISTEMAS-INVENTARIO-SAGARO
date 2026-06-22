package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.Backup;
import com.sistemas_inventario_backend.servicios.BackupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/backup")
@RequiredArgsConstructor
public class BackupController {

    private final BackupService service;

    @GetMapping("/activos")
    public List<Backup> listarActivos() {
        return service.listarActivos();
    }

    @GetMapping
    public List<Backup> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<?> obtener(@PathVariable Long codigo) {
        try {
            Backup backup = service.obtenerPorCodigo(codigo);
            return ResponseEntity.ok(backup);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Backup backup) {
        try {
            Backup nuevo = service.guardar(backup);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<?> actualizar(@PathVariable Long codigo, @RequestBody Backup datos) {
        try {
            Backup actualizado = service.actualizar(codigo, datos);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{codigo}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long codigo) {
        try {
            service.desactivar(codigo);
            return ResponseEntity.ok(Map.of("mensaje", "Backup desactivado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
