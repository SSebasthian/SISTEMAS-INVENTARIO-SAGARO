package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDate;

@Entity
@Table(name = "dispositivosmoviles")
@Getter
@Setter
@NoArgsConstructor
public class DispositivoMovil {


    @Id
    @Column(unique = true, nullable = false, length = 50)
    private String serial;

    private String plaqueta;
    private String facturaCompra;
    private LocalDate fechaCompra;
    private Boolean activo = true;
    private String descripcion;
    private String estado;

    // Especificaciones tecnicas (simples)
    private String pulgadas;
    private String ram;
    private String almacenamiento;
    private String imei1;
    private String imei2;
    private String procesador;



    // Relaciones ManyToOne con catalogos
    @ManyToOne
    @JoinColumn(name = "codigo_tipo")
    private DispositivoTecnologico_Tipo tipo;

    @ManyToOne
    @JoinColumn(name = "codigo_marca")
    private DispositivoTecnologico_Marca marca;

    @ManyToOne
    @JoinColumn(name = "codigo_modelo")
    private DispositivoTecnologico_Modelo modelo;

    @ManyToOne
    @JoinColumn(name = "codigo_so")
    private DispositivoTecnologico_SO sistemaOperativo;

    @ManyToOne
    @JoinColumn(name = "codigo_versionso")
    private DispositivoTecnologico_VersionSO versionSO;

}
