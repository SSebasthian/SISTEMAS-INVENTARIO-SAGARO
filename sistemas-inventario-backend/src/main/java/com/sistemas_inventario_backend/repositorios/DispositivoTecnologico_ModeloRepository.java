package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.DispositivoTecnologico_Modelo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface DispositivoTecnologico_ModeloRepository extends JpaRepository<DispositivoTecnologico_Modelo, Long> {

    List<DispositivoTecnologico_Modelo> findByMarcaCodigoAndActivoTrue(Long marcaCodigo);

}
