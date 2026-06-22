package com.sistemas_inventario_backend.servicios;
import com.sistemas_inventario_backend.entidades.Backup;
import com.sistemas_inventario_backend.repositorios.BackupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BackupService {

    private final BackupRepository repository;

    public List<Backup> listarActivos() {
        return repository.findByActivoTrue();
    }

    public List<Backup> listarTodos() {
        return repository.findAll();
    }

    public Backup obtenerPorCodigo(Long codigo) {
        return repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Backup no encontrado"));
    }

    @Transactional
    public Backup guardar(Backup backup) {
        backup.setActivo(true);
        return repository.save(backup);
    }

    @Transactional
    public Backup actualizar(Long codigo, Backup datos) {
        Backup existente = obtenerPorCodigo(codigo);
        existente.setNombre(datos.getNombre());
        existente.setActivo(datos.getActivo());
        return repository.save(existente);
    }

    @Transactional
    public void desactivar(Long codigo) {
        Backup existente = obtenerPorCodigo(codigo);
        existente.setActivo(false);
        repository.save(existente);
    }
}
