package com.sistemas_inventario_backend.entidades;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "antivirus")
@Getter
@Setter
@NoArgsConstructor
public class Antivirus {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    private String nombre;  // "Bitdefender Total Security - Windows Defender"

    private Boolean activo = true;
}
