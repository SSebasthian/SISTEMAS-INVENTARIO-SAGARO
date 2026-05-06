export default interface empleado{
    cedula: number;             
    nombre: string;             
    apellido: string;           
    area: string;               
    cargo: string;             
    estado: boolean;              // Tipo de usuario (ej. usuario activo o retirado)
    fechaIngreso: Date;         // Fecha de ingreso del usuario
    fechaRetiro?: Date;           // Fecha de retiro del usuario
}