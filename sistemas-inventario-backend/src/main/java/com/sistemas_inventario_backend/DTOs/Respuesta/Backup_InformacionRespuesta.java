package com.sistemas_inventario_backend.DTOs.Respuesta;
import com.sistemas_inventario_backend.entidades.Backup_Informacion;
import lombok.Data;

import java.time.LocalTime;

@Data
public class Backup_InformacionRespuesta {

    private Long codigo;
    private String nombre;
    private String frecuencia;
    private String ubicacion;
    private String ubicacionExcluida;
    private Integer dia;
    private LocalTime hora;
    private String tipo;
    private Long backupCodigo;
    private Boolean activo;
    private Boolean enUso;

    // Constructor que recibe la entidad y el flag enUso
    public Backup_InformacionRespuesta(Backup_Informacion entity, Boolean enUso) {
        this.codigo = entity.getCodigo();
        this.nombre = entity.getNombre();
        this.frecuencia = entity.getFrecuencia();
        this.ubicacion = entity.getUbicacion();
        this.ubicacionExcluida = entity.getUbicacionExcluida();
        this.dia = entity.getDia();
        this.hora = entity.getHora();
        this.tipo = entity.getTipo();
        this.backupCodigo = entity.getBackup() != null ? entity.getBackup().getCodigo() : null;
        this.activo = entity.getActivo();
        this.enUso = enUso;
    }
}
