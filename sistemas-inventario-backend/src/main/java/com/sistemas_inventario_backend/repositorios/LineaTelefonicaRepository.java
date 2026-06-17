package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.LineaTelefonica;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface LineaTelefonicaRepository extends JpaRepository<LineaTelefonica, Long> {

    List<LineaTelefonica> findByActivoTrue();
    Optional<LineaTelefonica> findByNumero(String numero);
}