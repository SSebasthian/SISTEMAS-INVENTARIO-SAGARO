import { MarcaLlamarDatos } from '../LlamarDatos/DispositivoTecnologico_Marca.interface';

export interface ModeloLlamarDatos {
  codigo: number;
  imagen: string;
  descripcion: string;
  activo: boolean;
  marca: MarcaLlamarDatos;

}