import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroLineaTelefonoService {

  private apiUrl = 'http://192.168.100.4:8080/telefonos';

  constructor(private http: HttpClient) { }

  registrar(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  editar(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  desactivar(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/desactivar`, {});
  }

  buscar(termino: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/buscar?termino=${termino}`);
  }

  listarActivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activos`);
  }

  listarTodos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/todos`);
  }
}
