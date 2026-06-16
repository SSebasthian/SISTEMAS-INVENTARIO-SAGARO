package com.sistemas_inventario_backend.servicios;


import com.sistemas_inventario_backend.entidades.Recurso;
import com.sistemas_inventario_backend.repositorios.RecursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecursoService {

    private final RecursoRepository repository;

    public List<Recurso> listarActivos() {
        return repository.findAll().stream()
                .filter(Recurso::getActivo)
                .collect(Collectors.toList());
    }
}
