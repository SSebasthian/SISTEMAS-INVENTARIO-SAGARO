import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EmpleadoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/EmpleadoRespuesta.interface';
import { ConsultarEmpleadoService } from '../../../arquitectura/servicio/consulta/ConsultarEmpleado.service';
import { RegistrarAsignacionesService } from '../../../arquitectura/servicio/registro/RegistrarAsignaciones.service';
import { A11yModule } from '@angular/cdk/a11y';
import { firstValueFrom } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';
import { ConsultarAntivirusPoliticaService } from '../../../arquitectura/servicio/consulta/ConsultarAntivirusPolitica.service';
import { RegistroBackupInformacionService } from '../../../arquitectura/servicio/registro/RegistroBackupInformacion.service';
import { ConsultarBackupInformacionService } from '../../../arquitectura/servicio/consulta/ConsultarBackupInformacion.service';
import { ConsultarCorreoService } from '../../../arquitectura/servicio/consulta/ConsultarCorreo.service';
import { ConsultarSoftwareTipoService } from '../../../arquitectura/servicio/consulta/ConsultarSoftwareTipo.service';
import { ConsultarSoftwareService } from '../../../arquitectura/servicio/consulta/ConsultarSoftware.service';
import { ConsultarAsignacionesService } from '../../../arquitectura/servicio/consulta/ConsultarAsignaciones.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { forkJoin, Observable } from 'rxjs';


@Component({
  selector: 'app-asig-equipo',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    A11yModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatInputModule,
  ],
  templateUrl: './asig-equipo.component.html',
  styleUrl: './asig-equipo.component.css',
})
export class AsigEquipoComponent {


  // ================================================================
  // PROPIEDADES DEL COMPONENTE
  // ================================================================

  equipo: any;
  yaAsignada: boolean = false;
  esReasignacion: boolean = false;
  mostrarDevolucion: boolean = false;
  errorFechaDevolucion: boolean = false;

  fechaAsignacion: string = new Date().toISOString().split('T')[0];
  fechaDevolucion: string = '';

  observaciones: string = '';
  observacionesOriginal: string = '';
  detalleDevolucion: string = '';

  empleados: EmpleadoLlamarDatos[] = [];
  empleadosFiltrados: EmpleadoLlamarDatos[] = [];
  busquedaEmpleado: string = '';
  empleadoSeleccionado: EmpleadoLlamarDatos | null = null;

  imagenModeloSeleccionado: SafeResourceUrl = '';

  paso: number = 1;
  intentadoAvanzarPaso2: boolean = false;
  intentadoAsignar: boolean = false;

  mostrarClaveAdmin: boolean = false;
  mostrarClaveUsuario: boolean = false;
  mostrarClaveAdicional: boolean = false;

  detalle: any = {
    nombreEquipo: '',
    ip: null,
    nombreUsuario: '',
    claveUsuario: '',
    nombreUsuarioAdministrador: 'SISTEMAS',
    claveUsuarioAdministrador: '',
    nombreUsuarioAdicional: '',
    claveUsuarioAdicional: '',
  };

  antivirusList: any[] = [];
  politicasList: any[] = [];
  backupList: any[] = [];
  backupInformacionList: any[] = [];
  mostrarFormularioBackup: boolean = true;
  correosList: any[] = [];
  configuracionesBackup: any[] = [];
  configuracionSeleccionada: any = null;
  softwareSeleccionadoBackup: any = null;

  softwareSeleccionado: any = {
    antivirus: null,
    backupGeneral: null,
    backupCorreo: null,
    correo: null,
  };

  panelActivo: boolean = false;
  panelTipo: string = '';
  panelTitulo: string = '';

  panelData: any = {
    antivirusCodigo: null,
    politicaCodigo: null,
  };

  mostrarModalBackup: boolean = false;
  nuevoBackupNombre: string = '';
  nombreBackupYaExiste: boolean = false;
  private seleccionPrevia: any = null;

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
    hora: null,
  };

  correosFormulario: any[] = [];
  panelCorreo: any = {
    correoCodigo: null,
    realizarBackup: false,
    programa: 1,
  };
  editandoCorreo = false;
  indiceCorreoEditando: number | null = null;
  bloquearCorreo = false;
  editandoBackupExistente: boolean = false;
  mostrarAyudaCorreo: boolean = false;

  softwareTipoOffice: any = null;
  softwareTiposActivos: any[] = [];
  softwarePorTipo: { [key: number]: any[] } = {};
  softwareSeleccionadoOpcional: { [key: number]: any } = {};
  panelTipoOpcionalCodigo: number | null = null;
  panelSeleccionesTemporales: any[] = [];
  officeList: any[] = [];
  softwareSeleccionadoOffice: any = null;

  mostrarModalIP: boolean = false;
  ipsDisponibles: any[] = [];
  ipSeleccionadaTemporal: number | null = null;

  detalleEquipo: any = null;
  mostrarClaveAdminDetalle: boolean = false;
  mostrarClaveUsuarioDetalle: boolean = false;
  mostrarClaveAdicionalDetalle: boolean = false;
  softwareAsignadoList: any[] = [];
  programaSeleccionadoEsNoAplica: boolean = false;


  modoEdicion: boolean = false;
  intentadoGuardar: boolean = false;

  modoEliminarSoftware: boolean = false;
  mostrarModalEliminar: boolean = false;
  softwareAEliminar: any = null;
  indiceAEliminar: number = -1;

  modoAgregarSoftware: boolean = false;
  categoriaSeleccionada: number | null = null;
  softwareSeleccionadosParaAgregar: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AsigEquipoComponent>,
    private empleadoService: ConsultarEmpleadoService,
    private registrarAsignacionesService: RegistrarAsignacionesService,
    private notificacionSnackbarService: NotificacionSnackbarService,
    private consultarBackupInformacionService: ConsultarBackupInformacionService,
    private registroBackupInformacionService: RegistroBackupInformacionService,
    private consultarCorreoService: ConsultarCorreoService,
    private consultarSoftwareTipoService: ConsultarSoftwareTipoService,
    private consultarSoftwareService: ConsultarSoftwareService,
    private consultarAntivirusPoliticaService: ConsultarAntivirusPoliticaService,
    private consultarAsignacionesService: ConsultarAsignacionesService,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {
    this.equipo = data.equipo;
    this.yaAsignada = this.equipo.asignado === true;

    if (this.yaAsignada) {
      let obs = this.equipo.observaciones || '';
      this.observacionesOriginal = obs.replace(/^ASIGNACION:\s*/, '');
      this.cargarDetalleEquipo(this.equipo.serial);
    }

    this.cargarEmpleados();
    this.cargarImagenModelo();
    this.cargarSoftwareTiposActivos();
    this.cargarAntivirus();
    this.cargarBackups();
  }

  // ==================== CARGA DE DATOS ====================

  cargarEmpleados(): void {
    this.empleadoService.listarEmpleadosActivos().subscribe({
      next: (data) => {
        this.empleados = data;
        this.empleadosFiltrados = data;
      },
      error: (err) => console.error('Error al cargar empleados:', err),
    });
  }

  cargarImagenModelo(): void {
    if (this.equipo?.modelo?.rutaImagen) {
      let urlLimpia = this.equipo.modelo.rutaImagen.split('&token=')[0];
      this.imagenModeloSeleccionado =
        this.sanitizer.bypassSecurityTrustResourceUrl(urlLimpia);
    } else {
      this.imagenModeloSeleccionado = '';
    }
  }

  cargarAntivirus(): void {
    this.consultarSoftwareService.listarPorTipo(1).subscribe({
      next: (data) => (this.antivirusList = data),
      error: (err) => {
        console.error('Error al cargar antivirus:', err);
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar los antivirus');
      },
    });
  }

  cargarPoliticasPorAntivirus(antivirusCodigo: number): void {
    if (antivirusCodigo && antivirusCodigo !== 0) {
      this.consultarAntivirusPoliticaService.listarPorSoftware(antivirusCodigo).subscribe({
        next: (data) => {
          this.politicasList = data;
          // Si el antivirus es "SIN PROTECCION" (codigo 1), asignar automaticamente la politica (codigo 1)
          if (antivirusCodigo === 1) {
            const politicaNoProteccion = data.find(p => p.codigo === 1);
            this.panelData.politicaCodigo = politicaNoProteccion ? 1 : null;
          } else {
            // Para otros antivirus, limpiar seleccion de politica
            this.panelData.politicaCodigo = null;
          }
        },
        error: (err) => {
          console.error('Error al cargar politicas:', err);
          this.notificacionSnackbarService.error('Error', 'No se pudieron cargar politicas');
          this.politicasList = [];
          this.panelData.politicaCodigo = null;
        },
      });
    } else {
      this.politicasList = [];
      this.panelData.politicaCodigo = null;
    }
  }


  cargarBackups(): void {
    // Obtiene los programas de backup desde la tabla software (tipo 2)
    this.consultarSoftwareService.listarPorTipo(2).subscribe({
      next: (data) => {
        this.backupList = data;
      },
      error: (err) => {
        console.error('Error al cargar programas de backup:', err);
        this.backupList = [];
      },
    });
  }

  cargarBackupInformacion(softwareCodigo: number): void {
    if (softwareCodigo) {
      this.consultarBackupInformacionService.listarPorSoftware(softwareCodigo).subscribe({
        next: (data) => (this.backupInformacionList = data),
        error: () => {
          this.notificacionSnackbarService.error('Error', 'No se pudo cargar informacion de backup');
          this.backupInformacionList = [];
        },
      });
    } else {
      this.backupInformacionList = [];
    }
  }

  cargarCorreos(): void {
    this.consultarCorreoService.listarDisponibles().subscribe({
      next: (data) => {
        this.correosList = data.map(c => ({
          ...c,
          codigo: Number(c.codigo)
        }));
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
        this.softwareTipoOffice = data.find((tipo) => tipo.codigo === 3) || null;
        // Excluir tambien el codigo 0 (NO APLICA)
        this.softwareTiposActivos = data.filter(
          (tipo) => tipo.codigo !== 1 && tipo.codigo !== 2 && tipo.codigo !== 0
        );
      },
      error: (err) => {
        console.error('Error al cargar tipos de software:', err);
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar los tipos de software');
      },
    });
  }

  cargarDetalleEquipo(serial: string): void {
    this.consultarAsignacionesService.obtenerDetalleActivoDTO(serial).subscribe({
      next: (detalle) => {
        this.detalleEquipo = detalle;
        this.equipo.detalle = detalle;
        this.cdr.detectChanges();
        this.cargarClavesEquipo(serial);
      },
      error: (err) => {
        console.error('Error al cargar detalle:', err);
        this.detalleEquipo = null;
      },
    });
    this.cargarSoftwareAsignado(serial);
  }

  cargarClavesEquipo(serial: string): void {
    this.consultarAsignacionesService.obtenerClavesEquipo(serial).subscribe({
      next: (claves) => {
        if (this.equipo.detalle) {
          this.equipo.detalle.claveUsuario = claves.claveUsuario || '******';
          this.equipo.detalle.claveUsuarioAdministrador =
            claves.claveUsuarioAdministrador || '******';
          this.equipo.detalle.claveUsuarioAdicional =
            claves.claveUsuarioAdicional || '******';
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.error('Error al cargar claves:', err);
        if (this.equipo.detalle) {
          this.equipo.detalle.claveUsuario = '******';
          this.equipo.detalle.claveUsuarioAdministrador = '******';
          this.equipo.detalle.claveUsuarioAdicional = '******';
        }
      },
    });
  }

  cargarSoftwareAsignado(serial: string): void {
    this.consultarAsignacionesService.obtenerSoftwarePorSerial(serial).subscribe({
      next: (software) => {
        this.softwareAsignadoList = software;
        const backupSoftware = software.find((s) => s.tipoCodigo === 2);
        this.softwareSeleccionadoBackup = backupSoftware || null;
        // console.log('Software asignado:', this.softwareAsignadoList);

        if (this.yaAsignada) {
          // Recorrer todos los tipos activos
          this.softwareTiposActivos.forEach(tipo => {
            const instalados = software.filter(sw => sw.tipoCodigo === tipo.codigo);
            if (instalados.length > 0) {
              // Cargar los software disponibles de este tipo
              if (!this.softwarePorTipo[tipo.codigo]) {
                this.consultarSoftwareService.listarPorTipo(tipo.codigo).subscribe({
                  next: (data) => {
                    const disponibles = data.filter(s => s.codigo !== 0);
                    this.softwarePorTipo[tipo.codigo] = disponibles;

                    // Mapear los instalados a la estructura de softwareSeleccionadoOpcional
                    this.softwareSeleccionadoOpcional[tipo.codigo] = disponibles.filter(
                      sw => instalados.some((inst: any) => inst.softwareCodigo === sw.codigo)
                    );
                    this.cdr.detectChanges();
                  }
                });
              } else {
                // Ya está cargado
                const disponibles = this.softwarePorTipo[tipo.codigo];
                this.softwareSeleccionadoOpcional[tipo.codigo] = disponibles.filter(
                  sw => instalados.some((inst: any) => inst.softwareCodigo === sw.codigo)
                );
              }
            }
          });
        }


        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar software asignado:', err);
        this.softwareAsignadoList = [];
      },
    });
  }

  // ==================== FILTROS Y SELECCIoN ====================

  filtrarEmpleados(): void {
    const termino = this.busquedaEmpleado.toLowerCase();
    this.empleadosFiltrados = this.empleados.filter(
      (emp) =>
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
    const softwareObligatorioValido = this.softwareSeleccionado.antivirus !== null;
    return empleadoFechaValido && softwareObligatorioValido;
  }

  // ==================== VALIDACIoN DE FECHAS ====================

  isFechaDevolucionValida(): boolean {
    if (!this.fechaDevolucion) return false;
    const fechaAsignacionStr = this.yaAsignada
      ? this.equipo.fechaAsignacion
      : this.fechaAsignacion;
    if (!fechaAsignacionStr) return true;
    const fechaAsignacion = new Date(fechaAsignacionStr);
    const fechaDevolucion = new Date(this.fechaDevolucion);
    fechaAsignacion.setHours(0, 0, 0, 0);
    fechaDevolucion.setHours(0, 0, 0, 0);
    return fechaDevolucion >= fechaAsignacion;
  }

  validarFechaDevolucion(): void {
    this.errorFechaDevolucion =
      !!this.fechaDevolucion && !this.isFechaDevolucionValida();
  }

  // ================ NAVEGACIoN POR PASOS ====================

  irAlPaso1(): void {
    this.paso = 1;
  }

  irAlPaso2(): void {
    this.intentadoAvanzarPaso2 = true;
    if (!this.esPaso1Valido) {
      this.notificacionSnackbarService.warning('Advertencia', 'Complete todos los campos obligatorios');
      return;
    }
    this.paso = 2;
  }

  irAlPaso2Asignado(): void {
    this.paso = 2;
  }

  irAlPaso3(): void {
    this.intentadoAsignar = true;
    if (!this.esPaso3Valido) {
      this.notificacionSnackbarService.warning('Advertencia', 'Seleccione un antivirus');
      return;
    }
    if (!this.validarOpcionalesObligatorios()) {
      return;
    }
    this.paso = 3;
  }


  irAlPaso2DesdePaso3(): void {
    this.paso = 2;
  }

  get esPaso1Valido(): boolean {
    const d = this.detalle;
    const nombreEquipo = d.nombreEquipo?.trim() || '';
    const ip = d.ip;
    const usuarioAdmin = d.nombreUsuarioAdministrador?.trim() || '';
    const claveAdmin = d.claveUsuarioAdministrador?.trim() || '';
    const usuario = d.nombreUsuario?.trim() || '';
    const claveUsuario = d.claveUsuario?.trim() || '';
    const usuarioAdicional = d.nombreUsuarioAdicional?.trim() || '';
    const claveAdicional = d.claveUsuarioAdicional?.trim() || '';
    const adicionalValido = (usuarioAdicional === '' && claveAdicional === '') ||
      (usuarioAdicional !== '' && claveAdicional !== '');
    return (
      nombreEquipo !== '' &&
      ip !== null && ip !== undefined && ip >= 1 && ip <= 255 &&
      usuarioAdmin !== '' && claveAdmin !== '' &&
      usuario !== '' && claveUsuario !== '' &&
      adicionalValido
    );
  }

  get esPaso3Valido(): boolean {
    return this.softwareSeleccionado.antivirus !== null;
  }

  get errorAntivirus(): boolean {
    return this.intentadoAsignar &&
      (!this.softwareSeleccionado.antivirus ||
        (this.softwareSeleccionado.antivirus && !this.softwareSeleccionado.antivirus.esNoAplica && !this.softwareSeleccionado.antivirus.antivirusCodigo));
  }

  get errorBackup(): boolean {
    return (
      this.intentadoAsignar &&
      (!this.softwareSeleccionado.backups ||
        this.softwareSeleccionado.backups.length === 0)
    );
  }

  get errorCorreo(): boolean {
    return this.intentadoAsignar && this.correosFormulario.length === 0;
  }

  get errorAdicional(): boolean {
    const d = this.detalle;
    const usuarioAdicional = d.nombreUsuarioAdicional?.trim() || '';
    const claveAdicional = d.claveUsuarioAdicional?.trim() || '';
    return (
      this.intentadoAvanzarPaso2 &&
      ((usuarioAdicional !== '' && claveAdicional === '') ||
        (usuarioAdicional === '' && claveAdicional !== ''))
    );
  }

  // ==================== METODOS PARA CORREO ====================

  get backupListFiltrada(): any[] {
    return this.backupList.filter((b) => b.codigo !== 0);
  }

  get correosFiltrados(): any[] {
    const codigosSeleccionados = this.correosFormulario.map((c) => Number(c.correoCodigo));
    // Devolver todos los correos de la lista (incluyendo el 0) que no esten seleccionados
    return this.correosList.filter(c => !codigosSeleccionados.includes(Number(c.codigo)));
  }

  onCorreoChange(): void {
    // console.log('correo cambiado a:', this.panelCorreo.correoCodigo);
    if (this.esCorreoNoAplica) {
      this.panelCorreo.realizarBackup = false;
    }
  }

  get esCorreoNoAplica(): boolean {
    return Number(this.panelCorreo.correoCodigo) === 0;
  }


  get backupsDisponibles(): any[] {
    const disponibles = this.configuracionesBackup.filter((c) => !c.enUso);
    const mapa = new Map<string, any>();
    disponibles.forEach((c) => {
      if (!mapa.has(c.nombre) || c.codigo < mapa.get(c.nombre).codigo) {
        mapa.set(c.nombre, c);
      }
    });
    return Array.from(mapa.values());
  }

  agregarCorreo(): void {
    if (!this.panelCorreo.correoCodigo) return;
    const correo = this.correosList.find(
      (c) => c.codigo == this.panelCorreo.correoCodigo
    );
    if (!correo) return;
    const existe = this.correosFormulario.some(
      (x) => x.correoCodigo == this.panelCorreo.correoCodigo
    );
    if (existe) return;
    this.correosFormulario.push({
      correoCodigo: this.panelCorreo.correoCodigo,
      direccion: correo.direccion,
      realizarBackup: this.panelCorreo.realizarBackup,
      backup: this.panelCorreo.realizarBackup ? { ...this.backupFormData } : null,
    });
    this.panelCorreo = { correoCodigo: null, realizarBackup: false };
    this.backupFormData = {
      backupCodigo: null,
      nombre: '',
      frecuencia: '',
      dia: null,
      ubicaciones: [''],
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
    return this.backupFormData.ubicaciones.some((u: string) => u.trim() !== '');
  }

  // ==================== AGREGAR BACKUP A LISTA ====================

  agregarBackupALista(): void {
    // NO APLICA (codigo 0)
    if (
      this.backupFormData.backupCodigo === '0' ||
      this.backupFormData.backupCodigo === 0
    ) {
      const nuevoBackup = {
        esNoAplica: true,
        backupInformacionCodigo: null,
        programa: 'NO APLICA',
        nombre: 'NO APLICA',
        frecuencia: 'NO APLICA',
        dia: null,
        hora: null,
        ubicaciones: [],
        ubicacionesExcluidas: [],
      };
      if (this.editandoBackupIndex !== null) {
        this.backupsSeleccionados[this.editandoBackupIndex] = nuevoBackup;
        this.editandoBackupIndex = null;
      } else {
        const yaExiste = this.backupsSeleccionados.some(b => b.esNoAplica === true);
        if (yaExiste) {
          this.notificacionSnackbarService.warning('Duplicado', 'NO APLICA ya esto en la lista');
          return;
        }
        this.backupsSeleccionados.push(nuevoBackup);
      }
      this.limpiarCamposBackup();
      this.configuracionSeleccionada = null;
      this.backupFormData.backupCodigo = null;
      this.softwareSeleccionadoBackup = null;
      this.mostrarFormularioBackup = false;
      this.editandoBackupExistente = false;
      this.cdr.detectChanges();
      this.notificacionSnackbarService.success('Exito', 'NO APLICA guardado correctamente');
      return;
    }

    // BACKUPS NORMALES
    if (
      this.backupFormData.backupCodigo === null ||
      this.backupFormData.backupCodigo === undefined
    ) {
      this.notificacionSnackbarService.warning('Datos incompletos', 'Seleccione un programa de backup');
      return;
    }
    if (!this.backupFormData.nombre) {
      this.notificacionSnackbarService.warning('Datos incompletos', 'Ingrese un nombre para el backup');
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
    const frecuencia = this.backupFormData.frecuencia;
    const dia = this.backupFormData.dia;
    if (frecuencia !== 'DIARIO') {
      if (!dia || dia < 1 || (frecuencia === 'SEMANAL' && dia > 7) || (frecuencia !== 'SEMANAL' && dia > 30)) {
        this.notificacionSnackbarService.warning('Dia involido', 'Ingrese un dia volido');
        return;
      }
    }

    const programaSeleccionado = this.backupList.find(
      (b) => b.codigo === Number(this.backupFormData.backupCodigo)
    );
    const nombrePrograma = programaSeleccionado?.nombre || 'Sin programa';

    const nuevoBackup = {
      backupCodigo: Number(this.backupFormData.backupCodigo),
      backupInformacionCodigo: this.backupFormData.backupInformacionCodigo || null,
      programa: nombrePrograma,
      nombre: this.backupFormData.nombre,
      frecuencia: this.backupFormData.frecuencia,
      dia: this.backupFormData.dia,
      hora: this.backupFormData.hora || null,
      ubicaciones: [...this.backupFormData.ubicaciones].filter((u) => u.trim() !== ''),
      ubicacionesExcluidas: [...this.backupFormData.ubicacionesExcluidas].filter(
        (u) => u.trim() !== ''
      ),
    };

    const esEdicion = this.editandoBackupIndex !== null || this.editandoBackupExistente;
    const id = this.backupFormData.backupInformacionCodigo || this.configuracionSeleccionada?.codigo || null;

    // EDITAR
    if (esEdicion && id) {
      const updatePayload = {
        nombre: nuevoBackup.nombre,
        frecuencia: nuevoBackup.frecuencia,
        ubicacion: nuevoBackup.ubicaciones.join(';'),
        ubicacionExcluida: nuevoBackup.ubicacionesExcluidas.join(';'),
        dia: nuevoBackup.dia || 0,
        hora: nuevoBackup.hora || '00:00:00',
        software: { codigo: nuevoBackup.backupCodigo },
        activo: true,
        tipo: 'EQUIPO',
      };
      this.registroBackupInformacionService.actualizar(id, updatePayload).subscribe({
        next: () => {
          if (this.editandoBackupIndex !== null) {
            this.backupsSeleccionados[this.editandoBackupIndex] = nuevoBackup;
            this.editandoBackupIndex = null;
          } else {
            const idx = this.backupsSeleccionados.findIndex(
              (b) => b.backupInformacionCodigo === id
            );
            if (idx !== -1) this.backupsSeleccionados[idx] = nuevoBackup;
            else this.backupsSeleccionados.push(nuevoBackup);
          }
          this.actualizarSoftwareBackup(nuevoBackup.backupCodigo);
          this.notificacionSnackbarService.success('Exito', `Backup "${nuevoBackup.nombre}" actualizado`);
          this.limpiarCamposBackup();
          this.configuracionSeleccionada = null;
          this.backupFormData.backupCodigo = null;
          this.mostrarFormularioBackup = false;
          this.editandoBackupExistente = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al actualizar:', err);
          this.notificacionSnackbarService.error('Error', `No se pudo actualizar: ${err.error?.error || err.message}`);
        },
      });
      return;
    }

    // NUEVO
    const duplicado = this.backupsSeleccionados.some(
      (b) => b.nombre === nuevoBackup.nombre && b.backupCodigo === nuevoBackup.backupCodigo
    );
    if (duplicado) {
      this.notificacionSnackbarService.warning('Duplicado', 'Este backup ya esto en la lista');
      return;
    }
    const infoPayload = {
      nombre: nuevoBackup.nombre,
      frecuencia: nuevoBackup.frecuencia,
      ubicacion: nuevoBackup.ubicaciones.join(';'),
      ubicacionExcluida: nuevoBackup.ubicacionesExcluidas.join(';'),
      dia: nuevoBackup.dia || 0,
      hora: nuevoBackup.hora || '00:00:00',
      software: { codigo: nuevoBackup.backupCodigo },
      activo: true,
      tipo: 'EQUIPO',
    };
    this.registroBackupInformacionService.guardar(infoPayload).subscribe({
      next: (respuesta) => {
        nuevoBackup.backupInformacionCodigo = respuesta.codigo || respuesta.id;
        this.backupsSeleccionados.push(nuevoBackup);
        this.actualizarSoftwareBackup(nuevoBackup.backupCodigo);
        this.notificacionSnackbarService.success('Exito', `Backup "${nuevoBackup.nombre}" agregado`);
        this.limpiarCamposBackup();
        this.configuracionSeleccionada = null;
        this.backupFormData.backupCodigo = null;
        this.mostrarFormularioBackup = false;
        this.editandoBackupExistente = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al crear backup:', err);
        this.notificacionSnackbarService.error('Error', 'No se pudo crear el backup');
      },
    });
  }

  actualizarSoftwareBackup(backupCodigo: number): void {
    if (backupCodigo && backupCodigo !== 0) {
      const programa = this.backupList.find((b) => b.codigo === Number(backupCodigo));
      if (programa) {
        this.softwareSeleccionadoBackup = {
          codigo: programa.codigo,
          nombre: programa.nombre,
          rutaImagen: programa.rutaImagen,
          tipoCodigo: 2,
          tipoSoftware: 'BACKUP',
        };
      }
    } else {
      this.softwareSeleccionadoBackup = null;
    }
    this.cdr.detectChanges();
  }

  eliminarBackupDeLista(index: number): void {
    const removido = this.backupsSeleccionados[index];
    this.backupsSeleccionados.splice(index, 1);
    this.notificacionSnackbarService.info('Backup eliminado', `Se elimino "${removido.nombre}" de la lista`);
    if (this.backupsSeleccionados.length === 0) {
      this.mostrarFormularioBackup = true;
    }
  }

  // ==================== GUARDAR BACKUP CORREO ====================

  guardarBackupCorreo(): void {
    if (!this.panelCorreo.correoCodigo) {
      this.notificacionSnackbarService.warning('Correo requerido', 'Seleccione un correo.');
      return;
    }

    // NO APLICA
    if (this.backupFormData.backupCodigo === 0 || this.backupFormData.backupCodigo === '0') {
      this.consultarBackupInformacionService.obtenerPorCodigo(0).subscribe({
        next: (backupInfo) => {
          if (!backupInfo) {
            this.notificacionSnackbarService.error('Error', 'No se encontro la configuracion NO APLICA');
            return;
          }
          const correo = this.correosList.find(
            (c) => c.codigo === Number(this.panelCorreo.correoCodigo)
          );
          if (!correo) return;
          const correoGuardar = {
            correoCodigo: correo.codigo,
            direccion: correo.direccion,
            realizarBackup: false,
            backup: {
              backupInformacionCodigo: 0,
              backupCodigo: 0,
              programa: 'NO APLICA',
              nombre: backupInfo.nombre || 'NO APLICA',
              frecuencia: backupInfo.frecuencia || 'NO APLICA',
              dia: backupInfo.dia || null,
              hora: backupInfo.hora || null,
              ubicaciones: backupInfo.ubicacion
                ? backupInfo.ubicacion.split(';').filter((u: string) => u.trim() !== '')
                : [],
              ubicacionesExcluidas: backupInfo.ubicacionExcluida
                ? backupInfo.ubicacionExcluida.split(';').filter((u: string) => u.trim() !== '')
                : [],
            },
          };
          if (this.editandoCorreo && this.indiceCorreoEditando !== null) {
            this.correosFormulario[this.indiceCorreoEditando] = correoGuardar;
            this.notificacionSnackbarService.success('Exito', 'Correo actualizado correctamente.');
          } else {
            const yaExiste = this.correosFormulario.some(
              (c) => c.correoCodigo === correoGuardar.correoCodigo
            );
            if (yaExiste) {
              this.notificacionSnackbarService.warning('Duplicado', 'El correo ya fue agregado.');
              return;
            }
            this.correosFormulario.push(correoGuardar);
            this.notificacionSnackbarService.success('Exito', 'Correo agregado con NO APLICA.');
          }
          this.limpiarEstadoCorreo();
        },
        error: (err) => {
          console.error('Error al obtener backup_informacion codigo 0:', err);
          this.notificacionSnackbarService.error('Error', 'No se pudo obtener la configuracion NO APLICA');
        },
      });
      return;
    }

    // BACKUPS NORMALES
    if (this.backupFormData.backupCodigo === null || this.backupFormData.backupCodigo === undefined) {
      this.notificacionSnackbarService.warning('Programa requerido', 'Seleccione un programa de backup.');
      return;
    }
    if (!this.backupFormData.frecuencia) {
      this.notificacionSnackbarService.warning('Frecuencia requerida', 'Seleccione una frecuencia.');
      return;
    }
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
        this.notificacionSnackbarService.warning('Dia involido', 'Ingrese un dia volido.');
        return;
      }
    } else {
      this.backupFormData.dia = null;
    }

    const ubicaciones = this.backupFormData.ubicaciones.filter((u: string) => u.trim() !== '');
    if (ubicaciones.length === 0) {
      this.notificacionSnackbarService.warning('Ubicacion requerida', 'Debe ingresar la ubicacion .PST.');
      return;
    }

    const correo = this.correosList.find(
      (c) => c.codigo === Number(this.panelCorreo.correoCodigo)
    );
    if (!correo) return;
    const programa = this.backupList.find(
      (b) => b.codigo === Number(this.backupFormData.backupCodigo)
    );

    const idBackupExistente =
      this.backupFormData.backupInformacionCodigo ||
      this.configuracionSeleccionada?.codigo ||
      null;
    const esEdicion = this.editandoCorreo || (idBackupExistente !== null && idBackupExistente !== 0);

    if (esEdicion && idBackupExistente && idBackupExistente !== 0) {
      const updatePayload = {
        nombre: this.backupFormData.nombre || 'BACKUP-CORREO',
        frecuencia: this.backupFormData.frecuencia,
        ubicacion: ubicaciones.join(';'),
        ubicacionExcluida: this.backupFormData.ubicacionesExcluidas
          .filter((u: string) => u.trim() !== '')
          .join(';'),
        dia: this.backupFormData.dia || 0,
        hora: this.backupFormData.hora || '00:00:00',
        software: { codigo: Number(this.backupFormData.backupCodigo) },
        activo: true,
        tipo: 'CORREO',
      };
      this.registroBackupInformacionService.actualizar(idBackupExistente, updatePayload).subscribe({
        next: () => {
          const correoGuardar = {
            correoCodigo: correo.codigo,
            direccion: correo.direccion,
            realizarBackup: true,
            backup: {
              backupInformacionCodigo: idBackupExistente,
              backupCodigo: Number(this.backupFormData.backupCodigo),
              programa: programa?.nombre || '',
              nombre: this.backupFormData.nombre || 'BACKUP-CORREO',
              frecuencia: this.backupFormData.frecuencia,
              dia: this.backupFormData.dia,
              hora: this.backupFormData.hora || null,
              ubicaciones: [...ubicaciones],
              ubicacionesExcluidas: [...this.backupFormData.ubicacionesExcluidas].filter(
                (u: string) => u.trim() !== ''
              ),
            },
          };
          if (this.editandoCorreo && this.indiceCorreoEditando !== null) {
            this.correosFormulario[this.indiceCorreoEditando] = correoGuardar;
          } else {
            const idx = this.correosFormulario.findIndex(
              (c) => c.backup?.backupInformacionCodigo === idBackupExistente
            );
            if (idx !== -1) this.correosFormulario[idx] = correoGuardar;
            else this.correosFormulario.push(correoGuardar);
          }
          this.notificacionSnackbarService.success('Exito', 'Backup de correo ACTUALIZADO correctamente.');
          this.limpiarEstadoCorreo();
        },
        error: (err) => {
          console.error('Error al actualizar backup de correo:', err);
          this.notificacionSnackbarService.error('Error', `No se pudo actualizar: ${err.error?.error || err.message}`);
        },
      });
      return;
    }

    // NUEVO
    const yaExiste = this.correosFormulario.some((c) => c.correoCodigo === correo.codigo);
    if (yaExiste) {
      this.notificacionSnackbarService.warning('Duplicado', 'El correo ya fue agregado.');
      return;
    }
    const infoPayload = {
      nombre: this.backupFormData.nombre || 'BACKUP-CORREO',
      frecuencia: this.backupFormData.frecuencia,
      ubicacion: ubicaciones.join(';'),
      ubicacionExcluida: this.backupFormData.ubicacionesExcluidas
        .filter((u: string) => u.trim() !== '')
        .join(';'),
      dia: this.backupFormData.dia || 0,
      hora: this.backupFormData.hora || '00:00:00',
      software: { codigo: Number(this.backupFormData.backupCodigo) },
      activo: true,
      tipo: 'CORREO',
    };
    this.registroBackupInformacionService.guardar(infoPayload).subscribe({
      next: (respuesta) => {
        const correoGuardar = {
          correoCodigo: correo.codigo,
          direccion: correo.direccion,
          realizarBackup: true,
          backup: {
            backupInformacionCodigo: respuesta.codigo || respuesta.id,
            backupCodigo: Number(this.backupFormData.backupCodigo),
            programa: programa?.nombre || '',
            nombre: this.backupFormData.nombre || 'BACKUP-CORREO',
            frecuencia: this.backupFormData.frecuencia,
            dia: this.backupFormData.dia,
            hora: this.backupFormData.hora || null,
            ubicaciones: [...ubicaciones],
            ubicacionesExcluidas: [...this.backupFormData.ubicacionesExcluidas].filter(
              (u: string) => u.trim() !== ''
            ),
          },
        };
        this.correosFormulario.push(correoGuardar);
        this.notificacionSnackbarService.success('Exito', 'Correo agregado con backup.');
        this.limpiarEstadoCorreo();
      },
      error: (err) => {
        console.error('Error al crear backup de correo:', err);
        this.notificacionSnackbarService.error('Error', 'No se pudo crear el backup de correo');
      },
    });
  }

  private limpiarEstadoCorreo(): void {
    this.editandoCorreo = false;
    this.bloquearCorreo = false;
    this.indiceCorreoEditando = null;
    this.editandoBackupExistente = false;
    this.panelCorreo = { correoCodigo: null, realizarBackup: false };
    this.backupFormData = this.resetBackupFormData();
    this.modoUbicacion = 'normales';
    this.errorDia = '';
    this.configuracionSeleccionada = null;
    this.cdr.detectChanges();
  }

  editarBackupCorreo(item: any, index: number): void {
    if (!item.backup) {
      this.notificacionSnackbarService.warning('Error', 'El correo no tiene informacion de backup');
      return;
    }
    this.editandoCorreo = true;
    this.bloquearCorreo = true;
    this.indiceCorreoEditando = index;
    this.panelCorreo = {
      correoCodigo: item.correoCodigo,
      realizarBackup: true,
    };
    this.backupFormData = {
      backupCodigo: item.backup.backupCodigo || null,
      backupInformacionCodigo: item.backup.backupInformacionCodigo || null,
      nombre: item.backup.nombre || '',
      programa: item.backup.programa || '',
      frecuencia: item.backup.frecuencia || '',
      dia: item.backup.dia || null,
      hora: item.backup.hora || null,
      ubicaciones: item.backup.ubicaciones?.length ? [...item.backup.ubicaciones] : [''],
      ubicacionesExcluidas: item.backup.ubicacionesExcluidas?.length
        ? [...item.backup.ubicacionesExcluidas]
        : [''],
    };
    if (item.backup.backupInformacionCodigo) {
      const config = this.configuracionesBackup.find(
        (c) => c.codigo === item.backup.backupInformacionCodigo
      );
      if (config) {
        this.configuracionSeleccionada = config;
      } else {
        this.configuracionSeleccionada = {
          codigo: item.backup.backupInformacionCodigo,
          nombre: item.backup.nombre,
          frecuencia: item.backup.frecuencia,
          dia: item.backup.dia,
          hora: item.backup.hora,
          ubicacion: item.backup.ubicaciones.join(';'),
          ubicacionExcluida: item.backup.ubicacionesExcluidas.join(';'),
        };
      }
    } else {
      this.configuracionSeleccionada = null;
    }
    this.cdr.detectChanges();
    this.notificacionSnackbarService.info('Editando correo', `Editando "${item.direccion}"`);
  }

  volverCorreo(): void {
    this.panelCorreo = { correoCodigo: null, realizarBackup: false };
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
      hora: null,
    };
  }

  // ==================== BACKUP GENERAL EQUIPO ====================

  editarBackup(index: number): void {
    const backup = this.backupsSeleccionados[index];
    if (!backup) return;
    this.editandoBackupIndex = index;
    this.backupFormData.backupCodigo = backup.backupCodigo;
    this.backupFormData.nombre = backup.nombre;
    this.backupFormData.frecuencia = backup.frecuencia;
    this.backupFormData.dia = backup.dia;
    this.backupFormData.hora = backup.hora;
    this.backupFormData.ubicaciones = backup.ubicaciones.length
      ? [...backup.ubicaciones]
      : [''];
    this.backupFormData.ubicacionesExcluidas = backup.ubicacionesExcluidas.length
      ? [...backup.ubicacionesExcluidas]
      : [''];
    this.backupFormData.backupInformacionCodigo = backup.backupInformacionCodigo || null;
    this.mostrarFormularioBackup = true;
    this.notificacionSnackbarService.info('Editando backup', `Editando "${backup.nombre}"`);
    this.cdr.detectChanges();
  }

  // ==================== ACCIONES PRINCIPALES ====================

  cerrar(): void {
    this.dialogRef.close({ success: false });
  }

  async asignar(): Promise<void> {
    if (this.yaAsignada) {
      this.notificacionSnackbarService.warning(
        'Equipo ya asignado',
        'Este equipo ya tiene una asignacion activa. Use Reasignar o Devolver.'
      );
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
    if (!this.validarOpcionalesObligatorios()) {
      return;
    }

    const observacionesFormateadas = this.observaciones?.trim()
      ? `ASIGNACION: ${this.observaciones}`
      : 'ASIGNACION: SIN OBSERVACIONES';

    const detalleData = {
      nombreEquipo: this.detalle?.nombreEquipo || '',
      nombreUsuario: this.detalle?.nombreUsuario || '',
      claveUsuario: this.detalle?.claveUsuario || '',
      nombreUsuarioAdministrador: this.detalle?.nombreUsuarioAdministrador || '',
      claveUsuarioAdministrador: this.detalle?.claveUsuarioAdministrador || '',
      nombreUsuarioAdicional: this.detalle?.nombreUsuarioAdicional || '',
      claveUsuarioAdicional: this.detalle?.claveUsuarioAdicional || '',
    };

    const backups: any[] = [];
    if (this.softwareSeleccionado.backups && this.softwareSeleccionado.backups.length > 0) {
      for (const bk of this.softwareSeleccionado.backups) {
        // Si es NO APLICA, lo omitimos completamente (no se envia a BD)
        if (bk.esNoAplica) {
          continue; // Salta este elemento sin agregar nada
        }

        // Si ya tiene un ID de backup_informacion, lo reutilizamos
        if (bk.backupInformacionCodigo) {
          // Los backups de equipo NO deben llevar correoCodigo
          backups.push({ backupInformacionCodigo: bk.backupInformacionCodigo });
          continue;
        }

        // Si no tiene ID pero tiene codigo de programa (backup real)
        if (bk.backupCodigo && bk.backupCodigo !== 0) {
          try {
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
              backups.push({ backupInformacionCodigo: existente.codigo, correoCodigo: 0 });
              bk.backupInformacionCodigo = existente.codigo;
            } else {
              const infoPayload = {
                nombre: bk.nombre,
                frecuencia: bk.frecuencia,
                ubicacion: bk.ubicaciones?.length ? bk.ubicaciones.join(';') : null,
                ubicacionExcluida: bk.ubicacionesExcluidas?.length ? bk.ubicacionesExcluidas.join(';') : null,
                dia: bk.dia || null,
                hora: bk.hora || null,
                software: { codigo: bk.backupCodigo },
                activo: true,
                tipo: 'EQUIPO',
              };
              const nueva = await firstValueFrom(
                this.registroBackupInformacionService.guardar(infoPayload)
              );
              backups.push({ backupInformacionCodigo: nueva.codigo, correoCodigo: 0 });
              bk.backupInformacionCodigo = nueva.codigo;
            }
          } catch (error) {
            console.error('Error procesando backup:', error);
          }
        }
      }
    }

    this.intentadoAsignar = true;
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

    const correosConBackup: any[] = [];
    if (this.softwareSeleccionado.correos && this.softwareSeleccionado.correos.length > 0) {
      for (const item of this.softwareSeleccionado.correos) {
        // Ignorar "NO APLICA" (codigo 0)
        if (Number(item.correoCodigo) === 0) continue;

        if (item.realizarBackup && item.backup) {
          if (item.backup.backupInformacionCodigo) {
            // Si ya tiene ID de backup, lo agregamos a la lista de backups
            backups.push({
              backupInformacionCodigo: item.backup.backupInformacionCodigo,
              correoCodigo: Number(item.correoCodigo),
            });
          } else {
            // Si no tiene ID, lo guardamos en correosConBackup para crearlo despues
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
                tipo: 'CORREO',
              },
            });
          }
        }
      }
    }

    const softwares: any[] = [];
    const av = this.softwareSeleccionado.antivirus;
    if (av && av.antivirusCodigo && Number(av.antivirusCodigo) > 0 && av.politicaCodigo && Number(av.politicaCodigo) > 0) {
      softwares.push({
        softwareCodigo: Number(av.antivirusCodigo),
        politicaCodigo: Number(av.politicaCodigo),
      });
    }
    if (this.softwareSeleccionadoOffice) {
      softwares.push({
        softwareCodigo: this.softwareSeleccionadoOffice.codigo,
        politicaCodigo: 0,
      });
    }
    if (this.softwareSeleccionadoBackup && this.softwareSeleccionadoBackup.codigo) {
      softwares.push({
        softwareCodigo: this.softwareSeleccionadoBackup.codigo,
        politicaCodigo: 0,
      });
    }
    if (this.softwareSeleccionadoOpcional) {
      for (const tipoCodigo in this.softwareSeleccionadoOpcional) {
        if (this.softwareSeleccionadoOpcional.hasOwnProperty(tipoCodigo)) {
          const lista = this.softwareSeleccionadoOpcional[tipoCodigo];
          if (Array.isArray(lista) && lista.length > 0) {
            for (const sw of lista) {
              if (sw && sw.codigo) {
                softwares.push({ softwareCodigo: sw.codigo, politicaCodigo: 0 });
              }
            }
          } else if (lista && lista.codigo) {
            softwares.push({ softwareCodigo: lista.codigo, politicaCodigo: 0 });
          }
        }
      }
    }

    const softwaresLimpios = softwares.filter(s =>
      s.softwareCodigo != null &&
      s.politicaCodigo != null &&
      Number(s.politicaCodigo) >= 0
    );



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

    this.registrarAsignacionesService.asignar(asignacionPayload).subscribe({
      next: (resp) => {
        this.notificacionSnackbarService.success('Exito', 'Equipo asignado con detalle');
        if (this.correosFormulario && this.correosFormulario.length > 0) {
          const recursoTipoIdCorreo = 1;
          const asignacionesRecursos: Observable<any>[] = [];
          for (const item of this.correosFormulario) {
            // Excluir "NO APLICA"
            if (Number(item.correoCodigo) === 0) continue;
            const payload = {
              empleadoCedula: this.empleadoSeleccionado?.cedula,
              tipo: 'CORREO',
              recursoTipoId: recursoTipoIdCorreo,
              recursoId: Number(item.correoCodigo),
              fechaAsignacion: this.fechaAsignacion,
              observaciones: 'ASIGNACION DE CORREO',
            };
            asignacionesRecursos.push(
              this.registrarAsignacionesService.asignarRecurso(payload)
            );
          }
          if (asignacionesRecursos.length > 0) {
            forkJoin(asignacionesRecursos).subscribe({
              next: () =>
                this.notificacionSnackbarService.success('Exito', 'Correos asignados como recursos'),
              error: (err) => console.error('Error al asignar recursos:', err),
            });
          }
        }
        this.dialogRef.close({ success: true, data: resp });
      },
      error: (err) => {
        console.error('Error al asignar:', err);
        const errorMsg = err.error?.error || 'Error desconocido';
        this.notificacionSnackbarService.error('Error', errorMsg);
      }
    });
  }

  activarDevolucion(): void {
    this.mostrarDevolucion = true;
    this.esReasignacion = false;
    this.fechaDevolucion = new Date().toISOString().split('T')[0];
    this.detalleDevolucion = '';
  }

  cancelarDevolucion(): void {
    this.mostrarDevolucion = false;
    this.esReasignacion = false;
    this.fechaDevolucion = '';
    this.detalleDevolucion = '';
    this.errorFechaDevolucion = false;
    this.paso = 1; // Volver al paso 1 para mostrar los datos del equipo
    this.cdr.detectChanges();
  }

  confirmarDevolver(): void {
    if (!this.fechaDevolucion) {
      this.notificacionSnackbarService.warning('Fecha requerida', 'Seleccione una fecha de devolucion');
      return;
    }
    if (!this.isFechaDevolucionValida()) {
      this.notificacionSnackbarService.warning(
        'Fecha involida',
        'La fecha de devolucion no puede ser anterior a la fecha de asignacion'
      );
      return;
    }
    if (!this.equipo.asignacionId) {
      this.notificacionSnackbarService.error('Error', 'No se encontro el ID de la asignacion');
      return;
    }

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
      fechaDevolucion: this.fechaDevolucion,
    };

    this.registrarAsignacionesService.devolver(this.equipo.asignacionId, data).subscribe({
      next: () => {
        this.notificacionSnackbarService.success('Exito', 'Devolucion de equipo registrada');
        if (this.empleadoSeleccionado) {
          this.registrarAsignacionesService
            .listarRecursosPorEmpleado(this.empleadoSeleccionado.cedula)
            .subscribe({
              next: (recursos) => {
                const recursosCorreo = recursos.filter(
                  (r) => r.recurso.nombre === 'CORREO' && r.activo === true
                );
                const devoluciones = recursosCorreo.map((r) => {
                  const payload = {
                    fechaDevolucion: this.fechaDevolucion,
                    observaciones: `Devuelto por devolucion de equipo ${this.equipo.serial}`,
                  };
                  return this.registrarAsignacionesService.devolverRecurso(
                    r.numero,
                    payload
                  );
                });
                if (devoluciones.length > 0) {
                  forkJoin(devoluciones).subscribe({
                    next: () =>
                      this.notificacionSnackbarService.success('Exito', 'Correos devueltos correctamente'),
                    error: (err) => console.error('Error devolviendo recursos:', err),
                  });
                }
              },
              error: (err) => console.error('Error listando recursos:', err),
            });
        }
        this.dialogRef.close({ success: true, devuelta: true });
      },
      error: (err) => {
        console.error('Error al devolver:', err);
        this.notificacionSnackbarService.error('Error', err.error?.error || 'Error al devolver');
      },
    });
  }

  activarReasignacion(): void {
    this.mostrarDevolucion = true;
    this.esReasignacion = true;
    this.fechaDevolucion = new Date().toISOString().split('T')[0];
    this.detalleDevolucion = '';
  }

  confirmarReasignar(): void {
    if (!this.fechaDevolucion) {
      this.notificacionSnackbarService.warning('Fecha requerida', 'Seleccione una fecha de devolucion');
      return;
    }
    if (!this.isFechaDevolucionValida()) {
      this.notificacionSnackbarService.warning(
        'Fecha involida',
        'La fecha de devolucion no puede ser anterior a la fecha de asignacion'
      );
      return;
    }
    if (!this.equipo.asignacionId) {
      this.notificacionSnackbarService.error('Error', 'No se encontro el ID de la asignacion');
      return;
    }

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
      fechaDevolucion: this.fechaDevolucion,
    };

    this.registrarAsignacionesService.devolver(this.equipo.asignacionId, data).subscribe({
      next: () => {
        this.notificacionSnackbarService.success('Exito', 'Devolucion registrada');
        this.prepararReasignacion();
      },
      error: (err) => {
        console.error('Error al devolver:', err);
        this.notificacionSnackbarService.error('Error', err.error?.error || 'Error al devolver');
      },
    });
  }

  private prepararReasignacion(): void {
    this.yaAsignada = false;
    this.mostrarDevolucion = false;
    this.empleadoSeleccionado = null;
    this.fechaAsignacion = new Date().toISOString().split('T')[0];
    this.fechaDevolucion = '';
    this.observaciones = '';
    this.detalleDevolucion = '';
    this.busquedaEmpleado = '';
    this.empleadosFiltrados = [...this.empleados];
    this.notificacionSnackbarService.info('Reasignacion', 'Seleccione un nuevo empleado');
  }

  reasignar(): void {
    this.mostrarDevolucion = true;
    this.fechaDevolucion = new Date().toISOString().split('T')[0];
    this.detalleDevolucion = '';
    this.notificacionSnackbarService.info('Reasignacion', 'Ingrese los detalles de devolucion para continuar');
  }

  devolver(): void {
    this.empleadoSeleccionado = null;
    this.busquedaEmpleado = '';
    this.empleadosFiltrados = this.empleados;
    this.fechaDevolucion = '';
  }

  // ====== METODOS PARA UBICACIONES (BACKUP) ======

  agregarUbicacion(): void {
    this.backupFormData.ubicaciones.push('');
  }

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
    if (frecuencia === 'DIARIO') {
      this.backupFormData.dia = null;
      this.errorDia = 'No se requiere dia para frecuencia DIARIO';
      return;
    }
    if (dia === null || dia === undefined || dia === '') {
      this.errorDia = 'Debe ingresar un dia';
      return;
    }
    const numDia = Number(dia);
    if (isNaN(numDia)) {
      this.errorDia = 'Ingrese un numero volido';
      this.notificacionSnackbarService.warning('Dia involido', 'Ingrese un numero volido para el dia');
      return;
    }
    let valido = true;
    if (frecuencia === 'SEMANAL') {
      if (numDia < 1 || numDia > 7) {
        this.errorDia = 'Para frecuencia SEMANAL, el dia debe ser entre 1 y 7';
        this.notificacionSnackbarService.warning(
          'Dia fuera de rango',
          'Para frecuencia SEMANAL, el dia debe ser entre 1 y 7'
        );
        valido = false;
      }
    } else if (frecuencia === 'MENSUAL' || frecuencia === 'MANUAL') {
      if (numDia < 1 || numDia > 30) {
        this.errorDia = 'Para frecuencia MENSUAL o MANUAL, el dia debe ser entre 1 y 30';
        this.notificacionSnackbarService.warning(
          'Dia fuera de rango',
          'Para frecuencia MENSUAL o MANUAL, el dia debe ser entre 1 y 30'
        );
        valido = false;
      }
    }
    if (valido) this.errorDia = '';
  }

  // ==================== AUXILIARES ====================

  actualizarNombreBackup(): void {
    const codigo =
      this.backupFormData.backupCodigo !== null && this.backupFormData.backupCodigo !== undefined
        ? Number(this.backupFormData.backupCodigo)
        : null;

    this.configuracionesBackup = [];
    this.backupNombresList = [];

    if (codigo && codigo !== 0) {
      const tipo = this.panelTipo === 'correo' ? 'CORREO' : 'EQUIPO';
      this.consultarBackupInformacionService
        .listarPorSoftwareYTipo(codigo, tipo)
        .subscribe({
          next: (data) => {
            this.configuracionesBackup = data.filter((c) => c.activo === true);
            this.backupNombresList = [...this.configuracionesBackup];
            if (this.configuracionSeleccionada) {
              const existe = this.configuracionesBackup.some(
                (c) => c.codigo === this.configuracionSeleccionada.codigo
              );
              if (!existe || this.configuracionSeleccionada.enUso) {
                this.configuracionSeleccionada = null;
                this.limpiarCamposBackup();
              }
            }
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
          },
        });
    } else {
      this.configuracionesBackup = [];
      this.backupNombresList = [];
      this.configuracionSeleccionada = null;
    }
  }

  seleccionarConfiguracionBackup(config: any): void {
    if (config === null) {
      this.seleccionPrevia = this.configuracionSeleccionada;
      this.abrirModalBackup();
      setTimeout(() => {
        if (this.seleccionPrevia !== undefined) {
          this.configuracionSeleccionada = this.seleccionPrevia;
        }
      }, 0);
      return;
    }

    this.editandoBackupExistente = true;
    this.backupFormData.backupInformacionCodigo = config.codigo || null;

    const codigoPrograma = config.software?.codigo || config.backupCodigo || null;
    if (codigoPrograma && codigoPrograma > 1) {
      this.backupFormData.backupCodigo = codigoPrograma;
    }

    this.seleccionPrevia = undefined;
    this.configuracionSeleccionada = config;
    this.backupFormData.nombre = config.nombre;
    this.backupFormData.frecuencia = config.frecuencia || '';
    this.backupFormData.dia = config.dia || null;
    this.backupFormData.hora = config.hora || null;
    this.backupFormData.ubicaciones = config.ubicacion
      ? config.ubicacion.split(';')
      : [''];
    this.backupFormData.ubicacionesExcluidas = config.ubicacionExcluida
      ? config.ubicacionExcluida.split(';')
      : [''];

    if (this.backupFormData.backupCodigo && this.backupFormData.backupCodigo > 1) {
      this.actualizarSoftwareBackup(this.backupFormData.backupCodigo);
    } else {
      this.softwareSeleccionadoBackup = null;
    }
    this.cdr.detectChanges();
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
    const codigo = this.backupFormData.backupCodigo;
    return codigo === null || codigo === undefined;
  }

  getTitulo(): string {
    if (!this.yaAsignada) return 'Asignar Equipo';
    if (this.mostrarDevolucion) {
      return this.esReasignacion ? 'Reasignacion de Equipo' : 'Devolucion de Equipo';
    }
    return 'Equipo Asignado';
  }

  toggleClaveAdmin(): void {
    this.mostrarClaveAdmin = !this.mostrarClaveAdmin;
  }

  toggleClaveUsuario(): void {
    this.mostrarClaveUsuario = !this.mostrarClaveUsuario;
  }

  toggleClaveAdicional(): void {
    this.mostrarClaveAdicional = !this.mostrarClaveAdicional;
  }

  // ==================== MODAL CREAR NOMBRE BACKUP ====================

  abrirModalBackup(): void {
    this.nuevoBackupNombre = '';
    this.nombreBackupYaExiste = false;
    this.mostrarModalBackup = true;
    this.backupNombresList = [...this.configuracionesBackup];
    this.backupNombresFiltrados = [];
    if (this.backupNombresList.length === 0) {
      const codigo = this.backupFormData.backupCodigo;
      if (codigo && codigo !== 0) {
        const tipo = this.panelTipo === 'correo' ? 'CORREO' : 'EQUIPO';
        this.consultarBackupInformacionService
          .listarPorSoftwareYTipo(Number(codigo), tipo)
          .subscribe({
            next: (data) => {
              this.configuracionesBackup = data.filter((c) => c.activo === true);
              this.backupNombresList = [...this.configuracionesBackup];
              this.backupNombresFiltrados = [];
            },
            error: () => {
              this.backupNombresList = [];
              this.backupNombresFiltrados = [];
            },
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
    this.backupNombresFiltrados = this.backupNombresList.filter((config) =>
      config.nombre.toLowerCase().includes(termino)
    );
  }

  seleccionarNombreBackupExistente(event: any): void {
    const nombreSeleccionado = event.option.value;
    const config = this.backupNombresList.find((c) => c.nombre === nombreSeleccionado);
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

  cerrarModalBackup(): void {
    this.mostrarModalBackup = false;
    this.nuevoBackupNombre = '';
    this.nombreBackupYaExiste = false;
    if (this.seleccionPrevia !== undefined) {
      this.configuracionSeleccionada = this.seleccionPrevia;
      this.seleccionPrevia = undefined;
    }
  }

  crearNuevoBackup(): void {
    const nombre = this.nuevoBackupNombre?.trim().toUpperCase();
    if (!nombre) {
      this.notificacionSnackbarService.warning('Nombre requerido', 'Ingrese un nombre para el backup');
      return;
    }
    const existe = this.backupNombresList.some(
      (c) => c.nombre.toLowerCase() === nombre.toLowerCase()
    );
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
      backupInformacionCodigo: null,
    };
    this.configuracionesBackup.push(nuevoBackupTemporal);
    this.backupNombresList.push(nuevoBackupTemporal);
    this.seleccionarConfiguracionBackup(nuevoBackupTemporal);
    this.mostrarModalBackup = false;
    this.nuevoBackupNombre = '';
    this.nombreBackupYaExiste = false;
    this.seleccionPrevia = undefined;
    this.notificacionSnackbarService.success(
      'Backup creado',
      `Configuracion "${nombre}" creada correctamente`
    );
    this.cdr.detectChanges();
  }

  // ==================== PANEL INTERNO (AGREGAR/EDITAR SOFTWARE) ====================

  abrirPanel(tipo: string): void {
    this.panelActivo = true;
    this.panelTipo = tipo;

    if (tipo === 'antivirus') {
      if (this.antivirusList.length === 0) {
        this.consultarSoftwareService.listarPorTipo(1).subscribe({
          next: (data) => {
            this.antivirusList = data;
            this.inicializarPanelAntivirus();
          },
          error: () => {
            this.notificacionSnackbarService.error('Error', 'No se pudieron cargar antivirus');
            this.cerrarPanel();
          },
        });
      } else {
        this.inicializarPanelAntivirus();
      }
    } else if (tipo === 'backup') {
      if (this.backupList.length === 0) {
        this.cargarBackups();
      }
      if (
        this.softwareSeleccionado.backups &&
        this.softwareSeleccionado.backups.length > 0
      ) {
        this.backupsSeleccionados = [...this.softwareSeleccionado.backups];
        this.mostrarFormularioBackup = false;
      } else {
        this.backupsSeleccionados = [];
        this.mostrarFormularioBackup = true;
      }
      this.backupFormData = this.resetBackupFormData();
      this.backupInformacionList = [];
      this.panelTitulo = 'Agregar Backup';
    } else if (tipo === 'correo') {
      if (this.correosList.length === 0) this.cargarCorreos();
      if (this.backupList.length === 0) this.cargarBackups();
      if (this.softwareSeleccionado.correos?.length) {
        this.correosFormulario = [...this.softwareSeleccionado.correos];
      } else {
        this.correosFormulario = [];
      }
      this.panelCorreo = { correoCodigo: null, realizarBackup: false };
      this.backupFormData = this.resetBackupFormData();
      this.modoUbicacion = 'normales';
      this.panelTitulo = 'Administrar Correos';
    } else if (tipo === 'office') {
      if (this.officeList.length === 0) {
        this.consultarSoftwareService.listarPorTipo(3).subscribe({
          next: (data) => {
            this.officeList = data;
            this.panelData.softwareCodigo =
              this.softwareSeleccionadoOffice?.codigo || null;
            this.panelActivo = true;
            this.panelTipo = 'office';
            this.panelTitulo = 'Seleccionar Office';
          },
          error: () => {
            this.notificacionSnackbarService.error('Error', 'No se pudo cargar el software de Office');
            this.cerrarPanel();
          },
        });
      } else {
        this.panelData.softwareCodigo =
          this.softwareSeleccionadoOffice?.codigo || null;
        this.panelActivo = true;
        this.panelTipo = 'office';
        this.panelTitulo = 'Seleccionar Office';
      }
    }
  }

  private ubicacionParse(
    ubicacionStr: string,
    ubicacionExcluidaStr: string
  ): { normales: string[]; excluidas: string[] } {
    const normales = ubicacionStr
      ? ubicacionStr.split(';').filter((s) => s.trim() !== '')
      : [''];
    const excluidas = ubicacionExcluidaStr
      ? ubicacionExcluidaStr.split(';').filter((s) => s.trim() !== '')
      : [''];
    return {
      normales: normales.length > 0 ? normales : [''],
      excluidas: excluidas.length > 0 ? excluidas : [''],
    };
  }

  private inicializarPanelAntivirus(): void {
    const actual = this.softwareSeleccionado.antivirus;
    if (actual) {
      this.panelData.antivirusCodigo = actual.antivirusCodigo || null;
      // Si es "SIN PROTECCION", forzar politica 1
      if (actual.antivirusCodigo === 1) {
        this.panelData.politicaCodigo = 1;
      } else {
        this.panelData.politicaCodigo = actual.politicaCodigo || null;
      }
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
      dia: null,
    };
    this.panelCorreo = { correoCodigo: null, realizarBackup: false };
    this.modoUbicacion = 'normales';
  }

  guardarPanel(): void {
    if (this.panelTipo === 'correo') {
      const codigoSeleccionado = Number(this.panelCorreo.correoCodigo);

      // CASO 1: NO APLICA
      if (codigoSeleccionado === 0) {
        // Agregamos un elemento especial a la lista
        this.correosFormulario = [{ correoCodigo: 0, direccion: 'NO APLICA', realizarBackup: false, backup: null }];
        this.panelCorreo.correoCodigo = null;
        this.panelCorreo.realizarBackup = false;
        this.softwareSeleccionado.correos = [...this.correosFormulario];
        this.cdr.detectChanges();
        this.notificacionSnackbarService.success('Exito', 'Configuracion guardada (NO APLICA)');
        this.cerrarPanel();
        return;
      }

      // CASO 2: lista vacia y no se selecciono NO APLICA
      if (this.correosFormulario.length === 0) {
        this.notificacionSnackbarService.warning(
          'Agregue en lista',
          'Debe agregar al menos un correo o seleccionar NO APLICA'
        );
        this.mostrarAyudaCorreo = true;
        setTimeout(() => (this.mostrarAyudaCorreo = false), 3500);
        return;
      }

      // CASO 3: guardar correos reales (filtramos el 0 por si acaso)
      this.softwareSeleccionado.correos = [...this.correosFormulario];
      this.cdr.detectChanges();
      this.notificacionSnackbarService.success('Exito', 'Correos guardados');
      this.cerrarPanel();
      return;
    }

    this.mostrarAyudaCorreo = false;

    if (this.panelTipo === 'antivirus') {
      const codigo = Number(this.panelData.antivirusCodigo);

      // Si no hay antivirus seleccionado (null, undefined o 0), lo dejamos como null
      if (!codigo) {
        this.softwareSeleccionado.antivirus = null;
        this.cdr.detectChanges();
        this.cerrarPanel();
        return;
      }
      // Si es "SIN PROTECCION" (codigo 1), forzar politica 1
      if (codigo === 1) {
        this.panelData.politicaCodigo = 1;
      }

      // Validar que se haya seleccionado una politica (solo para otros antivirus)
      if (!this.panelData.politicaCodigo) {
        this.notificacionSnackbarService.warning('Campos incompletos', 'Seleccione antivirus y politica');
        return;
      }

      const antivirus = this.antivirusList.find(a => a.codigo === codigo);
      const politica = this.politicasList.find(p => p.codigo === Number(this.panelData.politicaCodigo));

      this.softwareSeleccionado.antivirus = {
        antivirusCodigo: codigo,
        politicaCodigo: this.panelData.politicaCodigo,
        nombre: antivirus?.nombre || 'Sin nombre',
        politica: politica?.politica || 'Sin politica',
      };

      this.cdr.detectChanges();
      this.cerrarPanel();







    } else if (this.panelTipo === 'backup') {
      if (this.backupsSeleccionados.length === 0) {
        this.softwareSeleccionado.backups = [];
        this.softwareSeleccionado.backup = false;
        this.softwareSeleccionadoBackup = null;
        this.softwareSeleccionado.backupGeneral = null;
      } else {
        this.softwareSeleccionado.backups = [...this.backupsSeleccionados];
        this.softwareSeleccionado.backup = true;

        // Tomar el primer backup de la lista (puede ser NO APLICA o un backup real)
        const primerBackup = this.backupsSeleccionados[0];
        if (primerBackup) {
          if (primerBackup.esNoAplica) {
            // Caso NO APLICA
            this.softwareSeleccionado.backupGeneral = {
              nombre: 'NO APLICA',
              esNoAplica: true,
            };
          } else {
            // Caso backup real
            const programa = this.backupList.find(b => b.codigo === primerBackup.backupCodigo);
            this.softwareSeleccionado.backupGeneral = {
              nombre: programa?.nombre || primerBackup.programa || 'Backup',
              codigo: primerBackup.backupCodigo,
            };
          }
        } else {
          this.softwareSeleccionado.backupGeneral = null;
        }

        // Actualizar softwareSeleccionadoBackup (para el paso 3, si se usa)
        const backupActivo = this.backupsSeleccionados.find(b => b.backupCodigo !== 0 && !b.esNoAplica);
        if (backupActivo) {
          const programa = this.backupList.find(b => b.codigo === backupActivo.backupCodigo);
          this.softwareSeleccionadoBackup = programa ? {
            codigo: programa.codigo,
            nombre: programa.nombre,
            tipo: { codigo: 2, descripcion: 'BACKUP' }
          } : null;
        } else {
          this.softwareSeleccionadoBackup = null;
        }
      }
      this.cdr.detectChanges();
      this.cerrarPanel();



    } else if (this.panelTipo === 'office') {
      const codigo = this.panelData.softwareCodigo;
      if (codigo) {
        const codigoNum = Number(codigo);
        const software = this.officeList.find((s) => s.codigo === codigoNum);
        if (software) {
          this.softwareSeleccionadoOffice = software;
          this.notificacionSnackbarService.success(
            'Exito',
            `Office: ${software.nombre} seleccionado`
          );
        } else {
          this.notificacionSnackbarService.error('Error', 'Software no encontrado');
          return;
        }
      } else {
        this.softwareSeleccionadoOffice = null;
        this.notificacionSnackbarService.info('Seleccion eliminada', 'Office desasignado');
      }
      this.cerrarPanel();



    } else if (this.panelTipo === 'softwareOpcional') {
      const tipoCodigo = this.panelTipoOpcionalCodigo;
      if (!tipoCodigo) {
        this.notificacionSnackbarService.warning('Error', 'Tipo de software no valido');
        return;
      }
      // Guardar la seleccion en el objeto correspondiente
      this.softwareSeleccionadoOpcional[tipoCodigo] = [...this.panelSeleccionesTemporales];
      this.cdr.detectChanges();
      this.cerrarPanel();

    }
  }

  // ==================== PANEL SOFTWARE OPCIONAL ====================

  private procesarSeleccionOffice(): void {
    const codigo = this.panelData.softwareCodigo;
    if (codigo) {
      const codigoNum = Number(codigo);
      const software = this.officeList.find((s) => s.codigo === codigoNum);
      if (software) {
        this.softwareSeleccionadoOffice = software;
        this.notificacionSnackbarService.success(
          'Exito',
          `Office: ${software.nombre} seleccionado`
        );
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
    const tipo = this.softwareTiposActivos.find((t) => t.codigo === codigo);
    return tipo ? tipo.descripcion : 'Software';
  }

  toggleSeleccionSoftware(software: any): void {
    // ==========================================
    // CASO ESPECIAL: OFFICE (codigo 4)
    // ==========================================
    if (this.panelTipoOpcionalCodigo === 4) {

      // ¿Hay algun Office ya instalado en este equipo?
      const officeInstalado = this.softwareAsignadoList.find(
        s => s.tipoCodigo === 4
      );

      if (officeInstalado) {
        // Si el software sobre el que se hace clic ES el instalado → no se puede desmarcar
        if (officeInstalado.softwareCodigo === software.codigo) {
          this.notificacionSnackbarService.info(
            'Office ya instalado',
            `"${software.nombre}" ya esta instalado y no se puede desmarcar.`
          );
          return;
        }

        // Si es otro Office distinto → no se puede seleccionar
        this.notificacionSnackbarService.warning(
          'Office bloqueado',
          `Ya hay un Office instalado ("${officeInstalado.nombreSoftware}"). Primero desinstalelo para poder seleccionar otro.`
        );
        return;
      }

      // No hay Office instalado → comportamiento normal (solo 1 seleccion)
      const yaSeleccionado = this.panelSeleccionesTemporales.some(
        s => s.codigo === software.codigo
      );
      if (yaSeleccionado) {
        this.panelSeleccionesTemporales = [];
      } else {
        this.panelSeleccionesTemporales = [software];
      }
      this.cdr.detectChanges();
      return;
    }

    // ==========================================
    // OTROS TIPOS (Navegador, Visor PDF, etc.)
    // ==========================================

    // Verificar si el software YA ESTa INSTALADO en este tipo
    const yaInstalado = this.softwareAsignadoList.some(
      s => s.softwareCodigo === software.codigo &&
        s.tipoCodigo === this.panelTipoOpcionalCodigo
    );

    // Si ya esta instalado, NO se puede desmarcar
    if (yaInstalado) {
      const yaSeleccionado = this.panelSeleccionesTemporales.some(
        s => s.codigo === software.codigo
      );
      if (yaSeleccionado) {
        this.notificacionSnackbarService.info(
          'Ya instalado',
          `"${software.nombre}" ya esta instalado y no se puede desmarcar.`
        );
        return;
      }
      // Si por alguna razon no estaba seleccionado, lo agregamos
      this.panelSeleccionesTemporales.push(software);
      this.cdr.detectChanges();
      return;
    }

    // Seleccion multiple normal
    const index = this.panelSeleccionesTemporales.findIndex(
      s => s.codigo === software.codigo
    );
    if (index > -1) {
      this.panelSeleccionesTemporales.splice(index, 1);
    } else {
      this.panelSeleccionesTemporales.push(software);
    }

    this.cdr.detectChanges();
  }


  estaSeleccionado(software: any): boolean {
    return this.panelSeleccionesTemporales.some(
      (s) => s.codigo === software.codigo
    );
  }


  abrirPanelOpcional(tipoCodigo: number): void {
    this.panelActivo = true;
    this.panelTipo = 'softwareOpcional';
    this.panelTipoOpcionalCodigo = tipoCodigo;

    // Cargar la lista de software disponible
    if (!this.softwarePorTipo[tipoCodigo]) {
      this.consultarSoftwareService.listarPorTipo(tipoCodigo).subscribe({
        next: (data) => {
          const disponibles = data.filter(s => s.codigo !== 0);
          this.softwarePorTipo[tipoCodigo] = disponibles;

          // Si el equipo ya esta asignado, precargar los instalados
          if (this.yaAsignada) {
            this.precargarInstalados(tipoCodigo);
          } else {
            // Nueva asignacion: cargar seleccion previa
            this.panelSeleccionesTemporales = this.softwareSeleccionadoOpcional[tipoCodigo] || [];
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar software:', err);
          this.notificacionSnackbarService.error('Error', 'No se pudo cargar el software');
          this.cerrarPanel();
        }
      });
    } else {
      // Ya esta en cache
      if (this.yaAsignada) {
        this.precargarInstalados(tipoCodigo);
      } else {
        this.panelSeleccionesTemporales = this.softwareSeleccionadoOpcional[tipoCodigo] || [];
      }
    }

    const tipo = this.softwareTiposActivos.find((t) => t.codigo === tipoCodigo);
    this.panelTitulo = tipo ? this.capitalizarPrimera(tipo.descripcion) : 'Software Opcional';
  }

  // Precarga los software que YA estan instalados (para equipo asignado)
  private precargarInstalados(tipoCodigo: number): void {
    const instalados = this.softwareAsignadoList
      .filter(sw => sw.tipoCodigo === tipoCodigo)
      .map(sw => sw.softwareCodigo);

    const disponibles = this.softwarePorTipo[tipoCodigo] || [];

    this.panelSeleccionesTemporales = disponibles.filter(
      sw => instalados.includes(sw.codigo)
    );
  }


  private marcarInstaladosComoSeleccionados(tipoCodigo: number): void {
    const instalados = this.softwareAsignadoList
      .filter(sw => sw.tipoCodigo === tipoCodigo)
      .map(sw => sw.softwareCodigo);

    const disponibles = this.softwarePorTipo[tipoCodigo] || [];

    const seleccionPrevia = this.softwareSeleccionadoOpcional[tipoCodigo] || [];
    const codigosSeleccionados = new Set(seleccionPrevia.map((s: any) => s.codigo));

    for (const sw of disponibles) {
      if (instalados.includes(sw.codigo) && !codigosSeleccionados.has(sw.codigo)) {
        seleccionPrevia.push(sw);
        codigosSeleccionados.add(sw.codigo);
      }
    }

    this.panelSeleccionesTemporales = [...seleccionPrevia];
    this.softwareSeleccionadoOpcional[tipoCodigo] = [...seleccionPrevia];
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
      next: (ips) => (this.ipsDisponibles = ips),
      error: (err) => {
        console.error('Error al cargar IPs:', err);
        this.ipsDisponibles = [];
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar las IPs');
      },
    });
  }

  seleccionarIpTemporal(ip: any): void {
    const activo = Number(ip.activo);
    const catalogo = Number(ip.catalogoCodigo);
    if (activo === 1 && catalogo === 1) {
      this.notificacionSnackbarService.warning(
        'IP ocupada',
        `La IP ${ip.ip} ya esto asignada a otro EQUIPO`
      );
      return;
    }
    if (catalogo !== 1) {
      this.notificacionSnackbarService.warning(
        'IP no apta',
        `La IP ${ip.ip} NO esto configurada para equipos de computo`
      );
      return;
    }
    if (activo === 0 && catalogo === 1) {
      this.ipSeleccionadaTemporal = ip.ip;
      return;
    }
    this.notificacionSnackbarService.warning(
      'No disponible',
      `La IP ${ip.ip} NO ESTo DISPONIBLE para asignacion`
    );
  }

  confirmarSeleccionIP(): void {
    if (this.ipSeleccionadaTemporal !== null) {
      this.detalle.ip = this.ipSeleccionadaTemporal;
      this.mostrarModalIP = false;
      this.cdr.detectChanges();
      this.notificacionSnackbarService.success(
        'IP seleccionada',
        `Se selecciono la IP ${this.ipSeleccionadaTemporal}`
      );
    }
  }

  cerrarModalIP(): void {
    this.mostrarModalIP = false;
    this.ipSeleccionadaTemporal = null;
  }

  // ================================================================
  // MOSTRAR CONTRASEÑA ASIGNACIoN
  // ================================================================

  toggleClaveAdminDetalle(): void {
    this.mostrarClaveAdminDetalle = !this.mostrarClaveAdminDetalle;
  }

  toggleClaveUsuarioDetalle(): void {
    this.mostrarClaveUsuarioDetalle = !this.mostrarClaveUsuarioDetalle;
  }

  toggleClaveAdicionalDetalle(): void {
    this.mostrarClaveAdicionalDetalle = !this.mostrarClaveAdicionalDetalle;
  }

  // ================================================================
  // AUXILIARES MOSTRAR SOFTWARE INSTALADO
  // ================================================================

  getSoftwarePorTipo(tipo: string): any[] {
    return this.softwareAsignadoList.filter((s) => s.tipoSoftware === tipo);
  }

  getSoftwarePorTipoPrimero(tipo: string): any {
    const lista = this.getSoftwarePorTipo(tipo);
    return lista.length > 0 ? lista[0] : null;
  }

  tieneSoftwareTipo(tipo: string): boolean {
    return this.getSoftwarePorTipo(tipo).length > 0;
  }

  get softwareOpcionalAsignado(): any[] {
    return this.softwareAsignadoList.filter((sw) => sw.tipoCodigo >= 3);
  }


  // ================================================================
  // AUXILIARES BACKUP - ANTIVIRUS
  // ================================================================


  get backupProgramasConNoAplica(): any[] {
    // Elemento ficticio para "NO APLICA"
    const noAplica = { codigo: 0, nombre: 'NO APLICA' };
    // Lo ponemos al inicio de la lista
    return [noAplica, ...this.backupList];
  }


  get backupProgramasSinNoAplica(): any[] {
    return this.backupList.filter((b) => b.codigo !== 0);
  }


  onProgramaBackupChange(): void {
    const codigo = Number(this.backupFormData.backupCodigo);
    const esNoAplica = (codigo === 0);

    this.programaSeleccionadoEsNoAplica = esNoAplica;

    if (esNoAplica) {
      // Limpiar campos de configuracion
      this.limpiarCamposBackup();
      // Limpiar seleccion de configuracion existente
      this.configuracionSeleccionada = null;
      this.editandoBackupExistente = false;
      this.softwareSeleccionadoBackup = null;
      this.backupFormData.backupInformacionCodigo = null;
    } else {
      // Si selecciona un programa real, cargar configuraciones (si corresponde)
      this.actualizarNombreBackup();
      this.actualizarSoftwareBackup(codigo);
    }
    this.cdr.detectChanges();
  }



  private readonly TIPOS_OBLIGATORIOS_OPCIONALES: number[] = [3, 4, 5];

  esTipoOpcionalObligatorio(tipoCodigo: number): boolean {
    return this.TIPOS_OBLIGATORIOS_OPCIONALES.includes(tipoCodigo);
  }

  private validarOpcionalesObligatorios(): boolean {
    const faltantes: number[] = [];
    for (const tipo of this.TIPOS_OBLIGATORIOS_OPCIONALES) {
      const seleccionados = this.softwareSeleccionadoOpcional[tipo] || [];
      if (seleccionados.length === 0) {
        faltantes.push(tipo);
      }
    }
    if (faltantes.length > 0) {
      const nombresTipos = faltantes.map(t => {
        switch (t) {
          case 3: return 'Navegador';
          case 4: return 'Office';
          case 5: return 'Visor PDF';
          default: return 'Software';
        }
      });
      this.notificacionSnackbarService.warning(
        'Software opcional obligatorio',
        `Debe seleccionar al menos: ${nombresTipos.join(', ')}`
      );
      return false;
    }
    return true;
  }




  totalPasos: number = 3; // si tienes mas, actualiza

  cambiarPaso(direccion: number): void {
    // Cancelar cualquier modo de edicion antes de cambiar de paso
    if (this.modoEdicion) {
      this.cancelarEdicion();
    }
    if (this.modoAgregarSoftware) {
      this.cancelarAgregarSoftware();
    }
    // Tambien si hay modo eliminar? No tiene cambios pendientes, asi que no es necesario.

    const nuevoPaso = this.paso + direccion;
    if (nuevoPaso >= 1 && nuevoPaso <= this.totalPasos) {
      this.paso = nuevoPaso;
    }
  }




  /*** Activa el modo edicion copiando los datos actuales al objeto editable 'detalle'.  */

  activarEdicion(): void {
    if (this.mostrarDevolucion) return;
    this.modoEdicion = true;

    if (this.detalleEquipo) {
      // Funcion auxiliar para limpiar claves
      const limpiarClave = (valor: string | null | undefined): string => {
        if (!valor || valor === '******') return '';
        return valor;
      };

      this.detalle = {
        nombreEquipo: this.detalleEquipo.nombreEquipo || '',
        ip: this.detalleEquipo.ip ?? null,
        nombreUsuarioAdministrador: this.detalleEquipo.nombreUsuarioAdministrador || 'SISTEMAS',
        claveUsuarioAdministrador: limpiarClave(this.detalleEquipo.claveUsuarioAdministrador),
        nombreUsuario: this.detalleEquipo.nombreUsuario || '',
        claveUsuario: limpiarClave(this.detalleEquipo.claveUsuario),
        nombreUsuarioAdicional: this.detalleEquipo.nombreUsuarioAdicional || '',
        claveUsuarioAdicional: limpiarClave(this.detalleEquipo.claveUsuarioAdicional),
      };
    } else {
      this.detalle = {
        nombreEquipo: '',
        ip: null,
        nombreUsuarioAdministrador: 'SISTEMAS',
        claveUsuarioAdministrador: '',
        nombreUsuario: '',
        claveUsuario: '',
        nombreUsuarioAdicional: '',
        claveUsuarioAdicional: '',
      };
    }

    this.paso = 1;
    this.cdr.detectChanges();
  }


  getClaveDisplay(valor: string | null | undefined): string {
    if (!valor || valor === '******') {
      return '';
    }
    return valor;
  }


  /**
   * Cancela la edicion y restaura los datos originales.
   */
  cancelarEdicion(): void {
    this.modoEdicion = false;
    this.intentadoGuardar = false; // Resetear
    this.cargarDetalleEquipo(this.equipo.serial);
    this.cargarSoftwareAsignado(this.equipo.serial);
    this.paso = 1;
  }




  /************************************************ */
  /*** Guarda los cambios en el detalle del equipo. */
  /*************************************************/




  guardarEdicion(): void {
    this.intentadoGuardar = true; // Marcar que se intento guardar

    // Validar campos obligatorios
    if (!this.esPaso1Valido) {
      this.notificacionSnackbarService.warning('Advertencia', 'Complete todos los campos obligatorios');
      // No retornamos, solo mostramos la advertencia y los asteriscos se mostraran
      // Porque la validacion fallo, no enviamos la peticion
      // Podemos retornar para no enviar datos invalidos
      return;
    }

    // Si pasa la validacion, resetear el flag (opcional)
    this.intentadoGuardar = false;

    const payload = {
      detalle: {
        nombreEquipo: this.detalle.nombreEquipo || '',
        nombreUsuario: this.detalle.nombreUsuario || '',
        claveUsuario: this.detalle.claveUsuario || '',
        nombreUsuarioAdministrador: this.detalle.nombreUsuarioAdministrador || 'SISTEMAS',
        claveUsuarioAdministrador: this.detalle.claveUsuarioAdministrador || '',
        nombreUsuarioAdicional: this.detalle.nombreUsuarioAdicional || '',
        claveUsuarioAdicional: this.detalle.claveUsuarioAdicional || '',
      },
      ip: this.detalle.ip ?? null,
    };

    this.registrarAsignacionesService.actualizarDetalleEquipo(this.equipo.serial, payload)
      .subscribe({
        next: () => {
          this.notificacionSnackbarService.success('Exito', 'Detalle del equipo actualizado');
          this.modoEdicion = false;
          this.intentadoGuardar = false; // Resetear al exito
          this.cargarDetalleEquipo(this.equipo.serial);
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error al actualizar detalle:', err);
          this.notificacionSnackbarService.error('Error', err.error?.error || 'Error al actualizar');
          // No resetear intentadoGuardar para que los errores sigan visibles
        }
      });
  }




  // SECCION EDITAR SOFTWARE INSTALADO


  /* Elimina un software instalado (desactivarlo) */
  toggleModoEliminarSoftware(): void {
    if (this.softwareOpcionalAsignado.length === 0) {
      this.notificacionSnackbarService.warning('Sin software', 'No hay software instalado para eliminar');
      return;
    }
    // Si el modo agregar esta activo, lo desactivo y limpio
    if (this.modoAgregarSoftware) {
      this.modoAgregarSoftware = false;
      this.limpiarSeleccionAgregar();
    }
    // Alterno el modo eliminar
    this.modoEliminarSoftware = !this.modoEliminarSoftware;
    this.cdr.detectChanges();
  }


  // Modal Elimnar programa
  abrirModalEliminar(software: any, index: number): void {
    this.softwareAEliminar = software;
    this.indiceAEliminar = index;
    this.mostrarModalEliminar = true;
  }

  cancelarEliminacion(): void {
    this.mostrarModalEliminar = false;
    this.softwareAEliminar = null;
    this.indiceAEliminar = -1;
  }


  async eliminarPrograma(): Promise<void> {
    if (!this.softwareAEliminar) {
      this.cancelarEliminacion();
      return;
    }

    try {
      // Llamar al endpoint para desactivar el software
      await firstValueFrom(
        this.consultarAsignacionesService.desactivarSoftwareEquipo(this.softwareAEliminar.numero)
      );

      this.notificacionSnackbarService.success(
        'Exito', `Software "${this.softwareAEliminar.nombreSoftware}" eliminado`
      );

      // Eliminar de la lista local (software opcional)
      this.softwareOpcionalAsignado.splice(this.indiceAEliminar, 1);

      // Tambien eliminar de la lista global (software asignado)
      const idxGlobal = this.softwareAsignadoList.findIndex(
        s => s.numero === this.softwareAEliminar.numero
      );
      if (idxGlobal !== -1) {
        this.softwareAsignadoList.splice(idxGlobal, 1);
      }

      // Si ya no hay software, desactivar el modo eliminar
      if (this.softwareOpcionalAsignado.length === 0) {
        this.modoEliminarSoftware = false;
      }

      // Cerrar modal y limpiar
      this.cancelarEliminacion();
      this.cdr.detectChanges();
    } catch (error) {
      console.error('Error al eliminar software:', error);
      this.notificacionSnackbarService.error('Error', 'No se pudo eliminar el software');
      this.cancelarEliminacion();
    }
  }



  /* Agregar un software instalado (activar) */


  getSoftwareList(categoriaCodigo: number | null): any[] {
    if (categoriaCodigo === null) return [];
    return this.softwarePorTipo[categoriaCodigo] || [];
  }


  toggleModoAgregarSoftware(): void {
    if (this.softwareTiposActivos.length === 0) {
      this.notificacionSnackbarService.warning('Sin categorias', 'No hay categorias de software disponibles');
      return;
    }
    // Si el modo eliminar esta activo, lo desactivo
    if (this.modoEliminarSoftware) {
      this.modoEliminarSoftware = false;
    }
    // Alterno el modo agregar
    this.modoAgregarSoftware = !this.modoAgregarSoftware;
    if (this.modoAgregarSoftware) {
      this.inicializarSeleccionesInstaladas();
    } else {
      this.limpiarSeleccionAgregar();
    }
    this.cdr.detectChanges();
  }



  seleccionarCategoria(codigo: number): void {
    this.categoriaSeleccionada = codigo;
    // Cargar software de la categoria si no esta cargado
    if (!this.softwarePorTipo[codigo]) {
      this.consultarSoftwareService.listarPorTipo(codigo).subscribe({
        next: (data) => {
          this.softwarePorTipo[codigo] = data.filter(s => s.codigo !== 0);
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error al cargar software:', err);
          this.notificacionSnackbarService.error('Error', 'No se pudo cargar el software');
        }
      });
    }
  }

  estaSeleccionadoParaAgregar(software: any): boolean {
    return this.softwareSeleccionadosParaAgregar.some(s => s.codigo === software.codigo);
  }


  toggleSeleccionParaAgregar(software: any): void {
    const index = this.softwareSeleccionadosParaAgregar.findIndex(s => s.codigo === software.codigo);
    if (index > -1) {
      this.softwareSeleccionadosParaAgregar.splice(index, 1);
    } else {
      this.softwareSeleccionadosParaAgregar.push(software);
    }
  }

  limpiarSeleccionAgregar(): void {
    this.categoriaSeleccionada = null;
    this.softwareSeleccionadosParaAgregar = [];
  }


  async agregarSoftwareSeleccionado(): Promise<void> {

    if (this.panelSeleccionesTemporales.length === 0) {
      this.notificacionSnackbarService.warning('Seleccion vacia', 'Seleccione al menos un software');
      return;
    }

    if (!this.equipo.asignacionId) {
      this.notificacionSnackbarService.error('Error', 'No se encontro la asignacion del equipo');
      return;
    }

    // Filtrar los que YA estan instalados para no duplicar
    const softwareParaAgregar = this.panelSeleccionesTemporales.filter(sw => {
      const yaInstalado = this.softwareAsignadoList.some(
        s => Number(s.softwareCodigo) === Number(sw.codigo)
      );
      return !yaInstalado;
    });

    if (softwareParaAgregar.length === 0) {
      this.notificacionSnackbarService.info('Sin cambios', 'El software seleccionado ya esta instalado');
      return;
    }

    try {
      const promesas = softwareParaAgregar.map(async (sw) => {
        return firstValueFrom(
          this.registrarAsignacionesService.asignarSoftwareAEquipo(
            this.equipo.serial,
            sw.codigo,
            this.equipo.asignacionId,
            null // politica (solo para antivirus)
          )
        );
      });

      await Promise.all(promesas);


      // ============================================================
      // ACTUALIZAR softwareSeleccionadoOpcional PARA REFLEJAR EN VERDE
      // ============================================================
      const tipoCodigo = this.panelTipoOpcionalCodigo;
      if (tipoCodigo !== null) {
        // Obtener TODOS los software instalados de este tipo
        const instaladosDeEsteTipo = this.softwareAsignadoList
          .filter(sw => sw.tipoCodigo === tipoCodigo)
          .map(sw => sw.softwareCodigo);

        // Obtener la lista completa de software disponible de este tipo
        const disponibles = this.softwarePorTipo[tipoCodigo] || [];

        // Actualizar softwareSeleccionadoOpcional con TODOS los instalados
        this.softwareSeleccionadoOpcional[tipoCodigo] = disponibles.filter(
          sw => instaladosDeEsteTipo.includes(sw.codigo)
        );
      }

      // Recargar la lista actualizada desde el backend
      await this.cargarSoftwareAsignado(this.equipo.serial);

      this.notificacionSnackbarService.success(
        'Exito',
        `${softwareParaAgregar.length} software(s) agregado(s) correctamente`
      );

      // Limpiar y cerrar
      this.panelSeleccionesTemporales = [];
      this.cerrarPanel();

      this.cdr.detectChanges();
    } catch (error) {
      console.error('❌ Error al agregar software:', error);
      this.notificacionSnackbarService.error('Error', 'No se pudo agregar el software');
    }
  }



  cancelarAgregarSoftware(): void {
    this.modoAgregarSoftware = false;
    this.limpiarSeleccionAgregar();
    this.cdr.detectChanges();
  }

  guardarAgregarSoftware(): void {
    this.agregarSoftwareSeleccionado();
  }


  private inicializarSeleccionesInstaladas(): void {
    // Recorrer todos los tipos activos
    this.softwareTiposActivos.forEach(tipo => {
      // Obtener los software asignados de este tipo (instalados)
      const instalados = this.softwareAsignadoList.filter(sw => sw.tipoCodigo === tipo.codigo);
      if (instalados.length > 0) {
        // Mapear a objetos con la estructura que espera softwareSeleccionadoOpcional
        this.softwareSeleccionadoOpcional[tipo.codigo] = instalados.map(sw => ({
          codigo: sw.softwareCodigo,
          nombre: sw.nombreSoftware,
          rutaImagen: sw.rutaImagen,
          tipo: { codigo: tipo.codigo, descripcion: tipo.descripcion }
        }));
      } else {
        // Asegurar que no queden datos de sesiones anteriores
        this.softwareSeleccionadoOpcional[tipo.codigo] = [];
      }
    });
  }

}



