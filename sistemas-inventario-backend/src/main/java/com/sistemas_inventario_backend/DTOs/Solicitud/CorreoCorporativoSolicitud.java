package com.sistemas_inventario_backend.DTOs.Solicitud;

import lombok.Data;

@Data
public class CorreoCorporativoSolicitud {

    private String direccion;
    private String clave;
    private Long recursoCodigo;
    private Long recursoTipoCodigo;
    private Boolean activo;
}
