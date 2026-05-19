import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DispositivoMovilRegistro } from '../../interface/Registro/DispositivoMovilRegistro.interface';
import { DispositivoMovilLlamarDatos } from '../../interface/LlamarDatos/DispositivoMovilRespuesta.interface';

@Injectable({
  providedIn: 'root'
})
export class RegistroDispositivoService {

  private apiUrlTelefono = 'http://localhost:8080/dispositivos-moviles';

  constructor(private http: HttpClient) { }

  /** REGISTRAR NUEVO DISPOSITIVO MÓVIL */
  registrarDispositivo(telefono: DispositivoMovilRegistro): Observable<DispositivoMovilLlamarDatos> {
    return this.http.post<DispositivoMovilLlamarDatos>(`${this.apiUrlTelefono}/registrar`, telefono);
  }
}
