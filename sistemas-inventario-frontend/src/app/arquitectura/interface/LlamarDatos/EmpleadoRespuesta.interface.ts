import { AreaLlamarDatos } from '../LlamarDatos/AreaRespuesta.interface';
import { CargoLlamarDatos } from '../LlamarDatos/CargoRespuesta.interface';


export interface EmpleadoLlamarDatos {
  cedula: string;
  nombre: string;
  apellido: string;
  fechaIngreso: string;
  fechaRetiro?: string;
  activo: boolean;
  area: AreaLlamarDatos;
  cargo: CargoLlamarDatos;
}