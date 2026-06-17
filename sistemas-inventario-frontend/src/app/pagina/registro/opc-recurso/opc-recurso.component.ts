import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { A11yModule } from '@angular/cdk/a11y';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';
import { PermisoModuloService } from '../../../arquitectura/servicio/autenticacion/permiso-modulo.service';
import { ConsultaRecursoService } from '../../../arquitectura/servicio/consulta/ConsultaRecurso.service';
import { ConsultarRecursoTipoService } from '../../../arquitectura/servicio/consulta/ConsultarRecursoTipo.service';
import { RegistroCorreoService } from '../../../arquitectura/servicio/registro/RegistroCorreo.service';
import { RegistroLineaTelefonoService } from '../../../arquitectura/servicio/registro/RegistroLineaTelefono.service';


@Component({
  selector: 'app-opc-recurso',
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatSelectModule,
    A11yModule
  ],
  templateUrl: './opc-recurso.component.html',
  styleUrl: './opc-recurso.component.css'
})
export class OpcRecursoComponent {


  // ========== DATOS PRINCIPALES ==========
  tiposRecurso: any[] = [];
  subtipos: any[] = [];
  tipoSeleccionado: any = null;


  // ========== MODELO DEL CORREO ==========
  mostrarClave = false;
  mostrarRepetirClave = false;

  recurso: any = {
    tipoCodigo: null,
    subtipoCodigo: null,
    operador: '',
    identificador: '',
    confirmarIdentificador: '',
    clave: '',
    repetirClave: '',
    activo: true
  };

  // ========== VARIABLES DE ESTADO ==========
  enviando = false;
  modoEdicion = false;
  idOriginal: number | null = null;


  // ========== MODALES ==========
  mostrarModalBuscar = false;
  busquedaModal = '';
  resultadosBusqueda: any[] = [];
  buscando = false;


  registrosActivos: any[] = [];
  filtroBusquedaModal: string = '';


  constructor(
    private registroCorreoService: RegistroCorreoService,
    private registroLineaTelefonoService: RegistroLineaTelefonoService,
    private consultaRecursoService: ConsultaRecursoService,
    private consultarRecursoTipoService: ConsultarRecursoTipoService,
    private snackbar: NotificacionSnackbarService,
    private permisoModuloService: PermisoModuloService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  // ========== CARGA INICIAL ==========
  cargarDatos(): void {
    this.consultaRecursoService.listarActivos().subscribe({
      next: (data) => {
        this.tiposRecurso = data;
      },
      error: () => this.snackbar.error('Error', 'No se pudieron cargar los tipos de recurso')
    });
  }

  // ========== AL CAMBIAR TIPO ==========
  onTipoChange(): void {
    const tipo = this.tiposRecurso.find(t => t.codigo === Number(this.recurso.tipoCodigo));
    this.tipoSeleccionado = tipo;
    this.mostrarModalBuscar = false;  // cerrar modal si estaba abierto

    if (tipo) {
      this.cargarSubtipos(tipo.codigo);
      this.cargarRegistrosActivos(tipo.nombre);
      this.limpiarFormulario();          // resetear campos
      this.modoEdicion = false;
      this.idOriginal = null;
    } else {
      this.subtipos = [];
      this.registrosActivos = [];
    }
  }

  cargarSubtipos(recursoCodigo: number): void {
    this.consultarRecursoTipoService.listarPorRecurso(recursoCodigo).subscribe({
      next: (data) => { this.subtipos = data; },
      error: () => this.snackbar.error('Error', 'No se pudieron cargar los subtipos')
    });
  }

  cargarRegistrosActivos(tipoNombre: string): void {
    if (tipoNombre === 'CORREO') {
      this.registroCorreoService.listarTodos().subscribe({
        next: (data) => { this.registrosActivos = data; },
        error: () => this.snackbar.error('Error', 'No se pudieron cargar los correos activos')
      });
    } else if (tipoNombre === 'LINEATELEFONICA') {
      this.registroLineaTelefonoService.listarTodos().subscribe({
        next: (data) => { this.registrosActivos = data; },
        error: () => this.snackbar.error('Error', 'No se pudieron cargar los teléfonos activos')
      });
    } else {
      this.registrosActivos = [];
    }
  }

  // ========== GETTER PARA FILTRADO LOCAL EN MODAL ==========
  get registrosFiltrados(): any[] {
    // Solo mostrar resultados si hay al menos 2 caracteres
    if (!this.filtroBusquedaModal || this.filtroBusquedaModal.length < 2) {
      return [];
    }
    const filtro = this.filtroBusquedaModal.toLowerCase();
    return this.registrosActivos.filter(item => {
      const campo = this.tipoSeleccionado?.nombre === 'CORREO' ? item.direccion : item.numero;
      return campo && campo.toLowerCase().includes(filtro);
    });
  }

  // ========== REGISTRAR ==========
  registrar(): void {
    if (this.enviando) return;
    if (!this.recurso.tipoCodigo || !this.recurso.subtipoCodigo || !this.recurso.identificador) {
      this.snackbar.warning('Campos incompletos', 'Todos los campos son obligatorios');
      return;
    }

    const tipo = this.tiposRecurso.find(t => t.codigo === Number(this.recurso.tipoCodigo));
    if (!tipo) {
      this.snackbar.error('Error', 'Tipo de recurso no válido');
      return;
    }

    const subtipo = this.subtipos.find(s => s.codigo === Number(this.recurso.subtipoCodigo));
    if (!subtipo) {
      this.snackbar.error('Error', 'Subtipo no válido');
      return;
    }

    let payload: any = {};
    let servicio: any;

    if (tipo.nombre === 'CORREO') {
      if (this.recurso.clave !== this.recurso.repetirClave) {
        this.snackbar.warning('Claves no coinciden', 'Las claves deben ser iguales');
        return;
      }
      const direccion = `${this.recurso.identificador.toUpperCase()}@${subtipo.nombre.toUpperCase()}.COM`;
      payload = {
        direccion: direccion,
        clave: this.recurso.clave,
        recursoCodigo: tipo.codigo,
        recursoTipoCodigo: subtipo.codigo,
        activo: this.recurso.activo
      };
      servicio = this.registroCorreoService;
    } else if (tipo.nombre === 'LINEATELEFONICA') {
      // Validar que los numeros coincidan
      if (this.recurso.identificador !== this.recurso.confirmarIdentificador) {
        this.snackbar.warning('Numeros no coinciden', 'Los numeros deben ser iguales');
        return;
      }
      if (!this.recurso.operador) {
        this.snackbar.warning('Operador requerido', 'Seleccione un operador');
        return;
      }
      payload = {
        numero: this.recurso.identificador,
        operador: this.recurso.operador,
        activo: this.recurso.activo,
        recursoCodigo: tipo.codigo,
        recursoTipoCodigo: subtipo.codigo,
      };
      servicio = this.registroLineaTelefonoService;

    } else {
      this.snackbar.warning('Tipo no soportado', 'Este tipo de recurso aun no esta implementado');
      return;
    }

    this.enviando = true;
    servicio.registrar(payload).subscribe({
      next: () => {
        this.snackbar.success('Registro exitoso', `${tipo.nombre} registrado`);
        this.limpiarFormulario();
        this.enviando = false;
        this.cargarRegistrosActivos(tipo.nombre);
      },
      error: (err: any) => {
        let mensaje = err.error?.message || err.message || 'Error al registrar';
        if (mensaje.toLowerCase().includes('ya existe')) {
          mensaje = `El ${tipo.nombre.toLowerCase()} ya esta registrado.`;
        }
        this.snackbar.error('Error', mensaje);
        this.enviando = false;
      }
    });
  }

  // ========== EDITAR ==========
  editar(): void {
    if (this.enviando) return;
    if (!this.idOriginal) {
      this.snackbar.warning('Sin ID', 'No se puede editar un registro sin ID');
      return;
    }

    const tipo = this.tiposRecurso.find(t => t.codigo === Number(this.recurso.tipoCodigo));
    if (!tipo) {
      this.snackbar.error('Error', 'Tipo de recurso no valido');
      return;
    }

    const subtipo = this.subtipos.find(s => s.codigo === Number(this.recurso.subtipoCodigo));
    if (!subtipo) {
      this.snackbar.error('Error', 'Subtipo no valido');
      return;
    }

    let payload: any = {};
    let servicio: any;

    if (tipo.nombre === 'CORREO') {
      if (this.recurso.clave && this.recurso.clave !== this.recurso.repetirClave) {
        this.snackbar.warning('Claves no coinciden', 'Las claves deben ser iguales');
        return;
      }
      const direccion = `${this.recurso.identificador.toUpperCase()}@${subtipo.nombre.toUpperCase()}.COM`;
      payload = { direccion, activo: this.recurso.activo };
      if (this.recurso.clave && this.recurso.clave.trim() !== '') {
        payload.clave = this.recurso.clave;
      }
      servicio = this.registroCorreoService;

    } else if (tipo.nombre === 'LINEATELEFONICA') {
      // Validar que los numeros coincidan (si se cambio)
      if (this.recurso.identificador !== this.recurso.confirmarIdentificador) {
        this.snackbar.warning('Números no coinciden', 'Los números deben ser iguales');
        return;
      }
      if (!this.recurso.operador) {
        this.snackbar.warning('Operador requerido', 'Seleccione un operador');
        return;
      }
      payload = {
        numero: this.recurso.identificador,
        operador: this.recurso.operador,
        activo: this.recurso.activo
      };
      servicio = this.registroLineaTelefonoService;

    } else {
      this.snackbar.warning('Tipo no soportado', 'Este tipo de recurso aún no esta implementado');
      return;
    }

    this.enviando = true;
    servicio.editar(this.idOriginal, payload).subscribe({
      next: () => {  //
        this.snackbar.success('Actualizacian exitosa', `${tipo.nombre} actualizado`);
        this.limpiarFormulario();
        this.enviando = false;
        this.cargarRegistrosActivos(tipo.nombre);
      },
      error: (err: any) => {  // 
        const mensaje = err.error?.message || err.message || 'Error al actualizar';
        this.snackbar.error('Error', mensaje);
        this.enviando = false;
      }
    });
  }

  // ========== LIMPIAR FORMULARIO ==========
  limpiarFormulario(): void {
    this.recurso = {
      tipoCodigo: this.recurso.tipoCodigo, // mantener el tipo seleccionado
      subtipoCodigo: null,
      identificador: '',
      confirmarIdentificador: '',
      clave: '',
      repetirClave: '',
      activo: true
    };
    this.modoEdicion = false;
    this.idOriginal = null;
    this.mostrarModalBuscar = false;
    this.filtroBusquedaModal = '';
    // No limpiar registrosActivos porque se recargan al cambiar tipo
  }

  // ========== MODAL DE BÚSQUEDA ==========
  abrirModalBuscar(): void {
    this.mostrarModalBuscar = true;
    this.filtroBusquedaModal = '';
    if (this.subtipos.length === 0 && this.tipoSeleccionado) {
      this.cargarSubtipos(this.tipoSeleccionado.codigo);
    }
  }

  cerrarModalBuscar(): void {
    this.mostrarModalBuscar = false;
    this.filtroBusquedaModal = '';
  }

  seleccionarRegistro(registro: any): void {
    this.modoEdicion = true;
    this.idOriginal = registro.codigo;

    // Establecer tipo
    this.recurso.tipoCodigo = this.tipoSeleccionado?.codigo;

    // Buscar subtipo correspondiente
    if (this.tipoSeleccionado?.nombre === 'CORREO') {
      const partes = registro.direccion.split('@');
      this.recurso.identificador = partes[0]; // usuario
      const nombreDominio = partes[1].split('.')[0].toLowerCase();
      const subtipo = this.subtipos.find(s => s.nombre.toLowerCase() === nombreDominio);
      this.recurso.subtipoCodigo = subtipo ? subtipo.codigo : null;
      this.recurso.clave = '';
      this.recurso.repetirClave = '';
    }

    else if (this.tipoSeleccionado?.nombre === 'LINEATELEFONICA') {
      this.recurso.identificador = registro.numero;
      this.recurso.confirmarIdentificador = registro.numero;
      this.recurso.operador = registro.operador;
      this.recurso.subtipoCodigo = registro.recursoTipo?.codigo || null;
      this.recurso.clave = '';
      this.recurso.repetirClave = '';
    }

    this.recurso.activo = registro.activo;

    this.snackbar.success('Registro seleccionado', `Editando: ${this.tipoSeleccionado?.nombre}`);
    this.cerrarModalBuscar();
  }

  // ========== PERMISOS ==========
  get puedeEditarRegistro(): boolean {
    return this.permisoModuloService.puede('registro', 'editar');
  }

  // ========== MOSTRAR/OCULTAR CLAVE ==========
  toggleMostrarClave(): void {
    this.mostrarClave = !this.mostrarClave;
  }
  toggleMostrarRepetirClave(): void {
    this.mostrarRepetirClave = !this.mostrarRepetirClave;
  }


  getNombreMostrar(tipo: any): string {
    if (tipo.nombre === 'LINEATELEFONICA') {
      return 'LINEA TELEFONICA';
    }
    return tipo.nombre;
  }

}
