import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsignacionPorEmpleado } from '../../interface/LlamarDatos/AsignacionPorEmpleado.interface';

@Injectable({
  providedIn: 'root'
})

@Injectable({ providedIn: 'root' })
export class ConsultarAsignacionesService {

  private apiUrlConsultarAsignaciones = 'http://192.168.100.4:8080/asignaciones';

  constructor(private http: HttpClient) { }

  obtenerAsignacionActual(serial: string): Observable<any> {
    return this.http.get(`${this.apiUrlConsultarAsignaciones}/${serial}/actual`);
  }

  obtenerAsignacionesPorEmpleado(cedula: string): Observable<AsignacionPorEmpleado[]> {
    return this.http.get<AsignacionPorEmpleado[]>(`${this.apiUrlConsultarAsignaciones}/empleado/${cedula}/detalle`);
  }
}
  