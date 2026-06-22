import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultarBackupService {

  private apiUrl = 'http://192.168.100.4:8080/backup';

  constructor(private http: HttpClient) { }

  listarActivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activos`);
  }
}
