package com.sistemas_inventario_backend.DTOs;
import lombok.Data;
import java.time.LocalDate;



@Data
public class EmpleadoSolicitud {

    private String cedula;
    private String nombre;
    private String apellido;
    private LocalDate fechaIngreso;
    private Long areaCodigo;
    private Long cargoCodigo;
    private Boolean activo;
}
