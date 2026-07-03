package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "equipodecomputo_software")
@Getter
@Setter
@NoArgsConstructor
public class EquipoDeComputo_Software {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long numero;

    // Relacion con el equipo
    @ManyToOne
    @JoinColumn(name = "serial", referencedColumnName = "serial", nullable = false)
    private EquipoDeComputo equipo;

    @ManyToOne
    @JoinColumn(name = "software_codigo", nullable = false)
    private Software software;

    @ManyToOne
    @JoinColumn(name = "politica_codigo", referencedColumnName = "codigo")
    private Antivirus_Politica politica;

    @ManyToOne
    @JoinColumn(name = "asignacion_consecutivo", referencedColumnName = "consecutivo")
    private EquipoDeComputo_Asignacion asignacion;

    private Boolean activo = true;


}
