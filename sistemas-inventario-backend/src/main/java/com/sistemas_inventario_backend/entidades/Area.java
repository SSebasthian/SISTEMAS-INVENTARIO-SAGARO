package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity                     // Indica que esta clase es una entidad (tabla en la base de datos)
@Table(name = "area")       // Nombre real de la tabla en la base de datos
@Getter
@Setter
@NoArgsConstructor           // Genera Automaticamente getters, setters, toString, equals y hashCode
public class Area {

    @Id                                                             // Llave primaria de la tabla
    @GeneratedValue(strategy = GenerationType.IDENTITY)             // MySQL generará el ID automáticamente (auto-increment)
    private Long codigo;

    @Column(unique = true, nullable = false)
    private String descripcion;
    private Boolean activo = true;



    // Relación muchos a muchos con Cargo
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "cargosxarea",                    // nombre de la tabla intermedia
            joinColumns = @JoinColumn(name = "area_codigo"),
            inverseJoinColumns = @JoinColumn(name = "cargo_codigo")
    )
    private Set<Cargo> cargos = new HashSet<>();
}


/*

INSERT INTO area (descripcion, activo) VALUES
    ('ADMINISTRACION', 1),
    ('ALMACEN', 1),
    ('ARCHIVO', 1),
    ('COMPRAS', 1),
    ('CONTABILIDAD', 1),
    ('CULTIVO CLAVEL', 1),
    ('CULTIVO ROSAS', 1),
    ('DIRECTIVOS', 1),
    ('ESTADISTICA', 1),
    ('EXPORTACIONES', 1),
    ('FACTURACION', 1),
    ('GESTION HUMANA', 1),
    ('LABORATORIO', 1),
    ('MANTENIMIENTO', 1),
    ('NOMINA', 1),
    ('POSTCOSECHA CLAVEL', 1),
    ('POSTCOSECHA ROSAS', 1),
    ('PRODUCCION', 1),
    ('SEGURIDAD', 1),
    ('SGI', 1),
    ('SISTEMAS', 1),
    ('SST', 1),
    ('VENTAS', 1);

*/
