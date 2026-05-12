import { TipoLlamarDatos } from '../../interface/LlamarDatos/DispositivoTecnologico_Tipo.interface';

export interface MarcaLlamarDatos {
  codigo: number;
  descripcion: string;
  tipo: TipoLlamarDatos;
  activo: boolean;
}