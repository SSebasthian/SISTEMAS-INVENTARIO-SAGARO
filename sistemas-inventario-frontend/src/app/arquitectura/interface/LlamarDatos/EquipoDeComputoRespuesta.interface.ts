import { TipoLlamarDatos } from '../LlamarDatos/DispositivoTecnologico_Tipo.interface';
import { MarcaLlamarDatos } from '../LlamarDatos/DispositivoTecnologico_Marca.interface';
import { ModeloLlamarDatos } from '../LlamarDatos/DispositivoTecnologico_Modelo.interface';
import { SOLlamarDatos } from '../LlamarDatos/DispositivoTecnologico_SO.interface';
import { VersionSOLlamarDatos } from '../LlamarDatos/DispositivoTecnologico_VersionSO.interface';


export interface EquipoDeComputoLlamarDatos {
    serial: string;
    plaqueta: string;
    fechaCompra: string;
    facturaCompra: string;
    activo: boolean;
    descripcion: string;
    estado: string;

    // Especificaciones tecnicas (simples)
    ram: string;
    tipoRam: string;
    disco: string;
    tipoDisco: string;
    procesador: string;
    bits: number;


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