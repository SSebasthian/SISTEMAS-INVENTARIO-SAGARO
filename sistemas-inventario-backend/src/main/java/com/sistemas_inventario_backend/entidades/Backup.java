package com.sistemas_inventario_backend.entidades;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "backup")
@Getter
@Setter
@NoArgsConstructor
public class Backup {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long codigo;

    private String nombre;  // "Bacula - Copia - Manual"

    private Boolean activo = true;
}
