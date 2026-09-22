package com.sistemas_inventario_backend.seguridad;

import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


// Esta clase se ejecuta automáticamente cuando inicia la aplicación Spring Boot
// Sirve para inicializar la base de datos por primera vez
@Component
public class IniciarBDPrimeraVez implements CommandLineRunner {

    private final JdbcTemplate jdbcTemplate;        // Permite ejecutar consultas SQL directamente
    private final PasswordEncoder passwordEncoder;  // Permite encriptar contraseñas


    // Constructor con inyección de dependencias
    public IniciarBDPrimeraVez(JdbcTemplate jdbcTemplate, PasswordEncoder passwordEncoder) {
        this.jdbcTemplate = jdbcTemplate;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional      // @Transactional asegura que todas las operaciones se ejecuten como una sola transacción
    public void run(String... args) {

        // ============================================
        // 1. INSERTAR ROLES
        // ============================================

        Integer cantidadRoles = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM rol",
                Integer.class
        );

        // Solo crea los roles si todavía no existen
        if (cantidadRoles != null && cantidadRoles == 0) {

            jdbcTemplate.update(
                    "INSERT INTO rol (id, nombre) VALUES (1, 'Administrador')"
            );

            jdbcTemplate.update(
                    "INSERT INTO rol (id, nombre) VALUES (2, 'Aprendiz')"
            );
        }


        // ============================================
        // 2. INSERTAR PERMISOS
        // ============================================

        Integer cantidadPermisos = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM permisos",
                Integer.class
        );

        // Solo crea los permisos si todavía no existen
        if (cantidadPermisos != null && cantidadPermisos == 0) {

            Object[][] permisos = {

                    {1L, "usuarios", "ver"},
                    {2L, "usuarios", "crear"},
                    {3L, "usuarios", "editar"},
                    {4L, "usuarios", "eliminar"},

                    {5L, "roles", "ver"},
                    {6L, "roles", "crear"},
                    {7L, "roles", "editar"},
                    {8L, "roles", "eliminar"},

                    {9L, "permisos", "ver"},
                    {10L, "permisos", "crear"},
                    {11L, "permisos", "editar"},
                    {12L, "permisos", "eliminar"},
                    {13L, "permisos", "asignar"},

                    {14L, "registro", "ver"},
                    {15L, "registro", "crear"},
                    {16L, "registro", "editar"}
            };


            for (Object[] p : permisos) {

                jdbcTemplate.update(
                        "INSERT INTO permisos (id, modulo, accion) VALUES (?, ?, ?)",
                        p[0],
                        p[1],
                        p[2]
                );
            }
        }


        // ============================================
        // 3. ASIGNAR PERMISOS AL ADMINISTRADOR
        // ============================================

        Integer cantidadPermisosAdmin = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM permisosxrol WHERE id_rol = 1",
                Integer.class
        );

        // Si el administrador todavía no tiene permisos,
        // se le asignan todos.
        if (cantidadPermisosAdmin != null && cantidadPermisosAdmin == 0) {

            List<Long> ids = jdbcTemplate.queryForList(
                    "SELECT id FROM permisos ORDER BY id",
                    Long.class
            );

            for (Long id : ids) {

                jdbcTemplate.update(
                        "INSERT INTO permisosxrol (id_rol, id_permiso) VALUES (1, ?)",
                        id
                );
            }
        }


        // ============================================
        // 4. ASIGNAR PERMISO AL APRENDIZ
        // ============================================

        Integer permisoAprendiz = jdbcTemplate.queryForObject(
                """
                SELECT COUNT(*)
                FROM permisosxrol
                WHERE id_rol = 2
                AND id_permiso = 14
                """,
                Integer.class
        );

        if (permisoAprendiz != null && permisoAprendiz == 0) {

            jdbcTemplate.update(
                    "INSERT INTO permisosxrol (id_rol, id_permiso) VALUES (2, 14)"
            );
        }


        // ============================================
        // 5. CREAR USUARIO ADMINISTRADOR
        // ============================================

        Integer adminExiste = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM usuarios WHERE usuario = 'admin'",
                Integer.class
        );

        // Si el usuario admin no existe, se crea
        if (adminExiste != null && adminExiste == 0) {

            // Contraseña original
            String clave = "admin";

            // Encriptar contraseña con BCrypt
            String claveEncriptada =
                    passwordEncoder.encode(clave);

            // Crear usuario administrador
            jdbcTemplate.update(
                    """
                    INSERT INTO usuarios
                    (usuario, nombre, clave, activo, rol_id)
                    VALUES ('admin', 'admin', ?, 1, 1)
                    """,
                    claveEncriptada
            );

            System.out.println(
                    "Usuario administrador creado correctamente."
            );
        }
    }
}