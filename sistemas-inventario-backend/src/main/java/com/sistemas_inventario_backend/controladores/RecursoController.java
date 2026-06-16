package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.Recurso;
import com.sistemas_inventario_backend.servicios.RecursoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/recurso")
@RequiredArgsConstructor
public class RecursoController {

    private final RecursoService service;

    @GetMapping("/activos")
    public List<Recurso> listarActivos() {
        return service.listarActivos();
    }
}
