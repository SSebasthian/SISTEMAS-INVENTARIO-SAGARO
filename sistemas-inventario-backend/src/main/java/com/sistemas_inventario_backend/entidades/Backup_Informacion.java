package com.sistemas_inventario_backend.entidades;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Entity
@Table(name = "backup_informacion")
@Getter
@Setter
@NoArgsConstructor
public class Backup_Informacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(unique = true)
    private String nombre;
    private String frecuencia;
    private String ubicacion;

    private String ubicacionExcluida;

    private Integer dia; // 1-7 o 1-31 segun frecuencia

    private Boolean activo = true;

    @Column(name = "hora", columnDefinition = "TIME")
    private LocalTime hora;

    @Column(nullable = false)
    private String tipo; // "EQUIPO" o "CORREO"

    @ManyToOne
    @JoinColumn(name = "backup_codigo", nullable = false)
    private Backup backup;
}
