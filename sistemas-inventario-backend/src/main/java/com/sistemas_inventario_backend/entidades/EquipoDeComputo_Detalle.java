package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "equipodecomputo_detalle", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"ip"})
})@Getter
@Setter
@NoArgsConstructor
public class EquipoDeComputo_Detalle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long numero;

    @ManyToOne
    @JoinColumn(name = "serial", referencedColumnName = "serial", nullable = false)
    private EquipoDeComputo equipo;

    // CREDENCIALES

    private String nombreEquipo;

    private String nombreUsuario;
    private String claveUsuario;

    private String nombreUsuarioAdministrador;
    private String claveUsuarioAdministrador;

    private String nombreUsuarioAdicional;
    private String claveUsuarioAdicional;

    @ManyToOne
    @JoinColumn(name = "ip", referencedColumnName = "ip")
    private IP ip;


    @OneToOne
    @JoinColumn(name = "asignacion_consecutivo", referencedColumnName = "consecutivo")
    private EquipoDeComputo_Asignacion asignacion;

    private Boolean activo = true;
}
