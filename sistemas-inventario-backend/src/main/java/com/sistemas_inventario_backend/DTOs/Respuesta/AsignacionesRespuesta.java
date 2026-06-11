package com.sistemas_inventario_backend.DTOs.Respuesta;

import lombok.Data;
import java.time.LocalDate;

@Data
public class AsignacionesRespuesta {

    private Long consecutivo;
    private String empleadoCedula;
    private String empleadoNombre;
    private String empleadoApellido;
    private Long areaCodigo;
    private String areaDescripcion;
    private Long  catalogoCodigo;
    private String catalogoNombre;
    private Long  tipoCodigo;
    private String tipoDescripcion;
    private String serialActivo;
    private LocalDate fechaAsignacion;
    private LocalDate fechaDevolucion;
    private String observaciones;
    private Boolean activo;
}
