import { SOLlamarDatos } from './SistemaOperativo.interface';

export interface VersionSOLlamarDatos {
  codigo: number;
  descripcion: string;
  activo: boolean;
  sistemaOperativo: SOLlamarDatos;
}