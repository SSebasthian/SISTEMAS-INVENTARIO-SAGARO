import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EmpleadoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/EmpleadoRespuesta.interface';
import { ConsultarEmpleadoService } from '../../../arquitectura/servicio/consulta/ConsultarEmpleado.service';
import { ConsultarAsignacionesService } from '../../../arquitectura/servicio/consulta/ConsultarAsignaciones.service';
import { RegistrarAsignacionesService } from '../../../arquitectura/servicio/registro/RegistrarAsignaciones.service';
import { A11yModule } from "@angular/cdk/a11y";
import { ChangeDetectorRef } from '@angular/core';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';
import { ConsultarAntivirusService } from '../../../arquitectura/servicio/consulta/ConsultarAntivirus.service';
import { ConsultarAntivirusPoliticaService } from '../../../arquitectura/servicio/consulta/ConsultarAntivirusPolitica.service';
import { ConsultarBackupService } from '../../../arquitectura/servicio/consulta/ConsultarBackup.service';
import { RegistroBackupInformacionService } from '../../../arquitectura/servicio/registro/RegistroBackupInformacion.service';
import { ConsultarBackupInformacionService } from '../../../arquitectura/servicio/consulta/ConsultarBackupInformacion.service';
import { ConsultarCorreoService } from '../../../arquitectura/servicio/consulta/ConsultarCorreo.service';


@Component({
  selector: 'app-asig-equipo',
  imports: [CommonModule, FormsModule, MatIconModule, A11yModule],
  templateUrl: './asig-equipo.component.html',
  styleUrl: './asig-equipo.component.css'
})

export class AsigEquipoComponent {



  // ================================================================
  // PROPIEDADES DEL COMPONENTE
  // ================================================================


  // Datos del equipo y asignacion
  equipo: any;
  yaAsignada: boolean = false;
  esReasignacion: boolean = false;
  mostrarDevolucion: boolean = false;
  errorFechaDevolucion: boolean = false;


  // Fechas
  fechaAsignacion: string = new Date().toISOString().split('T')[0];
  fechaDevolucion: string = '';


  // Textos y observaciones 
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


  // Navegacion por pasos - ASIGNACION EQUIPO
  paso: number = 1;


  // Visibilidad de claves - ASIGNACION EQUIPO
  mostrarClaveAdmin: boolean = false;
  mostrarClaveUsuario: boolean = false;
  mostrarClaveAdicional: boolean = false;


  // DETALLE DEL EQUIPO (PASO 2)
  detalle: any = {
    nombreEquipo: '',
    ip: null,
    nombreUsuario: '',
    claveUsuario: '',
    nombreUsuarioAdministrador: 'SISTEMAS',
    claveUsuarioAdministrador: '',
    nombreUsuarioAdicional: '',
    claveUsuarioAdicional: ''
  };


  // CATALOGOS DE SOFTWARE (ANTIVIRUS - BACKUP - CORREO)
  antivirusList: any[] = [];
  politicasList: any[] = [];
  backupList: any[] = [];
  backupInformacionList: any[] = [];
  correosList: any[] = [];


  // SOFTWARE SELECCIONADO (RESUMEN PARA EL PASO 3)
  softwareSeleccionado: any = {
    antivirus: null,
    backupGeneral: null,
    backupCorreo: null,
    correo: null,
  };


  // PANEL INTERNO (AGREGAR/EDITAR SOFTWARE)
  panelActivo: boolean = false;
  panelTipo: string = ''; // 'antivirus' | 'backup' 
  panelTitulo: string = '';


  // Datos del panel para antivirus
  panelData: any = {
    antivirusCodigo: null,
    politicaCodigo: null,
  };


  // Datos del panel para backup (incluye multiples ubicaciones)
  modoUbicacion: string = 'normales';
  errorDia: string = '';
  backupFormData: any = {
    backupCodigo: null,
    nombre: '',
    programa: '',
    frecuencia: '',
    ubicaciones: [''],
    ubicacionesExcluidas: [''],
    dia: null
  };

  //Correo
  panelCorreo: any = {
    correoCodigo: null,
    realizarBackup: false,
    programa: 1,
  };




  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AsigEquipoComponent>,
    private empleadoService: ConsultarEmpleadoService,
    private consultarAsignacionesService: ConsultarAsignacionesService,
    private registrarAsignacionesService: RegistrarAsignacionesService,
    private notificacionSnackbarService: NotificacionSnackbarService,
    private consultarAntivirusService: ConsultarAntivirusService,
    private consultarAntivirusPoliticaService: ConsultarAntivirusPoliticaService,
    private consultarBackupService: ConsultarBackupService,
    private consultarBackupInformacionService: ConsultarBackupInformacionService,
    private registroBackupInformacionService: RegistroBackupInformacionService,
    private consultarCorreoService: ConsultarCorreoService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
    this.equipo = data.equipo;
    this.yaAsignada = this.equipo.asignado === true;

    if (this.yaAsignada) {
      let obs = this.equipo.observaciones || '';
      this.observacionesOriginal = obs.replace(/^ASIGNACION:\s*/, '');
    }

    // Carga inicial de datos
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
    if (this.equipo?.modelo?.rutaImagen) {
      let urlLimpia = this.equipo.modelo.rutaImagen.split('&token=')[0];
      this.imagenModeloSeleccionado = this.sanitizer.bypassSecurityTrustResourceUrl(urlLimpia);
    } else {
      this.imagenModeloSeleccionado = '';
    }
  }


  cargarAntivirus(): void {
    this.consultarAntivirusService.listarActivos().subscribe({
      next: (data) => {
        this.antivirusList = data;
        console.log('Antivirus cargados:', data); // Para depurar
      },
      error: (err) => {
        console.error('Error al cargar antivirus:', err);
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar los antivirus');
      }
    });
  }


  cargarPoliticasPorAntivirus(antivirusCodigo: number): void {
    if (antivirusCodigo) {
      this.consultarAntivirusPoliticaService.listarPorAntivirus(antivirusCodigo).subscribe({
        next: (data) => {
          this.politicasList = data;
        },
        error: () => {
          this.notificacionSnackbarService.error('Error', 'No se pudieron cargar politicas');
          this.politicasList = [];
        }
      });
    } else {
      this.politicasList = [];
    }
  }


  cargarBackups(): void {
    this.consultarBackupService.listarActivos().subscribe({
      next: (data) => {
        this.backupList = data;
      },
      error: () => {
        console.warn('No se pudieron cargar backups');
        this.backupList = [];
      }
    });
  }


  cargarBackupInformacion(backupCodigo: number): void {
    if (backupCodigo) {
      this.consultarBackupInformacionService.listarPorBackup(backupCodigo).subscribe({
        next: (data) => {
          this.backupInformacionList = data;
        },
        error: () => {
          this.notificacionSnackbarService.error('Error', 'No se pudo cargar informacion de backup');
          this.backupInformacionList = [];
        }
      });
    } else {
      this.backupInformacionList = [];
    }
  }


  cargarCorreos(): void {
    this.consultarCorreoService.listarActivos().subscribe({
      next: (data) => {
        this.correosList = data;
      },
      error: (err) => {
        console.error('Error al cargar correos:', err);
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar los correos');
      }
    });
  }


  onCorreoSeleccionado(): void {
    const correo = this.correosList.find(c => c.codigo === Number(this.panelCorreo.correoCodigo));
    if (correo) {
      // Generar nombre con prefijo Z-
      this.backupFormData.nombre = this.generarNombreBackup(correo.direccion);
      // NO asignar programa automáticamente
      // NO tocar backupFormData.backupCodigo
      this.actualizarNombreBackup(); // Ajusta prefijo Z- según programa actual (si hay)
      this.panelCorreo.realizarBackup = false;
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
    this.paso = 1;
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
      ? this.equipo.fechaAsignacion
      : this.fechaAsignacion;

    if (!fechaAsignacionStr) return true; // Si no hay fecha de asignacion, no validar

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



  // ================ NAVEGACION POR PASOS   ====================


  irAlDetalle(): void {
    this.paso = 2;
  }

  irAlPaso3(): void {
    this.paso = 3;
  }


  // ==================== ACCIONES PRINCIPALES ====================


  cerrar(): void {
    this.dialogRef.close({ success: false });
  }


  asignar(): void {
    // Validaciones iniciales
    if (this.yaAsignada) {
      this.notificacionSnackbarService.warning('Equipo ya asignado', 'Este equipo ya tiene una asignacion activa. Use Reasignar o Devolver.');
      return;
    }

    if (!this.empleadoSeleccionado) {
      this.notificacionSnackbarService.warning('Empleado requerido', 'Seleccione un empleado');
      return;
    }

    if (!this.empleadoSeleccionado.cedula || this.empleadoSeleccionado.cedula.trim() === '') {
      this.notificacionSnackbarService.error('Error', 'El empleado seleccionado no tiene cedula valida');
      return;
    }

    if (!this.empleadoSeleccionado.area?.codigo) {
      this.notificacionSnackbarService.error('Error', 'El empleado seleccionado no tiene un area asignada');
      return;
    }

    if (!this.fechaAsignacion) {
      this.notificacionSnackbarService.warning('Fecha requerida', 'Seleccione una fecha de asignacion');
      return;
    }

    // Formatear observaciones
    const observacionesFormateadas = this.observaciones?.trim()
      ? `ASIGNACION: ${this.observaciones}`
      : 'ASIGNACION: SIN OBSERVACIONES';

    // Armar el objeto detalle
    const detalleData = {
      nombreEquipo: this.detalle?.nombreEquipo || '',
      nombreUsuario: this.detalle?.nombreUsuario || '',
      claveUsuario: this.detalle?.claveUsuario || '',
      nombreUsuarioAdministrador: this.detalle?.nombreUsuarioAdministrador || '',
      claveUsuarioAdministrador: this.detalle?.claveUsuarioAdministrador || '',
      nombreUsuarioAdicional: this.detalle?.nombreUsuarioAdicional || '',
      claveUsuarioAdicional: this.detalle?.claveUsuarioAdicional || '',
      ip: this.detalle?.ip || null
    };

    // Payload completo
    const asignacionPayload = {
      empleadoCedula: this.empleadoSeleccionado.cedula,
      areaCodigo: this.empleadoSeleccionado.area.codigo,
      catalogoCodigo: 1,
      tipoCodigo: this.equipo.tipo?.codigo,
      serialActivo: this.equipo.serial,
      fechaAsignacion: this.fechaAsignacion,
      observaciones: observacionesFormateadas,
      detalle: detalleData
    };

    // Enviar al servicio
    this.registrarAsignacionesService.asignar(asignacionPayload).subscribe({
      next: (resp) => {
        //  Solo cerrar el modal aqui, cuando la respuesta es exitosa
        this.notificacionSnackbarService.success('Exito', 'Equipo asignado con detalle');
        this.dialogRef.close({ success: true, data: resp });
      },
      error: (err) => {
        //  Manejar el error sin cerrar el modal (el usuario puede corregir)
        const mensaje = err.error?.error || err.error?.message || 'Error al asignar';
        // No cerrar el modal para permitir que el usuario corrija los datos
      }
    });

  }


  activarDevolucion(): void {
    this.mostrarDevolucion = true;
    this.esReasignacion = false;
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

    if (!this.equipo.asignacionId) {
      this.notificacionSnackbarService.error('Error', 'No se encontro el ID de la asignacion');
      return;
    }

    // Obtener el texto original y limpiarlo
    let textoOriginal = this.equipo.observaciones || '';
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

    this.registrarAsignacionesService.devolver(this.equipo.asignacionId, data).subscribe({
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

    if (!this.equipo.asignacionId) {
      this.notificacionSnackbarService.error('Error', 'No se encontro el ID de la asignacion');
      return;
    }

    // Obtener el texto original y limpiarlo
    let textoOriginal = this.equipo.observaciones || '';
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

    this.registrarAsignacionesService.devolver(this.equipo.asignacionId, data).subscribe({
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


  // Metodo para devolver (reiniciar seleccion)
  devolver(): void {
    this.empleadoSeleccionado = null;
    this.busquedaEmpleado = '';
    this.empleadosFiltrados = this.empleados; //  Restaurar lista completa
    this.fechaDevolucion = '';
  }




  // ====== METODOS PARA UBICACIONES (BACKUP) =====



  // Agregar una nueva ubicacion vacia
  agregarUbicacion(): void {
    this.backupFormData.ubicaciones.push('');
  }


  // Eliminar una ubicacion por indice
  eliminarUbicacion(index: number): void {
    if (this.backupFormData.ubicaciones.length > 1) {
      this.backupFormData.ubicaciones.splice(index, 1);
    } else {
      this.notificacionSnackbarService.warning('Advertencia', 'Debe haber al menos una ubicacion');
    }
  }


  agregarUbicacionExcluida(): void {
    this.backupFormData.ubicacionesExcluidas.push('');
  }


  // Eliminar una ubicacion excluida por indice
  eliminarUbicacionExcluida(index: number): void {
    if (this.backupFormData.ubicacionesExcluidas.length > 1) {
      this.backupFormData.ubicacionesExcluidas.splice(index, 1);
    } else {
      this.notificacionSnackbarService.warning('Advertencia', 'Debe haber al menos una ubicacion excluida');
    }
  }


  trackByIndex(index: number, item: any): number {
    return index;
  }


  cambiarModoUbicacion(modo: string): void {
    this.modoUbicacion = modo;
  }

  agregarUbicacionSegunModo(): void {
    if (this.modoUbicacion === 'normales') {
      this.agregarUbicacion();
    } else {
      this.agregarUbicacionExcluida();
    }
  }


  eliminarUbicacionSegunModo(index: number): void {
    if (this.modoUbicacion === 'normales') {
      this.eliminarUbicacion(index);
    } else {
      this.eliminarUbicacionExcluida(index);
    }
  }


  validarDia(): void {
    const frecuencia = this.backupFormData.frecuencia;
    const dia = this.backupFormData.dia;
    this.errorDia = '';

    if (!frecuencia) return;

    // Si es DIARIO, no se requiere dia
    if (frecuencia === 'DIARIO') {
      this.backupFormData.dia = null;
      this.errorDia = 'No se requiere dia para frecuencia DIARIO';
      // No mostramos notificacion para DIARIO porque es informativo
      return;
    }

    if (dia === null || dia === undefined || dia === '') {
      this.errorDia = 'Debe ingresar un dia';
      // No mostramos notificacion aqui porque es un campo vacio, se mostrará al guardar
      return;
    }

    const numDia = Number(dia);
    if (isNaN(numDia)) {
      this.errorDia = 'Ingrese un numero valido';
      this.notificacionSnackbarService.warning('Dia invalido', 'Ingrese un numero valido para el dia');
      return;
    }

    let valido = true;
    if (frecuencia === 'SEMANAL') {
      if (numDia < 1 || numDia > 7) {
        this.errorDia = 'Para frecuencia SEMANAL, el dia debe ser entre 1 y 7';
        this.notificacionSnackbarService.warning('Dia fuera de rango', 'Para frecuencia SEMANAL, el dia debe ser entre 1 y 7');
        valido = false;
      }
    } else if (frecuencia === 'MENSUAL' || frecuencia === 'MANUAL') {
      if (numDia < 1 || numDia > 30) { // Usamos 30 según lo solicitado
        this.errorDia = 'Para frecuencia MENSUAL o MANUAL, el dia debe ser entre 1 y 30';
        this.notificacionSnackbarService.warning('Dia fuera de rango', 'Para frecuencia MENSUAL o MANUAL, el dia debe ser entre 1 y 30');
        valido = false;
      }
    }

    if (valido) {
      this.errorDia = '';
      // Si era inválido y ahora es válido, no mostramos notificacion de Exito (para no molestar)
    }
  }




  // AUXILIARES 


  actualizarNombreBackup(): void {
    const codigo = this.backupFormData.backupCodigo !== null && this.backupFormData.backupCodigo !== undefined
      ? Number(this.backupFormData.backupCodigo)
      : null;

    // ============================================================
    // CASO ESPECIAL: PANEL DE CORREO
    // ============================================================
    if (this.panelTipo === 'correo') {
      // BACULA (codigo 1): regenerar nombre desde el correo con prefijo "Z-"
      if (codigo === 1) {
        const correo = this.correosList.find(c => c.codigo === Number(this.panelCorreo.correoCodigo));
        if (correo) {
          this.backupFormData.nombre = this.generarNombreBackup(correo.direccion);
        }
      }
      // NO APLICA (0) o sin seleccion (null): limpiar nombre y otros campos
      else if (codigo === null || codigo === 0) {
        this.backupFormData.nombre = '';
        this.backupFormData.frecuencia = '';
        this.backupFormData.dia = null;
      }
      // Otros programas: quitar el prefijo "Z-" si existe
      else {
        if (this.backupFormData.nombre && this.backupFormData.nombre.startsWith('Z-')) {
          this.backupFormData.nombre = this.backupFormData.nombre.slice(2);
        }
      }
      // Salimos para no ejecutar la logica general
      return;
    }

    // ============================================================
    // LOGICA GENERAL (BACKUP, no correo)
    // ============================================================
    const nombreEquipo = this.detalle?.nombreEquipo || '';
    if (codigo === 1) {
      this.backupFormData.nombre = nombreEquipo ? `${nombreEquipo}-FD` : '';
    } else if (codigo === null || codigo === 0) {
      this.backupFormData.nombre = '';
      this.backupFormData.frecuencia = '';
      this.backupFormData.dia = null;
      this.backupFormData.ubicaciones = [''];
      this.backupFormData.ubicacionesExcluidas = [''];
      this.errorDia = '';
      this.validarDia();
    } else {
      this.backupFormData.nombre = nombreEquipo;
    }
  }



  get backupDisabled(): boolean {
    const codigo = this.backupFormData.backupCodigo !== null && this.backupFormData.backupCodigo !== undefined
      ? Number(this.backupFormData.backupCodigo)
      : null;
    // Deshabilitar si no hay seleccion (null) o si es codigo 0 (NO APLICA)
    return codigo === null || codigo === 0;
  }




  // Metodo para obtener el titulo segun el estado
  getTitulo(): string {
    // Si no está asignada
    if (!this.yaAsignada) {
      return 'Asignar Equipo';
    }

    // Si está asignada y está en modo devolucion
    if (this.mostrarDevolucion) {
      if (this.esReasignacion) {
        return 'Reasignacion de Equipo';
      }
      return 'Devolucion de Equipo';
    }

    // Si esta asignada y no en modo devolucion
    return 'Equipo Asignado';
  }



  // Metodos para alternar
  toggleClaveAdmin(): void {
    this.mostrarClaveAdmin = !this.mostrarClaveAdmin;
  }


  toggleClaveUsuario(): void {
    this.mostrarClaveUsuario = !this.mostrarClaveUsuario;
  }


  toggleClaveAdicional(): void {
    this.mostrarClaveAdicional = !this.mostrarClaveAdicional;
  }



  // ==================== PANEL INTERNO (AGREGAR/EDITAR SOFTWARE) ====================

  abrirPanel(tipo: string): void {
    this.panelActivo = true;
    this.panelTipo = tipo;

    if (tipo === 'antivirus') {
      // Cargar antivirus solo si aun no estan cargados
      if (this.antivirusList.length === 0) {
        this.consultarAntivirusService.listarActivos().subscribe({
          next: (data) => {
            this.antivirusList = data;
            // Despues de cargar, proceder con la logica normal
            this.inicializarPanelAntivirus();
          },
          error: () => {
            this.notificacionSnackbarService.error('Error', 'No se pudieron cargar antivirus');
            this.cerrarPanel();
          }
        });
      }

    } else if (tipo === 'backup') {
      if (this.backupList.length === 0) {
        this.cargarBackups();
      }

      if (this.softwareSeleccionado.backupGeneral) {
        const backup = this.softwareSeleccionado.backupGeneral;
        if (backup.esNoAplica) {
          this.backupFormData.backupCodigo = 0;
          this.backupFormData.nombre = '';
          this.backupFormData.programa = '';
          this.backupFormData.frecuencia = '';
          this.backupFormData.dia = null;
          this.backupFormData.ubicaciones = [''];
          this.backupFormData.ubicacionesExcluidas = [''];
          this.backupInformacionList = [];
          this.panelTitulo = 'Editar Backup (No Aplica)';
        } else {
          const ubicacionStr = backup.ubicacion || '';
          const ubicacionExcluidaStr = backup.ubicacionExcluida || '';
          const { normales, excluidas } = this.ubicacionParse(ubicacionStr, ubicacionExcluidaStr);

          this.backupFormData.backupCodigo = backup.backupCodigo || null;
          this.backupFormData.nombre = backup.nombreBackup || '';
          this.backupFormData.programa = backup.programa || '';
          this.backupFormData.frecuencia = backup.frecuencia || '';
          this.backupFormData.dia = backup.dia || null;
          this.backupFormData.ubicaciones = normales;
          this.backupFormData.ubicacionesExcluidas = excluidas;

          if (this.backupFormData.backupCodigo) {
            this.cargarBackupInformacion(this.backupFormData.backupCodigo);
          }
          this.panelTitulo = 'Editar Backup';
        }
      } else {
        // Nuevo backup
        this.backupFormData = {
          backupCodigo: null,
          nombre: '',
          programa: '',
          frecuencia: '',
          ubicaciones: [''],
          ubicacionesExcluidas: [''],
          dia: null
        };
        this.actualizarNombreBackup();
        this.backupInformacionList = [];
        this.panelTitulo = 'Agregar Backup';
      }


    } else if (tipo === 'correo') {
      if (this.correosList.length === 0) {
        this.cargarCorreos();
      }
      if (this.backupList.length === 0) {
        this.cargarBackups();
      }

      if (this.softwareSeleccionado.correo) {
        this.panelCorreo.correoCodigo = this.softwareSeleccionado.correo.codigo;

        if (this.softwareSeleccionado.backupCorreo) {
          const bc = this.softwareSeleccionado.backupCorreo;
          this.panelCorreo.realizarBackup = true;
          this.backupFormData.nombre = bc.nombre;
          this.backupFormData.backupCodigo = bc.backupCodigo;
          this.backupFormData.programa = bc.programa || '';
          this.backupFormData.frecuencia = bc.frecuencia;
          this.backupFormData.dia = bc.dia;
          this.backupFormData.ubicaciones = bc.ubicacion?.split(';').filter((s: string) => s) || [''];
          this.backupFormData.ubicacionesExcluidas = bc.ubicacionExcluida?.split(';').filter((s: string) => s) || [''];
        } else {
          this.panelCorreo.realizarBackup = false;
          this.backupFormData = {
            backupCodigo: null,
            nombre: '',
            programa: '',
            frecuencia: '',
            ubicaciones: [''],
            ubicacionesExcluidas: [''],
            dia: null
          };
        }
        this.panelTitulo = 'Editar Correo';
      } else {
        // Nuevo correo
        this.panelCorreo.correoCodigo = null;
        this.panelCorreo.realizarBackup = false;
        this.backupFormData = {
          backupCodigo: null,
          nombre: '',
          programa: '',
          frecuencia: '',
          ubicaciones: [''],
          ubicacionesExcluidas: [''],
          dia: null
        };
        this.panelTitulo = 'Agregar Correo';
      }
    }
  }


  private ubicacionParse(ubicacionStr: string, ubicacionExcluidaStr: string): { normales: string[]; excluidas: string[] } {
    const normales = ubicacionStr ? ubicacionStr.split(';').filter(s => s.trim() !== '') : [''];
    const excluidas = ubicacionExcluidaStr ? ubicacionExcluidaStr.split(';').filter(s => s.trim() !== '') : [''];
    return {
      normales: normales.length > 0 ? normales : [''],
      excluidas: excluidas.length > 0 ? excluidas : ['']
    };
  }


  private inicializarPanelAntivirus(): void {
    // Si ya hay un antivirus seleccionado, precargar sus datos
    if (this.softwareSeleccionado.antivirus) {
      this.panelData = {
        antivirusCodigo: this.softwareSeleccionado.antivirus.antivirusCodigo || null,
        politicaCodigo: this.softwareSeleccionado.antivirus.politicaCodigo || null
      };
      // Cargar politicas del antivirus seleccionado
      if (this.panelData.antivirusCodigo) {
        this.cargarPoliticasPorAntivirus(this.panelData.antivirusCodigo);
      }
      this.panelTitulo = 'Editar Antivirus';
    } else {
      this.panelData = {
        antivirusCodigo: null,
        politicaCodigo: null
      };
      this.politicasList = [];
      this.panelTitulo = 'Agregar Antivirus';
    }
  }


  generarNombreBackup(direccion: string): string {
    if (!direccion) return '';
    let nombreBase = direccion;
    nombreBase = nombreBase.replace('@', '-');
    const partes = nombreBase.split('.');
    if (partes.length > 1) {
      partes.pop();
      nombreBase = partes.join('.');
    }
    nombreBase = nombreBase.replace(/\./g, '-');
    return `Z-${nombreBase}`;
  }






  cerrarPanel(): void {
    this.panelActivo = false;
    this.panelData = { antivirusCodigo: null, politicaCodigo: null };
    this.backupFormData = {
      backupCodigo: null,
      nombre: '',
      programa: '',
      frecuencia: '',
      ubicaciones: [''],
      ubicacionesExcluidas: [''],
      dia: null
    };
    this.panelCorreo = {
      correoCodigo: null,
      realizarBackup: false
    };
    this.modoUbicacion = 'normales';
  }


  guardarPanel(): void {
    if (this.panelTipo === 'antivirus') {
      // Validar que se haya seleccionado antivirus y politica
      if (!this.panelData.antivirusCodigo || !this.panelData.politicaCodigo) {
        this.notificacionSnackbarService.warning('Campos incompletos', 'Seleccione antivirus y politica');
        return;
      }

      // Buscar nombres para mostrar en el resumen
      const antivirus = this.antivirusList.find(a => a.codigo === Number(this.panelData.antivirusCodigo));
      const politica = this.politicasList.find(p => p.codigo === Number(this.panelData.politicaCodigo));

      // Guardar en softwareSeleccionado
      this.softwareSeleccionado.antivirus = {
        antivirusCodigo: this.panelData.antivirusCodigo,
        politicaCodigo: this.panelData.politicaCodigo,
        nombre: antivirus?.nombre || 'Sin nombre',
        politica: politica?.politica || 'Sin politica'
      };
      this.cdr.detectChanges();

      this.cerrarPanel();
    } else if (this.panelTipo === 'backup') {
      const codigo = this.backupFormData.backupCodigo !== null && this.backupFormData.backupCodigo !== undefined
        ? Number(this.backupFormData.backupCodigo)
        : null;

      // Sin seleccion → limpiar
      if (codigo === null) {
        this.softwareSeleccionado.backupGeneral = null;
        this.cdr.detectChanges();
        this.cerrarPanel();
        return;
      }

      // NO APLICA → objeto especial
      if (codigo === 0) {
        this.softwareSeleccionado.backupGeneral = {
          esNoAplica: true,
          nombre: 'NO APLICA',
          nombreBackup: '',
          frecuencia: '',
          dia: null,
          ubicacion: '',
          ubicacionExcluida: ''
        };
        this.cdr.detectChanges();
        this.cerrarPanel();
        return;
      }

      // Validar campos obligatorios
      if (!this.backupFormData.nombre || !this.backupFormData.frecuencia) {
        this.notificacionSnackbarService.warning('Campos incompletos', 'Complete: Nombre y Frecuencia');
        return;
      }

      const frecuencia = this.backupFormData.frecuencia;
      const dia = this.backupFormData.dia;

      if (frecuencia !== 'DIARIO') {
        if (dia === null || dia === undefined) {
          this.notificacionSnackbarService.warning('Dia requerido', 'Debe ingresar un dia para la frecuencia seleccionada');
          return;
        }
        if (frecuencia === 'SEMANAL' && (dia < 1 || dia > 7)) {
          this.notificacionSnackbarService.warning('Dia invalido', 'Para frecuencia SEMANAL, el dia debe ser entre 1 y 7');
          return;
        }
        if ((frecuencia === 'MENSUAL' || frecuencia === 'MANUAL') && (dia < 1 || dia > 31)) {
          this.notificacionSnackbarService.warning('Dia invalido', 'Para frecuencia MENSUAL o MANUAL, el dia debe ser entre 1 y 31');
          return;
        }
      } else {
        // Si es DIARIO, el dia no es necesario, pero si el usuario ingreso uno, lo ignoramos o lo ponemos a null
        // Podemos forzar a null para que no se guarde 
        this.backupFormData.dia = null;
      }


      // Obtener nombre del programa seleccionado
      const programaSeleccionado = this.backupList.find(b => b.codigo === codigo);
      const nombrePrograma = programaSeleccionado?.nombre || 'Sin programa';

      //  Limpiar y unir ubicaciones (cada lista por separado)
      const ubicacionesFiltradas = this.backupFormData.ubicaciones.filter((u: string) => u.trim() !== '');
      const excluidasFiltradas = this.backupFormData.ubicacionesExcluidas.filter((u: string) => u.trim() !== '');

      const ubicacionStr = ubicacionesFiltradas.join(';') || null;
      const ubicacionExcluidaStr = excluidasFiltradas.join(';') || null;

      const infoPayload = {
        nombre: this.backupFormData.nombre,
        frecuencia: this.backupFormData.frecuencia,
        ubicacion: ubicacionStr,
        ubicacionExcluida: ubicacionExcluidaStr, // Campo separado
        dia: this.backupFormData.dia || null,
        backup: { codigo: codigo },
        activo: true
      };

      // Verificar si estamos editando
      const esEdicion = this.softwareSeleccionado.backupGeneral?.backupInformacionCodigo != null;

      if (esEdicion) {
        const id = this.softwareSeleccionado.backupGeneral.backupInformacionCodigo;
        this.registroBackupInformacionService.actualizar(id, infoPayload).subscribe({
          next: (resp) => {
            this.softwareSeleccionado.backupGeneral = {
              backupCodigo: codigo,
              backupInformacionCodigo: id,
              nombre: nombrePrograma,
              nombreBackup: resp.nombre,
              programa: this.backupFormData.programa || 'N/A',
              frecuencia: resp.frecuencia,
              ubicacion: resp.ubicacion,
              ubicacionExcluida: resp.ubicacionExcluida, // Incluir excluidas
              dia: this.backupFormData.dia,
              esNoAplica: false
            };
            this.cdr.detectChanges();
            this.notificacionSnackbarService.success('Exito', 'Backup actualizado');
            this.cerrarPanel();
          },
          error: (err) => {
            const mensaje = err.error?.message || 'Error al actualizar informacion de backup';
            this.notificacionSnackbarService.error('Error', mensaje);
          }
        });
      } else {
        this.registroBackupInformacionService.guardar(infoPayload).subscribe({
          next: (resp) => {
            this.softwareSeleccionado.backupGeneral = {
              backupCodigo: codigo,
              backupInformacionCodigo: resp.codigo,
              nombre: nombrePrograma,
              nombreBackup: resp.nombre,
              programa: this.backupFormData.programa || 'N/A',
              frecuencia: resp.frecuencia,
              ubicacion: resp.ubicacion,
              ubicacionExcluida: resp.ubicacionExcluida,
              dia: resp.dia,
              esNoAplica: false
            };
            this.cdr.detectChanges();
            this.notificacionSnackbarService.success('Exito', 'Backup guardado');
            this.cerrarPanel();
          },
          error: (err) => {
            const mensaje = err.error?.message || 'Error al guardar informacion de backup';
            this.notificacionSnackbarService.error('Error', mensaje);
          }
        });
      }


    } else if (this.panelTipo === 'correo') {
      if (!this.panelCorreo.correoCodigo) {
        this.notificacionSnackbarService.warning('Seleccion requerida', 'Debe seleccionar un correo');
        return;
      }

      const correoSeleccionado = this.correosList.find(c => c.codigo === Number(this.panelCorreo.correoCodigo));
      if (!correoSeleccionado) {
        this.notificacionSnackbarService.error('Error', 'Correo no encontrado');
        this.cerrarPanel();
        return;
      }

      this.softwareSeleccionado.correo = correoSeleccionado;

      if (this.panelCorreo.realizarBackup) {
        // Validar que se haya seleccionado un programa de backup
        if (!this.backupFormData.backupCodigo || this.backupFormData.backupCodigo === 0) {
          this.notificacionSnackbarService.warning('Programa requerido', 'Seleccione un programa de backup');
          return;
        }
        if (!this.backupFormData.frecuencia) {
          this.notificacionSnackbarService.warning('Frecuencia requerida', 'Seleccione una frecuencia para el backup');
          return;
        }

        // Validacion del dia según frecuencia
        const frecuencia = this.backupFormData.frecuencia;
        const dia = this.backupFormData.dia;
        if (frecuencia !== 'DIARIO') {
          if (dia === null || dia === undefined || dia === '') {
            this.notificacionSnackbarService.warning('Dia requerido', 'Debe ingresar un dia para la frecuencia seleccionada');
            return;
          }
          const numDia = Number(dia);
          if (isNaN(numDia)) {
            this.notificacionSnackbarService.warning('Dia inválido', 'Ingrese un número válido para el dia');
            return;
          }
          if (frecuencia === 'SEMANAL' && (numDia < 1 || numDia > 7)) {
            this.notificacionSnackbarService.warning('Dia fuera de rango', 'Para frecuencia SEMANAL, el dia debe ser entre 1 y 7');
            return;
          }
          if ((frecuencia === 'MENSUAL' || frecuencia === 'MANUAL') && (numDia < 1 || numDia > 30)) {
            this.notificacionSnackbarService.warning('Dia fuera de rango', 'Para frecuencia MENSUAL o MANUAL, el dia debe ser entre 1 y 30');
            return;
          }
        } else {
          // Si es DIARIO, no se requiere dia
          this.backupFormData.dia = null;
        }

        // Obtener nombre del programa seleccionado
        const programaSeleccionado = this.backupList.find(b => b.codigo === Number(this.backupFormData.backupCodigo));
        const nombrePrograma = programaSeleccionado?.nombre || 'Sin programa';

        // Preparar ubicaciones
        const ubicacionesFiltradas = this.backupFormData.ubicaciones.filter((u: string) => u.trim() !== '');
        const excluidasFiltradas = this.backupFormData.ubicacionesExcluidas.filter((u: string) => u.trim() !== '');
        const ubicacionStr = ubicacionesFiltradas.join(';') || null;
        const ubicacionExcluidaStr = excluidasFiltradas.join(';') || null;

        const infoPayload = {
          nombre: this.backupFormData.nombre,
          frecuencia: this.backupFormData.frecuencia,
          ubicacion: ubicacionStr,
          ubicacionExcluida: ubicacionExcluidaStr,
          dia: this.backupFormData.dia || null,
          backup: { codigo: Number(this.backupFormData.backupCodigo) },
          activo: true
        };

        const esEdicion = this.softwareSeleccionado.backupCorreo?.backupInformacionCodigo != null;

        if (esEdicion) {
          const id = this.softwareSeleccionado.backupCorreo.backupInformacionCodigo;
          this.registroBackupInformacionService.actualizar(id, infoPayload).subscribe({
            next: (resp) => {
              this.softwareSeleccionado.backupCorreo = {
                backupCodigo: this.backupFormData.backupCodigo,
                backupInformacionCodigo: id,
                nombre: resp.nombre,
                nombreBackup: resp.nombre,
                programa: nombrePrograma,
                frecuencia: resp.frecuencia,
                ubicacion: resp.ubicacion,
                ubicacionExcluida: resp.ubicacionExcluida,
                dia: this.backupFormData.dia,
                esNoAplica: false
              };
              this.cdr.detectChanges();
              this.notificacionSnackbarService.success('Exito', 'Correo y backup actualizados');
              this.cerrarPanel();
            },
            error: (err) => {
              this.notificacionSnackbarService.error('Error', err.error?.message || 'Error al actualizar backup');
            }
          });
        } else {
          this.registroBackupInformacionService.guardar(infoPayload).subscribe({
            next: (resp) => {
              this.softwareSeleccionado.backupCorreo = {
                backupCodigo: this.backupFormData.backupCodigo,
                backupInformacionCodigo: resp.codigo,
                nombre: resp.nombre,
                nombreBackup: resp.nombre,
                programa: nombrePrograma,
                frecuencia: resp.frecuencia,
                ubicacion: resp.ubicacion,
                ubicacionExcluida: resp.ubicacionExcluida,
                dia: this.backupFormData.dia,
                esNoAplica: false
              };
              this.cdr.detectChanges();
              this.notificacionSnackbarService.success('Exito', 'Correo y backup guardados');
              this.cerrarPanel();
            },
            error: (err) => {
              this.notificacionSnackbarService.error('Error', err.error?.message || 'Error al guardar backup');
            }
          });
        }
      } else {
        // Si no se marca backup, limpiar el backup del correo
        this.softwareSeleccionado.backupCorreo = null;
        this.cdr.detectChanges();
        this.notificacionSnackbarService.success('Exito', 'Correo guardado');
        this.cerrarPanel();
      }
    }
  }



}

