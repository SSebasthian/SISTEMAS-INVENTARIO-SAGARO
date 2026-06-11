package com.sistemas_inventario_backend.DTOs.Solicitud;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class AsignacionesSolicitud {

    private String empleadoCedula;
    private Long areaCodigo;
    private Long catalogoCodigo;
    private Long tipoCodigo;
    private String serialActivo;
    private LocalDate fechaAsignacion;  // si es null se asigna now()
    private String observaciones;
}
