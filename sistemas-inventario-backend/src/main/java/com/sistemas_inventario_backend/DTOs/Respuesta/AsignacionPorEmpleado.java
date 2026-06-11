package com.sistemas_inventario_backend.DTOs.Respuesta;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AsignacionPorEmpleado {

    private Long asignacionId;
    private Long catalogoCodigo;
    private String catalogoNombre;
    private String serialActivo;
    private String tipoDescripcion;
    private String marca;
    private String modelo;
    private LocalDate fechaAsignacion;

}
