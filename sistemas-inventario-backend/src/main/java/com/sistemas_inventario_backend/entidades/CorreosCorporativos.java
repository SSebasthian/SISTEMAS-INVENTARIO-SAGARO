package com.sistemas_inventario_backend.entidades;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "correoscorporativos")
@Data
public class CorreosCorporativos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(unique = true, nullable = false)
    private String direccion;       // (unico)
    private String clave;           //  encriptada
    private Boolean activo = true;
}

