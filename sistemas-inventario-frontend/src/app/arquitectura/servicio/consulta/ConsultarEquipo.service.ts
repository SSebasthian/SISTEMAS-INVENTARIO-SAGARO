import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EquipoDeComputoLlamarDatos } from '../../interface/LlamarDatos/EquipoDeComputoRespuesta.interface';


@Injectable({
  providedIn: 'root'
})
export class ConsultarEquipoService {

  private apiUrlConsultarEquipo = 'http://localhost:8080/equipos-computo';

  constructor(private http: HttpClient) { }

  listarEquipos(): Observable<EquipoDeComputoLlamarDatos[]> {
    return this.http.get<EquipoDeComputoLlamarDatos[]>(`${this.apiUrlConsultarEquipo}/listar`);
  }

  obtenerEquipo(serial: string): Observable<EquipoDeComputoLlamarDatos> {
    return this.http.get<EquipoDeComputoLlamarDatos>(`${this.apiUrlConsultarEquipo}/${serial}`);
  }

  buscarEquipos(termino: string): Observable<EquipoDeComputoLlamarDatos[]> {
    return this.http.get<EquipoDeComputoLlamarDatos[]>(`${this.apiUrlConsultarEquipo}/buscar?termino=${termino}`);
  }
}
