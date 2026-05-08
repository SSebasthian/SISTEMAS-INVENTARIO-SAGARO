package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.DispositivoTecnologico_Tipo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;


public interface DispositivoTecnologico_TipoRepository extends JpaRepository<DispositivoTecnologico_Tipo, Long> {
    // El metodo debe reflejar el nombre del campo: catalogo.codigo

    List<DispositivoTecnologico_Tipo> findByCatalogoCodigoAndActivoTrue(Long catalogoCodigo);
}