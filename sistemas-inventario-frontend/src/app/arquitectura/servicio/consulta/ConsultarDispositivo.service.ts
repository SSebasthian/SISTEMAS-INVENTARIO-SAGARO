import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DispositivoMovilLlamarDatos } from '../../interface/LlamarDatos/DispositivoMovil.interface';

@Injectable({
  providedIn: 'root'
})
export class ConsultarDispositivoService {

  private apiUrlConsultarDispositivo = 'http://192.168.100.4:8080/dispositivos-moviles';

  constructor(private http: HttpClient) { }

  /** Listar todos los dispositivos móviles */
  listarDispositivos(): Observable<DispositivoMovilLlamarDatos[]> {
    return this.http.get<DispositivoMovilLlamarDatos[]>(`${this.apiUrlConsultarDispositivo}/listar`);
  }

  /** Obtener dispositivo por serial */
  obtenerDispositivo(serial: string): Observable<DispositivoMovilLlamarDatos> {
    return this.http.get<DispositivoMovilLlamarDatos>(`${this.apiUrlConsultarDispositivo}/${serial}`);
  }

  /** Buscar dispositivos por término (serial, marca, modelo, IMEI, factura) */
  buscarDispositivos(termino: string): Observable<DispositivoMovilLlamarDatos[]> {
    return this.http.get<DispositivoMovilLlamarDatos[]>(`${this.apiUrlConsultarDispositivo}/buscar?termino=${termino}`);
  }

  // METODO - lista dispositivos CON asignacion
  listarDispositivosConAsignacion(): Observable<DispositivoMovilLlamarDatos[]> {
    return this.http.get<DispositivoMovilLlamarDatos[]>(`${this.apiUrlConsultarDispositivo}/listar-con-asignacion`);
  }
}