import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AreaLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/AreaRespuesta.interface';
import { EmpleadoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/EmpleadoRespuesta.interface';
import { ConsultarEmpleadoService } from '../../../arquitectura/servicio/consulta/ConsultarEmpleado.service';
import { ConsultarAsignacionesService } from '../../../arquitectura/servicio/consulta/ConsultarAsignaciones.service';
import { RegistrarAsignacionesService } from '../../../arquitectura/servicio/registro/RegistrarAsignaciones.service';
import { A11yModule } from "@angular/cdk/a11y";
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';


@Component({
  selector: 'app-asig-dispositivo',
  imports: [CommonModule, FormsModule, MatIconModule, A11yModule],
  templateUrl: './asig-dispositivo.component.html',
  styleUrl: './asig-dispositivo.component.css'
})
export class AsigDispositivoComponent {

  // ==================== PROPIEDADES ====================
  dispositivo: any;
  yaAsignada: boolean = false;
  esReasignacion: boolean = false;
  mostrarDevolucion: boolean = false;
  errorFechaDevolucion: boolean = false;

  // Fechas
  fechaAsignacion: string = new Date().toISOString().split('T')[0];
  fechaDevolucion: string = '';

  // Textos
  observaciones: string = '';
  observacionesOriginal: string = '';
  detalleDevolucion: string = '';

  // Empleados
  empleados: EmpleadoLlamarDatos[] = [];
  empleadosFiltrados: EmpleadoLlamarDatos[] = [];
  busquedaEmpleado: string = '';
  empleadoSeleccionado: EmpleadoLlamarDatos | null = null;

  // Imagen
  imagenModeloSeleccionado: SafeResourceUrl = '';


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AsigDispositivoComponent>,
    private empleadoService: ConsultarEmpleadoService,
    private consultarAsignacionesService: ConsultarAsignacionesService,
    private registrarAsignacionesService: RegistrarAsignacionesService,
    private notificacionSnackbarService: NotificacionSnackbarService,
    private sanitizer: DomSanitizer
  ) {
    this.dispositivo = data.dispositivo;

    // Verificar si ya esta asignada
    this.yaAsignada = this.dispositivo.asignado === true;
    if (this.yaAsignada) {
      let obs = this.dispositivo.observaciones || '';
      this.observacionesOriginal = obs.replace(/^ASIGNACION:\s*/, '');
    }

    this.cargarEmpleados();
    this.cargarImagenModelo();
  }



  // ==================== CARGA DE DATOS ====================

  cargarEmpleados(): void {
    this.empleadoService.listarEmpleadosActivos().subscribe({
      next: (data) => {
        this.empleados = data;
        this.empleadosFiltrados = data;
      },
      error: (err) => {
        console.error('Error al cargar empleados:', err);
      }
    });
  }

  cargarImagenModelo(): void {
    if (this.dispositivo?.modelo?.rutaImagen) {
      let urlLimpia = this.dispositivo.modelo.rutaImagen.split('&token=')[0];
      this.imagenModeloSeleccionado = this.sanitizer.bypassSecurityTrustResourceUrl(urlLimpia);
    } else {
      this.imagenModeloSeleccionado = '';
    }
  }


  // ==================== FILTROS Y SELECCION ====================

  filtrarEmpleados(): void {
    const termino = this.busquedaEmpleado.toLowerCase();
    this.empleadosFiltrados = this.empleados.filter(emp =>
      emp.nombre.toLowerCase().includes(termino) ||
      emp.apellido.toLowerCase().includes(termino) ||
      emp.cedula.includes(termino)
    );
  }


  seleccionarEmpleado(empleado: EmpleadoLlamarDatos): void {
    this.empleadoSeleccionado = empleado;
    this.busquedaEmpleado = '';
    this.empleadosFiltrados = [];
  }


  limpiarSeleccion(): void {
    this.empleadoSeleccionado = null;
  }


  limpiarSeleccionTotal(): void {
    this.empleadoSeleccionado = null;
    this.busquedaEmpleado = '';
    // Restaurar la lista completa de empleados
    this.empleadosFiltrados = [...this.empleados];
    this.observaciones = '';
    this.fechaAsignacion = new Date().toISOString().split('T')[0];
    this.fechaDevolucion = '';
    this.detalleDevolucion = '';
    this.mostrarDevolucion = false;
    this.esReasignacion = false;
    this.errorFechaDevolucion = false;
  }


  tieneSeleccion(): boolean {
    return this.empleadoSeleccionado !== null;
  }

  puedeAsignar(): boolean {
    return this.empleadoSeleccionado !== null && !!this.fechaAsignacion;
  }


  // ==================== VALIDACION DE FECHAS ====================


  isFechaDevolucionValida(): boolean {
    if (!this.fechaDevolucion) return false;

    // Obtener la fecha de asignacion (puede venir de dispositivo.fechaAsignacion o de la variable)
    const fechaAsignacionStr = this.yaAsignada
      ? this.dispositivo.fechaAsignacion
      : this.fechaAsignacion;

    if (!fechaAsignacionStr) return true; // Si no hay fecha de asignación, no validar

    const fechaAsignacion = new Date(fechaAsignacionStr);
    const fechaDevolucion = new Date(this.fechaDevolucion);

    // Resetear horas para comparar solo fechas
    fechaAsignacion.setHours(0, 0, 0, 0);
    fechaDevolucion.setHours(0, 0, 0, 0);

    return fechaDevolucion >= fechaAsignacion;
  }

  validarFechaDevolucion(): void {
    if (this.fechaDevolucion && !this.isFechaDevolucionValida()) {
      this.errorFechaDevolucion = true;
    } else {
      this.errorFechaDevolucion = false;
    }
  }


  // ==================== ACCIONES PRINCIPALES ====================

  cerrar(): void {
    this.dialogRef.close({ success: false });
  }


  asignar(): void {
    // Validar que haya un empleado seleccionado
    if (!this.empleadoSeleccionado) {
        this.notificacionSnackbarService.warning('Empleado requerido', 'Seleccione un empleado');
        return;
    }

    // Validar que el empleado tenga cédula
    if (!this.empleadoSeleccionado.cedula || this.empleadoSeleccionado.cedula.trim() === '') {
        this.notificacionSnackbarService.error('Error', 'El empleado seleccionado no tiene cédula válida');
        return;
    }

    // Validar que el empleado tenga área
    if (!this.empleadoSeleccionado.area?.codigo) {
        this.notificacionSnackbarService.error('Error', 'El empleado seleccionado no tiene un área asignada');
        return;
    }

    // Validar fecha de asignación
    if (!this.fechaAsignacion) {
        this.notificacionSnackbarService.warning('Fecha requerida', 'Seleccione una fecha de asignación');
        return;
    }

    let observacionesFormateadas = '';
    if (this.observaciones && this.observaciones.trim() !== '') {
        observacionesFormateadas = `ASIGNACION: ${this.observaciones}`;
    } else {
        observacionesFormateadas = 'ASIGNACION: SIN OBSERVACIONES';
    }

    const asignacionData = {
        empleadoCedula: this.empleadoSeleccionado.cedula,
        areaCodigo: this.empleadoSeleccionado.area.codigo,  // ← Enviar el área del empleado
        catalogoCodigo: 2,  // Dispositivo móvil
        tipoCodigo: this.dispositivo.tipo?.codigo,
        serialActivo: this.dispositivo.serial,
        fechaAsignacion: this.fechaAsignacion,
        observaciones: observacionesFormateadas
    };

    this.dialogRef.close({ success: true, data: asignacionData });
}


  activarDevolucion(): void {
    this.mostrarDevolucion = true;
    this.esReasignacion = false;  // ← Importante: debe ser false
    this.fechaDevolucion = new Date().toISOString().split('T')[0];
    this.detalleDevolucion = '';
  }


  // Confirmar y ejecutar la devolucion
  confirmarDevolver(): void {
    // Validar fecha
    if (!this.fechaDevolucion) {
      this.notificacionSnackbarService.warning('Fecha requerida', 'Seleccione una fecha de devolucion');
      return;
    }

    if (!this.isFechaDevolucionValida()) {
      this.notificacionSnackbarService.warning('Fecha invalida', 'La fecha de devolucion no puede ser anterior a la fecha de asignacion');
      return;
    }

    if (!this.dispositivo.asignacionId) {
      this.notificacionSnackbarService.error('Error', 'No se encontro el ID de la asignacion');
      return;
    }

    // Obtener el texto original y limpiarlo
    let textoOriginal = this.dispositivo.observaciones || '';
    let textoLimpio = textoOriginal.replace(/^ASIGNACION:\s*/, '').split(' | ')[0];

    if (!textoLimpio || textoLimpio.trim() === '') {
      textoLimpio = 'SIN OBSERVACIONES';
    }

    let detalle = '';
    if (this.detalleDevolucion && this.detalleDevolucion.trim() !== '') {
      detalle = ` | DEVOLUCION: ${this.detalleDevolucion}`;
    }

    const observacionesCompletas = `ASIGNACION: ${textoLimpio}${detalle}`;

    const data = {
      observaciones: observacionesCompletas,
      fechaDevolucion: this.fechaDevolucion
    };

    this.registrarAsignacionesService.devolver(this.dispositivo.asignacionId, data).subscribe({
      next: () => {
        // SOLO CERRAR EL MODAL, no ir a asignacion
        this.dialogRef.close({ success: true, devuelta: true });
      },
      error: (err) => {
        console.error('Error al devolver:', err);
        this.notificacionSnackbarService.error('Error', err.error?.error || 'Error al devolver');
      }
    });
  }



  // Metodo para devolver (reiniciar seleccion)
  devolver(): void {
    this.empleadoSeleccionado = null;
    this.busquedaEmpleado = '';
    this.empleadosFiltrados = this.empleados; //  Restaurar lista completa
    this.fechaDevolucion = '';
  }


  // Activar modo reasignacion (para Reasignar)
  activarReasignacion(): void {
    this.mostrarDevolucion = true;
    this.esReasignacion = true;  // ← Importante: debe ser true
    this.fechaDevolucion = new Date().toISOString().split('T')[0];
    this.detalleDevolucion = '';
  }



  confirmarReasignar(): void {
    // Validar fecha
    if (!this.fechaDevolucion) {
      this.notificacionSnackbarService.warning('Fecha requerida', 'Seleccione una fecha de devolucion');
      return;
    }

    if (!this.isFechaDevolucionValida()) {
      this.notificacionSnackbarService.warning('Fecha invalida', 'La fecha de devolucion no puede ser anterior a la fecha de asignacion');
      return;
    }

    if (!this.dispositivo.asignacionId) {
      this.notificacionSnackbarService.error('Error', 'No se encontro el ID de la asignacion');
      return;
    }

    // Obtener el texto original y limpiarlo
    let textoOriginal = this.dispositivo.observaciones || '';
    let textoLimpio = textoOriginal.replace(/^ASIGNACION:\s*/, '').split(' | ')[0];

    if (!textoLimpio || textoLimpio.trim() === '') {
      textoLimpio = 'SIN OBSERVACIONES';
    }

    let detalle = '';
    if (this.detalleDevolucion && this.detalleDevolucion.trim() !== '') {
      detalle = ` | DEVOLUCION: ${this.detalleDevolucion}`;
    }

    const observacionesCompletas = `ASIGNACION: ${textoLimpio}${detalle}`;

    const data = {
      observaciones: observacionesCompletas,
      fechaDevolucion: this.fechaDevolucion
    };

    this.registrarAsignacionesService.devolver(this.dispositivo.asignacionId, data).subscribe({
      next: () => {
        this.notificacionSnackbarService.success('Exito', 'Devolucion registrada');
        // Preparar para nueva asignacion
        this.prepararReasignacion();
      },
      error: (err) => {
        console.error('Error al devolver:', err);
        this.notificacionSnackbarService.error('Error', err.error?.error || 'Error al devolver');
      }
    });
  }


  // Metodo para preparar la reasignacion (nueva asignacion)
  private prepararReasignacion(): void {
    // Cambiar estado para mostrar formulario de nueva asignacion
    this.yaAsignada = false;
    this.mostrarDevolucion = false;

    // Limpiar selecciones previas
    this.empleadoSeleccionado = null;

    // Resetear fechas y observaciones para nueva asignacion
    this.fechaAsignacion = new Date().toISOString().split('T')[0];
    this.fechaDevolucion = '';
    this.observaciones = '';
    this.detalleDevolucion = '';

    // Resetear busquedas - IMPORTANTE: restaurar lista completa
    this.busquedaEmpleado = '';
    this.empleadosFiltrados = [...this.empleados];  // ← Restaurar lista completa

    this.notificacionSnackbarService.info('Reasignacion', 'Seleccione un nuevo empleado');
  }



  // Metodo para reasignar (limpiar asignacion actual y mostrar formulario)
  reasignar(): void {
    // Activar el modo devolucion (igual que Devolver)
    this.mostrarDevolucion = true;
    // Establecer fecha actual por defecto
    this.fechaDevolucion = new Date().toISOString().split('T')[0];
    // Limpiar detalle de devolucion anterior
    this.detalleDevolucion = '';

    // Opcional: Mostrar mensaje
    this.notificacionSnackbarService.info('Reasignacion', 'Ingrese los detalles de devolucion para continuar');
  }



  // AUXILIARES

  // Metodo para obtener el título según el estado
  getTitulo(): string {
    // Si no está asignada
    if (!this.yaAsignada) {
      return 'Asignar Dispositivo';
    }

    // Si está asignada y está en modo devolución
    if (this.mostrarDevolucion) {
      if (this.esReasignacion) {
        return 'Reasignacion de Dispositivo';
      }
      return 'Devolucion de Dispositivo';
    }

    // Si esta asignada y no en modo devolución
    return 'Dispositivo Asignado';
  }
}
