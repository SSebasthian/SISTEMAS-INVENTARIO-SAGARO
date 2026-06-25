package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "software")
@Getter
@Setter
@NoArgsConstructor
public class Software {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(nullable = false)
    private String nombre; // "Google Chrome", "Microsoft Office 2019"

    @Column(name = "ruta_imagen")
    private String rutaImagen;

    @ManyToOne
    @JoinColumn(name = "softwaretipo_codigo", nullable = false)
    private Software_Tipo tipo;

    private Boolean activo = true;
}
