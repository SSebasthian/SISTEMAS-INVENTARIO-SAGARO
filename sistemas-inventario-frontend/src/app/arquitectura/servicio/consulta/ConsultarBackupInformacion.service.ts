import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultarBackupInformacionService {

  private apiUrl = 'http://192.168.100.4:8080/backup-informacion';

  constructor(private http: HttpClient) { }

  // Obtener configuraciones por software (antes por backup)
  listarPorSoftware(softwareCodigo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/por-software/${softwareCodigo}`);
  }

  // Obtener configuraciones por software y tipo
  listarPorSoftwareYTipo(softwareCodigo: number, tipo: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/por-software/${softwareCodigo}/tipo/${tipo}`);
  }

  listarActivos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activos`);
  }

  // Busqueda por criterios (ahora usa softwareCodigo)
  buscarPorCriterios(
    nombre: string,
    frecuencia: string,
    ubicacion: string | null,
    ubicacionExcluida: string | null,
    dia: number | null,
    hora: string | null,
    softwareCodigo: number,
    tipo: string
  ): Observable<any> {
    const params = new HttpParams()
      .set('nombre', nombre)
      .set('frecuencia', frecuencia)
      .set('ubicacion', ubicacion || '')
      .set('ubicacionExcluida', ubicacionExcluida || '')
      .set('dia', dia !== null && dia !== undefined ? dia.toString() : '')
      .set('hora', hora || '')
      .set('softwareCodigo', softwareCodigo.toString())  
      .set('tipo', tipo);

    return this.http.get<any>(`${this.apiUrl}/buscar`, { params });
  }

  obtenerPorCodigo(codigo: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${codigo}`);
  }

}
