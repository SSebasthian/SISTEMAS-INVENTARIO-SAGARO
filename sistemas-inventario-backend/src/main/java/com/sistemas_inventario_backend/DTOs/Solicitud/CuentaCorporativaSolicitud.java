package com.sistemas_inventario_backend.DTOs.Solicitud;
import lombok.Data;

@Data
public class CuentaCorporativaSolicitud {

    private Long plataformaCodigo;
    private Long plataformaRolCodigo;
    private String usuario;
    private Long recursoTipoCodigo;
    private Boolean activo;
}
