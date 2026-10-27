package com.sistemas_inventario_backend.DTOs.Respuesta;

import lombok.Data;
import java.time.LocalDate;

@Data
public class RecursoAsignadoRespuesta {

    private Long numero;
    private String empleadoCedula;
    private Long recursoCodigo;
    private String recursoNombre;         // "CORREO", "TELEFONO", "CUENTA"
    private Long recursoTipoCodigo;
    private String recursoCodigoAsignado;
    private String descripcionRecurso;
    private LocalDate fechaAsignacion;
    private LocalDate fechaDevolucion;
    private String observaciones;
    private Boolean activo;

}
