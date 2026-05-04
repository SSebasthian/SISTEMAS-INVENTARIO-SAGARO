import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { AutenticadorService } from '../../arquitectura/servicio/autenticacion/autenticador.service';
import { NotificacionSnackbarService } from '../../arquitectura/servicio/notificacion/notificacion-snackbar.service';


@Component({
  selector: 'app-menu',
  imports: [MatIconModule, RouterLink, RouterLinkActive, MatTooltipModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  Usuario: any;
  mostrarModal: boolean = false;

  constructor(
    private router: Router,
    private autenticadorService: AutenticadorService,
    private notificacionSnackbarService: NotificacionSnackbarService
  ) { }

  ngOnInit() {
    // 1. Verificar sesión
    const usuario = localStorage.getItem('usuario');
    if (!usuario) {
      this.router.navigate(['/autenticacion/acceso']);
      return;
    }
  }


  confirmarCierreSesion(): void {
    this.mostrarModal = true;
  }

  cancelarCierreSesion(): void {
    this.mostrarModal = false;
  }

  cerrarSesion() {
    // Oculta el modal si estaba abierto
    this.mostrarModal = false;
    // Llamamos al método del servicio para cerrar sesión
    this.autenticadorService.cerrarSesion();
    // Mostrar notificación de éxito
    this.notificacionSnackbarService.success('Sesión cerrada', 'Has cerrado sesión correctamente');
    // limpiar consola o estado
    this.Usuario = null;
    // Redirigir a la página de inicio de sesión
    this.router.navigate(['/autenticacion/acceso']);
  }
}
