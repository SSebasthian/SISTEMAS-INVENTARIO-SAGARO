import { SOLlamarDatos } from '../LlamarDatos/DispositivoTecnologico_SO.interface';

export interface VersionSOLlamarDatos {
  codigo: number;
  descripcion: string;
  activo: boolean;
  sistemaOperativo: SOLlamarDatos;
}