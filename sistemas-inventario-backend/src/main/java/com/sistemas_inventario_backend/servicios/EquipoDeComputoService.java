/**package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.EquipoDeComputo;
import com.sistemas_inventario_backend.repositorios.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipoDeComputoService {

    private final EquipoDeComputoRepository equipoRepository;
    private final DispositivoTecnologico_TipoRepository tipoRepository;
    private final DispositivoTecnologico_MarcaRepository marcaRepository;
    private final DispositivoTecnologico_ModeloRepository modeloRepository;
    private final DispositivoTecnologico_SORepository soRepository;
    private final DispositivoTecnologico_VersionSORepository versionRepository;


    // Obtener todos los equipos
    public List<EquipoDeComputo> listarTodos() {
        return equipoRepository.findAll();
    }

    // Obtener equipos activos
    public List<EquipoDeComputo> listarActivos() {
        return equipoRepository.findByActivoTrue();
    }

    // Obtener equipo por serial
    public EquipoDeComputo obtenerPorSerial(String serial) {
        return equipoRepository.findById(serial)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado con serial: " + serial));
    }

    // Obtener equipos por tipo (codigo)
    public List<EquipoDeComputo> listarPorTipoCodigo(Long tipoCodigo) {
        return equipoRepository.findByTipoCodigo(tipoCodigo);
    }

    // Obtener equipos por marca (codigo)
    public List<EquipoDeComputo> listarPorMarcaCodigo(Long marcaCodigo) {
        return equipoRepository.findByMarcaCodigo(marcaCodigo);
    }

    // Obtener equipos por modelo (codigo)
    public List<EquipoDeComputo> listarPorModeloCodigo(Long modeloCodigo) {
        return equipoRepository.findByModeloCodigo(modeloCodigo);
    }

    // Obtener equipos por rango de fechas de compra
    public List<EquipoDeComputo> listarPorRangoFechas(LocalDate desde, LocalDate hasta) {
        return equipoRepository.findByFechaCompraBetween(desde, hasta);
    }

    // Obtener equipos activos con tipo y marca precargados (JOIN FETCH)
    public List<EquipoDeComputo> listarActivosConDetalles() {
        return equipoRepository.findAllActiveWithTipoAndMarca();
    }

    // Obtener equipos inactivos
    public List<EquipoDeComputo> listarInactivos() {
        return equipoRepository.findByActivoFalse();
    }


    // Contar equipos por marca
    public Long contarPorMarca(Long marcaCodigo) {
        return equipoRepository.countByMarcaCodigo(marcaCodigo);
    }

    // Registrar nuevo equipo
    @Transactional
    public EquipoDeComputo registrar(EquipoDeComputo equipo) {
        if (equipoRepository.existsById(equipo.getSerial())) {
            throw new RuntimeException("Ya existe un equipo con el serial: " + equipo.getSerial());
        }
        validarCatalogosExistentes(equipo);
        return equipoRepository.save(equipo);
    }

    // Actualizar equipo existente
    @Transactional
    public EquipoDeComputo actualizar(String serial, EquipoDeComputo equipoActualizado) {
        EquipoDeComputo existente = obtenerPorSerial(serial);
        // actualizar campos simples...
        existente.setPlaqueta(equipoActualizado.getPlaqueta());
        existente.setFacturaCompra(equipoActualizado.getFacturaCompra());
        existente.setFechaCompra(equipoActualizado.getFechaCompra());
        existente.setActivo(equipoActualizado.getActivo());
        existente.setDescripcion(equipoActualizado.getDescripcion());
        existente.setRam(equipoActualizado.getRam());
        existente.setTipoRam(equipoActualizado.getTipoRam());
        existente.setProcesador(equipoActualizado.getProcesador());
        existente.setDisco(equipoActualizado.getDisco());
        existente.setTipoDisco(equipoActualizado.getTipoDisco());
        existente.setBits(equipoActualizado.getBits());
        // actualizar relaciones
        existente.setTipo(equipoActualizado.getTipo());
        existente.setMarca(equipoActualizado.getMarca());
        existente.setModelo(equipoActualizado.getModelo());
        existente.setSistemaOperativo(equipoActualizado.getSistemaOperativo());
        existente.setVersionSO(equipoActualizado.getVersionSO());
        // validar que las nuevas FK existan
        validarCatalogosExistentes(existente);
        return equipoRepository.save(existente);
    }

    private void validarCatalogosExistentes(EquipoDeComputo equipo) {
        if (equipo.getTipo() != null && !tipoRepository.existsById(equipo.getTipo().getCodigo())) {
            throw new RuntimeException("El tipo especificado no existe");
        }
        if (equipo.getMarca() != null && !marcaRepository.existsById(equipo.getMarca().getCodigo())) {
            throw new RuntimeException("La marca especificada no existe");
        }
        if (equipo.getModelo() != null && !modeloRepository.existsById(equipo.getModelo().getCodigo())) {
            throw new RuntimeException("El modelo especificado no existe");
        }
        if (equipo.getSistemaOperativo() != null && !soRepository.existsById(equipo.getSistemaOperativo().getCodigo())) {
            throw new RuntimeException("El sistema operativo especificado no existe");
        }
        if (equipo.getVersionSO() != null && !versionRepository.existsById(equipo.getVersionSO().getCodigo())) {
            throw new RuntimeException("La versión de SO especificada no existe");
        }
    }

    // Desactivar equipo (borrado lógico)
    @Transactional
    public void desactivar(String serial) {
        EquipoDeComputo equipo = obtenerPorSerial(serial);
        equipo.setActivo(false);
        equipoRepository.save(equipo);
    }

    // Activar equipo
    @Transactional
    public void activar(String serial) {
        EquipoDeComputo equipo = obtenerPorSerial(serial);
        equipo.setActivo(true);
        equipoRepository.save(equipo);
    }

}
*/

