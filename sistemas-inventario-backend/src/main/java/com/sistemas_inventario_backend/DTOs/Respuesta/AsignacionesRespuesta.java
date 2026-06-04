package com.sistemas_inventario_backend.DTOs.Respuesta;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AsignacionesRespuesta {

    private Long codigo;
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
    private LocalDateTime fechaAsignacion;
    private LocalDateTime fechaDevolucion;
    private String observaciones;
    private Boolean activo;
}
