package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.IP;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface IPRepository extends JpaRepository<IP, Integer> {

    List<IP> findByActivoTrue();

    @Modifying
    @Transactional
    @Query("UPDATE IP i SET i.activo = true, i.catalogoCodigo = :catalogoCodigo, i.dispositivoTipoCodigo = :tipoCodigo WHERE i.ip = :ip")
    void ocuparIp(@Param("ip") Integer ip,
                  @Param("catalogoCodigo") Long catalogoCodigo,
                  @Param("tipoCodigo") Long tipoCodigo);

    @Modifying
    @Transactional
    @Query("UPDATE IP i SET i.activo = false, i.catalogoCodigo = null, i.dispositivoTipoCodigo = null WHERE i.ip = :ip")
    void liberarIp(@Param("ip") Integer ip);
}