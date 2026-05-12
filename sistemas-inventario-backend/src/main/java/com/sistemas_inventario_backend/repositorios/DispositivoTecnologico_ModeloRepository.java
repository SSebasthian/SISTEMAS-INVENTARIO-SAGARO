package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.DispositivoTecnologico_Modelo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface DispositivoTecnologico_ModeloRepository extends JpaRepository<DispositivoTecnologico_Modelo, Long> {

    // Modelos por marca (sin tipo) - si aún lo necesitas
    List<DispositivoTecnologico_Modelo> findByMarcaCodigoAndActivoTrue(Long marcaCodigo);

    // Modelos por marca Y tipo
    List<DispositivoTecnologico_Modelo> findByMarcaCodigoAndTipoCodigoAndActivoTrue(Long marcaCodigo, Long tipoCodigo);
}