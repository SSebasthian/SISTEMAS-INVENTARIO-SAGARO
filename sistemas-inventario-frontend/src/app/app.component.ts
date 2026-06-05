import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MenuComponent } from './pagina/menu/menu.component';
import { Subscription } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AutenticadorService } from './arquitectura/servicio/autenticacion/autenticador.service';
import { PerfilService } from './arquitectura/servicio/autenticacion/perfil.service';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatIconModule, MenuComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'sistemas-inventario-frontend';
  menuMinimizado = false; // Estado inicial del menú
  isLoggedIn = false;
  rolUsuario: string = '';
  private authSubscription: Subscription = new Subscription();
  private perfilSubscription: Subscription = new Subscription();
  private isBrowser: boolean;

  constructor(
    private autenticadorService: AutenticadorService,
    private perfilService: PerfilService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Cargar datos del usuario inicialmente
    this.cargarDatosUsuario();

    // Suscribirse al estado de autenticación
    this.authSubscription = this.autenticadorService.authState$.subscribe(
      estado => {
        this.isLoggedIn = estado;
        if (estado) {
          this.cargarDatosUsuario();
        } else {
          this.rolUsuario = '';
          this.menuMinimizado = false;
        }
      }
    );

    // Suscribirse a cambios en el perfil (cuando se actualiza el nombre)
    this.perfilSubscription = this.perfilService.perfilActualizado$.subscribe(() => {
      this.cargarDatosUsuario();
    });
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  private cargarDatosUsuario(): void {
    if (!this.isBrowser) return;

    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        this.rolUsuario = usuario.rol || '';
      } catch (error) {
        console.error('Error al parsear usuario:', error);
        this.rolUsuario = '';
      }
    }
  }

  menuMinMax() {
    this.menuMinimizado = !this.menuMinimizado; // Cambia el estado al hacer clic
  }
}
