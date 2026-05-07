package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.DispositivoTecnologico_VersionSO;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface DispositivoTecnologico_VersionSORepository extends JpaRepository<DispositivoTecnologico_VersionSO, Long> {

    List<DispositivoTecnologico_VersionSO> findBySistemaOperativoCodigoAndActivoTrue(Long soCodigo);
}
