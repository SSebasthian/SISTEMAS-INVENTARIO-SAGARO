package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.*;
import com.sistemas_inventario_backend.repositorios.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ImpresoraService {

    private final ImpresoraRepository impresoraRepository;
    private final DispositivoTecnologico_TipoRepository tipoRepository;
    private final DispositivoTecnologico_MarcaRepository marcaRepository;
    private final DispositivoTecnologico_ModeloRepository modeloRepository;

    @Transactional
    public Impresora registrar(Impresora impresora) {

        // Validar que el serial no exista
        if (impresoraRepository.existsById(impresora.getSerial())) {
            throw new RuntimeException("Ya existe un dispositivo con el serial: " + impresora.getSerial());
        }

        // Validar y cargar Tipo
        if (impresora.getTipo() != null && impresora.getTipo().getCodigo() != null) {
            DispositivoTecnologico_Tipo tipo = tipoRepository.findById(impresora.getTipo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Tipo no encontrado"));
            impresora.setTipo(tipo);
        }

        // Validar y cargar Marca
        if (impresora.getMarca() != null && impresora.getMarca().getCodigo() != null) {
            DispositivoTecnologico_Marca marca = marcaRepository.findById(impresora.getMarca().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Marca no encontrada"));
            impresora.setMarca(marca);
        }

        // Validar y cargar Modelo
        if (impresora.getModelo() != null && impresora.getModelo().getCodigo() != null) {
            DispositivoTecnologico_Modelo modelo = modeloRepository.findById(impresora.getModelo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Modelo no encontrado"));
            impresora.setModelo(modelo);
        }

        // Validar propiedad impresora
        if (impresora.getPropiedad() == null || impresora.getPropiedad().trim().isEmpty()) {
            throw new RuntimeException("La propiedad de la impresora es requerida");
        }

        // Validar tipo de recarga
        if (impresora.getTipoRecarga() == null || impresora.getTipoRecarga().trim().isEmpty()) {
            throw new RuntimeException("El tipo de recarga es requerida");
        }

        // Por defecto activo = true
        impresora.setActivo(true);

        return impresoraRepository.save(impresora);
    }
}
