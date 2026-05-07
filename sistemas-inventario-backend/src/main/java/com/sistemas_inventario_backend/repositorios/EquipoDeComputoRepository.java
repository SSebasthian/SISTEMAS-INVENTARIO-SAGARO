package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.DispositivoTecnologico_Marca;
import com.sistemas_inventario_backend.entidades.DispositivoTecnologico_Modelo;
import com.sistemas_inventario_backend.entidades.DispositivoTecnologico_Tipo;
import com.sistemas_inventario_backend.entidades.EquipoDeComputo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface  EquipoDeComputoRepository extends JpaRepository<EquipoDeComputo, String> {

    // Buscar por serial (ya existe el findById, pero este es explícito)
    Optional<EquipoDeComputo> findBySerial(String serial);

    // Listar equipos activos
    List<EquipoDeComputo> findByActivoTrue();

    // Listar equipos inactivos
    List<EquipoDeComputo> findByActivoFalse();

    // Listar equipos por tipo
    List<EquipoDeComputo> findByTipo(DispositivoTecnologico_Tipo tipo);

    // Listar equipos por codigo de tipo
    List<EquipoDeComputo> findByTipoCodigo(Long tipoCodigo);

    // Listar equipos por marca
    List<EquipoDeComputo> findByMarca(DispositivoTecnologico_Marca marca);

    // Listar equipos por codigo de marca
    List<EquipoDeComputo> findByMarcaCodigo(Long marcaCodigo);

    // Listar equipos por modelo
    List<EquipoDeComputo> findByModelo(DispositivoTecnologico_Modelo modelo);

    // Listar equipos por modelo (codigo de modelo)
    List<EquipoDeComputo> findByModeloCodigo(Long modeloCodigo);

    // Listar equipos por rango de fechas de compra
    List<EquipoDeComputo> findByFechaCompraBetween(LocalDate startDate, LocalDate endDate);


    // Consulta personalizada con JOIN para obtener equipos con su tipo y marca (evita N+1)
    @Query("SELECT e FROM EquipoDeComputo e JOIN FETCH e.tipo JOIN FETCH e.marca WHERE e.activo = true")
    List<EquipoDeComputo> findAllActiveWithTipoAndMarca();

    // Contar equipos por marca
    Long countByMarcaCodigo(Long marcaCodigo);
}
