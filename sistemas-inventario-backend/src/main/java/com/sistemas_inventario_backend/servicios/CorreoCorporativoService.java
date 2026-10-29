package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.DTOs.Solicitud.CorreoCorporativoSolicitud;
import com.sistemas_inventario_backend.entidades.CorreosCorporativos;
import com.sistemas_inventario_backend.entidades.Recurso;
import com.sistemas_inventario_backend.entidades.Recurso_Tipo;
import com.sistemas_inventario_backend.repositorios.CorreoCorporativoRepository;
import com.sistemas_inventario_backend.repositorios.RecursoRepository;
import com.sistemas_inventario_backend.repositorios.Recurso_TipoRepository;
import lombok.RequiredArgsConstructor;
import com.sistemas_inventario_backend.seguridad.SeguridadClave;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CorreoCorporativoService {

    private final CorreoCorporativoRepository repository;
    private final RecursoRepository recursoRepository;
    private final Recurso_TipoRepository recursoTipoRepository;


    public List<CorreosCorporativos> listarActivos() {
        return repository.findByActivoTrue();
    }

    public List<CorreosCorporativos> listarTodos() {
        return repository.findAll();
    }


    @Transactional
    public CorreosCorporativos registrar(CorreoCorporativoSolicitud dto) {
        if (repository.findByDireccion(dto.getDireccion()).isPresent()) {
            throw new RuntimeException("Ya existe un correo con la direccion: " + dto.getDireccion());
        }

        Recurso recurso = recursoRepository.findById(dto.getRecursoCodigo())
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado"));
        Recurso_Tipo recursoTipo = recursoTipoRepository.findById(dto.getRecursoTipoCodigo())
                .orElseThrow(() -> new RuntimeException("Tipo de recurso no encontrado"));

        CorreosCorporativos correo = new CorreosCorporativos();
        correo.setDireccion(dto.getDireccion());

        if (dto.getClave() != null && !dto.getClave().isEmpty()) {
            try {
                correo.setClave(SeguridadClave.encrypt(dto.getClave()));
            } catch (Exception e) {
                throw new RuntimeException("Error al encriptar la clave: " + e.getMessage());
            }
        }


        correo.setRecurso(recurso);
        correo.setRecursoTipo(recursoTipo);
        correo.setActivo(dto.getActivo() != null ? dto.getActivo() : true);

        return repository.save(correo);
    }


    @Transactional
    public CorreosCorporativos editar(Long codigo, CorreosCorporativos datos) {
        CorreosCorporativos existente = repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Correo no encontrado"));

        existente.setDireccion(datos.getDireccion());
        existente.setActivo(datos.getActivo());

        if (datos.getClave() != null && !datos.getClave().isEmpty()) {
            try {
                existente.setClave(SeguridadClave.encrypt(datos.getClave()));
            } catch (Exception e) {
                throw new RuntimeException("Error al encriptar la clave: " + e.getMessage());
            }
        }
        return repository.save(existente);
    }


    @Transactional
    public void desactivar(Long codigo) {
        CorreosCorporativos correo = repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Correo no encontrado"));
        correo.setActivo(false);
        repository.save(correo);
    }

    public CorreosCorporativos buscarPorId(Long codigo) {
        return repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Correo no encontrado"));
    }

    public List<CorreosCorporativos> buscarPorTermino(String termino) {
        return repository.findByDireccionContainingIgnoreCase(termino);
    }

    public CorreosCorporativos obtenerPorCodigo(Long codigo) {
        return repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Correo no encontrado con codigo: " + codigo));
    }

    public List<CorreosCorporativos> listarCorreosDisponibles() {
        return repository.findCorreosDisponibles();  // solo los disponibles reales
    }

    public List<CorreosCorporativos> listarCorreosDisponiblesPorRecurso(Long recursoCodigo) {
        return repository.findCorreosDisponiblesByRecurso(recursoCodigo);
    }

}
