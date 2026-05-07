package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "dispositivotecnologico_so")
@Getter @Setter @NoArgsConstructor

public class DispositivoTecnologico_SO {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(unique = true, nullable = false)
    private String descripcion;
    private String categoria;
    private Boolean activo = true;
}
