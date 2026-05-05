import { Component, OnInit, OnDestroy, Inject, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MenuComponent } from './pagina/menu/menu.component';
import { Subscription } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { AutenticadorService } from './arquitectura/servicio/autenticacion/autenticador.service';


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
  private authSubscription: Subscription = new Subscription();
  private isBrowser: boolean;

 constructor(
    private autenticadorService: AutenticadorService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit() {
    // Suscribirse al estado de autenticación
    this.authSubscription = this.autenticadorService.authState$.subscribe(
      estado => {
        this.isLoggedIn = estado;
        // Cuando la sesión se cierra, reseteamos el estado del menú minimizado
        if (!estado) {
          this.menuMinimizado = false;
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  menuMinMax() {
    this.menuMinimizado = !this.menuMinimizado; // Cambia el estado al hacer clic
  }
}
