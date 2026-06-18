package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.PlataformaCriticidad;
import com.sistemas_inventario_backend.repositorios.PlataformaCriticidadRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlataformaCriticidadService {

    private final PlataformaCriticidadRepository repository;

    public List<PlataformaCriticidad> listarActivos() {
        return repository.findByActivoTrue();
    }


}
