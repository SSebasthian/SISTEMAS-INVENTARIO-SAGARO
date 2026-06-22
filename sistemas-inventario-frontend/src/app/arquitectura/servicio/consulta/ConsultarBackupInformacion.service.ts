import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultarBackupInformacionService {

  private apiUrl = 'http://192.168.100.4:8080/backup-informacion';

  constructor(private http: HttpClient) { }

  listarPorBackup(backupCodigo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/por-backup/${backupCodigo}`);
  }

  listarActivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activos`);
  }
}
