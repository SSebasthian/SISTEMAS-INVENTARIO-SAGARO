package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Area;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.Optional;


// Extiende JpaRepository para tener CRUD automático (save, findById, delete, etc.)
public interface AreaRepository extends JpaRepository<Area,Long> {

    // Consulta personalizada usando JPQL
    // Se utiliza JOIN FETCH para cargar la relación "cargos"
    // y evitar el problema de LazyInitializationException
    @Query("SELECT a FROM Area a JOIN FETCH a.cargos WHERE a.codigo = :codigo")

    // Optional porque puede que no exista un área con ese ID
    Optional<Area> findByIdWithCargos(@Param("codigo") Long codigo);
}
