package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "sistemaoperativo")
@Getter @Setter @NoArgsConstructor

public class SistemaOperativo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(unique = true, nullable = false)
    private String descripcion;
    private Boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "catalogo_codigo")
    private Catalogo catalogo;
}



/*

INSERT INTO dispositivotecnologico_so
(descripcion, activo, catalogo_codigo)
VALUES

    -- EQUIPO DE COMPUTO (catalogo = 1)
    ('WINDOWS', 1, 1),
    ('LINUX', 1, 1),
    ('WINDOWS SERVER', 1, 1),

    -- DISPOSITIVO MOVIL (catalogo = 2)
    ('ANDROID', 1, 2),

    -- IMPRESORA (catalogo = 3)
    ('FIRMWARE PROPIO', 1, 3);

 */