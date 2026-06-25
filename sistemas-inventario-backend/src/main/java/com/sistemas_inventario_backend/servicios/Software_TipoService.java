package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.Software_Tipo;
import com.sistemas_inventario_backend.repositorios.Software_TipoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class Software_TipoService {

    private final Software_TipoRepository repository;

    public List<Software_Tipo> listarActivos() {
        return repository.findByActivoTrue();
    }

    public List<Software_Tipo> listarTodos() {
        return repository.findAll();
    }

    public Software_Tipo obtenerPorCodigo(Long codigo) {
        return repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Tipo de software no encontrado"));
    }

    @Transactional
    public Software_Tipo guardar(Software_Tipo tipo) {
        tipo.setActivo(true);
        return repository.save(tipo);
    }

    @Transactional
    public Software_Tipo actualizar(Long codigo, Software_Tipo datos) {
        Software_Tipo existente = obtenerPorCodigo(codigo);
        existente.setDescripcion(datos.getDescripcion());
        existente.setActivo(datos.getActivo());
        return repository.save(existente);
    }

    @Transactional
    public void desactivar(Long codigo) {
        Software_Tipo existente = obtenerPorCodigo(codigo);
        existente.setActivo(false);
        repository.save(existente);
    }
}
