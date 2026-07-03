package com.sistemas_inventario_backend.servicios;


import com.sistemas_inventario_backend.entidades.*;
import com.sistemas_inventario_backend.repositorios.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class EquipoDeComputo_SoftwareService {

    private final EquipoDeComputo_SoftwareRepository repository;
    private final EquipoDeComputoRepository equipoRepository;
    private final SoftwareRepository softwareRepository;
    private final EquipoDeComputo_AsignacionRepository asignacionRepository;
    private final Antivirus_PoliticaRepository politicaRepository;


    public List<EquipoDeComputo_Software> listarPorSerial(String serial) {
        return repository.findByEquipoSerialAndActivoTrue(serial);
    }

    public List<EquipoDeComputo_Software> listarPorAsignacion(Long asignacionConsecutivo) {
        return repository.findByAsignacionConsecutivo(asignacionConsecutivo);
    }

    public EquipoDeComputo_Software obtenerPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro no encontrado"));
    }


    @Transactional
    public EquipoDeComputo_Software asignarSoftware(
            String serial,
            Long softwareCodigo,
            Long asignacionConsecutivo,
            Long politicaCodigo) {

        // 1. Validar existencia de equipo, software y asignacion
        EquipoDeComputo equipo = equipoRepository.findById(serial)
                .orElseThrow(() -> new RuntimeException("Equipo no encontrado"));
        Software software = softwareRepository.findById(softwareCodigo)
                .orElseThrow(() -> new RuntimeException("Software no encontrado"));
        EquipoDeComputo_Asignacion asignacion = asignacionRepository.findById(asignacionConsecutivo)
                .orElseThrow(() -> new RuntimeException("Asignacion no encontrada"));

        // 2. Obtener TODOS los registros de este equipo para este software (activos e inactivos)
        List<EquipoDeComputo_Software> todos = repository.findByEquipoSerial(serial)
                .stream()
                .filter(es -> es.getSoftware().getCodigo().equals(softwareCodigo))
                .collect(Collectors.toList());

        // 3. Buscar un registro inactivo (de asignaciones anteriores)
        Optional<EquipoDeComputo_Software> inactivoOpt = todos.stream()
                .filter(es -> !es.getActivo())
                .findFirst();

        if (inactivoOpt.isPresent()) {
            // Reactivar el registro existente
            EquipoDeComputo_Software existente = inactivoOpt.get();
            existente.setActivo(true);
            existente.setAsignacion(asignacion);  // Actualizar la asignacion

            // Actualizar politica si se proporciona
            if (politicaCodigo != null) {
                Antivirus_Politica politica = politicaRepository.findById(politicaCodigo)
                        .orElseThrow(() -> new RuntimeException("Politica no encontrada"));
                existente.setPolitica(politica);
            } else {
                // Si no se envia politica, mantener la que ya tenia o poner null
                // (Opcional: si quieres forzar null cuando no hay politica, hazlo)
                // existente.setPolitica(null);
            }
            return repository.save(existente);
        }

        // 4. Si no hay inactivo, verificar si hay alguno activo (por seguridad)
        Optional<EquipoDeComputo_Software> activoOpt = todos.stream()
                .filter(EquipoDeComputo_Software::getActivo)
                .findFirst();

        if (activoOpt.isPresent()) {
            // Si el software ya esta activo en este equipo, deberia estar en la misma asignacion
            // (esto no deberia pasar si el equipo no esta asignado actualmente)
            throw new RuntimeException("El software ya esta asignado activamente a este equipo en otra asignacion");
        }

        // 5. Si no existe registro previo (ni activo ni inactivo), crear uno nuevo
        EquipoDeComputo_Software nuevo = new EquipoDeComputo_Software();
        nuevo.setEquipo(equipo);
        nuevo.setSoftware(software);
        nuevo.setAsignacion(asignacion);
        nuevo.setActivo(true);

        if (politicaCodigo != null) {
            Antivirus_Politica politica = politicaRepository.findById(politicaCodigo)
                    .orElseThrow(() -> new RuntimeException("Politica no encontrada"));
            nuevo.setPolitica(politica);
        }

        return repository.save(nuevo);
    }



    @Transactional
    public void desactivarSoftwarePorAsignacion(Long asignacionConsecutivo) {
        List<EquipoDeComputo_Software> softwares = repository
                .findByAsignacionConsecutivo(asignacionConsecutivo);
        for (EquipoDeComputo_Software es : softwares) {
            es.setActivo(false);
            repository.save(es);
        }
    }


    @Transactional
    public void desactivar(Long id) {
        EquipoDeComputo_Software es = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro no encontrado"));
        es.setActivo(false);
        repository.save(es);
    }
}
