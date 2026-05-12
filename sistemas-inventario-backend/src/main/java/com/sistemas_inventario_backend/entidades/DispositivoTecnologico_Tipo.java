package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "dispositivotecnologico_tipo")
@Getter @Setter @NoArgsConstructor
public class DispositivoTecnologico_Tipo {

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

    INSERT INTO dispositivotecnologico_tipo (descripcion, activo, catalogo_codigo)
    VALUES
        ('TORRE', 1, 1),
        ('PORTATIL', 1, 1),
        ('TODO EN UNO', 1, 1),
        ('SERVIDOR', 1, 1),

        ('CELULAR', 1, 2),
        ('TABLET', 1, 2),
        ('TERMINAL', 1, 2),

        ('INYECCION DE TINTA', 1, 3),
        ('LASER', 1, 3),
        ('ESCANER', 1, 3),
        ('MATRIX', 1, 3),
        ('ETIQUETA', 1, 3);


 */