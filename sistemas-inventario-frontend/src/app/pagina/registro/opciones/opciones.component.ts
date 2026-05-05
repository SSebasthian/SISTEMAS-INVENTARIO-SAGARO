import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { OpcEmpleadoComponent } from '../opc-empleado/opc-empleado.component';
import { OpcEquipoComponent } from '../opc-equipo/opc-equipo.component';
import { OpcTelefonoComponent } from '../opc-telefono/opc-telefono.component';
import { OpcTabletComponent } from '../opc-tablet/opc-tablet.component';
import { OpcImpresoraComponent } from '../opc-impresora/opc-impresora.component';


@Component({
  selector: 'app-opciones',
  imports: [MatIconModule, CommonModule, OpcEmpleadoComponent, OpcEquipoComponent, OpcTelefonoComponent, OpcTabletComponent, OpcImpresoraComponent],
  templateUrl: './opciones.component.html',
  styleUrl: './opciones.component.css'
})
export class OpcionesComponent {

  componenteActivo: string = '';


  // Método para alternar la visibilidad del componente de registro
  mostrarComponenteRegistroEmpleado() {
    this.componenteActivo = this.componenteActivo === 'usuario' ? '' : 'usuario';
  }


  // Método para alternar la visibilidad del componente de registro
  mostrarComponenteRegistroEquipo() {
    this.componenteActivo = this.componenteActivo === 'equipo' ? '' : 'equipo';
  }


  // Método para alternar la visibilidad del componente de registro
  mostrarComponenteRegistroCelular() {
    this.componenteActivo = this.componenteActivo === 'celular' ? '' : 'celular';
  }


  // Método para alternar la visibilidad del componente de registro
  mostrarComponenteRegistroTablet() {
    this.componenteActivo = this.componenteActivo === 'tablet' ? '' : 'tablet';
  }


  // Método para alternar la visibilidad del componente de registro
  mostrarComponenteRegistroImpresora() {
    this.componenteActivo = this.componenteActivo === 'impresora' ? '' : 'impresora';
  }


}
