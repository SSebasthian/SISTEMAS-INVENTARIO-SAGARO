import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrarAsignacionesService {

  private apiUrlConsultarAsignaciones = 'http://192.168.100.4:8080';

  constructor(private http: HttpClient) { }

  // ========== METODO: ASIGNAR ==========
  asignar(data: any): Observable<any> {
    return this.http.post(`${this.apiUrlConsultarAsignaciones}/asignaciones`, data);
  }

  // ========== METODO: DEVOLVER ==========
  devolver(asignacionId: number, data: { observaciones?: string; fechaDevolucion?: string }): Observable<any> {
    return this.http.put(`${this.apiUrlConsultarAsignaciones}/asignaciones/${asignacionId}/devolver`, data);
  }



  //REGISTRO RECURSO

  asignarRecurso(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrlConsultarAsignaciones}/asignaciones/recursos`, payload);
  }


  // Listar recursos activos de un empleado
  listarRecursosPorEmpleado(cedula: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlConsultarAsignaciones}/asignaciones/recursos/empleado/${cedula}`);
  }

  // Devolver recurso
  devolverRecurso(id: number, payload: { fechaDevolucion?: string, observaciones?: string }): Observable<any> {
    return this.http.put(`${this.apiUrlConsultarAsignaciones}/asignaciones/recursos/${id}/devolver`, payload);
  }




  // ========== IPS ==========


  obtenerTodasLasIps(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlConsultarAsignaciones}/ips`);
  }


  obtenerIpsDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrlConsultarAsignaciones}/ips/disponibles`);
  }

  ocuparIp(ip: number, catalogoCodigo: number, tipoCodigo: number): Observable<any> {
    return this.http.post(`${this.apiUrlConsultarAsignaciones}/ips/ocupar`, {
      ip,
      catalogoCodigo,
      tipoCodigo
    });
  }

  liberarIp(ip: number): Observable<any> {
    return this.http.post(`${this.apiUrlConsultarAsignaciones}/ips/liberar`, { ip });
  }

  inicializarIps(): Observable<any> {
    return this.http.post(`${this.apiUrlConsultarAsignaciones}/ips/inicializar`, {});
  }

}
