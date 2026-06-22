package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Antivirus_Politica;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface Antivirus_PoliticaRepository extends JpaRepository<Antivirus_Politica, Long> {
    List<Antivirus_Politica> findByActivoTrue();
    List<Antivirus_Politica> findByAntivirusCodigoAndActivoTrue(Long antivirusCodigo);
}