import { TipoLlamarDatos } from '../LlamarDatos/DispositivoTecnologico_Tipo.interface';
import { MarcaLlamarDatos } from '../LlamarDatos/DispositivoTecnologico_Marca.interface';
import { ModeloLlamarDatos } from '../LlamarDatos/DispositivoTecnologico_Modelo.interface';
import { SOLlamarDatos } from '../LlamarDatos/DispositivoTecnologico_SO.interface';
import { VersionSOLlamarDatos } from '../LlamarDatos/DispositivoTecnologico_VersionSO.interface';


export interface EquipoDeComputoLlamarDatos {
    serial: string;
    plaqueta: string;
    fechaCompra: Date;
    facturaCompra: string;
    estado: string;
    descripcion: string;

    // Especificaciones tecnicas (simples)
    ram: string;
    tipoRam: string;
    disco: string;
    tipoDisco: string;
    procesador: string;
    bits: number;


    // Relaciones ManyToOne con catalogos
    tipoEquipo: TipoLlamarDatos;
    marca: MarcaLlamarDatos;
    modelo: ModeloLlamarDatos;
    sistemaOperativo: SOLlamarDatos;
    versionSistemaOperativo: VersionSOLlamarDatos;
    
    
}