package com.sistemas_inventario_backend.entidades;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "recurso_asignado")
@Data
public class RecursoAsignado {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long numero;

    @ManyToOne
    @JoinColumn(name = "empleado_cedula", referencedColumnName = "cedula")
    private Empleado empleado;

    @ManyToOne
    @JoinColumn(name = "recurso_codigo")
    private Recurso recurso;

    @ManyToOne
    @JoinColumn(name = "recurso_tipo_codigo")  // FK a la tabla recurso_tipo
    private Recurso_Tipo  Recurso_Tipo;

    private String recursoCodigoAsignado;


    private LocalDate fechaAsignacion;
    private LocalDate fechaDevolucion;
    private String observaciones;
    private Boolean activo = true;
}
