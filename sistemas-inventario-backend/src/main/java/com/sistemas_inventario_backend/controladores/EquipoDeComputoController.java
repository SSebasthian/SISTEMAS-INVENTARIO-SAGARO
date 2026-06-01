package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.EquipoDeComputo;
import com.sistemas_inventario_backend.servicios.EquipoDeComputoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/equipos-computo")
@RequiredArgsConstructor
public class EquipoDeComputoController {

    private final EquipoDeComputoService equipoService;


    @PostMapping("/registrar")
    public ResponseEntity<?> registrarEquipo(@RequestBody EquipoDeComputo equipo) {
        try {
            EquipoDeComputo nuevoEquipo = equipoService.registrar(equipo);
            return ResponseEntity.ok(nuevoEquipo);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }


    // ========== EDITAR ==========
    @PutMapping("/editar/{serial}")
    public ResponseEntity<?> editarEquipo(@PathVariable String serial, @RequestBody EquipoDeComputo equipo) {
        try {
            EquipoDeComputo equipoEditado = equipoService.editar(serial, equipo);
            return ResponseEntity.ok(equipoEditado);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ========== OBTENER POR SERIAL ==========
    @GetMapping("/{serial}")
    public ResponseEntity<?> obtenerPorSerial(@PathVariable String serial) {
        try {
            EquipoDeComputo equipo = equipoService.obtenerPorSerial(serial);
            return ResponseEntity.ok(equipo);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ========== LISTAR TODOS ==========
    @GetMapping("/listar")
    public ResponseEntity<?> listarTodos() {
        try {
            List<EquipoDeComputo> equipos = equipoService.listarTodos();
            return ResponseEntity.ok(equipos);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // ========== BUSCAR POR TERMINO (serial, marca, modelo, factura) ==========
    @GetMapping("/buscar")
    public ResponseEntity<?> buscarEquipos(@RequestParam String termino) {
        try {
            List<EquipoDeComputo> equipos = equipoService.buscarPorTermino(termino);
            return ResponseEntity.ok(equipos);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", e.getMessage()));
        }
    }
}


/// //////////////////////////////////////////////////////////////////////////////
/// /////////////////////// COMO PROBAR EN POSTMAN  //////////////////////////////
/// //////////////////////////////////////////////////////////////////////////////

/*

Registrar un equipo
Metodo: POST
URL: http://localhost:8080/requistrar/equipos-computo
Headers: Content-Type: application/json
    {
      "serial": "PC-001",
      "plaqueta": "ABC123",
      "facturaCompra": "F001",
      "fechaCompra": "2025-05-07",
      "activo": true,
      "descripcion": "Laptop de desarrollo",
      "ram": 16,
      "tipoRam": "DDR4",
      "procesador": "Intel i7",
      "disco": "512GB",
      "tipoDisco": "SSD",
      "bits": 64,
      "tipo": { "codigo": 1 },
      "marca": { "codigo": 1 },
      "modelo": { "codigo": 1 },
      "sistemaOperativo": { "codigo": 1 },
      "versionSO": { "codigo": 1 }
    }



 */
