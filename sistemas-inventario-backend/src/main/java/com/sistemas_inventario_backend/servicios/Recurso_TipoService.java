package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.Recurso_Tipo;
import com.sistemas_inventario_backend.repositorios.Recurso_TipoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class Recurso_TipoService {

    private final Recurso_TipoRepository repository;

    public List<Recurso_Tipo> listarActivos() {
        return repository.findByActivoTrue();
    }

    public List<Recurso_Tipo> listarPorRecurso(Long recursoCodigo) {
        return repository.findByRecursoCodigoAndActivoTrue(recursoCodigo);
    }
}
