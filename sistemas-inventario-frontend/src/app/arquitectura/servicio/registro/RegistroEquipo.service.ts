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

  /** EDITAR EQUIPO EXISTENTE */
  editarEquipo(serial: string, equipo: EquipoComputoRegistro): Observable<EquipoDeComputoLlamarDatos> {
    return this.http.put<EquipoDeComputoLlamarDatos>(`${this.apiUrl}/editar/${serial}`, equipo);
  }

  /** OBTENER EQUIPO POR SERIAL */
  obtenerEquipo(serial: string): Observable<EquipoDeComputoLlamarDatos> {
    return this.http.get<EquipoDeComputoLlamarDatos>(`${this.apiUrl}/${serial}`);
  }

  /** BUSCAR EQUIPOS POR SERIAL, MARCA O MODELO */
  buscarEquipos(termino: string): Observable<EquipoDeComputoLlamarDatos[]> {
    return this.http.get<EquipoDeComputoLlamarDatos[]>(`${this.apiUrl}/buscar?termino=${termino}`);
  }

  /** LISTAR TODOS LOS EQUIPOS */
  listarEquipos(): Observable<EquipoDeComputoLlamarDatos[]> {
    return this.http.get<EquipoDeComputoLlamarDatos[]>(`${this.apiUrl}/listar`);
  }

}
