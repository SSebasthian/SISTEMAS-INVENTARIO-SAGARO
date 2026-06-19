import { CatalogoLlamarDatos } from './Catalogo.interface';


export interface SOLlamarDatos {
  codigo: number;
  descripcion: string;
  catalogo: CatalogoLlamarDatos;
  activo: boolean;
}
