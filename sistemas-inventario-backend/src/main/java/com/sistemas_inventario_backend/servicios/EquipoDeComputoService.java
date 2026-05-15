package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.*;
import com.sistemas_inventario_backend.repositorios.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EquipoDeComputoService {

    private final EquipoDeComputoRepository equipoRepository;
    private final DispositivoTecnologico_TipoRepository tipoRepository;
    private final DispositivoTecnologico_MarcaRepository marcaRepository;
    private final DispositivoTecnologico_ModeloRepository modeloRepository;
    private final DispositivoTecnologico_SORepository soRepository;
    private final DispositivoTecnologico_VersionSORepository versionRepository;


    @Transactional
    public EquipoDeComputo registrar(EquipoDeComputo equipo) {
        // Validar que el serial no exista
        if (equipoRepository.existsById(equipo.getSerial())) {
            throw new RuntimeException("Ya existe un equipo con el serial: " + equipo.getSerial());
        }

        // Validar y cargar las entidades relacionadas
        if (equipo.getTipo() != null && equipo.getTipo().getCodigo() != null) {
            DispositivoTecnologico_Tipo tipo = tipoRepository.findById(equipo.getTipo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Tipo no encontrado"));
            equipo.setTipo(tipo);
        }

        if (equipo.getMarca() != null && equipo.getMarca().getCodigo() != null) {
            DispositivoTecnologico_Marca marca = marcaRepository.findById(equipo.getMarca().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Marca no encontrada"));
            equipo.setMarca(marca);
        }

        if (equipo.getModelo() != null && equipo.getModelo().getCodigo() != null) {
            DispositivoTecnologico_Modelo modelo = modeloRepository.findById(equipo.getModelo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Modelo no encontrado"));
            equipo.setModelo(modelo);
        }

        if (equipo.getSistemaOperativo() != null && equipo.getSistemaOperativo().getCodigo() != null) {
            DispositivoTecnologico_SO so = soRepository.findById(equipo.getSistemaOperativo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Sistema Operativo no encontrado"));
            equipo.setSistemaOperativo(so);
        }

        if (equipo.getVersionSO() != null && equipo.getVersionSO().getCodigo() != null) {
            DispositivoTecnologico_VersionSO version = versionRepository.findById(equipo.getVersionSO().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Versión de SO no encontrada"));
            equipo.setVersionSO(version);
        }

        // Por defecto activo = true
        equipo.setActivo(true);

        return equipoRepository.save(equipo);
    }

}


