package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "dispositivotecnologico_modelo")
@Getter @Setter @NoArgsConstructor
public class DispositivoTecnologico_Modelo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(unique = true, nullable = false)
    private String descripcion;
    private String rutaImagen;
    private Boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "marca_codigo")
    private DispositivoTecnologico_Marca marca;
}
