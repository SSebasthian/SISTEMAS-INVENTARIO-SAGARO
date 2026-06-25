package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "software_tipo")
@Getter
@Setter
@NoArgsConstructor
public class Software_Tipo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(unique = true, nullable = false)
    private String descripcion; // "NAVEGADOR", "OFFICE", "LECTOR PDF", "COMPRESOR"

    private Boolean activo = true;
}
