package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.EquipoDeComputo;
import com.sistemas_inventario_backend.entidades.EquipoDeComputo_Detalle;
import com.sistemas_inventario_backend.repositorios.EquipoDeComputo_DetalleRepository;
import com.sistemas_inventario_backend.repositorios.EquipoDeComputoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipoDeComputo_DetalleService {

    private final EquipoDeComputo_DetalleRepository repository;
    private final EquipoDeComputoRepository equipoRepository;
    private final PasswordEncoder passwordEncoder;

    public List<EquipoDeComputo_Detalle> listarTodos() {
        return repository.findAll();
    }

    public EquipoDeComputo_Detalle obtenerPorSerial(String serial) {
        return repository.findByEquipoSerial(serial)
                .orElseThrow(() -> new RuntimeException("Detalle no encontrado para el equipo " + serial));
    }

    public EquipoDeComputo_Detalle obtenerPorIp(Integer ip) {
        return repository.findByIp(ip)
                .orElseThrow(() -> new RuntimeException("No se encontró detalle con IP " + ip));
    }

    @Transactional
    public EquipoDeComputo_Detalle guardar(String serial, EquipoDeComputo_Detalle detalle) {

        EquipoDeComputo equipo = equipoRepository.findById(serial)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        // Verificar si ya existe un detalle para este serial (actualizar)
        EquipoDeComputo_Detalle existente = repository.findByEquipoSerialAndActivoTrue(serial).orElse(null);

        if (existente != null) {
            // Desactivar el anterior
            existente.setActivo(false);
            repository.save(existente);
        }

        //  Encriptar claves antes de guardar (solo si no son nulas/vacías)
        if (detalle.getClaveUsuario() != null && !detalle.getClaveUsuario().trim().isEmpty()) {
            detalle.setClaveUsuario(passwordEncoder.encode(detalle.getClaveUsuario()));
        }
        if (detalle.getClaveUsuarioAdministrador() != null && !detalle.getClaveUsuarioAdministrador().trim().isEmpty()) {
            detalle.setClaveUsuarioAdministrador(passwordEncoder.encode(detalle.getClaveUsuarioAdministrador()));
        }
        if (detalle.getClaveUsuarioAdicional() != null && !detalle.getClaveUsuarioAdicional().trim().isEmpty()) {
            detalle.setClaveUsuarioAdicional(passwordEncoder.encode(detalle.getClaveUsuarioAdicional()));
        }

        // Guardar el nuevo detalle como activo
        detalle.setEquipo(equipo);
        detalle.setActivo(true);
        return repository.save(detalle);
    }


    @Transactional
    public void eliminar(String serial) {
        EquipoDeComputo_Detalle detalle = obtenerPorSerial(serial);
        repository.delete(detalle);
    }
}
