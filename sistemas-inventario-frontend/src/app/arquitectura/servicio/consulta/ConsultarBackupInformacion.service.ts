import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  buscarPorCriterios(
    nombre: string,
    frecuencia: string,
    ubicacion: string | null,
    ubicacionExcluida: string | null,
    dia: number | null,
    hora: string | null,
    backupCodigo: number,
    tipo: string                    // tipo ("EQUIPO" o "CORREO")
  ): Observable<any> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('frecuencia', frecuencia)
      .set('ubicacion', ubicacion || '')
      .set('ubicacionExcluida', ubicacionExcluida || '')
      .set('dia', dia !== null && dia !== undefined ? dia.toString() : '')
      .set('hora', hora || '')
      .set('backupCodigo', backupCodigo.toString())
      .set('tipo', tipo);

    return this.http.get<any>(`${this.apiUrl}/buscar`, { params });
  }

  listarPorBackupYTipo(backupCodigo: number, tipo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/por-backup/${backupCodigo}/tipo/${tipo}`);
  }

  obtenerPorCodigo(codigo: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/backup-informacion/${codigo}`);
  }
}
