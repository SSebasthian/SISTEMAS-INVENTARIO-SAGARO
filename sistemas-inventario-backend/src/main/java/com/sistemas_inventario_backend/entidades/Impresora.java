package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "impresora")
@Getter
@Setter
@NoArgsConstructor
public class Impresora {


    @Id
    @Column(unique = true, nullable = false, length = 50)
    private String serial;

    private String propiedad;
    private String plaqueta;
    private String tipoRecarga;
    private String facturaCompra;
    private LocalDate fechaCompra;
    private Boolean activo = true;
    private String descripcion;
    private String estado;

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

}




