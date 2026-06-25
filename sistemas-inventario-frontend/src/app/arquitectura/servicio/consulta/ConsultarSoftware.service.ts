import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultarSoftwareService {

  private apiUrl = 'http://192.168.100.4:8080/software';


  constructor(private http: HttpClient) { }

  listarPorTipo(tipoCodigo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/por-tipo/${tipoCodigo}`);
  }


  listarActivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activos`);
  }



}
