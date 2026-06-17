package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.DTOs.Solicitud.LineaTelefonicaSolicitud;
import com.sistemas_inventario_backend.entidades.LineaTelefonica;
import com.sistemas_inventario_backend.servicios.LineaTelefonicaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/telefonos")
@RequiredArgsConstructor
public class LineaTelefonicaController {

    private final LineaTelefonicaService service;

    @GetMapping("/activos")
    public List<LineaTelefonica> listarActivos() {
        return service.listarActivos();
    }

    @GetMapping("/todos")
    public List<LineaTelefonica> listarTodos() { return service.listarTodos(); }

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody LineaTelefonicaSolicitud telefono) {
        try {
            LineaTelefonica nuevo = service.registrar(telefono);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<?> editar(@PathVariable Long codigo, @RequestBody LineaTelefonicaSolicitud dto) {
        try {
            LineaTelefonica actualizado = service.editar(codigo, dto);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{codigo}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long codigo) {
        try {
            service.desactivar(codigo);
            return ResponseEntity.ok(Map.of("mensaje", "Teléfono desactivado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
