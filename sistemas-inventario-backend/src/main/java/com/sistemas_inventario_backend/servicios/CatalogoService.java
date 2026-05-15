package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.*;
import com.sistemas_inventario_backend.repositorios.DispositivoTecnologico_TipoRepository;
import com.sistemas_inventario_backend.repositorios.DispositivoTecnologico_MarcaRepository;
import com.sistemas_inventario_backend.repositorios.DispositivoTecnologico_ModeloRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor

public class CatalogoService {

    private final DispositivoTecnologico_TipoRepository tipoRepository;
    private final DispositivoTecnologico_MarcaRepository marcaRepository;
    private final DispositivoTecnologico_ModeloRepository modeloRepository;




    // ========== CREAR MARCA ==========


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


    // ========== CREAR MODELO ==========

    @Transactional
    public DispositivoTecnologico_Modelo crearModelo(DispositivoTecnologico_Modelo modelo) {
        // Validar que el tipo exista
        DispositivoTecnologico_Tipo tipo = tipoRepository.findById(modelo.getTipo().getCodigo())
                .orElseThrow(() -> new RuntimeException("Tipo no encontrado con codigo: " + modelo.getTipo().getCodigo()));

        // Validar que la marca exista
        DispositivoTecnologico_Marca marca = marcaRepository.findById(modelo.getMarca().getCodigo())
                .orElseThrow(() -> new RuntimeException("Marca no encontrada con codigo: " + modelo.getMarca().getCodigo()));

        // Crear el modelo
        DispositivoTecnologico_Modelo nuevoModelo = new DispositivoTecnologico_Modelo();
        nuevoModelo.setDescripcion(modelo.getDescripcion());
        nuevoModelo.setTipo(tipo);
        nuevoModelo.setMarca(marca);
        nuevoModelo.setRutaImagen(modelo.getRutaImagen());
        nuevoModelo.setActivo(true);

        return modeloRepository.save(nuevoModelo);
    }

}
