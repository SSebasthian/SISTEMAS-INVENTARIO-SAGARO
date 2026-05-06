package com.sistemas_inventario_backend.repositorios;

import com.sistemas_inventario_backend.entidades.Cargo;
import org.springframework.data.jpa.repository.JpaRepository;


// Repositorio para la entidad Cargo
// No se agregan métodos personalizados porque JpaRepository
// ya proporciona todos los básicos (CRUD)
public interface CargoRepository extends JpaRepository<Cargo, Long> {
}
