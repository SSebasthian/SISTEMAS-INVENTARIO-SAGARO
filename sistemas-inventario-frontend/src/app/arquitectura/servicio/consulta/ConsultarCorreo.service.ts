import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultarCorreoService {

  private apiUrl = 'http://192.168.100.4:8080/correos';

  constructor(private http: HttpClient) { }

  // Listar todos los correos (activos e inactivos)
  listarTodos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todos`);
  }

  // Listar solo correos activos
  listarActivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activos`);
  }

  // Buscar correos por término en la dirección
  buscar(termino: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar`, { params: { termino } });
  }

  // Obtener un correo por ID
  obtenerPorId(codigo: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${codigo}`);
  }
}
