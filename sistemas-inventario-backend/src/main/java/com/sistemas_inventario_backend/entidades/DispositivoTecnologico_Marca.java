package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(
        name = "dispositivotecnologico_marca",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"descripcion", "tipo_codigo"})
        }
)
@Getter @Setter @NoArgsConstructor
public class DispositivoTecnologico_Marca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    private String descripcion;
    private Boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "tipo_codigo")
    private DispositivoTecnologico_Tipo tipo;
}


/*


    INSERT INTO dispositivotecnologico_marca
    (descripcion, activo, tipo_codigo)
    VALUES

    -- TORRE (tipo = 1)
    ('DELL', 1, 1),
    ('HEWLETT PACKARD', 1, 1),
    ('LENOVO', 1, 1),

    -- PORTATIL (tipo = 2)
    ('ASUS', 1, 2),
    ('DELL', 1, 2),
    ('HEWLETT PACKARD', 1, 2),
    ('LENOVO', 1, 2),

    -- TODOENUNO (tipo = 3)
    ('ASUS', 1, 3),
    ('HEWLETT PACKARD', 1, 3),
    ('LENOVO', 1, 3),

    -- SERVIDOR (tipo = 4)
    ('DELL', 1, 4),
    ('HEWLETT PACKARD', 1, 4),

    -- CELULAR (tipo = 5)
    ('KALLEY', 1, 5),
    ('MOTOROLA', 1, 5),
    ('NOKIA', 1, 5),
    ('SAMSUNG', 1, 5),
    ('XIAOMI', 1, 5),

    -- TABLET (tipo = 6)
    ('SAMSUNG', 1, 6),
    ('HUAWEI', 1, 6),
    ('LENOVO', 1, 6),

    -- TERMINAL (tipo = 7)
    ('3NSTAR', 1, 7),

    -- INYECCION DE TINTA (tipo = 8)
    ('EPSON', 1, 8),

    -- LASER (tipo = 9)
    ('KYOCERA', 1, 9),
    ('TOSHIBA', 1, 9),
    ('HEWLETT PACKARD', 1, 9),

    -- ESCANER (tipo = 10)
    ('CANON', 1, 10),

    -- MATRIX (tipo = 11)
    ('DELL', 1, 11),

    -- ETIQUETA (tipo = 12)
    ('ZEBRA', 1, 11);


 */