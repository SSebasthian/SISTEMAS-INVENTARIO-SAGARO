package com.sistemas_inventario_backend.controladores;


import com.sistemas_inventario_backend.DTOs.Solicitud.CuentaCorporativaSolicitud;
import com.sistemas_inventario_backend.entidades.CuentasCorporativas;
import com.sistemas_inventario_backend.servicios.CuentasCorporativasService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/cuentas")
@RequiredArgsConstructor
public class CuentasCorporativasController {

    private final CuentasCorporativasService service;

    @GetMapping("/activos")
    public List<CuentasCorporativas> listarActivos() {
        return service.listarActivos();
    }

    @GetMapping("/todos")
    public List<CuentasCorporativas> listarTodos() {
        return service.listarTodos();
    }

    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody CuentaCorporativaSolicitud dto) {
        try {
            CuentasCorporativas nuevo = service.registrar(dto);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @PutMapping("/{codigo}")
    public ResponseEntity<?> editar(@PathVariable Long codigo, @RequestBody CuentaCorporativaSolicitud dto) {
        try {
            CuentasCorporativas actualizado = service.editar(codigo, dto);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{codigo}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long codigo) {
        try {
            service.desactivar(codigo);
            return ResponseEntity.ok(Map.of("mensaje", "Cuenta desactivada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
