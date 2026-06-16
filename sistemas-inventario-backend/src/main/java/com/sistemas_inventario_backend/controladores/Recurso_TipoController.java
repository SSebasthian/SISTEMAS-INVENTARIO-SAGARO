package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.Recurso_Tipo;
import com.sistemas_inventario_backend.servicios.Recurso_TipoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tipos-recurso")
@RequiredArgsConstructor
public class Recurso_TipoController {

    private final Recurso_TipoService service;

    @GetMapping("/activos")
    public List<Recurso_Tipo> listarActivos() {
        return service.listarActivos();
    }

    @GetMapping("/recurso/{codigo}")
    public List<Recurso_Tipo> listarPorRecurso(
            @PathVariable Long codigo) {

        return service.listarPorRecurso(codigo);
    }
}
