package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.IP;
import com.sistemas_inventario_backend.servicios.IPService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/ips")
@RequiredArgsConstructor

public class IPController {

    private final IPService ipService;

    @GetMapping("/disponibles")
    public List<IP> obtenerDisponibles() {
        return ipService.obtenerIpsDisponibles();
    }

    @GetMapping
    public List<IP> obtenerTodas() {
        return ipService.obtenerTodas();
    }

    @PostMapping("/ocupar")
    public ResponseEntity<?> ocupar(@RequestBody Map<String, Object> request) {
        try {
            Integer ip = (Integer) request.get("ip");
            Long catalogoCodigo = Long.valueOf(request.get("catalogoCodigo").toString());
            Long tipoCodigo = Long.valueOf(request.get("tipoCodigo").toString());

            ipService.ocuparIp(ip, catalogoCodigo, tipoCodigo);
            return ResponseEntity.ok(Map.of("mensaje", "IP ocupada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/liberar")
    public ResponseEntity<?> liberar(@RequestBody Map<String, Object> request) {
        try {
            Integer ip = (Integer) request.get("ip");
            ipService.liberarIp(ip);
            return ResponseEntity.ok(Map.of("mensaje", "IP liberada correctamente"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
