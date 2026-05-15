package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.*;
import com.sistemas_inventario_backend.repositorios.DispositivoTecnologico_TipoRepository;
import com.sistemas_inventario_backend.repositorios.DispositivoTecnologico_MarcaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor

public class CatalogoService {

    private final DispositivoTecnologico_TipoRepository tipoRepository;
    private final DispositivoTecnologico_MarcaRepository marcaRepository;


    // ========== MARCAS ==========

    public List<DispositivoTecnologico_Marca> listarTodasLasMarcas() {
        return marcaRepository.findAll();
    }

    public List<DispositivoTecnologico_Marca> listarMarcasPorTipo(Long tipoCodigo) {
        return marcaRepository.findByTipoCodigoAndActivoTrue(tipoCodigo);
    }

    public List<DispositivoTecnologico_Tipo> listarTiposPorCatalogo(Long catalogoCodigo) {
        return tipoRepository.findByCatalogoCodigoAndActivoTrue(catalogoCodigo);
    }

    @Transactional
    public DispositivoTecnologico_Marca crearMarca(String descripcion, Long tipoCodigo) {
        DispositivoTecnologico_Marca marca = new DispositivoTecnologico_Marca();
        marca.setDescripcion(descripcion);
        marca.setActivo(true);

        // Si se especifica un tipo, asociarlo
        if (tipoCodigo != null) {
            DispositivoTecnologico_Tipo tipo = tipoRepository.findById(tipoCodigo)
                    .orElseThrow(() -> new RuntimeException("Tipo no encontrado"));
            marca.setTipo(tipo);  // Asociar la marca al tipo
        }

        return marcaRepository.save(marca);
    }

}
