import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AsignacionPorEmpleado } from '../../interface/LlamarDatos/AsignacionPorEmpleado.interface';
import { AreaLlamarDatos } from './../../interface/LlamarDatos/AreaRespuesta.interface';


@Injectable({ providedIn: 'root' })
export class ConsultarAsignacionesService {

  private apiUrlConsultarAsignaciones = 'http://192.168.100.4:8080/asignaciones';
  private apiUrlEmpleado = 'http://192.168.100.4:8080/registrar/empleado';
  private apiUrlBase = 'http://192.168.100.4:8080';

  constructor(private http: HttpClient) { }

  obtenerAsignacionActual(serial: string): Observable<any> {
    return this.http.get(`${this.apiUrlConsultarAsignaciones}/${serial}/actual`);
  }

  obtenerAsignacionesPorEmpleado(cedula: string): Observable<AsignacionPorEmpleado[]> {
    return this.http.get<AsignacionPorEmpleado[]>(`${this.apiUrlConsultarAsignaciones}/empleado/${cedula}/detalle`);
  }

  listarAreas(): Observable<AreaLlamarDatos[]> {
    return this.http.get<AreaLlamarDatos[]>(`${this.apiUrlEmpleado}/areas`);
  }

  // Metodo para obtener el detalle activo con DTO
  obtenerDetalleActivoDTO(serial: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlBase}/equipos-detalle/serial/${serial}/activo/dto`);
  }

  // Agrega este metodo
  obtenerClavesEquipo(serial: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrlBase}/equipos-detalle/serial/${serial}/claves`);
  }

  obtenerSoftwarePorSerial(serial: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlBase}/equipos-software/serial/${serial}/dto`);
  }

  desactivarSoftwareEquipo(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrlBase}/equipos-software/${id}/desactivar`, {});
  }


  desactivarSoftwareBackup(serial: string): Observable<any> {
    return this.http.patch(`${this.apiUrlBase}/equipos-software/serial/${serial}/desactivar-backups`, {});
  }

}
