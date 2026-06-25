package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.Software_Tipo;
import com.sistemas_inventario_backend.servicios.Software_TipoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/software-tipos")
@RequiredArgsConstructor
public class Software_TipoController {

    private final Software_TipoService service;

    @GetMapping("/activos")
    public List<Software_Tipo> listarActivos() {
        return service.listarActivos();
    }

    @GetMapping
    public List<Software_Tipo> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<?> obtener(@PathVariable Long codigo) {
        try {
            return ResponseEntity.ok(service.obtenerPorCodigo(codigo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Software_Tipo tipo) {
        try {
            return ResponseEntity.ok(service.guardar(tipo));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<?> actualizar(@PathVariable Long codigo, @RequestBody Software_Tipo datos) {
        try {
            return ResponseEntity.ok(service.actualizar(codigo, datos));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{codigo}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long codigo) {
        try {
            service.desactivar(codigo);
            return ResponseEntity.ok(Map.of("mensaje", "Tipo de software desactivado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
