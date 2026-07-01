package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.EquipoDeComputo_Backup;
import com.sistemas_inventario_backend.servicios.EquipoDeComputo_BackupService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/equipos-backup-informacion")
@RequiredArgsConstructor
public class EquipoDeComputo_BackupController {

    private final EquipoDeComputo_BackupService service;

    @GetMapping("/serial/{serial}/asignacion/{asignacionConsecutivo}")
    public ResponseEntity<?> listarPorSerialYAsignacion(
            @PathVariable String serial,
            @PathVariable Long asignacionConsecutivo) {
        try {
            List<EquipoDeComputo_Backup> lista = service
                    .listarPorSerialYAsignacion(serial, asignacionConsecutivo);
            return ResponseEntity.ok(lista);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/serial/{serial}")
    public ResponseEntity<?> listarPorSerial(@PathVariable String serial) {
        try {
            List<EquipoDeComputo_Backup> lista = service.listarPorSerial(serial);
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

    @PostMapping
    public ResponseEntity<?> guardarBackup(
            @RequestParam String serial,
            @RequestParam Long backupInformacionCodigo,
            @RequestParam Long asignacionConsecutivo,
            @RequestParam(required = false) Long correoCodigo) {
        try {
            EquipoDeComputo_Backup eb = service.guardarBackup(
                    serial, backupInformacionCodigo, asignacionConsecutivo, correoCodigo);
            return ResponseEntity.ok(eb);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long id) {
        try {
            service.desactivarBackup(id);
            return ResponseEntity.ok(Map.of("mensaje", "Backup desactivado del equipo"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/asignacion/{asignacionConsecutivo}/desactivar-todos")
    public ResponseEntity<?> desactivarPorAsignacion(@PathVariable Long asignacionConsecutivo) {
        try {
            service.desactivarBackupsPorAsignacion(asignacionConsecutivo);
            return ResponseEntity.ok(Map.of("mensaje", "Backups desactivados para la asignacion"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
