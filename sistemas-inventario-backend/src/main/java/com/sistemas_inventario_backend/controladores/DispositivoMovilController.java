package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.DTOs.Respuesta.DispositivoMovilRespuesta;
import com.sistemas_inventario_backend.entidades.DispositivoMovil;
import com.sistemas_inventario_backend.servicios.DispositivoMovilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dispositivos-moviles")
@RequiredArgsConstructor
public class DispositivoMovilController {

    private final DispositivoMovilService dispositivoMovilService;


    // ========== REGISTRAR ==========

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

    // ========== EDITAR ==========
    @PutMapping("/editar/{serial}")
    public ResponseEntity<?> editar(@PathVariable String serial, @RequestBody DispositivoMovil dispositivo) {
        try {
            DispositivoMovil dispositivoEditado = dispositivoMovilService.editar(serial, dispositivo);
            return ResponseEntity.ok(dispositivoEditado);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ========== OBTENER POR SERIAL ==========
    @GetMapping("/{serial}")
    public ResponseEntity<?> obtenerPorSerial(@PathVariable String serial) {
        try {
            DispositivoMovil dispositivo = dispositivoMovilService.obtenerPorSerial(serial);
            return ResponseEntity.ok(dispositivo);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ========== LISTAR TODOS ==========
    @GetMapping("/listar")
    public ResponseEntity<?> listarTodos() {
        try {
            List<DispositivoMovil> dispositivos = dispositivoMovilService.listarTodos();
            return ResponseEntity.ok(dispositivos);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ========== BUSCAR POR TERMINO ==========
    @GetMapping("/buscar")
    public ResponseEntity<?> buscar(@RequestParam String termino) {
        try {
            List<DispositivoMovil> dispositivos = dispositivoMovilService.buscarPorTermino(termino);
            return ResponseEntity.ok(dispositivos);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }



    // ENDPOINT: listar equipos con estado de asignacion

    @GetMapping("/listar-con-asignacion")
    public ResponseEntity<?> listarConAsignacion() {
        try {
            List<DispositivoMovilRespuesta> dispositivos = dispositivoMovilService.listarConEstadoAsignacion();
            return ResponseEntity.ok(dispositivos);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}
