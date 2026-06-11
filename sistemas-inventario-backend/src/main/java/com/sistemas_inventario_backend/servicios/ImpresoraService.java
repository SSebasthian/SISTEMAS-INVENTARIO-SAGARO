package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.DTOs.Respuesta.ImpresoraRespuesta;
import com.sistemas_inventario_backend.entidades.*;
import com.sistemas_inventario_backend.repositorios.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImpresoraService {

    private final ImpresoraRepository impresoraRepository;
    private final DispositivoTecnologico_TipoRepository tipoRepository;
    private final DispositivoTecnologico_MarcaRepository marcaRepository;
    private final DispositivoTecnologico_ModeloRepository modeloRepository;
    private final AsignacionesRepository asignacionRepository;


    // ========== REGISTRAR ==========


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


    // ========== EDITAR ==========
    @Transactional
    public Impresora editar(String serial, Impresora impresoraActualizada) {
        Impresora impresoraExistente = impresoraRepository.findById(serial)
                .orElseThrow(() -> new RuntimeException("No se encontro el serial: " + serial));

        // Actualizar relaciones
        if (impresoraActualizada.getTipo() != null && impresoraActualizada.getTipo().getCodigo() != null) {
            DispositivoTecnologico_Tipo tipo = tipoRepository.findById(impresoraActualizada.getTipo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Tipo no encontrado"));
            impresoraExistente.setTipo(tipo);
        }

        if (impresoraActualizada.getMarca() != null && impresoraActualizada.getMarca().getCodigo() != null) {
            DispositivoTecnologico_Marca marca = marcaRepository.findById(impresoraActualizada.getMarca().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Marca no encontrada"));
            impresoraExistente.setMarca(marca);
        }

        if (impresoraActualizada.getModelo() != null && impresoraActualizada.getModelo().getCodigo() != null) {
            DispositivoTecnologico_Modelo modelo = modeloRepository.findById(impresoraActualizada.getModelo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Modelo no encontrado"));
            impresoraExistente.setModelo(modelo);
        }

        // Actualizar campos simples
        impresoraExistente.setPropiedad(impresoraActualizada.getPropiedad());
        impresoraExistente.setPlaqueta(impresoraActualizada.getPlaqueta());
        impresoraExistente.setTipoRecarga(impresoraActualizada.getTipoRecarga());
        impresoraExistente.setFacturaCompra(impresoraActualizada.getFacturaCompra());
        impresoraExistente.setFechaCompra(impresoraActualizada.getFechaCompra());
        impresoraExistente.setDescripcion(impresoraActualizada.getDescripcion());
        impresoraExistente.setEstado(impresoraActualizada.getEstado());
        impresoraExistente.setActivo(impresoraActualizada.getActivo());

        return impresoraRepository.save(impresoraExistente);
    }

    // ========== OBTENER POR SERIAL ==========
    public Impresora obtenerPorSerial(String serial) {
        return impresoraRepository.findById(serial)
                .orElseThrow(() -> new RuntimeException("No se encontró una impresora con el serial: " + serial));
    }

    // ========== LISTAR TODOS ==========
    public List<Impresora> listarTodos() {
        return impresoraRepository.findAll();
    }


    // ========== BUSCAR POR TERMINO ==========
    public List<Impresora> buscarPorTermino(String termino) {
        return impresoraRepository.buscarPorTermino(termino);
    }


    // ========== LISTAR CON ESTADO DE ASIGNACION ==========
    public List<ImpresoraRespuesta> listarConEstadoAsignacion() {
        List<Impresora> impresoras = impresoraRepository.findAll();
        List<ImpresoraRespuesta> resultado = new ArrayList<>();

        for (Impresora impresora : impresoras) {
            ImpresoraRespuesta dto = new ImpresoraRespuesta();

            // Mapear datos de la impresora
            dto.setSerial(impresora.getSerial());
            dto.setPropiedad(impresora.getPropiedad());
            dto.setPlaqueta(impresora.getPlaqueta());
            dto.setTipoRecarga(impresora.getTipoRecarga());
            dto.setFacturaCompra(impresora.getFacturaCompra());
            dto.setFechaCompra(impresora.getFechaCompra());
            dto.setActivo(impresora.getActivo());
            dto.setDescripcion(impresora.getDescripcion());
            dto.setEstado(impresora.getEstado());

            // Mapear relaciones
            if (impresora.getTipo() != null) {
                dto.setTipoDescripcion(impresora.getTipo().getDescripcion());
            }
            if (impresora.getMarca() != null) {
                dto.setMarcaDescripcion(impresora.getMarca().getDescripcion());
            }
            if (impresora.getModelo() != null) {
                dto.setModeloDescripcion(impresora.getModelo().getDescripcion());
            }

            // AGREGAR INFORMACION DE ASIGNACION
            Asignaciones asignacion = asignacionRepository.findFirstBySerialActivoAndActivoTrue(impresora.getSerial());

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
