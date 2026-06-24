package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.DTOs.Solicitud.CuentaCorporativaSolicitud;
import com.sistemas_inventario_backend.entidades.*;
import com.sistemas_inventario_backend.repositorios.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CuentasCorporativasService {

    private final CuentasCorporativasRepository repository;
    private final PlataformaRepository plataformaRepository;
    private final PlataformaRolRepository plataformaRolRepository;

    public List<CuentasCorporativas> listarActivos() {
        return repository.findByActivoTrue();
    }

    public List<CuentasCorporativas> listarTodos() {
        return repository.findAll();
    }


    @Transactional
    public CuentasCorporativas registrar(CuentaCorporativaSolicitud dto) {
        Plataforma plataforma = plataformaRepository.findById(dto.getPlataformaCodigo())
                .orElseThrow(() -> new RuntimeException("Plataforma no encontrada"));

        PlataformaRol rol = plataformaRolRepository.findById(dto.getPlataformaRolCodigo())
                .orElseThrow(() -> new RuntimeException("Rol no encontrado"));

        CuentasCorporativas cuenta = new CuentasCorporativas();
        cuenta.setPlataforma(plataforma);
        cuenta.setPlataformaRol(rol);
        cuenta.setUsuario(dto.getUsuario());
        cuenta.setActivo(dto.getActivo() != null ? dto.getActivo() : true);

        return repository.save(cuenta);
    }


    @Transactional
    public CuentasCorporativas editar(Long codigo, CuentaCorporativaSolicitud dto) {
        CuentasCorporativas cuenta = repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));


        // Solo actualizar usuario, rol y activo (no se cambia plataforma )
        if (dto.getUsuario() != null) {
            cuenta.setUsuario(dto.getUsuario());
        }
        if (dto.getPlataformaRolCodigo() != null) {
            PlataformaRol rol = plataformaRolRepository.findById(dto.getPlataformaRolCodigo())
                    .orElseThrow(() -> new RuntimeException("Rol no encontrado"));
            cuenta.setPlataformaRol(rol);
        }
        if (dto.getActivo() != null) {
            cuenta.setActivo(dto.getActivo());
        }

        return repository.save(cuenta);
    }


    @Transactional
    public void desactivar(Long codigo) {
        CuentasCorporativas cuenta = repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));
        cuenta.setActivo(false);
        repository.save(cuenta);
    }

    public CuentasCorporativas buscarPorId(Long codigo) {
        return repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Cuenta no encontrada"));
    }




}
