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



/*

INSERT INTO dispositivotecnologico_modelo
(descripcion, ruta_imagen, activo, marca_codigo)
VALUES

    -- EQUIPOS DE COMPUTO
    -- DELL (marca_codigo = 2)
    ('OPTIPLEX 3050', NULL, 1, 2),
    ('INSPIRON 620S', NULL, 1, 2),
    ('VOSTRO 3250', NULL, 1, 2),
    ('OPTIPLEX 3060', NULL, 1, 2),
    ('OPTIPLEX 3080', NULL, 1, 2),
    ('OPTIPLEX 3090', NULL, 1, 2),
    ('OPTIPLEX 3020', NULL, 1, 2),
    ('VOSTRO 260S', NULL, 1, 2),
    ('VOSTRO 220S', NULL, 1, 2),
    ('INSPIRON 545S', NULL, 1, 2),
    ('VOSTRO 200', NULL, 1, 2),
    ('VOSTRO 200S', NULL, 1, 2),
    ('INSPIRON 660S', NULL, 1, 2),
    ('INSPIRON 530', NULL, 1, 2),
    ('INSPIRON 580S', NULL, 1, 2),
    ('POWEREDGE T110 II', NULL, 1, 2),
    ('POWEREDGE T300', NULL, 1, 2),
    ('VOSTRO 3550', NULL, 1, 2),
    ('OPTIPLEX 320', NULL, 1, 2),

    -- ASUS (marca_codigo = 1)
    ('ZEN AIO 0540', NULL, 1, 1),
    ('ZEN AIO 540', NULL, 1, 1),
    ('ZEN AIO 5401', NULL, 1, 1),
    ('VIVOBOOK M1503QA', NULL, 1, 1),
    ('EXPERTCENTER AIO E540', NULL, 1, 1),

    -- HP / HEWLETT PACKARD (marca_codigo = 3)
    ('HP ALL-IN-ONE DESKTOP 24-CB-1', NULL, 1, 3),
    ('HP PRO BOOK 445 G8', NULL, 1, 3),
    ('HP PROONE 440', NULL, 1, 3),
    ('HP PROBOOK 445G8', NULL, 1, 3),
    ('HP PROBOOK 445G9', NULL, 1, 3),
    ('HP LAPTOP 15-GW0XXX', NULL, 1, 3),
    ('HP PROBOOK 445GB', NULL, 1, 3),
    ('245 G7', NULL, 1, 3),
    ('HP PROBOOK 450 G2', NULL, 1, 3),
    ('PRODESK 600 G1', NULL, 1, 3),

    -- LENOVO (marca_codigo = 4)
    ('F0G100T0LD', NULL, 1, 4),
    ('80SX', NULL, 1, 4),
    ('THINKPAD 21JQ', NULL, 1, 4),
    ('G40-70', NULL, 1, 4),



    -- DISPOSITIVO MOVIL
    -- MOTOROLA (marca_codigo = 6)
    ('E6S-XT2053-2', NULL, 1, 6),
    ('MOTOG04S', NULL, 1, 6),
    ('MOTO G(7) PLAY', NULL, 1, 6),
    ('MOTO G84 5G', NULL, 1, 6),
    ('MOTO E6S', NULL, 1, 6),
    ('MOTO G06', NULL, 1, 6),
    ('E6 PLUS', NULL, 1, 6),
    ('MOTO G84', NULL, 1, 6),

    -- KALLEY (marca_codigo = 5)
    ('SILVER MAX PRO', NULL, 1, 5),
    ('BLACK_6_2', NULL, 1, 5),

    -- SAMSUNG (marca_codigo = 8)
    ('GALAXY A03 CORE', NULL, 1, 8),
    ('GALAXY A03 SM-A03 SM/DS', NULL, 1, 8),
    ('GALAXY J2 PRO', NULL, 1, 8),
    ('GALAXY A03', NULL, 1, 8),
    ('GALAXY A21S', NULL, 1, 8),
    ('GALAXY A12', NULL, 1, 8),
    ('GALAXY A26 5G', NULL, 1, 8),
    ('SM-X110', NULL, 1, 8),

    -- NOKIA (marca_codigo = 7)
    ('C01 PLUS', NULL, 1, 7),

    -- 3NSTAR (marca_codigo = 12)
    ('NUSTAR 5SX', NULL, 1, 12),

    -- LENOVO (marca_codigo = 4)
    ('TB300FU', NULL, 1, 4),
    ('TB328FU', NULL, 1, 4),
    ('TB-8505FS', NULL, 1, 4),
    ('TB-8505FX', NULL, 1, 4),
    ('TB-7305X', NULL, 1, 4),
    ('TB-7304F', NULL, 1, 4),
    ('YT-X705F', NULL, 1, 4),
    ('TB-7305F', NULL, 1, 4),
    ('YT3-850F', NULL, 1, 4),

    -- HUAWEI (marca_codigo = 9)
    ('B62-W09', NULL, 1, 9);


    --IMPRESORAS
    -- KYOCERA (marca_codigo = 15)
    ('M250DW', NULL, 1, 15),
    ('M3550IDN', NULL, 1, 15),
    ('P3155DN', NULL, 1, 15),
    ('FS-4200DN', NULL, 1, 15),
    ('ECOSYS P3045DN', NULL, 1, 15),
    ('FS-2100DN', NULL, 1, 15),
    ('KYO ECO M3550IDN', NULL, 1, 15),

    -- EPSON (marca_codigo = 13)
    ('LQ-2090 II PB34A', NULL, 1, 13),
    ('L4260 SERIES', NULL, 1, 13),
    ('L3210', NULL, 1, 13),
    ('L355', NULL, 1, 13),
    ('FX-2180', NULL, 1, 13),
    ('L3110', NULL, 1, 13),
    ('L210', NULL, 1, 13),
    ('L380', NULL, 1, 13),
    ('L3150', NULL, 1, 13),

    -- HP / HEWLETT PACKARD (marca_codigo = 3)
    ('M1212NF MFP', NULL, 1, 3),
    ('P1102W', NULL, 1, 3),

    -- ZEBRA (marca_codigo = 17)
    ('ZT230', NULL, 1, 17),
    ('ZT510', NULL, 1, 17),
    ('STRIPE S4M', NULL, 1, 17),
    ('ZD230', NULL, 1, 17),
    ('GK420T', NULL, 1, 17),

    -- TOSHIBA (marca_codigo = 16)
    ('E-STUDIO3508A', NULL, 1, 16);

 */