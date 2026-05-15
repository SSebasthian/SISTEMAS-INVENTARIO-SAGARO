package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.*;
import com.sistemas_inventario_backend.entidades.Catalogo;
import com.sistemas_inventario_backend.repositorios.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/catalogo")
@RequiredArgsConstructor
public class CatalogoController {

    private final CatalogoRepository catalogoRepo;
    private final DispositivoTecnologico_TipoRepository tipoRepo;
    private final DispositivoTecnologico_MarcaRepository marcaRepo;
    private final DispositivoTecnologico_ModeloRepository modeloRepo;
    private final DispositivoTecnologico_SORepository soRepo;
    private final DispositivoTecnologico_VersionSORepository versionRepo;

    // =====================================================
    // ========== CONSULTAS (GET) ==========================
    // =====================================================


    // Obtener todas las categorías activas
    @GetMapping("/catalogos")
    public List<Catalogo> getCatalogos() {
        return catalogoRepo.findByActivoTrue();
    }

    // Tipos por categoría (COMPUTADOR - PORTATIL - SERVIDOR - CELULAR - TABLET)
    @GetMapping("/tipos/catalogo/{catalogoCodigo}")
    public List<DispositivoTecnologico_Tipo> getTiposPorCatalogo(@PathVariable Long catalogoCodigo) {
        return tipoRepo.findByCatalogoCodigoAndActivoTrue(catalogoCodigo);
    }


    // Todas las marcas
    @GetMapping("/marcas")
    public List<DispositivoTecnologico_Marca> getMarcas() {
        return marcaRepo.findAll();
    }

    // Marcas por catálogo
    @GetMapping("/marcas/catalogo/{catalogoCodigo}")
    public List<DispositivoTecnologico_Marca> getMarcasPorCatalogo(@PathVariable Long catalogoCodigo) {
        return marcaRepo.findByCatalogoCodigo(catalogoCodigo);
    }

    // Obtener marcas por tipo
    @GetMapping("/marcas/tipo/{tipoCodigo}")
    public List<DispositivoTecnologico_Marca> getMarcasPorTipo(@PathVariable Long tipoCodigo) {
        return marcaRepo.findByTipoCodigoAndActivoTrue(tipoCodigo);
    }

    // Modelos por marca
    @GetMapping("/modelos/marca/{marcaCodigo}")
    public List<DispositivoTecnologico_Modelo> getModelosPorMarca(@PathVariable Long marcaCodigo) {
        return modeloRepo.findByMarcaCodigoAndActivoTrue(marcaCodigo);
    }

    //Llamar Modelo x Marca + Tipo
    @GetMapping("/modelos/marca/{marcaCodigo}/tipo/{tipoCodigo}")
    public List<DispositivoTecnologico_Modelo> getModelosPorMarcaYTipo(
            @PathVariable Long marcaCodigo,
            @PathVariable Long tipoCodigo) {
        return modeloRepo.findByMarcaCodigoAndTipoCodigoAndActivoTrue(marcaCodigo, tipoCodigo);
    }


    // Sistemas Operativos por categoría  (usando el ID de la categoría)
    @GetMapping("/sistemas-operativos/catalogo/{catalogoCodigo}")
    public List<DispositivoTecnologico_SO> getSoPorCatalogo(@PathVariable Long catalogoCodigo) {
        return soRepo.findByCatalogoCodigoAndActivoTrue(catalogoCodigo);
    }

    // Versiones por SO
    @GetMapping("/versiones-so/so/{soCodigo}")
    public List<DispositivoTecnologico_VersionSO> getVersionesPorSO(@PathVariable Long soCodigo) {
        return versionRepo.findBySistemaOperativoCodigoAndActivoTrue(soCodigo);
    }


    // =============================================
    // ========== CREAR (POST)  ====================
    // =============================================


    // Crear nueva MARCA
    @PostMapping("/marcas/crear")
    public ResponseEntity<?> crearMarca(@RequestBody Map<String, Object> request) {
        try {
            String descripcion = (String) request.get("descripcion");
            Long tipoCodigo = Long.valueOf(request.get("tipoCodigo").toString());

            if (descripcion == null || descripcion.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "La descripción de la marca es requerida"));
            }

            // Buscar el tipo
            DispositivoTecnologico_Tipo tipo = tipoRepo.findById(tipoCodigo)
                    .orElseThrow(() -> new RuntimeException("Tipo no encontrado"));

            // Crear nueva marca
            DispositivoTecnologico_Marca nuevaMarca = new DispositivoTecnologico_Marca();
            nuevaMarca.setDescripcion(descripcion.trim());
            nuevaMarca.setActivo(true);
            nuevaMarca.setTipo(tipo);

            DispositivoTecnologico_Marca guardada = marcaRepo.save(nuevaMarca);
            return ResponseEntity.ok(guardada);

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("message", "Error al crear la marca: " + e.getMessage()));
        }
    }


}

/// //////////////////////////////////////////////////////////////////////////////
/// /////////////////////// COMO PROBAR EN POSTMAN  //////////////////////////////
/// //////////////////////////////////////////////////////////////////////////////

/*
Obtiene todas las categorías activas
GET: http://localhost:8080/catalogo/catalogos

Obtiene los tipos según la categoría
GET: http://localhost:8080/catalogo/tipos/catalogo/{catalogoCodigo}

Obtiene todas las marcas
GET: http://localhost:8080/catalogo/marcas

Obtiene las marcas según la categoría
GET: http://localhost:8080/catalogo/marcas/catalogo/{catalogoCodigo}

Obtiene los modelos según la marca
GET: http://localhost:8080/catalogo/modelos/marca/{marcaCodigo}

Obtiene los sistemas operativos según la categoría
GET: http://localhost:8080/catalogo/sistemas-operativos/catalogo/{catalogoCodigo}

Obtiene las versiones según el sistema operativo
GET: http://localhost:8080/catalogo/versiones-so/so/{soCodigo}


http://localhost:8080/catalogo/marcas/tipo/2


*/
