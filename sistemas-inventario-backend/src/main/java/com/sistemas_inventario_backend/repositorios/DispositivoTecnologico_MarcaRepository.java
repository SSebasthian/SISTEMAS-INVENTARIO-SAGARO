package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.DispositivoTecnologico_Marca;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface DispositivoTecnologico_MarcaRepository   extends JpaRepository<DispositivoTecnologico_Marca, Long> {
    List<DispositivoTecnologico_Marca> findByCatalogoCodigoAndActivoTrue(Long catalogoCodigo);
}