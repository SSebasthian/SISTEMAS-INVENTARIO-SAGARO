package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "dispositivotecnologico_marca")
@Getter @Setter @NoArgsConstructor
public class DispositivoTecnologico_Marca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(unique = true, nullable = false)
    private String descripcion;

    private Boolean activo = true;
}
