import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultarPlataformaRolService {

  private apiUrl = 'http://192.168.100.4:8080/plataforma-roles';

  constructor(private http: HttpClient) { }

  listarPorPlataforma(plataformaCodigo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/plataforma/${plataformaCodigo}`);
  }
}
