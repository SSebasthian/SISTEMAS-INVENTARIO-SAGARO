package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.DTOs.Solicitud.CorreoCorporativoSolicitud;
import com.sistemas_inventario_backend.entidades.CorreosCorporativos;
import com.sistemas_inventario_backend.seguridad.SeguridadClave;
import com.sistemas_inventario_backend.servicios.CorreoCorporativoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sistemas_inventario_backend.repositorios.RecursoAsignadoRepository;
import org.springframework.beans.factory.annotation.Value;


import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/correos")
@RequiredArgsConstructor
public class CorreosCorporativosController {

    private final CorreoCorporativoService service;
    private final RecursoAsignadoRepository recursoAsignadoRepository;

    @GetMapping("/activos")
    public List<CorreosCorporativos> listarActivos() {
        return service.listarActivos();
    }

    @GetMapping("/todos")
    public List<CorreosCorporativos> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/disponibles")
    public ResponseEntity<?> listarCorreosDisponibles() {
        try {
            List<CorreosCorporativos> disponibles = service.listarCorreosDisponibles();
            return ResponseEntity.ok(disponibles);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/disponibles/recurso/{recursoCodigo}")
    public ResponseEntity<?> listarDisponiblesPorRecurso(@PathVariable Long recursoCodigo) {
        try {
            List<CorreosCorporativos> disponibles = service.listarCorreosDisponiblesPorRecurso(recursoCodigo);
            return ResponseEntity.ok(disponibles);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }


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

    @GetMapping("/{codigo}/esta-asignado")
    public ResponseEntity<?> verificarSiEstaAsignado(@PathVariable Long codigo) {
        try {
            // Buscamos si existe alguna asignación activa donde el recurso sea CORREO (codigo 1)
            // y el codigo asignado coincida con el ID del correo.
            // Si tienes un método específico en tu repositorio, úsalo. Si no, lo creamos abajo.
            boolean asignado = recursoAsignadoRepository.existeAsignacionActivaPorRecursoYCodigo(1L, codigo.toString());

            return ResponseEntity.ok(Map.of("asignado", asignado));
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


    @GetMapping("/{codigo}/ver-clave")
    public ResponseEntity<?> obtenerClaveDesencriptada(@PathVariable Long codigo) {
        try {
            CorreosCorporativos correo = service.buscarPorId(codigo);

            // VALIDACIÓN DE SEGURIDAD: Asegúrate de que el usuario tenga permiso
            // (Si usas Spring Security, aquí validas el rol)

            if (correo.getClave() != null && !correo.getClave().isEmpty()) {
                String claveDesencriptada = SeguridadClave.decrypt(correo.getClave());
                return ResponseEntity.ok(Map.of("clave", claveDesencriptada));
            }
            return ResponseEntity.ok(Map.of("clave", ""));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

}
