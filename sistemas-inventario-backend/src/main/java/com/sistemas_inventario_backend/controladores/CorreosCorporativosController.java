package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.DTOs.Solicitud.CorreoCorporativoSolicitud;
import com.sistemas_inventario_backend.entidades.CorreosCorporativos;
import com.sistemas_inventario_backend.servicios.CorreoCorporativoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/correos")
@RequiredArgsConstructor
public class CorreosCorporativosController {

    private final CorreoCorporativoService service;

    @GetMapping("/activos")
    public List<CorreosCorporativos> listarActivos() {
        return service.listarActivos();
    }

    @GetMapping("/todos")
    public List<CorreosCorporativos> listarTodos() { return service.listarTodos(); }




    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody CorreoCorporativoSolicitud correo) {
        try {
            CorreosCorporativos nuevo = service.registrar(correo);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<?> editar(@PathVariable Long codigo, @RequestBody CorreosCorporativos datos) {
        try {
            CorreosCorporativos actualizado = service.editar(codigo, datos);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @PutMapping("/{codigo}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long codigo) {
        try {
            service.desactivar(codigo);
            return ResponseEntity.ok(Map.of("mensaje", "Correo desactivado correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping("/buscar")
    public List<CorreosCorporativos> buscar(@RequestParam String termino) {
        return service.buscarPorTermino(termino);
    }


}
