package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "plataforma")
@Data
public class Plataforma {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(unique = true, nullable = false)
    private String descripcion;  // "Nomina", "Inventario", "Siflor", "Facturacion", "Siigo", "Sevenet"

    private String link_acceso;

    private Boolean activo = true;

    // Relacion con Recurso (siempre sera el codigo 3 = PLATAFORMAS)
    @ManyToOne
    @JoinColumn(name = "recurso_codigo", nullable = false)
    private Recurso recurso;

    // Relacion con Recurso_Tipo (PROPIO, TERCERO)
    @ManyToOne
    @JoinColumn(name = "recurso_tipo_codigo", nullable = false)
    private Recurso_Tipo recursoTipo;
}
