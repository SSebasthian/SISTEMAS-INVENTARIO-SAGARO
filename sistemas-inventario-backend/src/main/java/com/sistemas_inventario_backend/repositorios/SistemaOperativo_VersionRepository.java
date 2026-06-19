package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.sistemaoperativo_version;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface SistemaOperativo_VersionRepository extends JpaRepository<sistemaoperativo_version, Long> {

    List<sistemaoperativo_version> findBySistemaOperativoCodigoAndActivoTrue(Long soCodigo);
}
