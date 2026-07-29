package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Backup_Informacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface Backup_InformacionRepository extends JpaRepository<Backup_Informacion, Long> {
    List<Backup_Informacion> findByActivoTrue();

    List<Backup_Informacion> findByBackupCodigoAndActivoTrue(Long backupCodigo);

    // Filtrar por backup y tipo
    List<Backup_Informacion> findByBackupCodigoAndTipoAndActivoTrue(Long backupCodigo, String tipo);



    // Busqueda exacta por todos los campos (incluyendo tipo y hora)
    @Query("SELECT b FROM Backup_Informacion b WHERE " +
            "b.nombre = :nombre AND " +
            "b.frecuencia = :frecuencia AND " +
            "(:ubicacion IS NULL OR b.ubicacion = :ubicacion) AND " +
            "(:ubicacionExcluida IS NULL OR b.ubicacionExcluida = :ubicacionExcluida) AND " +
            "(:dia IS NULL OR b.dia = :dia) AND " +
            "(:hora IS NULL OR b.hora = :hora) AND " +
            "b.backup.codigo = :backupCodigo AND " +
            "b.tipo = :tipo")
    Optional<Backup_Informacion> buscarPorCriterios(
            @Param("nombre") String nombre,
            @Param("frecuencia") String frecuencia,
            @Param("ubicacion") String ubicacion,
            @Param("ubicacionExcluida") String ubicacionExcluida,
            @Param("dia") Integer dia,
            @Param("hora") LocalTime hora,
            @Param("backupCodigo") Long backupCodigo,
            @Param("tipo") String tipo
    );
}