export interface EquipoComputoRegistro {
    serial: string;
    plaqueta: string;
    facturaCompra: string;
    fechaCompra: string | null;         
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
    tipo: { codigo: number };
    marca: { codigo: number };
    modelo: { codigo: number };
    sistemaOperativo: { codigo: number };
    versionSO: { codigo: number };
    
}