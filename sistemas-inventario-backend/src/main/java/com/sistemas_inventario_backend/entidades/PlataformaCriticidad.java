package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "plataformacriticidad")
@Data
public class PlataformaCriticidad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(nullable = false)
    private String criticidad;
    private String detalleCriticidad;
    private String descripcionAcceso;
    private String descripcionRestricciones;
    private String justificacion;
    private Boolean activo = true;
}
