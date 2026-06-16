import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-recursos',
  imports: [MatIconModule],
  templateUrl: './recursos.component.html',
  styleUrl: './recursos.component.css'
})
export class RecursosComponent {

  detalleVisible: string | null = null;

toggleDetalle(tipo: string): void {
    this.detalleVisible = this.detalleVisible === tipo ? null : tipo;
}

obtenerTotalCorreos(): number { return 0; }      
obtenerCorreosActivos(): number { return 0; }
obtenerCorreosDisponibles(): number { return 0; }
obtenerCorreosAsignados(): number { return 0; }

obtenerTotalTelefonos(): number { return 0; }
obtenerTelefonosActivos(): number { return 0; }
obtenerTelefonosInactivos(): number { return 0; }
obtenerTelefonosAsignados(): number { return 0; }

obtenerTotalCuentas(): number { return 0; }
obtenerCuentasActivas(): number { return 0; }
obtenerCuentasInactivas(): number { return 0; }
obtenerCuentasAsignadas(): number { return 0; }

obtenerTotalAsignaciones(): number { return 0; }
obtenerAsignacionesCorreo(): number { return 0; }
obtenerAsignacionesTelefono(): number { return 0; }
obtenerAsignacionesCuenta(): number { return 0; }
}
