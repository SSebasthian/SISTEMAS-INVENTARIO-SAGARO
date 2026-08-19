package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "ip", uniqueConstraints = {
        @UniqueConstraint(columnNames = "ip")
})
@Data
public class IP {

    @Id
    private Integer ip;  // La IP es la clave primaria (1-255)

    @Column(nullable = false)
    private Boolean activo = true; // true = disponible, false = ocupada

    @Column(name = "catalogo_codigo")
    private Long catalogoCodigo; // 1=Equipo, 2=Movil, 3=Impresora

    @Column(name = "dispositivo_tipo_codigo")
    private Long dispositivoTipoCodigo; // Subtipo (ej. telefono, tablet)

}
