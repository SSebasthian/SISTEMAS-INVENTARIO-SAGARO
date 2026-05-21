package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.Impresora;
import com.sistemas_inventario_backend.servicios.ImpresoraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/impresora")
@RequiredArgsConstructor
public class ImpresoraController {

    private final ImpresoraService impresoraService;

    // ========== REGISTRAR ==========

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody Impresora  impresora ) {
        try {
            Impresora nuevaImpresora = impresoraService.registrar(impresora);
            return ResponseEntity.ok(nuevaImpresora);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ========== EDITAR ==========
    @PutMapping("/editar/{serial}")
    public ResponseEntity<?> editar(@PathVariable String serial, @RequestBody Impresora impresora) {
        try {
            Impresora impresoraEditada = impresoraService.editar(serial, impresora);
            return ResponseEntity.ok(impresoraEditada);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ========== OBTENER POR SERIAL ==========
    @GetMapping("/{serial}")
    public ResponseEntity<?> obtenerPorSerial(@PathVariable String serial) {
        try {
            Impresora impresora = impresoraService.obtenerPorSerial(serial);
            return ResponseEntity.ok(impresora);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ========== LISTAR TODOS ==========
    @GetMapping("/listar")
    public ResponseEntity<?> listarTodos() {
        try {
            List<Impresora> impresoras = impresoraService.listarTodos();
            return ResponseEntity.ok(impresoras);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ========== BUSCAR POR TERMINO ==========
    @GetMapping("/buscar")
    public ResponseEntity<?> buscar(@RequestParam String termino) {
        try {
            List<Impresora> impresoras = impresoraService.buscarPorTermino(termino);
            return ResponseEntity.ok(impresoras);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
