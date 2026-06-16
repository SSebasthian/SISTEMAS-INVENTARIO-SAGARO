import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OpcEmpleadoComponent } from '../opc-empleado/opc-empleado.component';
import { OpcEquipoComponent } from '../opc-equipo/opc-equipo.component';
import { OpcDispositivoComponent } from '../opc-dispositivo/opc-dispositivo.component';
import { OpcImpresoraComponent } from '../opc-impresora/opc-impresora.component';
import { OpcRecursoComponent } from '../opc-recurso/opc-recurso.component';
import { Location } from '@angular/common'; // Importar Location
import { PermisoModuloService } from '../../../arquitectura/servicio/autenticacion/permiso-modulo.service';


@Component({
  selector: 'app-opciones',
  imports: [MatIconModule, CommonModule, OpcEmpleadoComponent, OpcEquipoComponent, OpcDispositivoComponent, OpcImpresoraComponent, OpcRecursoComponent],
  templateUrl: './opciones.component.html',
  styleUrl: './opciones.component.css'
})
export class OpcionesComponent {

  componenteActivo: string = '';

  // Propiedad computada para el permiso
  get puedeCrearRegistro(): boolean {
    return this.permisoModuloService.puede('registro', 'crear');
  }

  constructor(
    private location: Location,
    private permisoModuloService: PermisoModuloService) { }

  // Método para alternar la visibilidad del componente de registro
  mostrarComponenteRegistroEmpleado() {
    if (this.componenteActivo === 'usuario') {
      this.componenteActivo = '';  // Desactiva el componente
      this.location.replaceState('/registro/opciones'); // Vuelve a la ruta base
    } else {
      this.componenteActivo = 'usuario';  // Activa el componente
      this.location.replaceState('/registro/usuario'); // Cambia la URL
    }
  }

   // Método para alternar la visibilidad del componente de registro
  mostrarComponenteRegistroRecurso() {
    if (this.componenteActivo === 'recurso') {
      this.componenteActivo = '';  // Desactiva el componente
      this.location.replaceState('/registro/opciones'); // Vuelve a la ruta base
    } else {
      this.componenteActivo = 'recurso';  // Activa el componente
      this.location.replaceState('/registro/recurso'); // Cambia la URL
    }
  }

  // Método para alternar la visibilidad del componente de registro
  mostrarComponenteRegistroEquipo() {
    if (this.componenteActivo === 'equipo') {
      this.componenteActivo = '';  // Desactiva el componente
      this.location.replaceState('/registro/opciones'); // Vuelve a la ruta base
    } else {
      this.componenteActivo = 'equipo';  // Activa el componente
      this.location.replaceState('/registro/equipo'); // Cambia la URL
    }
  }


  // Método para alternar la visibilidad del componente de registro
  mostrarComponenteRegistroDispositivo() {
    if (this.componenteActivo === 'dispositivo') {
      this.componenteActivo = '';  // Desactiva el componente
      this.location.replaceState('/registro/opciones'); // Vuelve a la ruta base
    } else {
      this.componenteActivo = 'dispositivo';  // Activa el componente
      this.location.replaceState('/registro/dispositivo'); // Cambia la URL
    }
  }


  // Método para alternar la visibilidad del componente de registro
  mostrarComponenteRegistroImpresora() {
    if (this.componenteActivo === 'impresora') {
      this.componenteActivo = '';  // Desactiva el componente
      this.location.replaceState('/registro/opciones'); // Vuelve a la ruta base
    } else {
      this.componenteActivo = 'impresora';  // Activa el componente
      this.location.replaceState('/registro/impresora'); // Cambia la URL
    }
  }


}
