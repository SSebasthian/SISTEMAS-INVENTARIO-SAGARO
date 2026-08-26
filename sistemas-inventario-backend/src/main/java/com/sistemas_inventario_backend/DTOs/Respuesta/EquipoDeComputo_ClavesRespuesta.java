package com.sistemas_inventario_backend.DTOs.Respuesta;

import lombok.Data;

@Data
public class EquipoDeComputo_ClavesRespuesta {

    private String claveUsuario;
    private String claveUsuarioAdministrador;
    private String claveUsuarioAdicional;
}
