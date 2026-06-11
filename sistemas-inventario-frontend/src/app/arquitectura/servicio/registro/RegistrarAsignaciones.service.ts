import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistrarAsignacionesService {

  private apiUrlConsultarAsignaciones = 'http://192.168.100.4:8080/asignaciones';

  constructor(private http: HttpClient) { }

  // ========== METODO: ASIGNAR ==========
  asignar(data: any): Observable<any> {
    return this.http.post(`${this.apiUrlConsultarAsignaciones}`, data);
  }

  // ========== METODO: DEVOLVER ==========
  devolver(asignacionId: number, data: { observaciones?: string; fechaDevolucion?: string }): Observable<any> {
    return this.http.put(`${this.apiUrlConsultarAsignaciones}/${asignacionId}/devolver`, data);
  }

}
