import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImpresoraRegistro } from '../../interface/Registro/ImpresoraRegistro.interface';
import { ImpresoraLlamarDatos } from '../../interface/LlamarDatos/ImpresoraRespuesta.interface';


@Injectable({
  providedIn: 'root'
})
export class ImpresoraService {

  private apiUrlImpresora = 'http://localhost:8080/impresora';

  constructor(private http: HttpClient) { }

  /** REGISTRAR NUEVA IMPRESORA */
  registrarImpresora(impresora: ImpresoraRegistro): Observable<ImpresoraLlamarDatos> {
    return this.http.post<ImpresoraLlamarDatos>(`${this.apiUrlImpresora}/registrar`, impresora);
  }

}
  