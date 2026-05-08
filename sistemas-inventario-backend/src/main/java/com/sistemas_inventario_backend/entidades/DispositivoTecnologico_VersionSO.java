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

    -- WINDOWS SERVER (so_codigo = 2)
    ('WINDOWS SERVER 2012', 1, 2),
    ('WINDOWS SERVER 2016', 1, 2),
    ('WINDOWS SERVER 2019', 1, 2),
    ('WINDOWS SERVER 2022', 1, 2),

    -- LINUX (so_codigo = 3)
    ('DEBIAN', 1, 3),
    ('UBUNTU', 1, 3),
    ('FEDORA', 1, 3),

    -- ANDROID (so_codigo = 5)
    ('ANDROID KITKAT 4.4', 1, 5),
    ('ANDROID LOLLIPOP 5.0', 1, 5),
    ('ANDROID LOLLIPOP 5.1', 1, 5),
    ('ANDROID MARSHMALLOW 6.0', 1, 5),
    ('ANDROID NOUGAT 7.0', 1, 5),
    ('ANDROID OREO 8.0', 1, 5),
    ('ANDROID PIE 9', 1, 5),
    ('ANDROID 10', 1, 5),
    ('ANDROID 11', 1, 5),
    ('ANDROID 12', 1, 5),
    ('ANDROID 13', 1, 5),
    ('ANDROID 14', 1, 5),
    ('ANDROID 15', 1, 5);


    -- FIRMWARE PROPIETARIO (so_codigo = 7)
    ('FIRMWARE ESTANDAR', 1, 7);


 */