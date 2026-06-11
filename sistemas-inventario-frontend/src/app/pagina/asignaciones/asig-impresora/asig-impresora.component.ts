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
  selector: 'app-asig-impresora',
  imports: [CommonModule, FormsModule, MatIconModule, A11yModule],
  templateUrl: './asig-impresora.component.html',
  styleUrl: './asig-impresora.component.css'
})
export class AsigImpresoraComponent {


  // ==================== PROPIEDADES ====================
  impresora: any;
  tipoAsignacion: 'empleado' | 'area' = 'empleado';
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

  // Areas
  areas: AreaLlamarDatos[] = [];
  areaSeleccionada: number | null = null;
  busquedaArea: string = '';
  areasFiltradas: AreaLlamarDatos[] = [];
  areaSeleccionadaObj: AreaLlamarDatos | null = null;

  // Imagen
  imagenModeloSeleccionado: SafeResourceUrl = '';


  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AsigImpresoraComponent>,
    private empleadoService: ConsultarEmpleadoService,
    private consultarAsignacionesService: ConsultarAsignacionesService,
    private registrarAsignacionesService: RegistrarAsignacionesService,
    private notificacionSnackbarService: NotificacionSnackbarService,
    private sanitizer: DomSanitizer
  ) {
    this.impresora = data.impresora;
    this.areas = data.areas || [];

    // Verificar si ya esta asignada
    this.yaAsignada = this.impresora.asignado === true;
    if (this.yaAsignada) {
      this.tipoAsignacion = this.impresora.tipoAsignacion; // 'empleado' o 'area'
      let obs = this.impresora.observaciones || '';
      this.observacionesOriginal = obs.replace(/^ASIGNACION:\s*/, '');
    }

    this.cargarEmpleados();
    this.cargarImagenModelo();  // Cargar imagen al abrir el modal
    this.cargarAreas();
  }


  // ==================== CARGA DE DATOS ====================

  cargarEmpleados(): void {
    this.empleadoService.listarEmpleados().subscribe({
      next: (data) => {
        this.empleados = data;
        this.empleadosFiltrados = data;
      },
      error: (err) => {
        console.error('Error al cargar empleados:', err);
      }
    });
  }


  cargarAreas(): void {
    this.consultarAsignacionesService.listarAreas().subscribe({
      next: (data) => {
        this.areas = data;
        this.areasFiltradas = data;
      },
      error: (err) => {
        console.error('Error al cargar áreas:', err);
      }
    });
  }


  // Metodo para cargar la imagen del modelo (igual que en opc-impresora)
  cargarImagenModelo(): void {
    if (this.impresora?.modelo?.rutaImagen) {
      let urlLimpia = this.impresora.modelo.rutaImagen.split('&token=')[0];
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
    // Establecer el area del empleado como areaCodigo
    this.areaSeleccionada = empleado.area.codigo;
  }



  limpiarSeleccion(): void {
    this.empleadoSeleccionado = null;
  }


  filtrarAreas(): void {
    const termino = this.busquedaArea.toLowerCase();
    this.areasFiltradas = this.areas.filter(area =>
      area.descripcion.toLowerCase().includes(termino)
    );
  }

  seleccionarArea(area: AreaLlamarDatos): void {
    this.areaSeleccionadaObj = area;
    this.areaSeleccionada = area.codigo;
    this.busquedaArea = '';
    this.areasFiltradas = [];
  }

  limpiarSeleccionArea(): void {
    this.areaSeleccionadaObj = null;
    this.areaSeleccionada = null;
  }


  limpiarSeleccionTotal(): void {
    if (this.tipoAsignacion === 'empleado') {
      this.empleadoSeleccionado = null;
      this.busquedaEmpleado = '';
      this.empleadosFiltrados = this.empleados;
    } else {
      this.areaSeleccionadaObj = null;
      this.areaSeleccionada = null;
      this.busquedaArea = '';
      this.areasFiltradas = this.areas;
    }
    this.fechaDevolucion = '';
  }


  // MEtodo para saber si hay selección
  tieneSeleccion(): boolean {
    if (this.tipoAsignacion === 'empleado') {
      return this.empleadoSeleccionado !== null;
    } else {
      return this.areaSeleccionadaObj !== null;
    }
  }


  puedeAsignar(): boolean {
    if (this.tipoAsignacion === 'empleado') {
      return this.empleadoSeleccionado !== null;
    } else {
      return this.areaSeleccionada !== null;
    }
  }



  // ==================== VALIDACION DE FECHAS ====================


  isFechaDevolucionValida(): boolean {
    if (!this.fechaDevolucion) return false;

    // Obtener la fecha de asignacion (puede venir de impresora.fechaAsignacion o de la variable)
    const fechaAsignacionStr = this.yaAsignada
      ? this.impresora.fechaAsignacion
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
    let observacionesFormateadas = '';
    if (this.observaciones && this.observaciones.trim() !== '') {
      observacionesFormateadas = `ASIGNACION: ${this.observaciones}`;
    } else {
      observacionesFormateadas = 'ASIGNACION: SIN OBSERVACIONES';
    }

    let areaCodigo: number | null = null;

    if (this.tipoAsignacion === 'empleado') {
      areaCodigo = this.empleadoSeleccionado!.area!.codigo;
    } else {
      areaCodigo = this.areaSeleccionada;
    }

    const asignacionData = {
      empleadoCedula: this.tipoAsignacion === 'empleado' ? this.empleadoSeleccionado?.cedula : null,
      areaCodigo: areaCodigo,
      catalogoCodigo: 3,
      tipoCodigo: this.impresora.tipo?.codigo,
      serialActivo: this.impresora.serial,
      fechaAsignacion: this.fechaAsignacion,
      observaciones: observacionesFormateadas  // ← Asegurar que usas esta variable
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

    if (!this.impresora.asignacionId) {
      this.notificacionSnackbarService.error('Error', 'No se encontro el ID de la asignacion');
      return;
    }

    // Obtener el texto original y limpiarlo
    let textoOriginal = this.impresora.observaciones || '';
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

    this.registrarAsignacionesService.devolver(this.impresora.asignacionId, data).subscribe({
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
    // Limpiar seleccion
    if (this.tipoAsignacion === 'empleado') {
      this.empleadoSeleccionado = null;
      this.busquedaEmpleado = '';
      this.empleadosFiltrados = this.empleados; //  Restaurar lista completa
    } else {
      this.areaSeleccionadaObj = null;
      this.areaSeleccionada = null;
      this.busquedaArea = '';
      this.areasFiltradas = this.areas; //  Restaurar lista completa
    }

    // Limpiar fecha de devolucion
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

    if (!this.impresora.asignacionId) {
      this.notificacionSnackbarService.error('Error', 'No se encontro el ID de la asignacion');
      return;
    }

    // Obtener el texto original y limpiarlo
    let textoOriginal = this.impresora.observaciones || '';
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

    this.registrarAsignacionesService.devolver(this.impresora.asignacionId, data).subscribe({
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
    this.areaSeleccionadaObj = null;
    this.areaSeleccionada = null;

    // Resetear fechas y observaciones para nueva asignacion
    this.fechaAsignacion = new Date().toISOString().split('T')[0];
    this.fechaDevolucion = '';
    this.observaciones = '';
    this.detalleDevolucion = '';

    // Resetear busquedas
    this.busquedaEmpleado = '';
    this.busquedaArea = '';
    this.empleadosFiltrados = this.empleados;
    this.areasFiltradas = this.areas;

    this.notificacionSnackbarService.info('Reasignacion', 'Seleccione un nuevo empleado o area');
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

  // Método para obtener el título según el estado
  getTitulo(): string {
    // Si no está asignada
    if (!this.yaAsignada) {
      return 'Asignar Impresora';
    }

    // Si está asignada y está en modo devolución
    if (this.mostrarDevolucion) {
      if (this.esReasignacion) {
        return 'Reasignacion de Impresora';
      }
      return 'Devolucion de Impresora';
    }

    // Si esta asignada y no en modo devolución
    return 'Impresora Asignada';
  }

}
