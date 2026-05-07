import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmpleadoRegistro } from '../../interface/Registro/EmpleadoRegistro.interface';
import { EmpleadoLlamarDatos } from '../../interface/LlamarDatos/EmpleadoRespuesta.interface';
import { AreaLlamarDatos } from '../../interface/LlamarDatos/AreaRespuesta.interface';
import { CargoLlamarDatos } from '../../interface/LlamarDatos/CargoRespuesta.interface';



@Injectable({
  providedIn: 'root'
})
export class RegistroEmpleadoService {

  private apiUrlRegistroEmpleado = 'http://localhost:8080/registrar/empleado';

  constructor(private http: HttpClient) { }

  getAreas(): Observable<AreaLlamarDatos[]> {
    return this.http.get<AreaLlamarDatos[]>(`${this.apiUrlRegistroEmpleado}/areas`);
  }

  getCargosPorArea(areaCodigo: number): Observable<CargoLlamarDatos[]> {
    return this.http.get<CargoLlamarDatos[]>(`${this.apiUrlRegistroEmpleado}/areas/${areaCodigo}/cargos`);
  }

  registrarEmpleado(empleado: EmpleadoRegistro): Observable<EmpleadoLlamarDatos> {
    return this.http.post<EmpleadoLlamarDatos>(`${this.apiUrlRegistroEmpleado}/agregar`, empleado);
  }

}
