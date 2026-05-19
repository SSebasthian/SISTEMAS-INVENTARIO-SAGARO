import { TipoLlamarDatos } from './DispositivoTecnologico_Tipo.interface';
import { MarcaLlamarDatos } from './DispositivoTecnologico_Marca.interface';
import { ModeloLlamarDatos } from './DispositivoTecnologico_Modelo.interface';

export interface ImpresoraLlamarDatos{
    serial: string;
    propiedad: string;
    plaqueta: string;
    tipoRecarga: string;
    fechaCompra: string;
    facturaCompra: string;
    estado: string;
    descripcion: string;
    
    // Relaciones ManyToOne con catalogos
    tipo: TipoLlamarDatos;
    marca: MarcaLlamarDatos;
    modelo: ModeloLlamarDatos;
}