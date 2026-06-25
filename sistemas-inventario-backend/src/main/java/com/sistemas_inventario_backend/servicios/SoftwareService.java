package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.Software;
import com.sistemas_inventario_backend.entidades.Software_Tipo;
import com.sistemas_inventario_backend.repositorios.SoftwareRepository;
import com.sistemas_inventario_backend.repositorios.Software_TipoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SoftwareService {

    private final SoftwareRepository repository;
    private final Software_TipoRepository tipoRepository;

    public List<Software> listarActivos() {
        return repository.findByActivoTrue();
    }

    public List<Software> listarTodos() {
        return repository.findAll();
    }

    public List<Software> listarPorTipo(Long tipoCodigo) {
        return repository.findByTipo_CodigoAndActivoTrue(tipoCodigo);
    }

    public Software obtenerPorCodigo(Long codigo) {
        return repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Software no encontrado"));
    }

    @Transactional
    public Software guardar(Software software) {
        if (software.getTipo() == null || software.getTipo().getCodigo() == null) {
            throw new RuntimeException("Debe asignar un tipo de software");
        }
        Software_Tipo tipo = tipoRepository.findById(software.getTipo().getCodigo())
                .orElseThrow(() -> new RuntimeException("Tipo de software no encontrado"));
        software.setTipo(tipo);
        software.setActivo(true);
        return repository.save(software);
    }

    @Transactional
    public Software actualizar(Long codigo, Software datos) {
        Software existente = obtenerPorCodigo(codigo);
        existente.setNombre(datos.getNombre());
        if (datos.getTipo() != null && datos.getTipo().getCodigo() != null) {
            Software_Tipo tipo = tipoRepository.findById(datos.getTipo().getCodigo())
                    .orElseThrow(() -> new RuntimeException("Tipo de software no encontrado"));
            existente.setTipo(tipo);
        }
        existente.setActivo(datos.getActivo());
        return repository.save(existente);
    }

    @Transactional
    public void desactivar(Long codigo) {
        Software existente = obtenerPorCodigo(codigo);
        existente.setActivo(false);
        repository.save(existente);
    }
}
