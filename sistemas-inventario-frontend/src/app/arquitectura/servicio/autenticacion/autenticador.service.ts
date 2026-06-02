import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, BehaviorSubject } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { inicioSesionSolicitud } from '../../interface/Autenticacion/inicioSesionSolicitud.interface';
import { inicioSesionRespuesta } from '../../interface/Autenticacion/inicioSesionRespuesta.interface';
import { PerfilService } from './perfil.service';



@Injectable({
  providedIn: 'root'
})
export class AutenticadorService {

  // URL base del backend donde están los endpoints de usuarios

  private apiUrl = 'http://192.168.100.4:8080/';
  
  private perfilActualizado = new BehaviorSubject<boolean>(false);
  perfilActualizado$ = this.perfilActualizado.asObservable();
  private isBrowser: boolean;

  // Subject para el estado de autenticación
  private authState = new BehaviorSubject<boolean>(this.estaLogueado());
  authState$ = this.authState.asObservable();

  constructor(
    private http: HttpClient,
    private perfilService: PerfilService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    // Solo verificar el estado inicial si estamos en el navegador
    if (this.isBrowser) {
      this.authState.next(this.estaLogueado());
    }
  }


  // ============================================
  // AUTENTICACION
  // ============================================


  // --------------------
  // INICIAR SESIÓN -----
  // --------------------
  inicioSesion(data: inicioSesionSolicitud): Observable<inicioSesionRespuesta> {
    return this.http.post<inicioSesionRespuesta>(`${this.apiUrl}usuarios/inicio-sesion`, data);
  }


  // Método para establecer la sesión manualmente (después del delay)
  establecerSesion(respuesta: inicioSesionRespuesta): void {
    if (this.isBrowser) {
      localStorage.setItem('usuario', JSON.stringify(respuesta));
      this.authState.next(true);
    }
  }
  
  // ----------------
  // CERRAR PERFIL---
  // ----------------
  cerrarSesion() {
    // Limpiar permisos antes de cerrar sesión
    this.perfilService.limpiarPermisosLocalStorage();
    // Elimina el usuario del localStorage para cerrar sesión
    localStorage.removeItem('usuario');
    // Actualizar el estado de autenticación
    this.authState.next(false);
  }



  // ----------------------------------
  // VERIFICAR SI HAY SESION ACTIVA ---
  // ----------------------------------
  estaLogueado(): boolean {
    if (this.isBrowser) {
      return !!localStorage.getItem('usuario');
    }
    return false;
  }

  // Método para obtener el usuario actual (opcional)
  getUsuarioActual(): any {
    if (this.isBrowser) {
      const usuario = localStorage.getItem('usuario');
      return usuario ? JSON.parse(usuario) : null;
    }
    return null;
  }

}