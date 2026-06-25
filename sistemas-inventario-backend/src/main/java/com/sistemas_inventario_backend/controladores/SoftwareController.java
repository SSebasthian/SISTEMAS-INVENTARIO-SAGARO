package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.Software;
import com.sistemas_inventario_backend.servicios.SoftwareService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/software")
@RequiredArgsConstructor
public class SoftwareController {


    private final SoftwareService service;

    @GetMapping("/activos")
    public List<Software> listarActivos() {
        return service.listarActivos();
    }

    @GetMapping
    public List<Software> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/por-tipo/{tipoCodigo}")
    public List<Software> listarPorTipo(@PathVariable Long tipoCodigo) {
        return service.listarPorTipo(tipoCodigo);
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
    public ResponseEntity<?> guardar(@RequestBody Software software) {
        try {
            return ResponseEntity.ok(service.guardar(software));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<?> actualizar(@PathVariable Long codigo, @RequestBody Software datos) {
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
            return ResponseEntity.ok(Map.of("mensaje", "Software desactivado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
