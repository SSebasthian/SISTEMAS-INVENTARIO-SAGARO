import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmpleadoLlamarDatos } from '../../interface/LlamarDatos/EmpleadoRespuesta.interface';
import { EmpleadoConAsignacionesRespuesta } from '../../interface/LlamarDatos/EmpleadoConAsignaciones.interface';

@Injectable({
  providedIn: 'root'
})
export class ConsultarEmpleadoService {

  private apiUrlConsultarEmpleado = 'http://192.168.100.4:8080/registrar/empleado';

  constructor(private http: HttpClient) { }


  /** Listar todos los empleados */
  listarEmpleados(): Observable<EmpleadoLlamarDatos[]> {
    return this.http.get<EmpleadoLlamarDatos[]>(`${this.apiUrlConsultarEmpleado}/listar`);
  }

   /** Obtener empleado por cédula */
  obtenerEmpleado(cedula: string): Observable<EmpleadoLlamarDatos> {
    return this.http.get<EmpleadoLlamarDatos>(`${this.apiUrlConsultarEmpleado}/${cedula}`);
  }
  
  /** Listar empleados CON asignaciones */
  listarEmpleadosConAsignaciones(): Observable<EmpleadoConAsignacionesRespuesta[]> {
    return this.http.get<EmpleadoConAsignacionesRespuesta[]>(`${this.apiUrlConsultarEmpleado}/listar-con-asignaciones`);
  }

}
