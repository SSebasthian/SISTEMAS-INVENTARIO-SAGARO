import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EquipoComputoRegistro } from '../../interface/Registro/EquipoComputoRegistro.interface';
import { EquipoDeComputoLlamarDatos } from '../../interface/LlamarDatos/EquipoDeComputoRespuesta.interface';


@Injectable({
  providedIn: 'root'
})
export class RegistroEquipoService {

  private apiUrl = 'http://localhost:8080/equipos-computo';

  constructor(private http: HttpClient) { }

  /** REGISTRAR NUEVO EQUIPO */
  registrarEquipo(equipo: EquipoComputoRegistro): Observable<EquipoDeComputoLlamarDatos> {
    return this.http.post<EquipoDeComputoLlamarDatos>(`${this.apiUrl}/registrar`, equipo);
  }

}
