package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.Impresora;
import com.sistemas_inventario_backend.servicios.ImpresoraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/impresora")
@RequiredArgsConstructor
public class ImpresoraController {

    private final ImpresoraService impresoraService;

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
}
