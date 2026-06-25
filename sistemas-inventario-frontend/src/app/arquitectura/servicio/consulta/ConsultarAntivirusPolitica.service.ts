import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultarAntivirusPoliticaService {

  private apiUrl = 'http://192.168.100.4:8080/antivirus-politicas';

  constructor(private http: HttpClient) { }

  listarPorAntivirus(antivirusCodigo: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/por-antivirus/${antivirusCodigo}`);
  }

  listarPorSoftware(softwareCodigo: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/por-software/${softwareCodigo}`);
}
}
