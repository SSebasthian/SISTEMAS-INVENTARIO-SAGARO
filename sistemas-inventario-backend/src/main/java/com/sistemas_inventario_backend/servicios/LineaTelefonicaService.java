package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.DTOs.Solicitud.LineaTelefonicaSolicitud;
import com.sistemas_inventario_backend.entidades.LineaTelefonica;
import com.sistemas_inventario_backend.entidades.Recurso;
import com.sistemas_inventario_backend.entidades.Recurso_Tipo;
import com.sistemas_inventario_backend.repositorios.LineaTelefonicaRepository;
import com.sistemas_inventario_backend.repositorios.RecursoRepository;
import com.sistemas_inventario_backend.repositorios.Recurso_TipoRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LineaTelefonicaService {

    private final LineaTelefonicaRepository repository;
    private final RecursoRepository recursoRepository;
    private final Recurso_TipoRepository recursoTipoRepository;


    public List<LineaTelefonica> listarActivos() {
        return repository.findByActivoTrue();
    }

    public List<LineaTelefonica> listarTodos() { return repository.findAll(); }

    @Transactional
    public LineaTelefonica registrar(LineaTelefonicaSolicitud dto) {
        // Validar que el número no exista
        if (repository.findByNumero(dto.getNumero()).isPresent()) {
            throw new RuntimeException("Ya existe un telefono con el numero: " + dto.getNumero());
        }

        Recurso recurso = recursoRepository.findById(dto.getRecursoCodigo())
                .orElseThrow(() -> new RuntimeException("Recurso no encontrado"));
        Recurso_Tipo recursoTipo = recursoTipoRepository.findById(dto.getRecursoTipoCodigo())
                .orElseThrow(() -> new RuntimeException("Tipo de recurso no encontrado"));

        LineaTelefonica telefono = new LineaTelefonica();
        telefono.setNumero(dto.getNumero());
        telefono.setOperador(dto.getOperador());
        telefono.setRecurso(recurso);
        telefono.setRecursoTipo(recursoTipo);
        telefono.setActivo(dto.getActivo() != null ? dto.getActivo() : true);
        return repository.save(telefono);
    }

    @Transactional
    public LineaTelefonica editar(Long codigo, LineaTelefonicaSolicitud dto) {
        LineaTelefonica telefono = repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Teléfono no encontrado"));

        // Validar que el nuevo numero no exista en otro registro
        if (!telefono.getNumero().equals(dto.getNumero()) &&
                repository.findByNumero(dto.getNumero()).isPresent()) {
            throw new RuntimeException("Ya existe un teléfono con el número: " + dto.getNumero());
        }

        telefono.setNumero(dto.getNumero());
        telefono.setOperador(dto.getOperador());
        telefono.setActivo(dto.getActivo() != null ? dto.getActivo() : telefono.getActivo());

        return repository.save(telefono);
    }



    @Transactional
    public void desactivar(Long codigo) {
        LineaTelefonica telefono = repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Telefono no encontrado"));
        telefono.setActivo(false);
        repository.save(telefono);
    }

    public LineaTelefonica buscarPorId(Long codigo) {
        return repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Telefono no encontrado"));
    }
}
