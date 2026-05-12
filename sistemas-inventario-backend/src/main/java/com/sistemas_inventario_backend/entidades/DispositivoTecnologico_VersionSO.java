package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "dispositivotecnologico_versionso")
@Getter @Setter @NoArgsConstructor
public class DispositivoTecnologico_VersionSO {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(unique = true, nullable = false)
    private String descripcion;

    private Boolean activo = true;

    @ManyToOne
    @JoinColumn(name = "so_codigo")
    private DispositivoTecnologico_SO sistemaOperativo;

}


/*


INSERT INTO dispositivotecnologico_versionso
(descripcion, activo, so_codigo)
VALUES

    -- WINDOWS (so_codigo = 1)
    ('WINDOWS XP', 1, 1),
    ('WINDOWS 7', 1, 1),
    ('WINDOWS 8', 1, 1),
    ('WINDOWS 10', 1, 1),
    ('WINDOWS 11', 1, 1),
    ('WINDOWS DISPONIBLE', 0, 1),

    -- LINUX (so_codigo = 2)
    ('DEBIAN', 1, 2),
    ('UBUNTU', 1, 2),
    ('FEDORA', 1, 2),


    -- WINDOWS SERVER (so_codigo = 3)
    ('PROXMOX ENTORNO VIRTUAL', 1, 3),
    ('WINDOWS SERVER 2012', 1, 3),
    ('WINDOWS SERVER 2016', 1, 3),
    ('WINDOWS SERVER 2019', 1, 3),
    ('WINDOWS SERVER 2022', 1, 3),
    ('WINDOWS SERVER DISPONIBLE', 0, 3),



    -- ANDROID (so_codigo = 4)
    ('4 KITKAT', 1, 4),
    ('5 LOLLIPOP', 1, 4),
    ('6 MARSHMALLOW', 1, 4),
    ('7 NOUGAT', 1, 4),
    ('8 OREO', 1, 4),
    ('9 PIE', 1, 4),
    ('10 QUINCE TART', 1, 4),
    ('11 RED VELVET', 1, 4),
    ('12 SNOW CONE', 1, 4),
    ('13 TIRAMISU', 1, 4),
    ('14 UPSIDE', 1, 4),
    ('15 VANILLA', 1, 4),
    ('16', 0, 4),
    ('17', 0, 4),
    ('18', 0, 4),
    ('19', 0, 4),
    ('20', 0, 4),
    ('21', 0, 4),
    ('22', 0, 4),
    ('23', 0, 4),
    ('24', 0, 4),
    ('25', 0, 4),
    ('26', 0, 4),
    ('27', 0, 4),
    ('28', 0, 4),
    ('29', 0, 4),
    ('30', 0, 4),



    -- FIRMWARE PROPIETARIO (so_codigo = 5)
    ('FIRMWARE ESTANDAR', 1, 5);


 */