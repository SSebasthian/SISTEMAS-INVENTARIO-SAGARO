package com.sistemas_inventario_backend.DTOs.Respuesta;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class ImpresoraRespuesta {

    // Datos de la impresora
    private String serial;
    private String propiedad;
    private String plaqueta;
    private String tipoRecarga;
    private String facturaCompra;
    private LocalDate fechaCompra;
    private Boolean activo;
    private String descripcion;
    private String estado;

    // Datos de relaciones
    private String tipoDescripcion;
    private String marcaDescripcion;
    private String modeloDescripcion;

    // DATOS DE ASIGNACION
    private Boolean asignado;
    private String asignadoA;
    private Long asignacionId;
}
