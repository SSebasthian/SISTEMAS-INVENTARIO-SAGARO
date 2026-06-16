package com.sistemas_inventario_backend.entidades;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "recurso") // nombre más claro
@Data
public class Recurso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    @Column(unique = true, nullable = false)
    private String nombre;   // "LINEATELEFONO", "CORREO", "CUENTA"

    private Boolean activo = true;
}
