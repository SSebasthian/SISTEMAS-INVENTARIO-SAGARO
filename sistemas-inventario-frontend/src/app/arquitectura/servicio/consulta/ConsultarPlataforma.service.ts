import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultarPlataformaService {

  private apiUrl = 'http://192.168.100.4:8080/plataformas';

  constructor(private http: HttpClient) {}

  listarPorTipo(recursoTipoCodigo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/por-tipo/${recursoTipoCodigo}`);
  }
}
