/*package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.EquipoDeComputo;
import com.sistemas_inventario_backend.servicios.EquipoDeComputoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/requistrar/equipos-computo")
@RequiredArgsConstructor
public class EquipoDeComputoController {

    private final EquipoDeComputoService equipoService;

    // Obtener todos los equipos
    @GetMapping
    public List<EquipoDeComputo> listarTodos() {
        return equipoService.listarTodos();
    }

    // Obtener equipos activos
    @GetMapping("/activos")
    public List<EquipoDeComputo> listarActivos() {
        return equipoService.listarActivos();
    }

    // Obtener equipos activos con tipo y marca precargados (JOIN FETCH)
    @GetMapping("/activos-con-detalles")
    public List<EquipoDeComputo> listarActivosConDetalles() {
        return equipoService.listarActivosConDetalles();
    }

    // Obtener equipos inactivos
    @GetMapping("/inactivos")
    public List<EquipoDeComputo> listarInactivos() {
        return equipoService.listarInactivos();
    }

    @GetMapping("/{serial}")
    public EquipoDeComputo obtenerPorSerial(@PathVariable String serial) {
        return equipoService.obtenerPorSerial(serial);
    }

    @GetMapping("/tipo/{tipoCodigo}")
    public List<EquipoDeComputo> listarPorTipo(@PathVariable Long tipoCodigo) {
        return equipoService.listarPorTipoCodigo(tipoCodigo);
    }

    @GetMapping("/marca/{marcaCodigo}")
    public List<EquipoDeComputo> listarPorMarca(@PathVariable Long marcaCodigo) {
        return equipoService.listarPorMarcaCodigo(marcaCodigo);
    }

    @GetMapping("/modelo/{modeloCodigo}")
    public List<EquipoDeComputo> listarPorModelo(@PathVariable Long modeloCodigo) {
        return equipoService.listarPorModeloCodigo(modeloCodigo);
    }

    @GetMapping("/fechas")
    public List<EquipoDeComputo> listarPorRangoFechas(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate desde,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate hasta) {
        return equipoService.listarPorRangoFechas(desde, hasta);
    }

    @GetMapping("/contar-por-marca/{marcaCodigo}")
    public Long contarPorMarca(@PathVariable Long marcaCodigo) {
        return equipoService.contarPorMarca(marcaCodigo);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EquipoDeComputo registrar(@RequestBody EquipoDeComputo equipo) {
        return equipoService.registrar(equipo);
    }

    @PutMapping("/{serial}")
    public EquipoDeComputo actualizar(@PathVariable String serial, @RequestBody EquipoDeComputo equipo) {
        return equipoService.actualizar(serial, equipo);
    }


    @PatchMapping("/{serial}/desactivar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void desactivar(@PathVariable String serial) {
        equipoService.desactivar(serial);
    }

    @PatchMapping("/{serial}/activar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void activar(@PathVariable String serial) {
        equipoService.activar(serial);
    }
}
*/

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


Actualizar equipo completo
Metodo: PUT
URL: http://localhost:8080/requistrar/equipos-computo/PC-001
Body (JSON): Igual que en el registro, con los nuevos valores



Listar todos los equipos
Metodo: GET
URL: http://localhost:8080/requistrar/equipos-computo


Listar solo equipos activos
Metodo: GET
URL: http://localhost:8080/requistrar/equipos-computo/activos


Prueba en Postman:
Metodo: GET
URL: http://localhost:8080/requistrar/equipos-computo/inactivos



Obtener equipo por serial
Metodo: GET
URL: http://localhost:8080/requistrar/equipos-computo/PC-001


Filtrar por tipo
Metodo: GET
URL: http://localhost:8080/requistrar/equipos-computo/tipo/1


Filtrar por marca
Metodo: GET
URL: http://localhost:8080/requistrar/equipos-computo/marca/1


Filtrar por modelo
Metodo: GET
URL: http://localhost:8080/requistrar/equipos-computo/modelo/1


Filtrar por rango de fechas
Metodo: GET
URL: http://localhost:8080/requistrar/equipos-computo/fechas?desde=2025-01-01&hasta=2025-12-31


Contar equipos por marca
Metodo: GET
URL: http://localhost:8080/requistrar/equipos-computo/contar-por-marca/1


Desactivar equipo
Metodo: PATCH
URL: http://localhost:8080/requistrar/equipos-computo/PC-001/desactivar


Activar equipo
Metodo: PATCH
URL: http://localhost:8080/requistrar/equipos-computo/PC-001/activar




 */
