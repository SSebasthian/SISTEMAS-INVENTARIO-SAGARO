package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.IP;
import com.sistemas_inventario_backend.repositorios.IPRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IPService {

    private final IPRepository ipRepository;

    public List<IP> obtenerIpsDisponibles() {
        return ipRepository.findByActivoTrue();
    }

    public List<IP> obtenerTodas() {
        return ipRepository.findAll();
    }

    @Transactional
    public void ocuparIp(Integer ip, Long catalogoCodigo, Long tipoCodigo) {
        ipRepository.ocuparIp(ip, catalogoCodigo, tipoCodigo);
    }

    @Transactional
    public void liberarIp(Integer ip) {
        ipRepository.liberarIp(ip);
    }

}
