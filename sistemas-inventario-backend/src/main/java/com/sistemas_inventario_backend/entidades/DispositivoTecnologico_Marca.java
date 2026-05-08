package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(
        name = "dispositivotecnologico_marca",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"descripcion", "categoria_codigo"})
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
    @JoinColumn(name = "categoria_codigo")
    private Catalogo catalogo;
}


/*


    INSERT INTO dispositivotecnologico_marca (descripcion, activo, categoria_codigo)
        VALUES
        -- EQUIPO DE COMPUTO (catalogo = 1)
        ('ASUS', 1, 1),
        ('DELL', 1, 1),
        ('HEWLETT PACKARD', 1, 1),
        ('LENOVO', 1, 1),


        -- DISPOSITIVO MOVIL (catalogo = 2)
        ('KALLEY', 1, 2),
        ('MOTOROLA', 1, 2),
        ('NOKIA', 1, 2),
        ('SAMSUNG', 1, 2),
        ('HUAWEI', 1, 2),
        ('XIAOMI', 1, 2),
        ('LENOVO', 1, 2),
        ('3NSTAR', 1, 2),

        -- IMPRESORA (catalogo = 3)
        ('EPSON', 1, 3),
        ('HEWLETT PACKARD', 1, 3),
        ('KYOCERA', 1, 3),
        ('TOSHIBA', 1, 3),
        ('ZEBRA', 1, 3)


 */