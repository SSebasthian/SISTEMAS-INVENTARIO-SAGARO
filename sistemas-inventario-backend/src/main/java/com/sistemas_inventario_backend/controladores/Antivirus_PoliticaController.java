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

    @GetMapping("/por-antivirus/{antivirusCodigo}")
    public List<Antivirus_Politica> listarPorAntivirus(@PathVariable Long antivirusCodigo) {
        return service.listarPorAntivirus(antivirusCodigo);
    }

    @GetMapping("/{codigo}")
    public ResponseEntity<?> obtener(@PathVariable Long codigo) {
        try {
            Antivirus_Politica politica = service.obtenerPorCodigo(codigo);
            return ResponseEntity.ok(politica);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Antivirus_Politica politica) {
        try {
            Antivirus_Politica nueva = service.guardar(politica);
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<?> actualizar(@PathVariable Long codigo, @RequestBody Antivirus_Politica datos) {
        try {
            Antivirus_Politica actualizada = service.actualizar(codigo, datos);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{codigo}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long codigo) {
        try {
            service.desactivar(codigo);
            return ResponseEntity.ok(Map.of("mensaje", "Política desactivada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
