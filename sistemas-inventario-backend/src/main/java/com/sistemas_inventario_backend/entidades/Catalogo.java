package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "categoria")
@Getter @Setter @NoArgsConstructor
public class Catalogo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(unique = true, nullable = false)
    private String nombre;   // "EQUIPO", "DISPOSITIVO", "IMPRESORA"

    private Boolean activo = true;
}


/*

    INSERT INTO categoria (nombre, activo)
    VALUES
            ('EQUIPO DE COMPUTO', 1),
            ('DISPOSITIVO MOVIL', 1),
            ('IMPRESORA', 1);

 */
