package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.Plataforma;
import com.sistemas_inventario_backend.servicios.PlataformaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/plataformas")
@RequiredArgsConstructor
public class PlataformaController {

    private final PlataformaService service;

    @GetMapping("/activos")
    public List<Plataforma> listarActivos() { return service.listarActivos(); }

    @GetMapping("/por-tipo/{recursoTipoCodigo}")
    public List<Plataforma> listarPorRecursoTipo(@PathVariable Long recursoTipoCodigo) {
        return service.listarPorRecursoTipo(recursoTipoCodigo);
    }

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Plataforma plataforma) {
        try {
            return ResponseEntity.ok(service.registrar(plataforma));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


}
