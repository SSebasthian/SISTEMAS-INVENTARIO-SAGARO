package com.sistemas_inventario_backend.DTOs.Solicitud;
import com.sistemas_inventario_backend.entidades.EquipoDeComputo_Detalle;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AsignacionesSolicitud {

    private String empleadoCedula;
    private Long areaCodigo;
    private Long catalogoCodigo;
    private Long tipoCodigo;
    private String serialActivo;
    private LocalDate fechaAsignacion;  // si es null se asigna now()
    private String observaciones;

    private EquipoDeComputo_Detalle detalle;
}
