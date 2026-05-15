import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogoLlamarDatos } from '../../interface/LlamarDatos/Catalogo.interface';
import { TipoLlamarDatos } from '../../interface/LlamarDatos/DispositivoTecnologico_Tipo.interface';
import { MarcaLlamarDatos } from '../../interface/LlamarDatos/DispositivoTecnologico_Marca.interface';
import { ModeloLlamarDatos } from '../../interface/LlamarDatos/DispositivoTecnologico_Modelo.interface';
import { SOLlamarDatos } from '../../interface/LlamarDatos/DispositivoTecnologico_SO.interface';
import { VersionSOLlamarDatos } from '../../interface/LlamarDatos/DispositivoTecnologico_VersionSO.interface';

@Injectable({
  providedIn: 'root'
})
export class RegistroCatalogoService {

  private apiUrlCatalogo = 'http://localhost:8080/catalogo';
 
   constructor(private http: HttpClient) { }
 
 
   // Obtener todos los catálogos (COMPUTADOR, TELEFONO, IMPRESORA)
   getCatalogos(): Observable<CatalogoLlamarDatos[]> {
     return this.http.get<CatalogoLlamarDatos[]>(`${this.apiUrlCatalogo}/catalogos`);
   }
 
   // Tipos por categoría (para equipo de cómputo usamos 'COMPUTADOR')
   getTiposPorCatalogo(catalogoCodigo: number): Observable<TipoLlamarDatos[]> {
     return this.http.get<TipoLlamarDatos[]>(`${this.apiUrlCatalogo}/tipos/catalogo/${catalogoCodigo}`);
   }
 
   // Todas las marcas
   getMarcas(): Observable<MarcaLlamarDatos[]> {
     return this.http.get<MarcaLlamarDatos[]>(`${this.apiUrlCatalogo}/marcas`);
   }
 
   // Marcas por catálogo
   getMarcasPorCatalogo(catalogoCodigo: number): Observable<MarcaLlamarDatos[]> {
     return this.http.get<MarcaLlamarDatos[]>(`${this.apiUrlCatalogo}/marcas/catalogo/${catalogoCodigo}`);
   }
 
   // Marcas por tipo
   getMarcasPorTipo(tipoCodigo: number): Observable<MarcaLlamarDatos[]> {
     return this.http.get<MarcaLlamarDatos[]>(`${this.apiUrlCatalogo}/marcas/tipo/${tipoCodigo}`);
   }
 
   // Modelos por marca
   getModelosPorMarca(marcaCodigo: number): Observable<ModeloLlamarDatos[]> {
     return this.http.get<ModeloLlamarDatos[]>(`${this.apiUrlCatalogo}/modelos/marca/${marcaCodigo}`);
   }
 
   // Modelos por marca y tipo
   getModelosPorMarcaYTipo(marcaCodigo: number, tipoCodigo: number): Observable<ModeloLlamarDatos[]> {
     return this.http.get<ModeloLlamarDatos[]>(`${this.apiUrlCatalogo}/modelos/marca/${marcaCodigo}/tipo/${tipoCodigo}`);
   }
 
   // Sistemas operativos por catalogo
   getSistemasOperativosPorCatalogo(catalogoCodigo: number): Observable<SOLlamarDatos[]> {
     return this.http.get<SOLlamarDatos[]>(`${this.apiUrlCatalogo}/sistemas-operativos/catalogo/${catalogoCodigo}`);
   }
 
   // Versiones por SO
   getVersionesPorSO(soCodigo: number): Observable<VersionSOLlamarDatos[]> {
     return this.http.get<VersionSOLlamarDatos[]>(`${this.apiUrlCatalogo}/versiones-so/so/${soCodigo}`);
   }





   // REGISTRAR

  /** CREAR NUEVA MARCA asociada a un tipo */
  crearMarca(descripcion: string, tipoCodigo: number): Observable<MarcaLlamarDatos> {
    return this.http.post<MarcaLlamarDatos>(`${this.apiUrlCatalogo}/marcas/crear`, {
      descripcion,
      tipoCodigo   // ← enviar el tipo seleccionado
    });
  }

}
