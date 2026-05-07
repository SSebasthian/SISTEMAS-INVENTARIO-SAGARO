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
