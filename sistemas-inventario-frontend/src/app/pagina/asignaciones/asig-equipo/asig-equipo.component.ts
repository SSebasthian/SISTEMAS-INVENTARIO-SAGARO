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

  // Navegacion por pasos - ASIGNACION EQUIPO
  paso: number = 1;

  // Visibilidad de claves - ASIGNACION EQUIPO
  mostrarClaveAdmin: boolean = false;
  mostrarClaveUsuario: boolean = false;
  mostrarClaveAdicional: boolean = false;


  // ==================== DETALLE DEL EQUIPO ====================
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

  // Antivirus y politicas
  antivirusList: any[] = [];
  politicasList: any[] = [];


  // Software seleccionado 
  softwareSeleccionado: any = {
    antivirus: null,
    // backup: null,
  };

  // Panel interno para agregar/editar software
  panelActivo: boolean = false;
  panelTipo: string = ''; // 'antivirus' | 'backup' 
  panelTitulo: string = '';
  panelData: any = {
    antivirusCodigo: null,
    politicaCodigo: null,
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
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
    this.equipo = data.equipo;

    // Verificar si ya esta asignada
    this.yaAsignada = this.equipo.asignado === true;
    if (this.yaAsignada) {
      let obs = this.equipo.observaciones || '';
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
          this.notificacionSnackbarService.error('Error', 'No se pudieron cargar políticas');
          this.politicasList = [];
        }
      });
    } else {
      this.politicasList = [];
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



  // ================ NAVEGACION POR PASOS   ====================


  irAlDetalle(): void {
    this.paso = 2;
  }

  irAlPaso3(): void {
    this.paso = 3;
  }

  cambiarPaso(nuevoPaso: number): void {
    this.paso = nuevoPaso;
  }


  // ==================== ACCIONES PRINCIPALES ====================

  cerrar(): void {
    this.dialogRef.close({ success: false });
  }

  asignar(): void {
    // Validaciones iniciales
    if (this.yaAsignada) {
      this.notificacionSnackbarService.warning('Equipo ya asignado', 'Este equipo ya tiene una asignación activa. Use Reasignar o Devolver.');
      return;
    }

    if (!this.empleadoSeleccionado) {
      this.notificacionSnackbarService.warning('Empleado requerido', 'Seleccione un empleado');
      return;
    }

    if (!this.empleadoSeleccionado.cedula || this.empleadoSeleccionado.cedula.trim() === '') {
      this.notificacionSnackbarService.error('Error', 'El empleado seleccionado no tiene cédula válida');
      return;
    }

    if (!this.empleadoSeleccionado.area?.codigo) {
      this.notificacionSnackbarService.error('Error', 'El empleado seleccionado no tiene un área asignada');
      return;
    }

    if (!this.fechaAsignacion) {
      this.notificacionSnackbarService.warning('Fecha requerida', 'Seleccione una fecha de asignación');
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
        //  Solo cerrar el modal aquí, cuando la respuesta es exitosa
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



  // AUXILIARES


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
      } else {
        this.inicializarPanelAntivirus();
      }
    } else {
      // Por ahora, solo soportamos antivirus
      this.cerrarPanel();
      return;
    }
  }


  private inicializarPanelAntivirus(): void {
    // Si ya hay un antivirus seleccionado, precargar sus datos
    if (this.softwareSeleccionado.antivirus) {
      this.panelData = {
        antivirusCodigo: this.softwareSeleccionado.antivirus.antivirusCodigo || null,
        politicaCodigo: this.softwareSeleccionado.antivirus.politicaCodigo || null
      };
      // Cargar políticas del antivirus seleccionado
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


  cerrarPanel(): void {
    this.panelActivo = false;
    this.panelData = {};
  }

  guardarPanel(): void {
    if (this.panelTipo === 'antivirus') {
      // Validar que se haya seleccionado antivirus y política
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
    } else {
      // Si no es antivirus, cerrar sin hacer nada
      this.cerrarPanel();
    }
  }



}

