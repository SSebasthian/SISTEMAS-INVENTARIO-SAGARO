package com.sistemas_inventario_backend.DTOs.Solicitud;
import lombok.Data;

@Data
public class LineaTelefonicaSolicitud {

    private String numero;
    private String operador;
    private Long recursoCodigo;
    private Long recursoTipoCodigo;
    private Boolean activo;
}
