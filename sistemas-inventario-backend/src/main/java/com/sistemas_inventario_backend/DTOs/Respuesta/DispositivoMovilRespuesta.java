package com.sistemas_inventario_backend.DTOs.Respuesta;
import lombok.Data;
import java.time.LocalDate;

@Data
public class DispositivoMovilRespuesta {

    // Datos del dispositivo
    private String serial;
    private String plaqueta;
    private String facturaCompra;
    private LocalDate fechaCompra;
    private Boolean activo;
    private String descripcion;
    private String estado;

    private String pulgadas;
    private String ram;
    private String almacenamiento;
    private String imei1;
    private String imei2;
    private String procesador;

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
