package com.sistemas_inventario_backend.DTOs.Respuesta;

import lombok.Data;

@Data
public class EquipoDeComputo_DetalleRespuesta {
    private Long numero;
    private Boolean activo;
    private String nombreEquipo;
    private String nombreUsuario;
    private String claveUsuario;
    private String nombreUsuarioAdministrador;
    private String claveUsuarioAdministrador;
    private String nombreUsuarioAdicional;
    private String claveUsuarioAdicional;
    private Integer ip;
    private Long asignacionConsecutivo;
    private String serial;
}
