package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.EquipoDeComputo;
import com.sistemas_inventario_backend.entidades.EquipoDeComputo_Detalle;
import com.sistemas_inventario_backend.entidades.IP;
import com.sistemas_inventario_backend.repositorios.EquipoDeComputo_DetalleRepository;
import com.sistemas_inventario_backend.repositorios.EquipoDeComputoRepository;
import com.sistemas_inventario_backend.repositorios.IPRepository;
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
    private final IPRepository ipRepository;

    public List<EquipoDeComputo_Detalle> listarTodos() {
        return repository.findAll();
    }

    public EquipoDeComputo_Detalle obtenerPorSerial(String serial) {
        return repository.findByEquipoSerial(serial)
                .orElseThrow(() -> new RuntimeException("Detalle no encontrado para el equipo " + serial));
    }

    public EquipoDeComputo_Detalle obtenerPorIp(Integer ip) {
        return repository.findByIp(ip)
                .orElseThrow(() -> new RuntimeException("No se encontro detalle con IP " + ip));
    }

    @Transactional
    public EquipoDeComputo_Detalle guardar(String serial, EquipoDeComputo_Detalle detalle, Integer ipNumero) {
        // Buscar equipo
        EquipoDeComputo equipo = equipoRepository.findById(serial)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        // Buscar la IP en la tabla maestra
        IP ip = ipRepository.findById(ipNumero)
                .orElseThrow(() -> new RuntimeException("IP no encontrada"));

        // Verificar si la IP esta disponible (activo = true)
        if (ip.getActivo()) {
            throw new RuntimeException("La IP " + ipNumero + " no esta disponible");
        }

        // Desactivar detalle anterior si existe
        EquipoDeComputo_Detalle existente = repository.findByEquipoSerialAndActivoTrue(serial).orElse(null);
        if (existente != null) {
            existente.setActivo(false);
            repository.save(existente);
        }

        // Encriptar claves
        if (detalle.getClaveUsuario() != null && !detalle.getClaveUsuario().trim().isEmpty()) {
            detalle.setClaveUsuario(passwordEncoder.encode(detalle.getClaveUsuario()));
        }
        if (detalle.getClaveUsuarioAdministrador() != null && !detalle.getClaveUsuarioAdministrador().trim().isEmpty()) {
            detalle.setClaveUsuarioAdministrador(passwordEncoder.encode(detalle.getClaveUsuarioAdministrador()));
        }
        if (detalle.getClaveUsuarioAdicional() != null && !detalle.getClaveUsuarioAdicional().trim().isEmpty()) {
            detalle.setClaveUsuarioAdicional(passwordEncoder.encode(detalle.getClaveUsuarioAdicional()));
        }

        // Asignar la IP y el equipo
        detalle.setEquipo(equipo);
        detalle.setIp(ip);
        detalle.setActivo(true);

        // Marcar la IP como ocupada (activo = true) en la tabla maestra
        ip.setActivo(true);
        ipRepository.save(ip);

        return repository.save(detalle);
    }

    @Transactional
    public void eliminar(String serial) {
        EquipoDeComputo_Detalle detalle = obtenerPorSerial(serial);
        if (detalle != null && detalle.getIp() != null) {
            IP ip = detalle.getIp();
            ip.setActivo(false); // Liberar IP
            ipRepository.save(ip);
        }
        repository.delete(detalle);
    }
}
