package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.EquipoDeComputo_Software;
import com.sistemas_inventario_backend.servicios.EquipoDeComputo_SoftwareService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/equipos-software")
@RequiredArgsConstructor
public class EquipoDeComputo_SoftwareController {


    private final EquipoDeComputo_SoftwareService service;

    @GetMapping("/serial/{serial}")
    public ResponseEntity<?> listarPorSerial(@PathVariable String serial) {
        try {
            List<EquipoDeComputo_Software> lista = service.listarPorSerial(serial);
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/asignacion/{asignacionConsecutivo}")
    public ResponseEntity<?> listarPorAsignacion(@PathVariable Long asignacionConsecutivo) {
        try {
            List<EquipoDeComputo_Software> lista = service.listarPorAsignacion(asignacionConsecutivo);
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.obtenerPorId(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/asignar")
    public ResponseEntity<?> asignarSoftware(
            @RequestParam String serial,
            @RequestParam Long softwareCodigo,
            @RequestParam Long asignacionConsecutivo,
            @RequestParam(required = false) Long politicaCodigo) {
        try {
            EquipoDeComputo_Software nuevo = service.asignarSoftware(
                    serial, softwareCodigo, asignacionConsecutivo, politicaCodigo);
            return ResponseEntity.ok(nuevo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long id) {
        try {
            service.desactivar(id);
            return ResponseEntity.ok(Map.of("mensaje", "Software desactivado del equipo"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


    @PatchMapping("/asignacion/{asignacionConsecutivo}/desactivar-todos")
    public ResponseEntity<?> desactivarPorAsignacion(@PathVariable Long asignacionConsecutivo) {
        try {
            service.desactivarSoftwarePorAsignacion(asignacionConsecutivo);
            return ResponseEntity.ok(Map.of("mensaje", "Todos los softwares desactivados para la asignacion"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
