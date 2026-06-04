import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImpresoraLlamarDatos } from '../../interface/LlamarDatos/ImpresoraRespuesta.interface';


@Injectable({
  providedIn: 'root'
})
export class ConsultarImpresoraService {

  private apiUrlConsultarImpresora = 'http://192.168.100.4:8080/impresora';

  constructor(private http: HttpClient) { }

  /** Listar todas las impresoras */
  listarImpresoras(): Observable<ImpresoraLlamarDatos[]> {
    return this.http.get<ImpresoraLlamarDatos[]>(`${this.apiUrlConsultarImpresora}/listar`);
  }

  /** Obtener impresora por serial */
  obtenerImpresora(serial: string): Observable<ImpresoraLlamarDatos> {
    return this.http.get<ImpresoraLlamarDatos>(`${this.apiUrlConsultarImpresora}/${serial}`);
  }

  /** Buscar impresoras por término (serial, marca, modelo, plaqueta, tipoRecarga, factura) */
  buscarImpresoras(termino: string): Observable<ImpresoraLlamarDatos[]> {
    return this.http.get<ImpresoraLlamarDatos[]>(`${this.apiUrlConsultarImpresora}/buscar?termino=${termino}`);
  }

  // METODO - lista impresoras CON asignacion
  listarImpresorasConAsignacion(): Observable<ImpresoraLlamarDatos[]> {
    return this.http.get<ImpresoraLlamarDatos[]>(`${this.apiUrlConsultarImpresora}/listar-con-asignacion`);
  }
}

