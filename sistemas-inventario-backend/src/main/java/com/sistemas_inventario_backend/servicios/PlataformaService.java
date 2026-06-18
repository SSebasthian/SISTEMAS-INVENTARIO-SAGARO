package com.sistemas_inventario_backend.servicios;


import com.sistemas_inventario_backend.entidades.Plataforma;
import com.sistemas_inventario_backend.entidades.Recurso;
import com.sistemas_inventario_backend.entidades.Recurso_Tipo;
import com.sistemas_inventario_backend.repositorios.PlataformaRepository;
import com.sistemas_inventario_backend.repositorios.RecursoRepository;
import com.sistemas_inventario_backend.repositorios.Recurso_TipoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlataformaService {

    private final PlataformaRepository repository;
    private final RecursoRepository recursoRepository;
    private final Recurso_TipoRepository tipoRepository;

    public List<Plataforma> listarActivos() {
        return repository.findByActivoTrue();
    }

    public List<Plataforma> listarPorRecursoTipo(Long recursoTipoCodigo) {
        return repository.findByRecursoTipoCodigoAndActivoTrue(recursoTipoCodigo);
    }

    @Transactional
    public Plataforma registrar(Plataforma plataforma) {
        if (repository.findByDescripcion(plataforma.getDescripcion()).isPresent()) {
            throw new RuntimeException("Ya existe una plataforma con esa descripción");
        }

        // Asignar el recurso PLATAFORMAS (código 3)
        Recurso recurso = recursoRepository.findById(3L)
                .orElseThrow(() -> new RuntimeException("Recurso PLATAFORMAS no encontrado"));

        // Asignar el recursoTipo (por ejemplo, PROPIO = código 6)
        // Puedes cambiarlo según la lógica de negocio
        Recurso_Tipo recursoTipo = tipoRepository.findById(6L)
                .orElseThrow(() -> new RuntimeException("RecursoTipo PROPIO no encontrado"));

        plataforma.setRecurso(recurso);
        plataforma.setRecursoTipo(recursoTipo);
        plataforma.setActivo(true);

        return repository.save(plataforma);
    }


}
