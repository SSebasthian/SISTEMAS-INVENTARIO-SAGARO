import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImpresoraRegistro } from '../../interface/Registro/ImpresoraRegistro.interface';
import { ImpresoraLlamarDatos } from '../../interface/LlamarDatos/ImpresoraRespuesta.interface';


@Injectable({
  providedIn: 'root'
})
export class ImpresoraService {

  private apiUrlImpresora = 'http://192.168.100.4:8080/impresora';

  constructor(private http: HttpClient) { }

  /** REGISTRAR NUEVA IMPRESORA */
  registrarImpresora(impresora: ImpresoraRegistro): Observable<ImpresoraLlamarDatos> {
    return this.http.post<ImpresoraLlamarDatos>(`${this.apiUrlImpresora}/registrar`, impresora);
  }


  /** EDITAR IMPRESORA */
  editarImpresora(serial: string, impresora: ImpresoraRegistro): Observable<ImpresoraLlamarDatos> {
    return this.http.put<ImpresoraLlamarDatos>(`${this.apiUrlImpresora}/editar/${serial}`, impresora);
  }

  /** OBTENER IMPRESORA POR SERIAL */
  obtenerImpresora(serial: string): Observable<ImpresoraLlamarDatos> {
    return this.http.get<ImpresoraLlamarDatos>(`${this.apiUrlImpresora}/${serial}`);
  }

  /** BUSCAR IMPRESORAS POR TERMINO */
  buscarImpresoras(termino: string): Observable<ImpresoraLlamarDatos[]> {
    return this.http.get<ImpresoraLlamarDatos[]>(`${this.apiUrlImpresora}/buscar?termino=${termino}`);
  }

  /** LISTAR TODAS LAS IMPRESORAS */
  listarImpresoras(): Observable<ImpresoraLlamarDatos[]> {
    return this.http.get<ImpresoraLlamarDatos[]>(`${this.apiUrlImpresora}/listar`);
  }
}
