package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.Antivirus_Politica;
import com.sistemas_inventario_backend.servicios.AntivirusPoliticaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/antivirus-politicas")
@RequiredArgsConstructor
public class Antivirus_PoliticaController {

    private final AntivirusPoliticaService service;

    @GetMapping("/activos")
    public List<Antivirus_Politica> listarActivos() {
        return service.listarActivos();
    }

    @GetMapping
    public List<Antivirus_Politica> listarTodos() {
        return service.listarTodos();
    }

    // ✅ NUEVO ENDPOINT: listar politicas por software (antivirus)
    @GetMapping("/por-software/{softwareCodigo}")
    public List<Antivirus_Politica> listarPorSoftware(@PathVariable Long softwareCodigo) {
        return service.listarPorSoftware(softwareCodigo);
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
    public ResponseEntity<?> guardar(@RequestBody Antivirus_Politica politica) {
        try {
            return ResponseEntity.ok(service.guardar(politica));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<?> actualizar(@PathVariable Long codigo, @RequestBody Antivirus_Politica datos) {
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
            return ResponseEntity.ok(Map.of("mensaje", "Politica desactivada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
