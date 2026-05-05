import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OpcEmpleadoComponent } from '../opc-empleado/opc-empleado.component';
import { OpcEquipoComponent } from '../opc-equipo/opc-equipo.component';
import { OpcTelefonoComponent } from '../opc-telefono/opc-telefono.component';
import { OpcTabletComponent } from '../opc-tablet/opc-tablet.component';
import { OpcImpresoraComponent } from '../opc-impresora/opc-impresora.component';
import { Location } from '@angular/common'; // Importar Location


@Component({
  selector: 'app-opciones',
  imports: [MatIconModule, CommonModule, OpcEmpleadoComponent, OpcEquipoComponent, OpcTelefonoComponent, OpcTabletComponent, OpcImpresoraComponent],
  templateUrl: './opciones.component.html',
  styleUrl: './opciones.component.css'
})
export class OpcionesComponent {

  componenteActivo: string = '';

  constructor(private location: Location) { }

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
  mostrarComponenteRegistroCelular() {
    if (this.componenteActivo === 'celular') {
      this.componenteActivo = '';  // Desactiva el componente
      this.location.replaceState('/registro/opciones'); // Vuelve a la ruta base
    } else {
      this.componenteActivo = 'celular';  // Activa el componente
      this.location.replaceState('/registro/celular'); // Cambia la URL
    }
  }


  // Método para alternar la visibilidad del componente de registro
  mostrarComponenteRegistroTablet() {
    if (this.componenteActivo === 'tablet') {
      this.componenteActivo = '';  // Desactiva el componente
      this.location.replaceState('/registro/opciones'); // Vuelve a la ruta base
    } else {
      this.componenteActivo = 'tablet';  // Activa el componente
      this.location.replaceState('/registro/tablet'); // Cambia la URL
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
