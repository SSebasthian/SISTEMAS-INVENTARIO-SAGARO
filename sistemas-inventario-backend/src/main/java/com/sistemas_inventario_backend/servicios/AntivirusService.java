package com.sistemas_inventario_backend.servicios;
import com.sistemas_inventario_backend.entidades.Antivirus;
import com.sistemas_inventario_backend.repositorios.AntivirusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AntivirusService {

    private final AntivirusRepository repository;

    public List<Antivirus> listarActivos() {
        return repository.findByActivoTrue();
    }

    public List<Antivirus> listarTodos() {
        return repository.findAll();
    }

    public Antivirus obtenerPorCodigo(Long codigo) {
        return repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Antivirus no encontrado"));
    }

    @Transactional
    public Antivirus guardar(Antivirus antivirus) {
        antivirus.setActivo(true);
        return repository.save(antivirus);
    }

    @Transactional
    public Antivirus actualizar(Long codigo, Antivirus datos) {
        Antivirus existente = obtenerPorCodigo(codigo);
        existente.setNombre(datos.getNombre());
        existente.setActivo(datos.getActivo());
        return repository.save(existente);
    }

    @Transactional
    public void desactivar(Long codigo) {
        Antivirus existente = obtenerPorCodigo(codigo);
        existente.setActivo(false);
        repository.save(existente);
    }
}
