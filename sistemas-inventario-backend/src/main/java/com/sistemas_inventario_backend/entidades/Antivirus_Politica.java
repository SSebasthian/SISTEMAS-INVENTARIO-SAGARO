package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "antivirus_politica")
@Getter
@Setter
@NoArgsConstructor
public class Antivirus_Politica {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(nullable = false)
    private String politica;

    private Boolean puertosBloqueados;

    private Boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "software_codigo", nullable = false)
    private Software software;

}
