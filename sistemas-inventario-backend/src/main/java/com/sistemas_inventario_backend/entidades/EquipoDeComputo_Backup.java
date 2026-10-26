package com.sistemas_inventario_backend.entidades;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
        name = "equipodecomputo_backup",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "serial",
                                "backup_informacion_codigo",
                                "asignacion_consecutivo",
                                "correo_codigo"
                        }
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
public class EquipoDeComputo_Backup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long numero;

    @Column(name = "serial", nullable = false, length = 50)
    private String serial;

    @ManyToOne
    @JoinColumn(name = "backup_informacion_codigo", nullable = false)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Backup_Informacion backupInformacion;

    @ManyToOne
    @JoinColumn(name = "asignacion_consecutivo", nullable = false)
    @JsonIgnore
    private EquipoDeComputo_Asignacion asignacion;

    @ManyToOne
    @JoinColumn(name = "correo_codigo")   // nullable = true por defecto
    private CorreosCorporativos correo;

    private Boolean activo = true;
}
