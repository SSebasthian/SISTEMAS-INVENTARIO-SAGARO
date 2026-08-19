import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EmpleadoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/EmpleadoRespuesta.interface';
import { ConsultarEmpleadoService } from '../../../arquitectura/servicio/consulta/ConsultarEmpleado.service';
import { RegistrarAsignacionesService } from '../../../arquitectura/servicio/registro/RegistrarAsignaciones.service';
import { A11yModule } from "@angular/cdk/a11y";
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';
import { ConsultarAntivirusPoliticaService } from '../../../arquitectura/servicio/consulta/ConsultarAntivirusPolitica.service';
import { ConsultarBackupService } from '../../../arquitectura/servicio/consulta/ConsultarBackup.service';
import { RegistroBackupInformacionService } from '../../../arquitectura/servicio/registro/RegistroBackupInformacion.service';
import { ConsultarBackupInformacionService } from '../../../arquitectura/servicio/consulta/ConsultarBackupInformacion.service';
import { ConsultarCorreoService } from '../../../arquitectura/servicio/consulta/ConsultarCorreo.service';
import { ConsultarSoftwareTipoService } from '../../../arquitectura/servicio/consulta/ConsultarSoftwareTipo.service';
import { ConsultarSoftwareService } from '../../../arquitectura/servicio/consulta/ConsultarSoftware.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { forkJoin, Observable } from 'rxjs';




@Component({
  selector: 'app-asig-equipo',
  imports: [CommonModule, FormsModule, MatIconModule, A11yModule, MatFormFieldModule, MatAutocompleteModule, MatInputModule],
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
  intentadoAvanzarPaso2: boolean = false;
  intentadoAsignar: boolean = false;


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
  mostrarFormularioBackup: boolean = true;
  correosList: any[] = [];
  configuracionesBackup: any[] = [];
  configuracionSeleccionada: any = null;


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


  // Propiedades del modal
  mostrarModalBackup: boolean = false;
  nuevoBackupNombre: string = '';
  nombreBackupYaExiste: boolean = false;
  private seleccionPrevia: any = null;



  // Datos del panel para backup (incluye multiples ubicaciones)
  backupNombresList: any[] = [];
  backupNombresFiltrados: any[] = [];
  backupsSeleccionados: any[] = [];
  modoUbicacion: string = 'normales';
  errorDia: string = '';
  editandoBackupIndex: number | null = null;
  backupFormData: any = {
    backupCodigo: null,
    nombre: '',
    programa: '',
    frecuencia: '',
    ubicaciones: [''],
    ubicacionesExcluidas: [''],
    dia: null,
    hora: null
  };


  //Correo
  correosFormulario: any[] = [];
  panelCorreo: any = {
    correoCodigo: null,
    realizarBackup: false,
    programa: 1,
  };
  editandoCorreo = false;
  indiceCorreoEditando: number | null = null;
  bloquearCorreo = false;


  // Software Opcional
  softwareTipoOffice: any = null;
  softwareTiposActivos: any[] = [];
  softwarePorTipo: { [key: number]: any[] } = {};
  softwareSeleccionadoOpcional: { [key: number]: any } = {};
  panelTipoOpcionalCodigo: number | null = null;
  panelSeleccionesTemporales: any[] = [];
  officeList: any[] = [];
  softwareSeleccionadoOffice: any = null;




  mostrarModalIP: boolean = false;
  ipsDisponibles: any[] = []; // Lista completa de IPs con estado
  ipSeleccionadaTemporal: number | null = null; // IP seleccionada en el modal




  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AsigEquipoComponent>,
    private empleadoService: ConsultarEmpleadoService,
    private registrarAsignacionesService: RegistrarAsignacionesService,
    private notificacionSnackbarService: NotificacionSnackbarService,
    private consultarBackupService: ConsultarBackupService,
    private consultarBackupInformacionService: ConsultarBackupInformacionService,
    private registroBackupInformacionService: RegistroBackupInformacionService,
    private consultarCorreoService: ConsultarCorreoService,
    private consultarSoftwareTipoService: ConsultarSoftwareTipoService,
    private consultarSoftwareService: ConsultarSoftwareService,
    private consultarAntivirusPoliticaService: ConsultarAntivirusPoliticaService,
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
    this.cargarSoftwareTiposActivos();
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
    this.consultarSoftwareService.listarPorTipo(1).subscribe({
      next: (data) => {
        this.antivirusList = data;
        console.log('Antivirus cargados desde software:', data);
      },
      error: (err) => {
        console.error('Error al cargar antivirus:', err);
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar los antivirus');
      }
    });
  }


  cargarPoliticasPorAntivirus(antivirusCodigo: number): void {
    if (antivirusCodigo) {
      this.consultarAntivirusPoliticaService.listarPorSoftware(antivirusCodigo).subscribe({
        next: (data) => {
          console.log('Politicas recibidas:', data);
          this.politicasList = data;
        },
        error: (err) => {
          console.error('Error al cargar politicas:', err);
          this.notificacionSnackbarService.error('Error', 'No se pudieron cargar politicas');
          this.politicasList = [];
        }
      });
    } else {
      console.warn('Antivirus codigo es null o undefined');
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




  cargarSoftwareTiposActivos(): void {
    this.consultarSoftwareTipoService.listarActivos().subscribe({
      next: (data) => {
        // Guarda el tipo con codigo 2 (si existe)
        this.softwareTipoOffice = data.find(tipo => tipo.codigo === 2) || null;

        // Excluir codigos 1 y 2 (ANTIVIRUS Y OFFICE)
        this.softwareTiposActivos = data.filter(
          tipo => tipo.codigo !== 1 && tipo.codigo !== 2
        );
      },
      error: (err) => {
        console.error('Error al cargar tipos de software:', err);
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar los tipos de software');
      }
    });
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
    const empleadoFechaValido = this.empleadoSeleccionado !== null && !!this.fechaAsignacion;
    const softwareObligatorioValido = this.softwareSeleccionado.antivirus !== null &&
      this.softwareSeleccionadoOffice !== null;
    return empleadoFechaValido && softwareObligatorioValido;
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
    this.intentadoAvanzarPaso2 = true;
    if (!this.esPaso2Valido) {
      this.notificacionSnackbarService.warning('Advertencia', 'Complete todos los campos obligatorios');
      return;
    }
    this.paso = 3;
  }


  // PASO 2 - DETALLE EQUIPO 
  get esPaso2Valido(): boolean {
    const d = this.detalle;
    const nombreEquipo = d.nombreEquipo?.trim() || '';
    const ip = d.ip;
    const usuarioAdmin = d.nombreUsuarioAdministrador?.trim() || '';
    const claveAdmin = d.claveUsuarioAdministrador?.trim() || '';
    const usuario = d.nombreUsuario?.trim() || '';
    const claveUsuario = d.claveUsuario?.trim() || '';
    const usuarioAdicional = d.nombreUsuarioAdicional?.trim() || '';
    const claveAdicional = d.claveUsuarioAdicional?.trim() || '';

    // Validacion: si usuarioAdicional tiene valor, claveAdicional debe tenerlo tambien
    const adicionalValido = (usuarioAdicional === '' && claveAdicional === '') ||
      (usuarioAdicional !== '' && claveAdicional !== '');

    return nombreEquipo !== '' &&
      ip !== null && ip !== undefined && ip >= 1 && ip <= 255 &&
      usuarioAdmin !== '' &&
      claveAdmin !== '' &&
      usuario !== '' &&
      claveUsuario !== '' &&
      adicionalValido;
  }

  get errorAdicional(): boolean {
    const d = this.detalle;
    const usuarioAdicional = d.nombreUsuarioAdicional?.trim() || '';
    const claveAdicional = d.claveUsuarioAdicional?.trim() || '';
    return this.intentadoAvanzarPaso2 &&
      ((usuarioAdicional !== '' && claveAdicional === '') ||
        (usuarioAdicional === '' && claveAdicional !== ''));
  }


  //PASO 3 SOFTWARE OBLIGATORIOS

  get puedeIrPaso3(): boolean {
    const nombreValido = this.detalle.nombreEquipo && this.detalle.nombreEquipo.trim() !== '';
    const ipValida = this.detalle.ip !== null && this.detalle.ip !== undefined && this.detalle.ip >= 1 && this.detalle.ip <= 255;
    return nombreValido && ipValida;
  }


  get esPaso3Valido(): boolean {
    return this.softwareSeleccionado.antivirus !== null &&
      this.softwareSeleccionadoOffice !== null;
  }

  // Getters para errores individuales (usados en el HTML)
  get errorAntivirus(): boolean {
    return this.intentadoAsignar && !this.softwareSeleccionado.antivirus;
  }

  get errorBackup(): boolean {
    return this.intentadoAsignar && (!this.softwareSeleccionado.backups || this.softwareSeleccionado.backups.length === 0);
  }

  get errorCorreo(): boolean {
    return this.intentadoAsignar && this.correosFormulario.length === 0;
  }

  get errorOffice(): boolean {
    return this.intentadoAsignar && !this.softwareSeleccionadoOffice;
  }



  // ==================== METODOS PARA CORREO ==================== 

  get backupListFiltrada(): any[] {
    return this.backupList.filter(b => b.codigo !== 0);
  }

  get correosFiltrados(): any[] {
    // Primero, obtener los codigos de correos ya seleccionados en el formulario
    const codigosSeleccionados = this.correosFormulario.map(c => c.correoCodigo);

    // Luego, filtrar la lista completa:
    // - Excluir codigo 0 (correo ficticio)
    // - Excluir los que ya estan en el formulario
    // - Excluir los que ya estan asignados en la asignacion actual (si existe)
    return this.correosList.filter(c => {
      if (c.codigo === 0) return false;
      if (codigosSeleccionados.includes(c.codigo)) return false;

      // Si ya existe una asignacion (equipo.asignado), excluir correos que ya estan en esa asignacion
      // (esto requiere que el equipo tenga la lista de correos asignados)
      if (this.yaAsignada && this.equipo.correosAsignados) {
        return !this.equipo.correosAsignados.some((ca: any) => ca.codigo === c.codigo);
      }
      return true;
    });
  }

  get backupsDisponibles(): any[] {
    // 1. Filtrar los que NO estan en uso
    const disponibles = this.configuracionesBackup.filter(c => !c.enUso);
    // 2. Agrupar por nombre, quedandonos con el de menor codigo
    const mapa = new Map<string, any>();
    disponibles.forEach(c => {
      // Si no existe en el mapa, o el codigo es menor, lo guardamos
      if (!mapa.has(c.nombre) || c.codigo < mapa.get(c.nombre).codigo) {
        mapa.set(c.nombre, c);
      }
    });
    // 3. Devolver los valores (objetos unicos por nombre)
    return Array.from(mapa.values());
  }

  agregarCorreo(): void {

    if (!this.panelCorreo.correoCodigo) {
      return;
    }

    const correo = this.correosList.find(
      c => c.codigo == this.panelCorreo.correoCodigo
    );

    if (!correo) {
      return;
    }

    // Evitar duplicados
    const existe = this.correosFormulario.some(
      x => x.correoCodigo == this.panelCorreo.correoCodigo
    );

    if (existe) {
      return;
    }

    this.correosFormulario.push({
      correoCodigo: this.panelCorreo.correoCodigo,
      direccion: correo.direccion,
      realizarBackup: this.panelCorreo.realizarBackup,

      backup: this.panelCorreo.realizarBackup
        ? { ...this.backupFormData }
        : null
    });


    // Limpiar formulario para agregar otro
    this.panelCorreo = {
      correoCodigo: null,
      realizarBackup: false
    };

    this.backupFormData = {
      backupCodigo: null,
      nombre: '',
      frecuencia: '',
      dia: null,
      ubicaciones: ['']
    };
  }


  mostrarFormularioParaAgregarOtro(): void {
    this.mostrarFormularioBackup = true;
    this.limpiarCamposBackup();
    this.configuracionSeleccionada = null;
    this.editandoBackupIndex = null;
    this.backupFormData.backupCodigo = null;
  }

  get ubicacionValida(): boolean {
    // Devuelve true si al menos una ubicacion tiene texto no vacio
    return this.backupFormData.ubicaciones.some((u: string) => u.trim() !== '');
  }

  agregarBackupALista(): void {
    // Validaciones iniciales
    if (!this.backupFormData.backupCodigo || !this.backupFormData.nombre) {
      this.notificacionSnackbarService.warning('Datos incompletos', 'Seleccione programa y nombre del backup');
      return;
    }
    if (!this.backupFormData.frecuencia) {
      this.notificacionSnackbarService.warning('Frecuencia requerida', 'Seleccione una frecuencia');
      return;
    }

    if (!this.ubicacionValida) {
      this.notificacionSnackbarService.warning('Ubicacion requerida', 'Debe ingresar al menos una ubicacion');
      return;
    }

    // Validar dia segun frecuencia
    const frecuencia = this.backupFormData.frecuencia;
    const dia = this.backupFormData.dia;
    if (frecuencia !== 'DIARIO') {
      if (!dia || dia < 1 || (frecuencia === 'SEMANAL' && dia > 7) || (frecuencia !== 'SEMANAL' && dia > 30)) {
        this.notificacionSnackbarService.warning('Dia invalido', 'Ingrese un dia valido para la frecuencia seleccionada');
        return;
      }
    }

    // Obtener nombre del programa
    const programaSeleccionado = this.backupList.find(b => b.codigo === Number(this.backupFormData.backupCodigo));
    const nombrePrograma = programaSeleccionado?.nombre || 'Sin programa';

    // Construir objeto backup
    const nuevoBackup = {
      backupCodigo: this.backupFormData.backupCodigo,
      programa: nombrePrograma,
      nombre: this.backupFormData.nombre,
      frecuencia: this.backupFormData.frecuencia,
      dia: this.backupFormData.dia,
      hora: this.backupFormData.hora,
      ubicaciones: [...this.backupFormData.ubicaciones].filter(u => u.trim() !== ''),
      ubicacionesExcluidas: [...this.backupFormData.ubicacionesExcluidas].filter(u => u.trim() !== ''),
      backupInformacionCodigo: this.configuracionSeleccionada?.codigo
        || this.configuracionSeleccionada?.backupInformacionCodigo
        || null
    };

    // Si estamos editando, reemplazar en la posicion guardada
    if (this.editandoBackupIndex !== null) {
      // Reemplazar el backup en la misma posicion
      this.backupsSeleccionados[this.editandoBackupIndex] = nuevoBackup;
      this.editandoBackupIndex = null; // Limpiar estado de edicion
    } else {
      // Nuevo backup: verificar duplicados
      const duplicado = this.backupsSeleccionados.some(
        b => b.nombre === nuevoBackup.nombre && b.backupCodigo === nuevoBackup.backupCodigo
      );
      if (duplicado) {
        this.notificacionSnackbarService.warning('Duplicado', 'Este backup ya esta en la lista');
        return;
      }
      this.backupsSeleccionados.push(nuevoBackup);
    }

    // Limpiar formulario
    this.limpiarCamposBackup();
    this.configuracionSeleccionada = null;
    this.backupFormData.backupCodigo = null;

    // Ocultar formulario y mostrar resumen
    this.mostrarFormularioBackup = false;

    this.cdr.detectChanges();

    this.notificacionSnackbarService.success(
      this.editandoBackupIndex === null ? 'Backup agregado' : 'Backup actualizado',
      `Se ${this.editandoBackupIndex === null ? 'agrego' : 'actualizo'} "${nuevoBackup.nombre}"`
    );
  }


  eliminarBackupDeLista(index: number): void {
    const removido = this.backupsSeleccionados[index];
    this.backupsSeleccionados.splice(index, 1);
    this.notificacionSnackbarService.info('Backup eliminado', `Se elimino "${removido.nombre}" de la lista`);

    // Si no quedan backups, mostrar el formulario
    if (this.backupsSeleccionados.length === 0) {
      this.mostrarFormularioBackup = true;
    }
  }


  guardarBackupCorreo(): void {

    if (!this.panelCorreo.correoCodigo) {
      this.notificacionSnackbarService.warning('Correo requerido', 'Seleccione un correo.');
      return;
    }

    // Verificar duplicado (solo cuando es nuevo)
    if (
      !this.editandoCorreo &&
      this.correosFormulario.some(c => c.correoCodigo === this.panelCorreo.correoCodigo)
    ) {
      this.notificacionSnackbarService.warning('Duplicado', 'El correo ya fue agregado.');
      return;
    }

    if (!this.backupFormData.backupCodigo || this.backupFormData.backupCodigo === 0) {
      this.notificacionSnackbarService.warning('Programa requerido', 'Seleccione un programa de backup.');
      return;
    }

    if (!this.backupFormData.frecuencia) {
      this.notificacionSnackbarService.warning('Frecuencia requerida', 'Seleccione una frecuencia.');
      return;
    }

    // Validar dia
    const frecuencia = this.backupFormData.frecuencia;
    const dia = this.backupFormData.dia;

    if (frecuencia !== 'DIARIO') {

      if (dia === null || dia === undefined || dia === '') {
        this.notificacionSnackbarService.warning('Dia requerido', 'Debe ingresar un dia.');
        return;
      }

      const numDia = Number(dia);

      if (
        isNaN(numDia) ||
        numDia < 1 ||
        (frecuencia === 'SEMANAL' && numDia > 7) ||
        (frecuencia !== 'SEMANAL' && numDia > 30)
      ) {
        this.notificacionSnackbarService.warning('Dia invalido', 'Ingrese un dia valido.');
        return;
      }

    } else {
      this.backupFormData.dia = null;
    }

    const correo = this.correosList.find(c => c.codigo === Number(this.panelCorreo.correoCodigo));

    if (!correo) {
      return;
    }

    const programa = this.backupList.find(
      b => b.codigo === Number(this.backupFormData.backupCodigo)
    );

    const ubicaciones = this.backupFormData.ubicaciones.filter(
      (u: string) => u.trim() !== ''
    );

    if (ubicaciones.length === 0) {
      this.notificacionSnackbarService.warning('Ubicacion requerida', 'Debe ingresar la ubicacion .PST.');
      return;
    }

    const correoGuardar = {
      correoCodigo: correo.codigo,
      direccion: correo.direccion,
      realizarBackup: true,
      backup: {
        backupInformacionCodigo: this.backupFormData.backupInformacionCodigo || null,
        backupCodigo: Number(this.backupFormData.backupCodigo),
        programa: programa?.nombre || '',
        nombre: this.backupFormData.nombre,
        frecuencia: this.backupFormData.frecuencia,
        dia: this.backupFormData.dia,
        hora: this.backupFormData.hora || null,
        ubicaciones: [...ubicaciones]
      }

    };

    // Nuevo o edicion
    if (this.editandoCorreo && this.indiceCorreoEditando !== null) {

      this.correosFormulario[this.indiceCorreoEditando] = correoGuardar;

      this.notificacionSnackbarService.success(
        'Exito', 'Backup actualizado correctamente.');

    } else {

      this.correosFormulario.push(correoGuardar);

      this.notificacionSnackbarService.success(
        'Exito', 'Correo agregado con backup.');

    }



    // Limpiar estado de edicion
    this.editandoCorreo = false;
    this.bloquearCorreo = false;
    this.indiceCorreoEditando = null;
    // Limpiar formulario
    this.panelCorreo = {
      correoCodigo: null,
      realizarBackup: false
    };
    this.backupFormData = this.resetBackupFormData();
    this.modoUbicacion = 'normales';
    this.errorDia = '';
  }


  editarBackupCorreo(item: any, index: number): void {
    // Verificar que el item tenga backup
    if (!item.backup) {
      this.notificacionSnackbarService.warning('Error', 'El correo no tiene informacion de backup');
      return;
    }

    // Activar modo edicion
    this.editandoCorreo = true;
    this.bloquearCorreo = true;
    this.indiceCorreoEditando = index;

    // Cargar datos del correo en el panel
    this.panelCorreo = {
      correoCodigo: item.correoCodigo,
      realizarBackup: true
    };

    // Cargar datos del backup en el formulario
    this.backupFormData = {
      backupCodigo: item.backup.backupCodigo || null,
      backupInformacionCodigo: item.backup.backupInformacionCodigo || null,
      nombre: item.backup.nombre || '',
      programa: item.backup.programa || '',
      frecuencia: item.backup.frecuencia || '',
      dia: item.backup.dia || null,
      hora: item.backup.hora || null,
      ubicaciones: item.backup.ubicaciones?.length ? [...item.backup.ubicaciones] : [''],
      ubicacionesExcluidas: item.backup.ubicacionesExcluidas?.length ? [...item.backup.ubicacionesExcluidas] : ['']
    };

    // Buscar la configuraciLon seleccionada (para el select de NOMBRE BACKUP)
    if (item.backup.backupInformacionCodigo) {
      const config = this.configuracionesBackup.find(c => c.codigo === item.backup.backupInformacionCodigo);
      this.configuracionSeleccionada = config || null;
    } else {
      this.configuracionSeleccionada = null;
    }

    // Forzar actualizacion de la vista
    this.cdr.detectChanges();

    this.notificacionSnackbarService.info('Editando correo', `Editando "${item.direccion}"`);
  }



  volverCorreo(): void {
    this.panelCorreo = {
      correoCodigo: null,
      realizarBackup: false
    };

    this.backupFormData = this.resetBackupFormData();

    this.editandoCorreo = false;
    this.bloquearCorreo = false;
  }



  private resetBackupFormData(): any {
    return {
      backupCodigo: null,
      backupInformacionCodigo: null,
      nombre: '',
      programa: '',
      frecuencia: '',
      ubicaciones: [''],
      ubicacionesExcluidas: [''],
      dia: null,
      hora: null
    };
  }





  // ==================== BACKUP GENERAL EQUIPO ==================

  editarBackup(index: number): void {
    const backup = this.backupsSeleccionados[index];
    if (!backup) return;

    // Guardar el indice que estamos editando
    this.editandoBackupIndex = index;

    // Cargar los datos del backup en el formulario
    this.backupFormData.backupCodigo = backup.backupCodigo;
    this.backupFormData.nombre = backup.nombre;
    this.backupFormData.frecuencia = backup.frecuencia;
    this.backupFormData.dia = backup.dia;
    this.backupFormData.hora = backup.hora;
    this.backupFormData.ubicaciones = backup.ubicaciones.length ? backup.ubicaciones : [''];
    this.backupFormData.ubicacionesExcluidas = backup.ubicacionesExcluidas.length ? backup.ubicacionesExcluidas : [''];

    // Buscar la configuracion seleccionada para cargar el nombre
    if (backup.backupInformacionCodigo) {
      const config = this.configuracionesBackup.find(c => c.codigo === backup.backupInformacionCodigo);
      if (config) {
        this.configuracionSeleccionada = config;
      }
    } else {
      this.configuracionSeleccionada = null;
    }

    // Mostrar formulario
    this.mostrarFormularioBackup = true;

    // Notificar
    this.notificacionSnackbarService.info('Editando backup', `Editando "${backup.nombre}"`);
    this.cdr.detectChanges();
  }




  // ==================== ACCIONES PRINCIPALES ====================


  cerrar(): void {
    this.dialogRef.close({ success: false });
  }


  async asignar(): Promise<void> {
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
      claveUsuarioAdicional: this.detalle?.claveUsuarioAdicional || ''
    };


    // ============================================================
    // CONSTRUCCION DEL ARRAY DE BACKUPS (REUTILIZA backup_informacion)
    // ============================================================


    const backups: any[] = [];

    // Backup general (si existe y no es "NO APLICA")
    if (this.softwareSeleccionado.backups && this.softwareSeleccionado.backups.length > 0) {
      for (const bk of this.softwareSeleccionado.backups) {
        // Si el backup ya tiene ID (existente), usarlo directamente
        if (bk.backupInformacionCodigo) {
          backups.push({
            backupInformacionCodigo: bk.backupInformacionCodigo,
            correoCodigo: 0  // backup general (no asociado a correo)
          });
        } else {
          // Es un backup nuevo → buscar si ya existe en BD (para evitar duplicados)
          const existente = await firstValueFrom(
            this.consultarBackupInformacionService.buscarPorCriterios(
              bk.nombre,
              bk.frecuencia,
              bk.ubicaciones?.length ? bk.ubicaciones.join(';') : null,
              bk.ubicacionesExcluidas?.length ? bk.ubicacionesExcluidas.join(';') : null,
              bk.dia || null,
              bk.hora || null,
              bk.backupCodigo,
              'EQUIPO'
            )
          );

          if (existente) {
            // Reutilizar el existente
            backups.push({
              backupInformacionCodigo: existente.codigo,
              correoCodigo: 0
            });
            bk.backupInformacionCodigo = existente.codigo; // actualizar para futuras referencias
          } else {
            // Crear nuevo backup_informacion
            const infoPayload = {
              nombre: bk.nombre,
              frecuencia: bk.frecuencia,
              ubicacion: bk.ubicaciones?.length ? bk.ubicaciones.join(';') : null,
              ubicacionExcluida: bk.ubicacionesExcluidas?.length ? bk.ubicacionesExcluidas.join(';') : null,
              dia: bk.dia || null,
              hora: bk.hora || null,
              backup: { codigo: bk.backupCodigo },
              activo: true,
              tipo: 'EQUIPO'
            };

            const nueva = await firstValueFrom(
              this.registroBackupInformacionService.guardar(infoPayload)
            );
            backups.push({
              backupInformacionCodigo: nueva.codigo,
              correoCodigo: 0
            });
            bk.backupInformacionCodigo = nueva.codigo;
          }
        }
      }
    }




    // VALIDAR SOFTWARE OBLIGATORIOS

    this.intentadoAsignar = true;

    // Validar software obligatorios
    if (!this.esPaso3Valido) {
      let mensaje = 'Seleccione los software obligatorios:';
      if (!this.softwareSeleccionado.antivirus) mensaje += ' Antivirus';
      if (!this.softwareSeleccionadoOffice) mensaje += ' Office';
      this.notificacionSnackbarService.warning('Advertencia', mensaje);
      return;
    }

    if (this.errorAntivirus) {
      this.notificacionSnackbarService.warning('Advertencia', 'Seleccione un antivirus');
      return;
    }

    if (this.errorBackup) {
      this.notificacionSnackbarService.warning('Advertencia', 'Seleccione un backup');
      return;
    }

    // ============================================================
    // CORREOS CON BACKUP
    // ============================================================

    const correosConBackup: any[] = [];

    if (this.softwareSeleccionado.correos && this.softwareSeleccionado.correos.length > 0) {
      for (const item of this.softwareSeleccionado.correos) {
        if (item.realizarBackup && item.backup) {
          // Si el backup ya tiene ID, reutilizarlo (enviar a 'backups')
          if (item.backup.backupInformacionCodigo) {
            backups.push({
              backupInformacionCodigo: item.backup.backupInformacionCodigo,
              correoCodigo: Number(item.correoCodigo)
            });
          } else {
            // Si es nuevo, enviar a 'correosConBackup' para crearlo
            correosConBackup.push({
              correoCodigo: Number(item.correoCodigo),
              backupData: {
                backupCodigo: item.backup.backupCodigo,
                nombre: item.backup.nombre,
                frecuencia: item.backup.frecuencia,
                ubicaciones: item.backup.ubicaciones || [],
                ubicacionesExcluidas: item.backup.ubicacionesExcluidas || [],
                dia: item.backup.dia,
                hora: item.backup.hora || null,
                tipo: "CORREO"
              }
            });
          }
        }
      }
    }




    // ============================================================
    // LISTA DE SOFTWARE
    // ============================================================

    const softwares: any[] = [];

    // 1. Antivirus (si esta seleccionado)
    if (this.softwareSeleccionado.antivirus) {
      softwares.push({
        softwareCodigo: this.softwareSeleccionado.antivirus.antivirusCodigo,
        politicaCodigo: this.softwareSeleccionado.antivirus.politicaCodigo,
      });
    }

    // 2. Office (si esta seleccionado)
    if (this.softwareSeleccionadoOffice) {
      softwares.push({
        softwareCodigo: this.softwareSeleccionadoOffice.codigo,
        politicaCodigo: 0
      });
    }

    // 3. Software opcional (multiple)
    if (this.softwareSeleccionadoOpcional) {
      // Recorrer cada tipo (clave) de software opcional
      for (const tipoCodigo in this.softwareSeleccionadoOpcional) {
        if (this.softwareSeleccionadoOpcional.hasOwnProperty(tipoCodigo)) {
          const lista = this.softwareSeleccionadoOpcional[tipoCodigo];
          if (Array.isArray(lista) && lista.length > 0) {
            // Si es un array, recorrer cada elemento
            for (const sw of lista) {
              if (sw && sw.codigo) {
                softwares.push({
                  softwareCodigo: sw.codigo,
                  politicaCodigo: 0
                });
              }
            }
          } else if (lista && lista.codigo) {
            // Si es un objeto unico (por si tu implementacion anterior lo dejo asi)
            softwares.push({
              softwareCodigo: lista.codigo,
              politicaCodigo: 0
            });
          }
        }
      }
    }



    // ============================================================
    // PAYLOAD COMPLETO
    // ============================================================
    const asignacionPayload = {
      empleadoCedula: this.empleadoSeleccionado.cedula,
      areaCodigo: this.empleadoSeleccionado.area.codigo,
      catalogoCodigo: 1,
      tipoCodigo: this.equipo.tipo?.codigo,
      serialActivo: this.equipo.serial,
      fechaAsignacion: this.fechaAsignacion,
      observaciones: observacionesFormateadas,
      detalle: detalleData,
      ip: this.detalle?.ip || null,
      backups: backups,
      correosConBackup: correosConBackup,
      softwares: softwares,
    };




    // ============================================================
    // ENVIO AL SERVICIO
    // ============================================================
    this.registrarAsignacionesService.asignar(asignacionPayload).subscribe({
      next: (resp) => {
        // Equipo asignado exitosamente
        this.notificacionSnackbarService.success('Exito', 'Equipo asignado con detalle');

        // Ahora asignar los correos como recursos
        if (this.correosFormulario && this.correosFormulario.length > 0) {
          // Obtener el recursoTipoId para CORREO (asumimos que es 1, ajustar segun BD)
          const recursoTipoIdCorreo = 1; // TODO: obtener de configuracion o servicio

          const asignacionesRecursos: Observable<any>[] = [];
          for (const item of this.correosFormulario) {
            const payload = {
              empleadoCedula: this.empleadoSeleccionado?.cedula,
              tipo: 'CORREO',
              recursoTipoId: recursoTipoIdCorreo,
              recursoId: Number(item.correoCodigo),
              fechaAsignacion: this.fechaAsignacion,
              observaciones: `ASIGNACION DE CORREO`
            };
            asignacionesRecursos.push(
              this.registrarAsignacionesService.asignarRecurso(payload)
            );
          }
          // Ejecutar todas las asignaciones en paralelo
          forkJoin(asignacionesRecursos).subscribe({
            next: () => {
              this.notificacionSnackbarService.success('Exito', 'Correos asignados como recursos');
            },
            error: (err) => {
              console.error('Error al asignar recursos:', err);
              // No mostramos error general porque ya se asigno el equipo
            }
          });
        }
        this.dialogRef.close({ success: true, data: resp });
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

    // Primero devolver el equipo
    this.registrarAsignacionesService.devolver(this.equipo.asignacionId, data).subscribe({
      next: () => {
        this.notificacionSnackbarService.success('Exito', 'Devolucion de equipo registrada');

        // Ahora devolver los recursos activos del empleado
        if (this.empleadoSeleccionado) {
          this.registrarAsignacionesService.listarRecursosPorEmpleado(this.empleadoSeleccionado.cedula).subscribe({
            next: (recursos) => {
              const recursosCorreo = recursos.filter(r => r.recurso.nombre === 'CORREO' && r.activo === true);
              const devoluciones = recursosCorreo.map(r => {
                const payload = {
                  fechaDevolucion: this.fechaDevolucion,
                  observaciones: `Devuelto por devolucion de equipo ${this.equipo.serial}`
                };
                return this.registrarAsignacionesService.devolverRecurso(r.numero, payload);
              });
              if (devoluciones.length > 0) {
                forkJoin(devoluciones).subscribe({
                  next: () => {
                    this.notificacionSnackbarService.success('Exito', 'Correos devueltos correctamente');
                  },
                  error: (err) => console.error('Error devolviendo recursos:', err)
                });
              }
            },
            error: (err) => console.error('Error listando recursos:', err)
          });
        }

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
      // No mostramos notificacion aqui porque es un campo vacio, se mostrara al guardar
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
      if (numDia < 1 || numDia > 30) { // Usamos 30 segun lo solicitado
        this.errorDia = 'Para frecuencia MENSUAL o MANUAL, el dia debe ser entre 1 y 30';
        this.notificacionSnackbarService.warning('Dia fuera de rango', 'Para frecuencia MENSUAL o MANUAL, el dia debe ser entre 1 y 30');
        valido = false;
      }
    }

    if (valido) {
      this.errorDia = '';
      // Si era invalido y ahora es valido, no mostramos notificacion de Exito (para no molestar)
    }
  }




  // AUXILIARES 


  actualizarNombreBackup(): void {
    const codigo = this.backupFormData.backupCodigo !== null && this.backupFormData.backupCodigo !== undefined
      ? Number(this.backupFormData.backupCodigo)
      : null;


    // Limpiar listas (pero no los campos del formulario)
    this.configuracionesBackup = [];
    this.backupNombresList = [];

    if (codigo && codigo !== 0) {
      const tipo = this.panelTipo === 'correo' ? 'CORREO' : 'EQUIPO';
      console.log('Consultando configuraciones para backup', codigo, 'tipo', tipo); // ← LOG

      this.consultarBackupInformacionService.listarPorBackupYTipo(codigo, tipo).subscribe({
        next: (data) => {
          console.log('Datos recibidos del backend:', data); // ← LOG
          this.configuracionesBackup = data.filter(c => c.activo === true);
          this.backupNombresList = [...this.configuracionesBackup];

          // Si el usuario ya tenia seleccionada una configuracion, verificar si aun existe
          if (this.configuracionSeleccionada) {
            const existe = this.configuracionesBackup.some(
              c => c.backupInformacionCodigo === this.configuracionSeleccionada.backupInformacionCodigo
            );
            if (!existe || this.configuracionSeleccionada.enUso) {
              this.configuracionSeleccionada = null;
              this.limpiarCamposBackup();
            }
          }

          // Si el modal esta abierto, actualizar el filtro (opcional)
          if (this.mostrarModalBackup) {
            this.filtrarNombresBackup();
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar configuraciones de backup:', err);
          this.configuracionesBackup = [];
          this.backupNombresList = [];
          this.configuracionSeleccionada = null;
        }
      });
    } else {
      // Si no hay programa seleccionado (null o 0), limpiar todo
      this.configuracionesBackup = [];
      this.backupNombresList = [];
      this.configuracionSeleccionada = null;
    }

  }


  seleccionarConfiguracionBackup(config: any): void {
    if (config === null) {
      // El usuario selecciono "CREAR NUEVO" → abrir modal
      this.seleccionPrevia = this.configuracionSeleccionada;
      this.abrirModalBackup();
      // Restaurar la seleccion previa para que el select no se quede en "CREAR NUEVO"
      setTimeout(() => {
        if (this.seleccionPrevia !== undefined) {
          this.configuracionSeleccionada = this.seleccionPrevia;
        }
      }, 0);
      return;
    }
    this.backupFormData.backupInformacionCodigo = config.codigo || null;
    // Selecciono una configuracion existente
    this.seleccionPrevia = undefined;
    this.configuracionSeleccionada = config;
    this.backupFormData.nombre = config.nombre;
    this.backupFormData.frecuencia = config.frecuencia || '';
    this.backupFormData.dia = config.dia || null;
    this.backupFormData.hora = config.hora || null;
    this.backupFormData.ubicaciones = config.ubicacion ? config.ubicacion.split(';') : [''];
    this.backupFormData.ubicacionesExcluidas = config.ubicacionExcluida ? config.ubicacionExcluida.split(';') : [''];
  }




  private limpiarCamposBackup(): void {
    this.backupFormData.nombre = '';
    this.backupFormData.frecuencia = '';
    this.backupFormData.dia = null;
    this.backupFormData.hora = null;
    this.backupFormData.ubicaciones = [''];
    this.backupFormData.ubicacionesExcluidas = [''];
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
    // Si no esta asignada
    if (!this.yaAsignada) {
      return 'Asignar Equipo';
    }

    // Si esta asignada y esta en modo devolucion
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




  // MODAL PARA CREAR NOMBRE DE BACKUP
  // Metodo para abrir el modal
  abrirModalBackup(): void {
    this.nuevoBackupNombre = '';
    this.nombreBackupYaExiste = false;
    this.mostrarModalBackup = true;

    // Tomar la lista ya cargada
    this.backupNombresList = [...this.configuracionesBackup];
    this.backupNombresFiltrados = []; // Sin sugerencias al abrir

    // Si no hay datos, recargar
    if (this.backupNombresList.length === 0) {
      const codigo = this.backupFormData.backupCodigo;
      if (codigo && codigo !== 0) {
        const tipo = this.panelTipo === 'correo' ? 'CORREO' : 'EQUIPO';
        this.consultarBackupInformacionService.listarPorBackupYTipo(codigo, tipo).subscribe({
          next: (data) => {
            this.configuracionesBackup = data.filter(c => c.activo === true);
            this.backupNombresList = [...this.configuracionesBackup];
            this.backupNombresFiltrados = [];
          },
          error: () => {
            this.backupNombresList = [];
            this.backupNombresFiltrados = [];
          }
        });
      }
    }
  }



  filtrarNombresBackup(): void {
    const termino = this.nuevoBackupNombre?.trim().toLowerCase() || '';
    if (termino.length === 0) {
      this.backupNombresFiltrados = [];
      return;
    }
    this.backupNombresFiltrados = this.backupNombresList.filter(config =>
      config.nombre.toLowerCase().includes(termino)
    );
  }



  seleccionarNombreBackupExistente(event: any): void {
    const nombreSeleccionado = event.option.value;
    const config = this.backupNombresList.find(c => c.nombre === nombreSeleccionado);
    if (config) {
      this.mostrarModalBackup = false;
      this.seleccionarConfiguracionBackup(config);
      this.notificacionSnackbarService.success(
        'Configuracion seleccionada',
        `Se cargo "${config.nombre}" (ya existente)`
      );
      this.nuevoBackupNombre = '';
      this.nombreBackupYaExiste = false;
    }
  }

  // Metodo para cerrar el modal
  cerrarModalBackup(): void {
    this.mostrarModalBackup = false;
    this.nuevoBackupNombre = '';
    this.nombreBackupYaExiste = false;
    // Restaurar la seleccion previa si existe
    if (this.seleccionPrevia !== undefined) {
      this.configuracionSeleccionada = this.seleccionPrevia;
      this.seleccionPrevia = undefined;
    }
  }
  // Metodo para crear el nuevo backup
  crearNuevoBackup(): void {
    const nombre = this.nuevoBackupNombre?.trim().toUpperCase();
    if (!nombre) {
      this.notificacionSnackbarService.warning('Nombre requerido', 'Ingrese un nombre para el backup');
      return;
    }

    // Verificar si ya existe en la lista completa (case-insensitive)
    const existe = this.backupNombresList.some(c => c.nombre.toLowerCase() === nombre.toLowerCase());
    if (existe) {
      this.nombreBackupYaExiste = true;
      this.notificacionSnackbarService.warning(
        'Nombre duplicado',
        'Ya existe una configuracion con este nombre. Seleccionela de la lista o use otro nombre.'
      );
      return;
    }

    this.nombreBackupYaExiste = false;
    this.crearBackupConNombre(nombre);
  }


  private crearBackupConNombre(nombre: string): void {
    this.limpiarCamposBackup();
    this.backupFormData.nombre = nombre;

    const nuevoBackupTemporal = {
      nombre: nombre,
      frecuencia: '',
      dia: null,
      hora: null,
      ubicacion: '',
      ubicacionExcluida: '',
      activo: true,
      esTemporal: true,
      backupInformacionCodigo: null
    };

    // Agregar a ambas listas
    this.configuracionesBackup.push(nuevoBackupTemporal);
    this.backupNombresList.push(nuevoBackupTemporal);
    // No actualizar backupNombresFiltrados (el modal se cerrara)

    this.seleccionarConfiguracionBackup(nuevoBackupTemporal);

    this.mostrarModalBackup = false;
    this.nuevoBackupNombre = '';
    this.nombreBackupYaExiste = false;
    this.seleccionPrevia = undefined;

    this.notificacionSnackbarService.success('Backup creado', `Configuracion "${nombre}" creada correctamente`);
    this.cdr.detectChanges();
  }





  // ==================== PANEL INTERNO (AGREGAR/EDITAR SOFTWARE) ====================

  abrirPanel(tipo: string): void {
    this.panelActivo = true;
    this.panelTipo = tipo;

    if (tipo === 'antivirus') {
      // Cargar antivirus desde software con tipo ANTIVIRUS (codigo 2)
      if (this.antivirusList.length === 0) {
        this.consultarSoftwareService.listarPorTipo(1).subscribe({
          next: (data) => {
            this.antivirusList = data;
            this.inicializarPanelAntivirus();
          },
          error: () => {
            this.notificacionSnackbarService.error('Error', 'No se pudieron cargar antivirus');
            this.cerrarPanel();
          }
        });
      } else {
        // Ya estan cargados, inicializar directamente
        this.inicializarPanelAntivirus();
      }


    } else if (tipo === 'backup') {
      if (this.backupList.length === 0) {
        this.cargarBackups();
      }

      // Cargar backups existentes si los hay
      if (this.softwareSeleccionado.backups && this.softwareSeleccionado.backups.length > 0) {
        this.backupsSeleccionados = [...this.softwareSeleccionado.backups];
        this.mostrarFormularioBackup = false;
      } else {
        this.backupsSeleccionados = [];
        this.mostrarFormularioBackup = true;
      }

      // Limpiar formulario
      this.backupFormData = this.resetBackupFormData();
      this.backupInformacionList = [];
      this.panelTitulo = 'Agregar Backup';


    } else if (tipo === 'correo') {
      if (this.correosList.length === 0) {
        this.cargarCorreos();
      }
      if (this.backupList.length === 0) {
        this.cargarBackups();
      }

      // Cargar correos previamente guardados a la lista temporal
      if (this.softwareSeleccionado.correos?.length) {
        this.correosFormulario = [...this.softwareSeleccionado.correos];
      } else {
        this.correosFormulario = [];
      }


      this.panelCorreo = {
        correoCodigo: null,
        realizarBackup: false
      };

      this.backupFormData = this.resetBackupFormData();
      this.modoUbicacion = 'normales';

      this.panelTitulo = 'Administrar Correos';


    } else if (tipo === 'office') {
      // Cargar la lista de software de tipo 2 (Office) si no esta cargada
      if (this.officeList.length === 0) {
        this.consultarSoftwareService.listarPorTipo(2).subscribe({
          next: (data) => {
            this.officeList = data;
            // Precargar la seleccion actual si existe
            this.panelData.softwareCodigo = this.softwareSeleccionadoOffice?.codigo || null;
            this.panelActivo = true;
            this.panelTipo = 'office';
            this.panelTitulo = 'Seleccionar Office';
          },
          error: () => {
            this.notificacionSnackbarService.error('Error', 'No se pudo cargar el software de Office');
            this.cerrarPanel();
          }
        });
      } else {
        // Si ya esta cargada, solo preparar el panel
        this.panelData.softwareCodigo = this.softwareSeleccionadoOffice?.codigo || null;
        this.panelActivo = true;
        this.panelTipo = 'office';
        this.panelTitulo = 'Seleccionar Office';
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
    if (this.softwareSeleccionado.antivirus) {
      this.panelData.antivirusCodigo = this.softwareSeleccionado.antivirus.antivirusCodigo || null;
      this.panelData.politicaCodigo = this.softwareSeleccionado.antivirus.politicaCodigo || null;
      if (this.panelData.antivirusCodigo) {
        this.cargarPoliticasPorAntivirus(this.panelData.antivirusCodigo);
      }
      this.panelTitulo = 'Editar Antivirus';
    } else {
      this.panelData.antivirusCodigo = null;
      this.panelData.politicaCodigo = null;
      this.politicasList = [];
      this.panelTitulo = 'Agregar Antivirus';
    }
  }


  cerrarPanel(): void {
    this.panelActivo = false;
    this.panelTipo = '';
    this.panelTipoOpcionalCodigo = null;
    this.panelSeleccionesTemporales = [];
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
      if (this.backupsSeleccionados.length === 0) {
        this.softwareSeleccionado.backups = [];
        this.softwareSeleccionado.backup = false;
      } else {
        // Guarda los backups en softwareSeleccionado
        this.softwareSeleccionado.backups = [...this.backupsSeleccionados];
        this.softwareSeleccionado.backup = true;
      }
      this.cdr.detectChanges();
      this.cerrarPanel();
      this.notificacionSnackbarService.success('Exito', `${this.backupsSeleccionados.length} backup(s) guardado(s)`);

    } else if (this.panelTipo === 'correo') {


      this.softwareSeleccionado.correos = [...this.correosFormulario];
      this.cdr.detectChanges();

      this.notificacionSnackbarService.success('Exito', 'Correos guardados');
      this.cerrarPanel();


    } else if (this.panelTipo === 'softwareOpcional') {
      const tipoCodigo = this.panelTipoOpcionalCodigo;
      if (!tipoCodigo) {
        this.notificacionSnackbarService.warning('Error', 'Tipo de software no valido');
        return;
      }
      // Guardar todas las selecciones temporales
      this.softwareSeleccionadoOpcional[tipoCodigo] = [...this.panelSeleccionesTemporales];
      this.notificacionSnackbarService.success(
        'Exito',
        `Se seleccionaron ${this.panelSeleccionesTemporales.length} programa(s)`
      );
      this.cerrarPanel();
    } else if (this.panelTipo === 'office') {
      const codigo = this.panelData.softwareCodigo;
      if (codigo) {
        const codigoNum = Number(codigo); // ← forzar a numero
        const software = this.officeList.find(s => s.codigo === codigoNum);
        if (software) {
          this.softwareSeleccionadoOffice = software;
          this.notificacionSnackbarService.success('Exito', `Office: ${software.nombre} seleccionado`);
        } else {
          this.notificacionSnackbarService.error('Error', 'Software no encontrado');
          return;
        }
      } else {
        this.softwareSeleccionadoOffice = null;
        this.notificacionSnackbarService.info('Seleccion eliminada', 'Office desasignado');
      }
      this.cerrarPanel();
    }
  }


  // PANEL SOFTWARE OPCIONAL

  private procesarSeleccionOffice(): void {
    const codigo = this.panelData.softwareCodigo;
    if (codigo) {
      const codigoNum = Number(codigo);
      const software = this.officeList.find(s => s.codigo === codigoNum);
      if (software) {
        this.softwareSeleccionadoOffice = software;
        this.notificacionSnackbarService.success('Exito', `Office: ${software.nombre} seleccionado`);
      } else {
        this.notificacionSnackbarService.error('Error', 'Software no encontrado');
        return;
      }
    } else {
      this.softwareSeleccionadoOffice = null;
      this.notificacionSnackbarService.info('Seleccion eliminada', 'Office desasignado');
    }
    this.cerrarPanel();
  }

  obtenerNombreTipo(codigo: number): string {
    const tipo = this.softwareTiposActivos.find(t => t.codigo === codigo);
    return tipo ? tipo.descripcion : 'Software';
  }

  toggleSeleccionSoftware(software: any): void {
    const index = this.panelSeleccionesTemporales.findIndex(s => s.codigo === software.codigo);
    if (index > -1) {
      this.panelSeleccionesTemporales.splice(index, 1);
    } else {
      this.panelSeleccionesTemporales.push(software);
    }
  }

  estaSeleccionado(software: any): boolean {
    return this.panelSeleccionesTemporales.some(s => s.codigo === software.codigo);
  }


  abrirPanelOpcional(tipoCodigo: number): void {
    this.panelActivo = true;
    this.panelTipo = 'softwareOpcional';
    this.panelTipoOpcionalCodigo = tipoCodigo;

    if (!this.softwarePorTipo[tipoCodigo]) {
      this.consultarSoftwareService.listarPorTipo(tipoCodigo).subscribe({
        next: (data) => {
          this.softwarePorTipo[tipoCodigo] = data;
          // Cargar selecciones previas (si existen) como array
          this.panelSeleccionesTemporales = this.softwareSeleccionadoOpcional[tipoCodigo] || [];
        },
        error: (err) => {
          console.error('Error al cargar software del tipo', tipoCodigo, err);
          this.notificacionSnackbarService.error('Error', 'No se pudo cargar el software');
          this.cerrarPanel();
        }
      });
    } else {
      // Si ya esta en cache
      this.panelSeleccionesTemporales = this.softwareSeleccionadoOpcional[tipoCodigo] || [];
    }

    const tipo = this.softwareTiposActivos.find(t => t.codigo === tipoCodigo);
    this.panelTitulo = tipo ? this.capitalizarPrimera(tipo.descripcion) : 'Software Opcional';

  }

  private capitalizarPrimera(texto: string): string {
    if (!texto) return '';
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
  }





  // ================================================================
  // METODOS PARA IP
  // ================================================================

  abrirModalIP(): void {
    this.mostrarModalIP = true;
    this.ipSeleccionadaTemporal = this.detalle.ip || null;
    this.cargarIpsParaModal();
  }


  cargarIpsParaModal(): void {
    this.registrarAsignacionesService.obtenerTodasLasIps().subscribe({
      next: (ips) => {
        console.log('Todas las IPs:', ips);
        this.ipsDisponibles = ips;
      },
      error: (err) => {
        console.error('Error al cargar IPs:', err);
        this.ipsDisponibles = [];
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar las IPs');
      }
    });
  }


  seleccionarIpTemporal(ip: any): void {
    // Convertir a numero para comparar correctamente
    const activo = Number(ip.activo);
    const catalogo = Number(ip.catalogoCodigo);

    // Caso 1: IP ocupada (activo === 1)
    if (activo === 1 && catalogo === 1) {
      this.notificacionSnackbarService.warning(
        'IP ocupada',
        `La IP ${ip.ip} ya esta asignada a otro EQUIPO`
      );
      return;
    }

    // Caso 2: IP no apta para equipo (catalogo !== 1)
    if (catalogo !== 1) {
      this.notificacionSnackbarService.warning(
        'IP no apta',
        `La IP ${ip.ip} NO esta configurada para equipos de computo`
      );
      return;
    }

    // Caso 3: IP disponible (activo === 0 y catalogo === 1)
    if (activo === 0 && catalogo === 1) {
      this.ipSeleccionadaTemporal = ip.ip;
      return;
    }

    // Caso 4: cualquier otra situacion (por si acaso)
    this.notificacionSnackbarService.warning(
      'No disponible',
      `La IP ${ip.ip} NO ESTA DISPONIBLE para asignacion`
    );
  }


  confirmarSeleccionIP(): void {
    if (this.ipSeleccionadaTemporal !== null) {
      this.detalle.ip = this.ipSeleccionadaTemporal;
      this.mostrarModalIP = false;
      this.cdr.detectChanges();
      this.notificacionSnackbarService.success('IP seleccionada', `Se  seleccionado la IP ${this.ipSeleccionadaTemporal}`);
    }
  }


  cerrarModalIP(): void {
    this.mostrarModalIP = false;
    this.ipSeleccionadaTemporal = null;
  }

}
