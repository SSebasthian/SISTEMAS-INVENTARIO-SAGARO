package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Antivirus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface  AntivirusRepository extends JpaRepository<Antivirus, Long> {
    List<Antivirus> findByActivoTrue();
}