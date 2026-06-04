import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

@Injectable({ providedIn: 'root' })
export class ConsultarAsignacionesService {

  private apiUrlConsultarAsignaciones = 'http://192.168.100.4:8080/asignaciones';
  
  constructor(private http: HttpClient) {}

  obtenerAsignacionActual(serial: string): Observable<any> {
    return this.http.get(`${this.apiUrlConsultarAsignaciones}/${serial}/actual`);
  }
}
