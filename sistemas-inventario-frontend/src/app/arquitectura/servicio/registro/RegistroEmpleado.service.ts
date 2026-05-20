import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmpleadoRegistro } from '../../interface/Registro/EmpleadoRegistro.interface';
import { EmpleadoLlamarDatos } from '../../interface/LlamarDatos/EmpleadoRespuesta.interface';
import { AreaLlamarDatos } from '../../interface/LlamarDatos/AreaRespuesta.interface';
import { CargoLlamarDatos } from '../../interface/LlamarDatos/CargoRespuesta.interface';



@Injectable({
  providedIn: 'root'
})
export class RegistroEmpleadoService {

  private apiUrlRegistroEmpleado = 'http://localhost:8080/registrar/empleado';

  constructor(private http: HttpClient) { }

  // Obtiene todas las áreas disponibles
  getAreas(): Observable<AreaLlamarDatos[]> {
    return this.http.get<AreaLlamarDatos[]>(`${this.apiUrlRegistroEmpleado}/areas`);
  }

  // Lista los cargos según el área seleccionada
  getCargosPorArea(areaCodigo: number): Observable<CargoLlamarDatos[]> {
    return this.http.get<CargoLlamarDatos[]>(`${this.apiUrlRegistroEmpleado}/areas/${areaCodigo}/cargos`);
  }

  //Permite registrar nuevos empleados en el sistema
  registrarEmpleado(empleado: EmpleadoRegistro): Observable<EmpleadoLlamarDatos> {
    return this.http.post<EmpleadoLlamarDatos>(`${this.apiUrlRegistroEmpleado}/agregar`, empleado);
  }

  // Crear una nueva área
  crearArea(descripcion: string): Observable<AreaLlamarDatos> {
    return this.http.post<AreaLlamarDatos>(`${this.apiUrlRegistroEmpleado}/areas/crear`, { descripcion });
  }


  // Traer todos los cargos globales (para búsqueda)
  getTodosLosCargos(): Observable<CargoLlamarDatos[]> {
    return this.http.get<CargoLlamarDatos[]>(`${this.apiUrlRegistroEmpleado}/cargos/todos`);
  }

  // Crear un nuevo cargo y asociarlo a un área
  crearCargo(descripcion: string, areaCodigo: number): Observable<CargoLlamarDatos> {
    return this.http.post<CargoLlamarDatos>(`${this.apiUrlRegistroEmpleado}/cargos/crear`, { descripcion, areaCodigo });
  }


  // ========== METODOS PARA EDICIÓN ==========

  // Obtener un empleado por su cédula
  obtenerEmpleado(cedula: string): Observable<EmpleadoLlamarDatos> {
    return this.http.get<EmpleadoLlamarDatos>(`${this.apiUrlRegistroEmpleado}/${cedula}`);
  }

  // Editar un empleado existente
  editarEmpleado(cedula: string, empleado: EmpleadoRegistro): Observable<EmpleadoLlamarDatos> {
    return this.http.put<EmpleadoLlamarDatos>(`${this.apiUrlRegistroEmpleado}/editar/${cedula}`, empleado);
  }

  // Buscar empleados por cédula (para autocomplete)
  buscarEmpleados(termino: string): Observable<EmpleadoLlamarDatos[]> {
    return this.http.get<EmpleadoLlamarDatos[]>(`${this.apiUrlRegistroEmpleado}/buscar?termino=${termino}`);
  }

}
