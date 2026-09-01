package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.DTOs.Respuesta.EquipoDeComputo_ClavesRespuesta;
import com.sistemas_inventario_backend.DTOs.Respuesta.EquipoDeComputo_DetalleRespuesta;
import com.sistemas_inventario_backend.entidades.EquipoDeComputo;
import com.sistemas_inventario_backend.entidades.EquipoDeComputo_Detalle;
import com.sistemas_inventario_backend.entidades.IP;
import com.sistemas_inventario_backend.repositorios.EquipoDeComputo_DetalleRepository;
import com.sistemas_inventario_backend.repositorios.EquipoDeComputoRepository;
import com.sistemas_inventario_backend.repositorios.IPRepository;
import lombok.RequiredArgsConstructor;
import com.sistemas_inventario_backend.seguridad.SeguridadClave;
//import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EquipoDeComputo_DetalleService {

    private final EquipoDeComputo_DetalleRepository repository;
    private final EquipoDeComputoRepository equipoRepository;
    //private final PasswordEncoder passwordEncoder;
    private final IPRepository ipRepository;

    public List<EquipoDeComputo_Detalle> listarTodos() {
        return repository.findAll();
    }

    public EquipoDeComputo_Detalle obtenerPorSerial(String serial) {
        List<EquipoDeComputo_Detalle> detalles = repository.findByEquipoSerial(serial);
        if (detalles.isEmpty()) {
            throw new RuntimeException("Detalle no encontrado para el equipo " + serial);
        }
        // Buscar activo, si no hay, devolver el más reciente (el de mayor numero)
        return detalles.stream()
                .filter(EquipoDeComputo_Detalle::getActivo)
                .findFirst()
                .orElse(detalles.get(detalles.size() - 1));
    }

    public EquipoDeComputo_Detalle obtenerPorIp(Integer ip) {
        return repository.findByIp(ip)
                .orElseThrow(() -> new RuntimeException("No se encontro detalle con IP " + ip));
    }


    @Transactional
    public EquipoDeComputo_Detalle guardar(String serial, EquipoDeComputo_Detalle detalle, Integer ipNumero, Long tipoCodigo) {
        EquipoDeComputo equipo = equipoRepository.findById(serial)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));

        // Desactivar cualquier detalle activo existente
        repository.findByEquipoSerialAndActivoTrue(serial).ifPresent(activo -> {
            activo.setActivo(false);
            // Liberar su IP si tiene
            if (activo.getIp() != null) {
                IP ipAnt = activo.getIp();
                ipAnt.setActivo(false);
                ipAnt.setCatalogoCodigo(1L);
                ipAnt.setDispositivoTipoCodigo(null);
                ipRepository.save(ipAnt);
                activo.setIp(null);
            }
            repository.save(activo);
        });

        // Crear nuevo detalle
        detalle.setEquipo(equipo);
        detalle.setActivo(true);

        // Asignar IP si se proporciona
        if (ipNumero != null) {
            IP ip = ipRepository.findById(ipNumero)
                    .orElseThrow(() -> new RuntimeException("IP no encontrada"));
            if (ip.getActivo()) {
                throw new RuntimeException("La IP " + ipNumero + " no está disponible");
            }
            detalle.setIp(ip);
            ip.setActivo(true);
            ip.setCatalogoCodigo(1L);
            ip.setDispositivoTipoCodigo(tipoCodigo);
            ipRepository.save(ip);
        } else {
            detalle.setIp(null);
        }

        // Encriptar claves
        try {
            if (detalle.getClaveUsuario() != null && !detalle.getClaveUsuario().trim().isEmpty()) {
                detalle.setClaveUsuario(SeguridadClave.encrypt(detalle.getClaveUsuario()));
            }
            if (detalle.getClaveUsuarioAdministrador() != null && !detalle.getClaveUsuarioAdministrador().trim().isEmpty()) {
                detalle.setClaveUsuarioAdministrador(SeguridadClave.encrypt(detalle.getClaveUsuarioAdministrador()));
            }
            if (detalle.getClaveUsuarioAdicional() != null && !detalle.getClaveUsuarioAdicional().trim().isEmpty()) {
                detalle.setClaveUsuarioAdicional(SeguridadClave.encrypt(detalle.getClaveUsuarioAdicional()));
            }
        } catch (Exception e) {
            throw new RuntimeException("Error al cifrar las claves: " + e.getMessage());
        }

        return repository.save(detalle);
    }


    // Metodo para obtener las claves descifradas
    public EquipoDeComputo_ClavesRespuesta obtenerClavesDescifradas(String serial) {
        EquipoDeComputo_Detalle detalle = repository.findByEquipoSerialAndActivoTrue(serial)
                .orElseThrow(() -> new RuntimeException("No se encontro detalle activo para el equipo " + serial));

        EquipoDeComputo_ClavesRespuesta dto = new EquipoDeComputo_ClavesRespuesta();
        try {
            dto.setClaveUsuario(SeguridadClave.decrypt(detalle.getClaveUsuario()));
            dto.setClaveUsuarioAdministrador(SeguridadClave.decrypt(detalle.getClaveUsuarioAdministrador()));
            dto.setClaveUsuarioAdicional(SeguridadClave.decrypt(detalle.getClaveUsuarioAdicional()));
        } catch (Exception e) {
            throw new RuntimeException("Error al descifrar las claves: " + e.getMessage());
        }
        return dto;
    }


    @Transactional
    public void eliminar(String serial) {
        EquipoDeComputo_Detalle detalle = obtenerPorSerial(serial);
        if (detalle != null && detalle.getIp() != null) {
            IP ip = detalle.getIp();
            // Liberar IP (activo = false) y limpiar tipo
            ip.setActivo(false);
            ip.setCatalogoCodigo(1L);
            ip.setDispositivoTipoCodigo(null);
            ipRepository.save(ip);
        }
        repository.delete(detalle);
    }


    // Metodo para obtener el detalle activo por serial y convertirlo a DTO
    public EquipoDeComputo_DetalleRespuesta obtenerDetalleActivoPorSerialDTO(String serial) {
        EquipoDeComputo_Detalle detalle = repository.findByEquipoSerialAndActivoTrue(serial)
                .orElseThrow(() -> new RuntimeException("No se encontro detalle activo para el equipo " + serial));
        return convertirADTO(detalle);
    }


    // Metodo privado para convertir de entidad a DTO
    private EquipoDeComputo_DetalleRespuesta convertirADTO(EquipoDeComputo_Detalle detalle) {
        EquipoDeComputo_DetalleRespuesta dto = new EquipoDeComputo_DetalleRespuesta();
        dto.setNumero(detalle.getNumero());
        dto.setActivo(detalle.getActivo());
        dto.setNombreEquipo(detalle.getNombreEquipo());
        dto.setNombreUsuario(detalle.getNombreUsuario());
        dto.setClaveUsuario(detalle.getClaveUsuario());
        dto.setNombreUsuarioAdministrador(detalle.getNombreUsuarioAdministrador());
        dto.setClaveUsuarioAdministrador(detalle.getClaveUsuarioAdministrador());
        dto.setNombreUsuarioAdicional(detalle.getNombreUsuarioAdicional());
        dto.setClaveUsuarioAdicional(detalle.getClaveUsuarioAdicional());

        // Obtener IP (puede ser null si no tiene asignada)
        if (detalle.getIp() != null) {
            dto.setIp(detalle.getIp().getIp());
        }

        // Obtener consecutivo de asignacion
        if (detalle.getAsignacion() != null) {
            dto.setAsignacionConsecutivo(detalle.getAsignacion().getConsecutivo());
        }

        // Obtener serial del equipo
        if (detalle.getEquipo() != null) {
            dto.setSerial(detalle.getEquipo().getSerial());
        }

        return dto;
    }
}
