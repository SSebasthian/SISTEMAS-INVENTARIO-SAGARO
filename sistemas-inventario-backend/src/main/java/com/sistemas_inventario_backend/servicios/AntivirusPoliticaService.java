package com.sistemas_inventario_backend.servicios;
import com.sistemas_inventario_backend.entidades.Antivirus;
import com.sistemas_inventario_backend.entidades.Antivirus_Politica;
import com.sistemas_inventario_backend.repositorios.Antivirus_PoliticaRepository;
import com.sistemas_inventario_backend.repositorios.AntivirusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AntivirusPoliticaService {

    private final Antivirus_PoliticaRepository repository;
    private final AntivirusRepository antivirusRepository;

    public List<Antivirus_Politica> listarActivos() {
        return repository.findByActivoTrue();
    }

    public List<Antivirus_Politica> listarPorAntivirus(Long antivirusCodigo) {
        return repository.findByAntivirusCodigoAndActivoTrue(antivirusCodigo);
    }

    public List<Antivirus_Politica> listarTodos() {
        return repository.findAll();
    }

    public Antivirus_Politica obtenerPorCodigo(Long codigo) {
        return repository.findById(codigo)
                .orElseThrow(() -> new RuntimeException("Política no encontrada"));
    }

    @Transactional
    public Antivirus_Politica guardar(Antivirus_Politica politica) {
        if (politica.getAntivirus() == null || politica.getAntivirus().getCodigo() == null) {
            throw new RuntimeException("Debe asignar un antivirus");
        }
        Antivirus antivirus = antivirusRepository.findById(politica.getAntivirus().getCodigo())
                .orElseThrow(() -> new RuntimeException("Antivirus no encontrado"));
        politica.setAntivirus(antivirus);
        politica.setActivo(true);
        return repository.save(politica);
    }

    @Transactional
    public Antivirus_Politica actualizar(Long codigo, Antivirus_Politica datos) {
        Antivirus_Politica existente = obtenerPorCodigo(codigo);
        existente.setPolitica(datos.getPolitica());
        existente.setPuertosBloqueados(datos.getPuertosBloqueados());
        existente.setActivo(datos.getActivo());
        // Si se cambia el antivirus, se puede manejar similar
        return repository.save(existente);
    }

    @Transactional
    public void desactivar(Long codigo) {
        Antivirus_Politica existente = obtenerPorCodigo(codigo);
        existente.setActivo(false);
        repository.save(existente);
    }
}
