package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(
        name = "dispositivotecnologico_modelo",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"descripcion", "marca_codigo", "tipo_codigo"}
                )
        })
@Getter
@Setter
@NoArgsConstructor
public class DispositivoTecnologico_Modelo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(nullable = false)
    private String descripcion;
    private String rutaImagen;
    private Boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "tipo_codigo")
    private DispositivoTecnologico_Tipo tipo;

    @ManyToOne
    @JoinColumn(name = "marca_codigo")
    private DispositivoTecnologico_Marca marca;
}




/*

INSERT INTO dispositivotecnologico_modelo
(descripcion, ruta_imagen, activo, tipo_codigo, marca_codigo)
VALUES


    -- =========================================
    -- ASUS
    -- =========================================

    -- TORREN (tipo = 1) NO HAY

    -- PORTATIL (tipo = 2) (marca = 4)
    ('VIVOBOOK M1503QA', NULL, 1, 2, 4),

    -- TODOENUNO (tipo = 3) (marca = 8)
    ('ZEN AIO 0540', NULL, 1, 3, 8),
    ('EXPERT CENTER AIO E540', NULL, 1, 3, 8),



    -- =========================================
    -- DELL INC.
    -- =========================================

    -- TORRE (tipo = 1) (marca = 1)
    ('INSPIRON 530', NULL, 1, 1, 1),
    ('INSPIRON 545S', NULL, 1, 1, 1),
    ('INSPIRON 580S', NULL, 1, 1, 1),
    ('INSPIRON 620S', NULL, 1, 1, 1),
    ('INSPIRON 660S', NULL, 1, 1, 1),
    ('OPTIPLEX 3020', NULL, 1, 1, 1),
    ('OPTIPLEX 3050', NULL, 1, 1, 1),
    ('OPTIPLEX 3060', NULL, 1, 1, 1),
    ('OPTIPLEX 3080', NULL, 1, 1, 1),
    ('OPTIPLEX 3090', NULL, 1, 1, 1),
    ('OPTIPLEX 3090 MICRO', NULL, 1, 1, 1),
    ('VOSTRO 200', NULL, 1, 1, 1),
    ('VOSTRO 220S', NULL, 1, 1, 1),
    ('VOSTRO 260S', NULL, 1, 1, 1),
    ('VOSTRO 3250', NULL, 1, 1, 1),

    -- PORTATIL (tipo = 2) (marca = 5)
    ('VOSTRO 3550', NULL, 1, 2, 5),

    -- SERVIDOR (tipo = 4) (marca = 11)
    ('POWER EDGE T300', NULL, 1, 4, 11),
    ('POWER EDGE T110 II', NULL, 1, 4, 11),


    -- =========================================
    -- HEWLETT PACKARD
    -- =========================================

    -- TORRE (tipo = 1) (marca = 2)
    ('PRO DESK 445 G8', NULL, 1, 1, 2),
    ('PRO DESK 600 G1', NULL, 1, 1, 2),

    -- PORTATIL (tipo = 2) (marca = 6)
    ('245 G7', NULL, 1, 2, 6),
    ('LAPTOP 15-GW0XXX', NULL, 1, 2, 6),
    ('PRO BOOK 445 G8', NULL, 1, 2, 6),
    ('PRO BOOK 450 G8', NULL, 1, 2, 6),

    -- TODOENUNO (tipo = 3) (marca = 9)
    ('DESKTOP 24-CB-1', NULL, 1, 3, 9),
    ('PRO ONE 440', NULL, 1, 3, 9),

    -- SERVIDOR (tipo = 4) (marca = 12)
    ('PRO LIANT ML110 GEN9', NULL, 1, 4, 12),


    -- =========================================
    -- LENOVO
    -- =========================================

    -- TORRE (tipo = 1) (marca = 3)
    ('SFF V530S', NULL, 1, 1, 3),

    -- PORTATIL (tipo = 2) (marca = 7)
    ('THINKPAD 21JQ', NULL, 1, 2, 7),
    ('80SX', NULL, 1, 2, 7),

    -- TODOENUNO (tipo = 3) (marca = 10)
    ('F0G100T0LD', NULL, 1, 3, 10),



    -- =========================================
    -- CELULAR
    -- tipo_codigo = 5
    -- =========================================

    -- KALLEY (marca_codigo = 13)
    ('SILVER MAX PRO', NULL, 1, 5, 13),
    ('BLACK_6_2', NULL, 1, 5, 13),

    -- MOTOROLA (marca_codigo = 14)
    ('E6 PLUS', NULL, 1, 5, 14),
    ('E6S-XT2053-2', NULL, 1, 5, 14),
    ('MOTO E6S', NULL, 1, 5, 14),
    ('MOTO G04S', NULL, 1, 5, 14),
    ('MOTO G05S', NULL, 1, 5, 14),
    ('MOTO G06', NULL, 1, 5, 14),
    ('MOTO G7 PLAY', NULL, 1, 5, 14),
    ('MOTO G84', NULL, 1, 5, 14),
    ('MOTO G84 5G', NULL, 1, 5, 14),


    -- NOKIA (marca_codigo = 15)
    ('C01 PLUS', NULL, 1, 5, 15),

    -- SAMSUNG (marca_codigo = 16)
    ('GALAXY A03', NULL, 1, 5, 16),
    ('GALAXY A03 CORE', NULL, 1, 5, 16),
    ('GALAXY A12', NULL, 1, 5, 16),
    ('GALAXY A21S', NULL, 1, 5, 16),
    ('GALAXY A26 5G', NULL, 1, 5, 16),

    -- XIAOMI (marca_codigo = 17)
    ('REDMI 15C', NULL, 1, 5, 17),




    -- =========================================
    -- TABLET
    -- tipo_codigo = 6
    -- =========================================

    -- SAMSUNG (marca_codigo = 18)
    ('GALAXY TAB A9', NULL, 1,6, 18),

    -- HUAWEI (marca_codigo = 19)
    ('B62-W09', NULL, 1,6, 19),

    -- LENOVO (marca_codigo = 20)
    ('TAB-7 TB-7304F', NULL, 1,6, 20),
    ('TAB-M7 TB-7305F', NULL, 1,6, 20),
    ('TAB-M7 TB-7305X', NULL, 1,6, 20),
    ('TAB-M8 TB-300FU', NULL, 1,6, 20),
    ('TAB-M8 TB-8505FS', NULL, 1,6, 20),
    ('TAB-M8 TB-8505FX', NULL, 1,6, 20),
    ('TAB-M10 TB-328FU', NULL, 1,6, 20),
    ('YOGA YT-X705F', NULL, 1,6, 20),
    ('YOGA YT3-850F', NULL, 1,6, 20),


    -- =========================================
    -- TERMINAL
    -- tipo_codigo = 7
    -- =========================================

    -- 3NSTAR (marca_codigo = 21)
    ('DC0505', NULL, 1, 7, 21),
    ('NUSTAR 5SX', NULL, 1, 7, 21),


    -- =========================================
    -- INYECCION DE TINTA
    -- tipo_codigo = 8
    -- =========================================

    -- EPSON (marca_codigo = 22)
    ('L210', NULL, 1, 8, 22),
    ('L220', NULL, 1, 8, 22),
    ('L355', NULL, 1, 8, 22),
    ('L365', NULL, 1, 8, 22),
    ('L380', NULL, 1, 8, 22),
    ('L3110', NULL, 1, 8, 22),
    ('L3150', NULL, 1, 8, 22),
    ('L3210', NULL, 1, 8, 22),
    ('L4160', NULL, 1, 8, 22),
    ('L4260', NULL, 1, 8, 22),


    -- =========================================
    -- LASER
    -- tipo_codigo = 9
    -- =========================================

    -- KYOCERA (marca_codigo = 23)

    ('ECOSYS M2540', NULL, 1, 9, 23),
    ('ECOSYS M3550', NULL, 1, 9, 23),
    ('ECOSYS M3560', NULL, 1, 9, 23),
    ('ECOSYS P3045', NULL, 1, 9, 23),
    ('FS-2100', NULL, 1, 9, 23),
    ('FS-3640', NULL, 1, 9, 23),
    ('FS-4200', NULL, 1, 9, 23),
    ('M250DW', NULL, 1, 9, 23),
    ('P3155DN', NULL, 1, 9, 23),


    -- TOSHIBA (marca_codigo = 24)
    ('E-STUDIO 3508A', NULL, 1, 9, 24),

    -- HEWLETT PACKARD (marca_codigo = 25)
    ('LASERJET P1102W', NULL, 1, 9, 25),
    ('LASERJET M1212', NULL, 1, 9, 25),


    -- =========================================
    -- SCANNER
    -- tipo_codigo = 10
    -- =========================================

    -- CANON (marca_codigo = 26)
    ('DR-C240', NULL, 1, 10, 26),
    ('DR-M160 II', NULL, 1, 10, 26),


    -- =========================================
    -- MATRIX
    -- tipo_codigo = 11
    -- =========================================

    ('FX-1170', NULL, 1, 11, 27),
    ('FX-2180', NULL, 1, 11, 27),
    ('LQ-2090 II PB34A', NULL, 1, 11, 27),


    -- ZEBRA (marca_codigo = 28)
    ('GK420T', NULL, 1, 12, 28),
    ('S4M', NULL, 1, 12, 28),
    ('ZD230', NULL, 1, 12, 28),
    ('ZT210', NULL, 1, 12, 28),
    ('ZT230', NULL, 1, 12, 28),
    ('ZT410', NULL, 1, 12, 28),
    ('ZT510', NULL, 1, 12, 28)

 */