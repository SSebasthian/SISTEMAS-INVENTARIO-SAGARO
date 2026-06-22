import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RegistroBackupInformacionService {

  private apiUrl = 'http://192.168.100.4:8080/backup-informacion';

  constructor(private http: HttpClient) {}

  guardar(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  actualizar(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  desactivar(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/desactivar`, {});
  }
}
