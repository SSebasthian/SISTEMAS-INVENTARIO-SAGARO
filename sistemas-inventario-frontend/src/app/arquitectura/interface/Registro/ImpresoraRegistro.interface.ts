export interface ImpresoraRegistro{
    serial: string;
    propiedad: string;
    plaqueta: string;
    tipoRecarga: string;
    facturaCompra: string;
    fechaCompra: string | null;
    estado: string;
    descripcion: string;
    
    // Relaciones ManyToOne con catalogos
    tipo: { codigo: number };
    marca: { codigo: number };
    modelo: { codigo: number };
}