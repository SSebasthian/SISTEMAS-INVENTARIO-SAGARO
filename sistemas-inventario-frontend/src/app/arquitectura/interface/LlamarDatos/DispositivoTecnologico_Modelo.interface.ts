import { MarcaLlamarDatos } from '../LlamarDatos/DispositivoTecnologico_Marca.interface';

export interface ModeloLlamarDatos {
  codigo: number;
  rutaImagen: string;
  descripcion: string;
  activo: boolean;
  marca: MarcaLlamarDatos;

}