package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "recurso_tipo")
@Data
public class Recurso_Tipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @ManyToOne
    @JoinColumn(name = "recurso_codigo")
    private Recurso recurso;

    private String nombre;

    private Boolean activo = true;
}
