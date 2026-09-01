package com.sistemas_inventario_backend.DTOs.Respuesta;
import lombok.Data;

@Data
public class EquipoDeComputo_SoftwareRespuesta {

    private Long tipoCodigo;
    private Long softwareCodigo;
    private String nombreSoftware;
    private String rutaImagen;
    private String tipoSoftware;
    private Long politicaCodigo;

}
