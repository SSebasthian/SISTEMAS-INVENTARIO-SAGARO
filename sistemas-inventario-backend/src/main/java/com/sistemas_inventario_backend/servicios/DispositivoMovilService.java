package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.DTOs.Respuesta.DispositivoMovilRespuesta;
import com.sistemas_inventario_backend.entidades.*;
import com.sistemas_inventario_backend.repositorios.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DispositivoMovilService {

    private final DispositivoMovilRepository dispositivoMovilRepository;
    private final DispositivoTecnologico_TipoRepository tipoRepository;
    private final DispositivoTecnologico_MarcaRepository marcaRepository;
    private final DispositivoTecnologico_ModeloRepository modeloRepository;
    private final DispositivoTecnologico_SORepository soRepository;
    private final DispositivoTecnologico_VersionSORepository versionRepository;
    private final AsignacionesRepository asignacionRepository;


    // ========== REGISTRAR ==========

    @Transactional
    public DispositivoMovil registrar(DispositivoMovil dispositivo) {

        // Validar que el serial no exista
        if (dispositivoMovilRepository.existsById(dispositivo.getSerial())) {
            throw new RuntimeException("Ya existe un dispositivo con el serial: " + dispositivo.getSerial());
        }

        // Validar y cargar las entidades relacionadas
        if (dispositivo.getTipo() != null && dispositivo.getTipo().getCodigo() != null) {
            DispositivoTecnologico_Tipo tipo = tipoRepository.findById(dispositivo.getTipo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Tipo no encontrado"));
            dispositivo.setTipo(tipo);
        }

        if (dispositivo.getMarca() != null && dispositivo.getMarca().getCodigo() != null) {
            DispositivoTecnologico_Marca marca = marcaRepository.findById(dispositivo.getMarca().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Marca no encontrada"));
            dispositivo.setMarca(marca);
        }

        if (dispositivo.getModelo() != null && dispositivo.getModelo().getCodigo() != null) {
            DispositivoTecnologico_Modelo modelo = modeloRepository.findById(dispositivo.getModelo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Modelo no encontrado"));
            dispositivo.setModelo(modelo);
        }

        if (dispositivo.getSistemaOperativo() != null && dispositivo.getSistemaOperativo().getCodigo() != null) {
            DispositivoTecnologico_SO so = soRepository.findById(dispositivo.getSistemaOperativo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Sistema Operativo no encontrado"));
            dispositivo.setSistemaOperativo(so);
        }

        if (dispositivo.getVersionSO() != null && dispositivo.getVersionSO().getCodigo() != null) {
            DispositivoTecnologico_VersionSO version = versionRepository.findById(dispositivo.getVersionSO().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Versión de SO no encontrada"));
            dispositivo.setVersionSO(version);
        }

        // Por defecto activo = true
        dispositivo.setActivo(true);

        return dispositivoMovilRepository.save(dispositivo);
    }


    // ========== EDITAR ==========
    @Transactional
    public DispositivoMovil editar(String serial, DispositivoMovil dispositivoActualizado) {
        DispositivoMovil dispositivoExistente = dispositivoMovilRepository.findById(serial)
                .orElseThrow(() -> new RuntimeException("No se encontro el serial: " + serial));

        // Actualizar relaciones
        if (dispositivoActualizado.getTipo() != null && dispositivoActualizado.getTipo().getCodigo() != null) {
            DispositivoTecnologico_Tipo tipo = tipoRepository.findById(dispositivoActualizado.getTipo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Tipo no encontrado"));
            dispositivoExistente.setTipo(tipo);
        }

        if (dispositivoActualizado.getMarca() != null && dispositivoActualizado.getMarca().getCodigo() != null) {
            DispositivoTecnologico_Marca marca = marcaRepository.findById(dispositivoActualizado.getMarca().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Marca no encontrada"));
            dispositivoExistente.setMarca(marca);
        }

        if (dispositivoActualizado.getModelo() != null && dispositivoActualizado.getModelo().getCodigo() != null) {
            DispositivoTecnologico_Modelo modelo = modeloRepository.findById(dispositivoActualizado.getModelo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Modelo no encontrado"));
            dispositivoExistente.setModelo(modelo);
        }

        if (dispositivoActualizado.getSistemaOperativo() != null && dispositivoActualizado.getSistemaOperativo().getCodigo() != null) {
            DispositivoTecnologico_SO so = soRepository.findById(dispositivoActualizado.getSistemaOperativo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Sistema Operativo no encontrado"));
            dispositivoExistente.setSistemaOperativo(so);
        }

        if (dispositivoActualizado.getVersionSO() != null && dispositivoActualizado.getVersionSO().getCodigo() != null) {
            DispositivoTecnologico_VersionSO version = versionRepository.findById(dispositivoActualizado.getVersionSO().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Versión de SO no encontrada"));
            dispositivoExistente.setVersionSO(version);
        }

        // Actualizar campos simples
        dispositivoExistente.setPlaqueta(dispositivoActualizado.getPlaqueta());
        dispositivoExistente.setFacturaCompra(dispositivoActualizado.getFacturaCompra());
        dispositivoExistente.setFechaCompra(dispositivoActualizado.getFechaCompra());
        dispositivoExistente.setDescripcion(dispositivoActualizado.getDescripcion());
        dispositivoExistente.setEstado(dispositivoActualizado.getEstado());
        dispositivoExistente.setPulgadas(dispositivoActualizado.getPulgadas());
        dispositivoExistente.setRam(dispositivoActualizado.getRam());
        dispositivoExistente.setAlmacenamiento(dispositivoActualizado.getAlmacenamiento());
        dispositivoExistente.setImei1(dispositivoActualizado.getImei1());
        dispositivoExistente.setImei2(dispositivoActualizado.getImei2());
        dispositivoExistente.setProcesador(dispositivoActualizado.getProcesador());
        dispositivoExistente.setActivo(dispositivoActualizado.getActivo());

        return dispositivoMovilRepository.save(dispositivoExistente);
    }

    // ========== OBTENER POR SERIAL ==========
    public DispositivoMovil obtenerPorSerial(String serial) {
        return dispositivoMovilRepository.findById(serial)
                .orElseThrow(() -> new RuntimeException("No se encontró un dispositivo con el serial: " + serial));
    }

    // ========== LISTAR TODOS ==========
    public List<DispositivoMovil> listarTodos() {
        return dispositivoMovilRepository.findAll();
    }

    // ========== BUSCAR POR TÉRMINO ==========
    public List<DispositivoMovil> buscarPorTermino(String termino) {
        return dispositivoMovilRepository.buscarPorTermino(termino);
    }

    // ========== LISTAR CON ESTADO DE ASIGNACION ==========

    public List<DispositivoMovilRespuesta> listarConEstadoAsignacion() {
        List<DispositivoMovil> dispositivos = dispositivoMovilRepository.findAll();
        List<DispositivoMovilRespuesta> resultado = new ArrayList<>();

        for (DispositivoMovil dispositivo : dispositivos) {
            DispositivoMovilRespuesta dto = new DispositivoMovilRespuesta();

            // Mapear datos del dispositivo
            dto.setSerial(dispositivo.getSerial());
            dto.setPlaqueta(dispositivo.getPlaqueta());
            dto.setFacturaCompra(dispositivo.getFacturaCompra());
            dto.setFechaCompra(dispositivo.getFechaCompra());
            dto.setActivo(dispositivo.getActivo());
            dto.setDescripcion(dispositivo.getDescripcion());
            dto.setEstado(dispositivo.getEstado());
            dto.setPulgadas(dispositivo.getPulgadas());
            dto.setRam(dispositivo.getRam());
            dto.setAlmacenamiento(dispositivo.getAlmacenamiento());
            dto.setImei1(dispositivo.getImei1());
            dto.setImei2(dispositivo.getImei2());
            dto.setProcesador(dispositivo.getProcesador());

            // Mapear relaciones
            if (dispositivo.getTipo() != null) {
                dto.setTipoDescripcion(dispositivo.getTipo().getDescripcion());
            }
            if (dispositivo.getMarca() != null) {
                dto.setMarcaDescripcion(dispositivo.getMarca().getDescripcion());
            }
            if (dispositivo.getModelo() != null) {
                dto.setModeloDescripcion(dispositivo.getModelo().getDescripcion());
            }
            if (dispositivo.getSistemaOperativo() != null) {
                dto.setSoDescripcion(dispositivo.getSistemaOperativo().getDescripcion());
            }
            if (dispositivo.getVersionSO() != null) {
                dto.setVersionSODescripcion(dispositivo.getVersionSO().getDescripcion());
            }

            // AGREGAR INFORMACION DE ASIGNACION
            Asignaciones asignacion = asignacionRepository.findFirstBySerialActivoAndActivoTrue(dispositivo.getSerial());

            if (asignacion != null) {
                dto.setAsignado(true);
                dto.setAsignadoA(asignacion.getEmpleado().getNombre() + " " + asignacion.getEmpleado().getApellido());
                dto.setAsignacionId(asignacion.getCodigo());
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
