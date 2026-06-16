package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.CorreosCorporativos;
import com.sistemas_inventario_backend.repositorios.CorreoCorporativoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CorreoCorporativoService {

    private final CorreoCorporativoRepository repository;
    private final PasswordEncoder passwordEncoder;

    public List<CorreosCorporativos> listarActivos() {
        return repository.findByActivoTrue();
    }

    @Transactional
    public CorreosCorporativos registrar(CorreosCorporativos correo) {
        if (repository.findByDireccion(correo.getDireccion()).isPresent()) {
            throw new RuntimeException("Ya existe un correo con la direccion: " + correo.getDireccion());
        }
        // Encriptar la clave antes de guardar
        if (correo.getClave() != null && !correo.getClave().isEmpty()) {
            correo.setClave(passwordEncoder.encode(correo.getClave()));
        }
        correo.setActivo(true);
        return repository.save(correo);
    }


    @Transactional
    public CorreosCorporativos editar(Long codigo, CorreosCorporativos datos) {
        CorreosCorporativos existente = repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Correo no encontrado"));

        existente.setDireccion(datos.getDireccion());
        existente.setActivo(datos.getActivo());

        // Solo actualizar clave si viene un valor no vacío
        if (datos.getClave() != null && !datos.getClave().isEmpty()) {
            existente.setClave(passwordEncoder.encode(datos.getClave()));
        }

        return repository.save(existente);
    }


    @Transactional
    public void desactivar(Long codigo) {
        CorreosCorporativos correo = repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Correo no encontrado"));
        correo.setActivo(false);
        repository.save(correo);
    }

    public CorreosCorporativos buscarPorId(Long codigo) {
        return repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Correo no encontrado"));
    }

    public List<CorreosCorporativos> buscarPorTermino(String termino) {
        return repository.findByDireccionContainingIgnoreCase(termino);
    }
}
