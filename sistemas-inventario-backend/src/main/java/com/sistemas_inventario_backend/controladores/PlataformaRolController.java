package com.sistemas_inventario_backend.controladores;

import com.sistemas_inventario_backend.entidades.PlataformaRol;
import com.sistemas_inventario_backend.servicios.PlataformaRolService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/plataforma-roles")
@RequiredArgsConstructor
public class PlataformaRolController {

    private final PlataformaRolService service;

    @GetMapping("/plataforma/{codigo}")
    public List<PlataformaRol> listarPorPlataforma(@PathVariable Long codigo) {
        return service.listarPorPlataforma(codigo);
    }


}
