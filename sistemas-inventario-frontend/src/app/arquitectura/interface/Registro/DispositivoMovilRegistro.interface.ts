export interface DispositivoMovilRegistro {
    serial: string;
    plaqueta: string;
    facturaCompra: string;
    fechaCompra: string | null;
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
    tipo: { codigo: number };
    marca: { codigo: number };
    modelo: { codigo: number };
    sistemaOperativo: { codigo: number };
    versionSO: { codigo: number };
}