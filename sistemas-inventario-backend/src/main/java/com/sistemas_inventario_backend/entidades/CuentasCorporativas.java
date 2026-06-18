package com.sistemas_inventario_backend.entidades;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "cuentascorporativas")
@Data
public class CuentasCorporativas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @ManyToOne
    @JoinColumn(name = "plataforma_codigo", nullable = false)
    private Plataforma plataforma;

    @ManyToOne
    @JoinColumn(name = "plataforma_rol_codigo", nullable = false)
    private PlataformaRol plataformaRol;

    private String usuario;
    private Boolean activo = true;

}

