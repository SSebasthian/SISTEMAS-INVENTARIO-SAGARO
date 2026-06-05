import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AutenticadorService } from '../../arquitectura/servicio/autenticacion/autenticador.service';
import { NotificacionSnackbarService } from '../../arquitectura/servicio/notificacion/notificacion-snackbar.service';
import { PerfilService } from '../../arquitectura/servicio/autenticacion/perfil.service';


@Component({
  selector: 'app-menu',
  imports: [MatIconModule, RouterLink, RouterLinkActive, MatTooltipModule, CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent {

  Usuario: any;
  nombreUsuario: string = '';
  mostrarModal: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private autenticadorService: AutenticadorService,
    private notificacionSnackbarService: NotificacionSnackbarService,
    private perfilService: PerfilService
  ) { }

  ngOnInit() {
    this.cargarDatosUsuario();

    // Suscribirse a cambios en el perfil
    this.subscriptions.add(
      this.perfilService.perfilActualizado$.subscribe(() => {
        this.cargarDatosUsuario();
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  private cargarDatosUsuario(): void {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (!usuarioGuardado) {
      this.router.navigate(['/autenticacion/acceso']);
      return;
    }

    try {
      const usuario = JSON.parse(usuarioGuardado);
      this.nombreUsuario = usuario.nombre || usuario.usuario || 'Usuario';
    } catch (error) {
      console.error('Error al parsear usuario:', error);
      this.nombreUsuario = 'Usuario';
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
