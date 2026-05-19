import { TipoLlamarDatos } from './DispositivoTecnologico_Tipo.interface';
import { MarcaLlamarDatos } from './DispositivoTecnologico_Marca.interface';
import { ModeloLlamarDatos } from './DispositivoTecnologico_Modelo.interface';
import { SOLlamarDatos } from './DispositivoTecnologico_SO.interface';
import { VersionSOLlamarDatos } from './DispositivoTecnologico_VersionSO.interface';


export interface DispositivoMovilLlamarDatos {
    serial: string;
    plaqueta: string;
    fechaCompra: string;
    facturaCompra: string;
    activo: boolean;
    descripcion: string;
    estado: string;

    // Especificaciones tecnicas (simples)
    pulgadas: string;
    ram: string;
    almacenamiento: string;
    imei1: string;
    imei2: string;
    procesador: string;


    // Relaciones ManyToOne con catalogos
    tipo: TipoLlamarDatos;
    marca: MarcaLlamarDatos;
    modelo: ModeloLlamarDatos;
    sistemaOperativo: SOLlamarDatos;
    versionSO: VersionSOLlamarDatos;
    
}