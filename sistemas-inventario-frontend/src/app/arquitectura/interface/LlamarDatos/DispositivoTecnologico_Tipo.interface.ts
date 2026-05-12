import { CatalogoLlamarDatos } from '../../interface/LlamarDatos/Catalogo.interface';

export interface TipoLlamarDatos {
  codigo: number;
  descripcion: string;
  catalogo: CatalogoLlamarDatos;
  activo: boolean;
}

