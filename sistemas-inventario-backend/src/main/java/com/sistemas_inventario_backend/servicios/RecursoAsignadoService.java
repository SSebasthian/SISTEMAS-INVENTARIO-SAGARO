package com.sistemas_inventario_backend.servicios;

import com.sistemas_inventario_backend.entidades.*;
import com.sistemas_inventario_backend.repositorios.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RecursoAsignadoService {

    private final RecursoAsignadoRepository asignacionRepo;
    private final EmpleadoRepository empleadoRepo;
    private final RecursoRepository recursoRepo;
    private final Recurso_TipoRepository recursoTipoRepo;
    private final LineaTelefonicaRepository telefonoRepo;
    private final CorreoCorporativoRepository correoRepo;
    private final CuentasCorporativasRepository cuentaRepo;

    /**
     * Asigna un recurso corporativo a un empleado.
     *
     * @param cedula        Cedula del empleado
     * @param nombreRecurso Nombre del tipo de recurso ("TELEFONO", "CORREO", "CUENTA")
     * @param recursoCodigoAsignado     Codigo del recurso específico (Long convertido a String)
     * @param fecha         Fecha de asignacion (si es null, se usa hoy)
     * @param observaciones Observaciones de la asignación
     * @return RecursoAsignado guardado
     */
    @Transactional
    public RecursoAsignado asignar(String cedula, String nombreRecurso, Long recursoCodigoAsignado,
                                   Long recursoTipoId, LocalDate fecha, String observaciones) {
        // 1. Validar empleado
        Empleado empleado = empleadoRepo.findById(cedula)
                .orElseThrow(() -> new RuntimeException("Empleado no encontrado"));

        // 2. Validar tipo de recurso
        Recurso recurso = recursoRepo.findByNombre(nombreRecurso)
                .orElseThrow(() -> new RuntimeException("Tipo de recurso no valido"));

        Recurso_Tipo recursoTipo = recursoTipoRepo.findById(recursoTipoId)
                .orElseThrow(() -> new RuntimeException("Subtipo de recurso no valido"));

        if (!recursoTipo.getRecurso().getCodigo().equals(recurso.getCodigo())) {
            throw new RuntimeException(
                    "El subtipo no pertenece al recurso seleccionado");
        }

        // 3. Validar existencia del recurso especifico segun su tipo
        validarExistenciaRecurso(nombreRecurso, recursoCodigoAsignado);

        // 4. Verificar que el recurso no este ya asignado activamente
        String recursoCodigoAsignadoStr = recursoCodigoAsignado.toString();
        if (!asignacionRepo.findByRecursoAndRecursoCodigoAsignadoAndActivoTrue(recurso, recursoCodigoAsignadoStr).isEmpty()) {
            throw new RuntimeException("El recurso ya esta asignado a otro empleado");
        }

        // 5. Crear la asignacion
        RecursoAsignado asignacion = new RecursoAsignado();
        asignacion.setEmpleado(empleado);
        asignacion.setRecurso(recurso);
        asignacion.setRecurso_Tipo(recursoTipo);
        asignacion.setRecursoCodigoAsignado(recursoCodigoAsignadoStr);
        asignacion.setFechaAsignacion(fecha != null ? fecha : LocalDate.now());
        asignacion.setObservaciones(observaciones);
        asignacion.setActivo(true);

        return asignacionRepo.save(asignacion);
    }

    private void validarExistenciaRecurso(String nombreRecurso, Long recursoCodigoAsignado) {
        switch (nombreRecurso) {
            case "TELEFONO":
                if (!telefonoRepo.existsById(recursoCodigoAsignado))
                    throw new RuntimeException("El telefono con codigo " + recursoCodigoAsignado + " no existe");
                break;
            case "CORREO":
                if (!correoRepo.existsById(recursoCodigoAsignado))
                    throw new RuntimeException("El correo con codigo " + recursoCodigoAsignado + " no existe");
                break;
            case "CUENTA":
                if (!cuentaRepo.existsById(recursoCodigoAsignado))
                    throw new RuntimeException("La cuenta con codigo " + recursoCodigoAsignado + " no existe");
                break;
            default:
                throw new RuntimeException("Tipo de recurso desconocido: " + nombreRecurso);
        }
    }

    /**
     * Marca una asignacion como devuelta.
     *
     * @param asignacionId   ID de la asignacion
     * @param fechaDevolucion Fecha de devolucion (si null, hoy)
     * @param observaciones   Observaciones de la devolucion
     */
    @Transactional
    public void devolver(Long asignacionId, LocalDate fechaDevolucion, String observaciones) {
        RecursoAsignado asignacion = asignacionRepo.findById(asignacionId)
                .orElseThrow(() -> new RuntimeException("Asignacion no encontrada"));
        asignacion.setActivo(false);
        asignacion.setFechaDevolucion(fechaDevolucion != null ? fechaDevolucion : LocalDate.now());
        if (observaciones != null) {
            asignacion.setObservaciones(observaciones);
        }
        asignacionRepo.save(asignacion);
    }

    /**
     * Lista todas las asignaciones activas de un empleado.
     *
     * @param cedula Cedula del empleado
     * @return Lista de asignaciones activas
     */
    public List<RecursoAsignado> listarActivasPorEmpleado(String cedula) {
        return asignacionRepo.findByEmpleadoCedulaAndActivoTrue(cedula);
    }
}
