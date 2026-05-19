package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.DispositivoMovil;
import com.sistemas_inventario_backend.servicios.DispositivoMovilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/dispositivos-moviles")
@RequiredArgsConstructor
public class DispositivoMovilController {

    private final DispositivoMovilService dispositivoMovilService;

    @PostMapping("/registrar")
    public ResponseEntity<?> registrar(@RequestBody DispositivoMovil dispositivo) {
        try {
            DispositivoMovil nuevoDispositivo = dispositivoMovilService.registrar(dispositivo);
            return ResponseEntity.ok(nuevoDispositivo);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
