import { CatalogoLlamarDatos } from '../../interface/LlamarDatos/Catalogo.interface';


export interface SOLlamarDatos {
  codigo: number;
  descripcion: string;
  catalogo: CatalogoLlamarDatos;
  activo: boolean;
}
