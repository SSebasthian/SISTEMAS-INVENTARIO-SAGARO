package com.sistemas_inventario_backend.DTOs.Respuesta;
import lombok.Data;
import java.time.LocalDate;

@Data
public class EquipoDeComputoRespuesta {

    // Datos del equipo
    private String serial;
    private String plaqueta;
    private String facturaCompra;
    private LocalDate fechaCompra;
    private Boolean activo;
    private String descripcion;
    private String estado;

    private String ram;
    private String tipoRam;
    private String procesador;
    private String disco;
    private String tipoDisco;
    private Integer bits;

    // Datos de relaciones
    private String tipoDescripcion;
    private String marcaDescripcion;
    private String modeloDescripcion;
    private String soDescripcion;
    private String versionSODescripcion;

    // DATOS DE ASIGNACION
    private Boolean asignado;
    private String asignadoA;
    private Long asignacionId;
}