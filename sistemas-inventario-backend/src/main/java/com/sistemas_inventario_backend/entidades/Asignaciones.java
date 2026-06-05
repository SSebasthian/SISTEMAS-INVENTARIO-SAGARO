package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "asignaciones")
@Data
public class Asignaciones {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long consecutivo;

    @ManyToOne
    @JoinColumn(name = "empleado_cedula", referencedColumnName = "cedula")
    private Empleado empleado;

    @ManyToOne
    @JoinColumn(name = "area_codigo", referencedColumnName = "codigo")
    private Area area;

    @ManyToOne
    @JoinColumn(name = "catalogo_codigo", referencedColumnName = "codigo")
    private Catalogo catalogo;

    @ManyToOne
    @JoinColumn(name = "tipo_codigo", referencedColumnName = "codigo")
    private DispositivoTecnologico_Tipo tipo;

    @Column(nullable = false)
    private String serialActivo;

    @Column(nullable = false)
    private LocalDateTime fechaAsignacion;

    private LocalDateTime fechaDevolucion;

    @Column(length = 500)
    private String observaciones;

    @Column(nullable = false)
    private Boolean activo = true;
}
