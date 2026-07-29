package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.DTOs.Respuesta.Backup_InformacionRespuesta;
import com.sistemas_inventario_backend.entidades.Backup_Informacion;
import com.sistemas_inventario_backend.servicios.Backup_InformacionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/backup-informacion")
@RequiredArgsConstructor
public class Backup_InformacionController {

    private final Backup_InformacionService service;

    @GetMapping("/activos")
    public List<Backup_Informacion> listarActivos() {
        return service.listarActivos();
    }

    @GetMapping
    public List<Backup_Informacion> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/por-backup/{backupCodigo}")
    public List<Backup_Informacion> listarPorBackup(@PathVariable Long backupCodigo) {
        return service.listarPorBackup(backupCodigo);
    }

    // NUEVO ENDPOINT: listar por backup y tipo
    @GetMapping("/por-backup/{backupCodigo}/tipo/{tipo}")
    public List<Backup_InformacionRespuesta> listarPorBackupYTipo(
            @PathVariable Long backupCodigo,
            @PathVariable String tipo) {
        return service.listarPorBackupYTipo(backupCodigo, tipo);
    }



    @GetMapping("/{codigo}")
    public ResponseEntity<?> obtener(@PathVariable Long codigo) {
        try {
            Backup_Informacion info = service.obtenerPorCodigo(codigo);
            return ResponseEntity.ok(info);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> guardar(@RequestBody Backup_Informacion info) {
        try {
            Backup_Informacion nueva = service.guardar(info);
            return ResponseEntity.ok(nueva);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{codigo}")
    public ResponseEntity<?> actualizar(@PathVariable Long codigo, @RequestBody Backup_Informacion datos) {
        try {
            Backup_Informacion actualizada = service.actualizar(codigo, datos);
            return ResponseEntity.ok(actualizada);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{codigo}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long codigo) {
        try {
            service.desactivar(codigo);
            return ResponseEntity.ok(Map.of("mensaje", "Informacion de backup desactivada"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // BUSCAR POR CRITERIOS (con tipo y hora)
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarPorCriterios(
            @RequestParam String nombre,
            @RequestParam String frecuencia,
            @RequestParam(required = false) String ubicacion,
            @RequestParam(required = false) String ubicacionExcluida,
            @RequestParam(required = false) Integer dia,
            @RequestParam(required = false) String hora,
            @RequestParam Long backupCodigo,
            @RequestParam String tipo) {
        try {
            LocalTime horaTime = null;
            if (hora != null && !hora.isEmpty()) {
                horaTime = LocalTime.parse(hora);
            }
            Backup_Informacion encontrado = service.buscarPorCriterios(
                    nombre, frecuencia, ubicacion, ubicacionExcluida, dia, horaTime, backupCodigo, tipo);
            if (encontrado != null) {
                return ResponseEntity.ok(encontrado);
            } else {
                return ResponseEntity.noContent().build();
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


}