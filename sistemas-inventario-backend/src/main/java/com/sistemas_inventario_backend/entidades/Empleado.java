package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity                     // Indica que esta clase es una entidad (tabla en la base de datos)
@Table(name = "empleado")       // Nombre real de la tabla en la base de datos
@Getter
@Setter
@NoArgsConstructor                         // Genera Automaticamente getters, setters, toString, equals y hashCode
public class Empleado {

    @Id
    @Column(unique = true, nullable = false, length = 20)
    private String cedula;   // ahora es la PK

    private String nombre;
    private String apellido;
    private LocalDate fechaIngreso;
    private LocalDate fechaRetiro;
    private Boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "area_codigo")
    private Area area;

    @ManyToOne
    @JoinColumn(name = "cargo_codigo")
    private Cargo cargo;
}
