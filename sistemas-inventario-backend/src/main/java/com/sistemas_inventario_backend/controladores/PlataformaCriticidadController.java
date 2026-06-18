package com.sistemas_inventario_backend.controladores;
import com.sistemas_inventario_backend.entidades.PlataformaCriticidad;
import com.sistemas_inventario_backend.servicios.PlataformaCriticidadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/criticidad")
@RequiredArgsConstructor
public class PlataformaCriticidadController {

    private final PlataformaCriticidadService service;

    @GetMapping("/activos")
    public List<PlataformaCriticidad> listarActivos() {
        return service.listarActivos();
    }

}
