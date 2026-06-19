import { TipoLlamarDatos } from './DispositivoTecnologico_Tipo.interface';
import { MarcaLlamarDatos } from './DispositivoTecnologico_Marca.interface';
import { ModeloLlamarDatos } from './DispositivoTecnologico_Modelo.interface';
import { SOLlamarDatos } from './SistemaOperativo.interface';
import { VersionSOLlamarDatos } from './SistemaOperativo_Version.interface';


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

    // Asignacion
     asignado: boolean;
    asignadoA: string | null;
    asignadoCedula?: string | null; 
    asignadoArea: string | null;
    tipoAsignacion: 'empleado' | 'area' | null;
    fechaAsignacion?: string | null;
    asignacionId: number | null;
    observacionesOriginal?: string | null;
    observaciones?: string | null;
    
}