package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "lineastelefonicas")
@Data
public class LineaTelefonica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(unique = true, nullable = false, length = 20)
    private String numero;

    private String operador;     // Claro, Movistar, Tigo

    private Boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "recurso_codigo", nullable = false)
    private Recurso recurso;

    @ManyToOne
    @JoinColumn(name = "recurso_tipo_codigo", nullable = false)
    private Recurso_Tipo recursoTipo;

}
