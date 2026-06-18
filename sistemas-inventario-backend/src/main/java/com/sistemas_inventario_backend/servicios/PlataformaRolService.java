package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.PlataformaRol;
import com.sistemas_inventario_backend.repositorios.PlataformaRolRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlataformaRolService {

    private final PlataformaRolRepository repository;

    public List<PlataformaRol> listarPorPlataforma(Long plataformaCodigo) {
        return repository.findByPlataformaCodigo(plataformaCodigo);
    }
}
