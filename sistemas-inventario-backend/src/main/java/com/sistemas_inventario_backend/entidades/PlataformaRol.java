package com.sistemas_inventario_backend.entidades;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "plataformarol")
@Data
public class PlataformaRol {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @ManyToOne
    @JoinColumn(name = "plataforma_codigo", nullable = false)
    private Plataforma plataforma;

    private Integer rol;
    private String descripcion;
    private Boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "criticidad_codigo", nullable = false)
    private PlataformaCriticidad criticidad;
}
