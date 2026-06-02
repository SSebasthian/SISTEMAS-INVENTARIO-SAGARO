import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DispositivoMovilRegistro } from '../../interface/Registro/DispositivoMovilRegistro.interface';
import { DispositivoMovilLlamarDatos } from '../../interface/LlamarDatos/DispositivoMovilRespuesta.interface';

@Injectable({
  providedIn: 'root'
})
export class RegistroDispositivoService {

  private apiUrlTelefono = 'http://192.168.100.4:8080/dispositivos-moviles';

  constructor(private http: HttpClient) { }

  /** REGISTRAR NUEVO DISPOSITIVO MÓVIL */
  registrarDispositivo(telefono: DispositivoMovilRegistro): Observable<DispositivoMovilLlamarDatos> {
    return this.http.post<DispositivoMovilLlamarDatos>(`${this.apiUrlTelefono}/registrar`, telefono);
  }

  /** EDITAR DISPOSITIVO MÓVIL */
  editarDispositivo(serial: string, dispositivo: DispositivoMovilRegistro): Observable<DispositivoMovilLlamarDatos> {
    return this.http.put<DispositivoMovilLlamarDatos>(`${this.apiUrlTelefono}/editar/${serial}`, dispositivo);
  }

  /** OBTENER DISPOSITIVO POR SERIAL */
  obtenerDispositivo(serial: string): Observable<DispositivoMovilLlamarDatos> {
    return this.http.get<DispositivoMovilLlamarDatos>(`${this.apiUrlTelefono}/${serial}`);
  }

  /** BUSCAR DISPOSITIVOS POR TERMINO (serial, marca, modelo, IMEI) */
  buscarDispositivos(termino: string): Observable<DispositivoMovilLlamarDatos[]> {
    return this.http.get<DispositivoMovilLlamarDatos[]>(`${this.apiUrlTelefono}/buscar?termino=${termino}`);
  }

  /** LISTAR TODOS LOS DISPOSITIVOS */
  listarDispositivos(): Observable<DispositivoMovilLlamarDatos[]> {
    return this.http.get<DispositivoMovilLlamarDatos[]>(`${this.apiUrlTelefono}/listar`);
  }
}
