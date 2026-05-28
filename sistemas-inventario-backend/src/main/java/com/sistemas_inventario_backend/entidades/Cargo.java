package com.sistemas_inventario_backend.entidades;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity                     // Indica que esta clase es una entidad (tabla en la base de datos)
@Table(name = "cargo")       // Nombre real de la tabla en la base de datos
@Getter
@Setter
@NoArgsConstructor                    // Genera Automaticamente getters, setters, toString, equals y hashCode
public class Cargo {
    @Id                                                             // Llave primaria de la tabla
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    // MySQL generará el ID automáticamente (auto-increment)
    private Long codigo;

    @Column(unique = true, nullable = false)
    private String descripcion;
    private Boolean activo = true;
}


/*

INSERT INTO cargo (descripcion, activo) VALUES
    ('PRESIDENCIA', 1),
    ('DIRECTOR', 1),
    ('GERENTE', 1),
    ('JEFE', 1),
    ('CUMPLIMIENTO', 1),
    ('SUPERVISOR', 1),
    ('MEDICO', 1),
    ('ASISTENTE', 1),
    ('AUXILIAR', 1),
    ('SECRETARIA', 1),
    ('ASEGURAMIENTO', 1),
    ('FACILITADOR', 1),
    ('OPERARIO', 1),
    ('SUPERVISOR CLAVEL', 1),
    ('SUPERVISOR ROSAS', 1),
    ('TRABAJADOR CLAVEL', 1),
    ('TRABAJADOR ROSAS', 1),
    ('PASANTE', 1);



 */