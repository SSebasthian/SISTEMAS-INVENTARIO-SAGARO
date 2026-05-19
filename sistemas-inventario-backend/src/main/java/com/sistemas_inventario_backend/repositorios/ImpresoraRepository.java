package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Impresora;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ImpresoraRepository extends JpaRepository<Impresora, String> {

}