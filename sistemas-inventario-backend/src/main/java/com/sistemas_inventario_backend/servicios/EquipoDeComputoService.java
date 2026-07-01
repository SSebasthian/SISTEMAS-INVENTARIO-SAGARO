package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.DTOs.Respuesta.EquipoDeComputoRespuesta;
import com.sistemas_inventario_backend.entidades.*;
import com.sistemas_inventario_backend.repositorios.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipoDeComputoService {

    private final EquipoDeComputoRepository equipoRepository;
    private final DispositivoTecnologico_TipoRepository tipoRepository;
    private final DispositivoTecnologico_MarcaRepository marcaRepository;
    private final DispositivoTecnologico_ModeloRepository modeloRepository;
    private final SistemaOperativoRepository soRepository;
    private final SistemaOperativo_VersionRepository versionRepository;
    private final EquipoDeComputo_AsignacionesRepository asignacionRepository;


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
            SistemaOperativo so = soRepository.findById(equipo.getSistemaOperativo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Sistema Operativo no encontrado"));
            equipo.setSistemaOperativo(so);
        }

        if (equipo.getVersionSO() != null && equipo.getVersionSO().getCodigo() != null) {
            sistemaoperativo_version version = versionRepository.findById(equipo.getVersionSO().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Versión de SO no encontrada"));
            equipo.setVersionSO(version);
        }

        // Por defecto activo = true
        equipo.setActivo(true);

        return equipoRepository.save(equipo);
    }


    // ========== EDITAR ==========
    @Transactional
    public EquipoDeComputo editar(String serial, EquipoDeComputo equipoActualizado) {
        // Buscar el equipo existente
        EquipoDeComputo equipoExistente = equipoRepository.findById(serial)
                .orElseThrow(() -> new RuntimeException("No se encontró un equipo con el serial: " + serial));

        // Validar y cargar Tipo
        if (equipoActualizado.getTipo() != null && equipoActualizado.getTipo().getCodigo() != null) {
            DispositivoTecnologico_Tipo tipo = tipoRepository.findById(equipoActualizado.getTipo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Tipo no encontrado"));
            equipoExistente.setTipo(tipo);
        }

        // Validar y cargar Marca
        if (equipoActualizado.getMarca() != null && equipoActualizado.getMarca().getCodigo() != null) {
            DispositivoTecnologico_Marca marca = marcaRepository.findById(equipoActualizado.getMarca().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Marca no encontrada"));
            equipoExistente.setMarca(marca);
        }

        // Validar y cargar Modelo
        if (equipoActualizado.getModelo() != null && equipoActualizado.getModelo().getCodigo() != null) {
            DispositivoTecnologico_Modelo modelo = modeloRepository.findById(equipoActualizado.getModelo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Modelo no encontrado"));
            equipoExistente.setModelo(modelo);
        }

        // Validar y cargar SO
        if (equipoActualizado.getSistemaOperativo() != null && equipoActualizado.getSistemaOperativo().getCodigo() != null) {
            SistemaOperativo so = soRepository.findById(equipoActualizado.getSistemaOperativo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Sistema Operativo no encontrado"));
            equipoExistente.setSistemaOperativo(so);
        }

        // Validar y cargar Versión SO
        if (equipoActualizado.getVersionSO() != null && equipoActualizado.getVersionSO().getCodigo() != null) {
            sistemaoperativo_version version = versionRepository.findById(equipoActualizado.getVersionSO().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Versión de SO no encontrada"));
            equipoExistente.setVersionSO(version);
        }

        // Actualizar campos simples
        equipoExistente.setPlaqueta(equipoActualizado.getPlaqueta());
        equipoExistente.setFacturaCompra(equipoActualizado.getFacturaCompra());
        equipoExistente.setFechaCompra(equipoActualizado.getFechaCompra());
        equipoExistente.setDescripcion(equipoActualizado.getDescripcion());
        equipoExistente.setEstado(equipoActualizado.getEstado());
        equipoExistente.setRam(equipoActualizado.getRam());
        equipoExistente.setTipoRam(equipoActualizado.getTipoRam());
        equipoExistente.setProcesador(equipoActualizado.getProcesador());
        equipoExistente.setDisco(equipoActualizado.getDisco());
        equipoExistente.setTipoDisco(equipoActualizado.getTipoDisco());
        equipoExistente.setBits(equipoActualizado.getBits());
        equipoExistente.setActivo(equipoActualizado.getActivo());

        return equipoRepository.save(equipoExistente);
    }

    // ========== OBTENER POR SERIAL ==========
    public EquipoDeComputo obtenerPorSerial(String serial) {
        return equipoRepository.findById(serial)
                .orElseThrow(() -> new RuntimeException("No se encontró un equipo con el serial: " + serial));
    }

    // ========== LISTAR TODOS ==========
    public List<EquipoDeComputo> listarTodos() {
        return equipoRepository.findAll();
    }

    // ========== BUSCAR POR TERMINO (serial, marca, modelo) ==========
    public List<EquipoDeComputo> buscarPorTermino(String termino) {
        return equipoRepository.buscarPorTermino(termino);
    }


    // METODO: listar equipos con estado de asignacion
    public List<EquipoDeComputoRespuesta> listarConEstadoAsignacion() {
        List<EquipoDeComputo> equipos = equipoRepository.findAll();
        List<EquipoDeComputoRespuesta> resultado = new ArrayList<>();

        for (EquipoDeComputo equipo : equipos) {
            EquipoDeComputoRespuesta dto = new EquipoDeComputoRespuesta();

            // Mapear datos del equipo
            dto.setSerial(equipo.getSerial());
            dto.setPlaqueta(equipo.getPlaqueta());
            dto.setFacturaCompra(equipo.getFacturaCompra());
            dto.setFechaCompra(equipo.getFechaCompra());
            dto.setActivo(equipo.getActivo());
            dto.setDescripcion(equipo.getDescripcion());
            dto.setEstado(equipo.getEstado());
            dto.setRam(equipo.getRam());
            dto.setTipoRam(equipo.getTipoRam());
            dto.setProcesador(equipo.getProcesador());
            dto.setDisco(equipo.getDisco());
            dto.setTipoDisco(equipo.getTipoDisco());
            dto.setBits(equipo.getBits());

            // Mapear relaciones
            if (equipo.getTipo() != null) {
                dto.setTipoDescripcion(equipo.getTipo().getDescripcion());
            }
            if (equipo.getMarca() != null) {
                dto.setMarcaDescripcion(equipo.getMarca().getDescripcion());
            }
            if (equipo.getModelo() != null) {
                dto.setModeloDescripcion(equipo.getModelo().getDescripcion());
            }
            if (equipo.getSistemaOperativo() != null) {
                dto.setSoDescripcion(equipo.getSistemaOperativo().getDescripcion());
            }
            if (equipo.getVersionSO() != null) {
                dto.setVersionSODescripcion(equipo.getVersionSO().getDescripcion());
            }

            // AGREGAR INFORMACIÓN DE ASIGNACIÓN
            EquipoDeComputo_Asignaciones asignacion = asignacionRepository.findFirstBySerialActivoAndActivoTrue(equipo.getSerial());

            if (asignacion != null) {
                dto.setAsignado(true);
                dto.setAsignadoA(asignacion.getEmpleado().getNombre() + " " + asignacion.getEmpleado().getApellido());
                dto.setAsignacionId(asignacion.getConsecutivo());
            } else {
                dto.setAsignado(false);
                dto.setAsignadoA(null);
                dto.setAsignacionId(null);
            }

            resultado.add(dto);
        }

        return resultado;
    }
}


