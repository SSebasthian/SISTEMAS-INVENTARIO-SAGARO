package com.sistemas_inventario_backend.DTOs.Solicitud;
import com.sistemas_inventario_backend.entidades.EquipoDeComputo_Detalle;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class AsignacionesSolicitud {

    private String empleadoCedula;
    private Long areaCodigo;
    private Long catalogoCodigo;
    private Long tipoCodigo;
    private String serialActivo;
    private LocalDate fechaAsignacion;  // si es null se asigna now()
    private String observaciones;
    private EquipoDeComputo_Detalle detalle;
    private Integer ip;
    private List<BackupAsignacion> backups;
    private List<CorreoConBackup> correosConBackup;
    private List<SoftwareAsignacion> softwares;

    @Data
    public static class BackupAsignacion {
        private Long backupInformacionCodigo;
        private Long correoCodigo; // null si es backup general
    }

    @Data
    public static class CorreoConBackup {
        private Long correoCodigo;
        private BackupData backupData;  // datos para crear backup_informacion
    }

    @Data
    public static class BackupData {
        private Long backupCodigo;        // programa de backup
        private String nombre;
        private String frecuencia;
        private List<String> ubicaciones;
        private List<String> ubicacionesExcluidas;
        private Integer dia;
        private String hora;
        private String tipo;
    }

    @Data
    public static class SoftwareAsignacion {
        private Long softwareCodigo;
        private Long politicaCodigo; // solo para antivirus, null
    }


}
