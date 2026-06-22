package com.sistemas_inventario_backend.entidades;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "backup_informacion")
@Getter
@Setter
@NoArgsConstructor
public class Backup_Informacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    private String nombre;
    private String frecuencia;
    private String ubicacion;

    private String ubicacionExcluida;

    private Integer dia; // 1-7 o 1-31 segun frecuencia

    private Boolean activo = true;


    @ManyToOne
    @JoinColumn(name = "backup_codigo", nullable = false)
    private Backup backup;
}
