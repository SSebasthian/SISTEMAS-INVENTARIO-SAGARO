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
  dominios: any[] = [];
  tipoSeleccionado: any = null;

  // ========== MODELO DEL CORREO ==========
  mostrarClave = false;
  mostrarRepetirClave = false;

  recurso: any = {
    tipoCodigo: null,
    dominioCodigo: null,
    usuario: '',
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

  constructor(
    private registroCorreoService: RegistroCorreoService,
    private consultaRecursoService: ConsultaRecursoService,
    private consultarRecursoTipoService: ConsultarRecursoTipoService,
    private snackbar: NotificacionSnackbarService,
    private permisoModuloService: PermisoModuloService
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.consultaRecursoService.listarActivos().subscribe({
      next: (data) => {
        this.tiposRecurso = data;
        // Si hay un tipo CORREO, cargar sus dominios
        const correoTipo = data.find(t => t.nombre === 'CORREO');
        if (correoTipo) {
          this.cargarDominios(correoTipo.codigo);
        }
      },
      error: () => this.snackbar.error('Error', 'No se pudieron cargar los tipos de recurso')
    });
  }

  cargarDominios(recursoCodigo: number): void {
    this.consultarRecursoTipoService.listarPorRecurso(recursoCodigo).subscribe({
      next: (data) => { this.dominios = data; },
      error: () => this.snackbar.error('Error', 'No se pudieron cargar los dominios')
    });
  }

  // ========== REGISTRAR ==========
  registrar(): void {
    if (this.enviando) return;
    if (!this.recurso.tipoCodigo || !this.recurso.dominioCodigo || !this.recurso.usuario || !this.recurso.clave) {
      this.snackbar.warning('Campos incompletos', 'Todos los campos son obligatorios');
      return;
    }

    // Validar coincidencia de claves
    if (this.recurso.clave !== this.recurso.repetirClave) {
      this.snackbar.warning('Claves no coinciden', 'Las claves deben ser iguales');
      return;
    }

    // Validar que el dominio exista
    const dominio = this.dominios.find(d => d.codigo === Number(this.recurso.dominioCodigo));
    if (!dominio) {
      this.snackbar.error('Error', 'Dominio no encontrado. Por favor seleccione uno valido.');
      return;
    }

    // Convertir cuerpo a mayasculas
    const usuarioMayus = this.recurso.usuario.toUpperCase();
    // Dominio en mayusculas y agregar .COM
    const dominioNombre = dominio.nombre.toUpperCase();
    const direccion = `${usuarioMayus}@${dominioNombre}.COM`;

    const payload = {
      direccion: direccion,
      clave: this.recurso.clave,
      activo: this.recurso.activo
    };

    this.enviando = true;
    this.registroCorreoService.registrar(payload).subscribe({
      next: (resp) => {
        this.snackbar.success('Correo registrado', `${resp.direccion}`);
        this.limpiarFormulario();
        this.enviando = false;
      },
      error: (err) => {
        console.error('Error completo:', err); // Para depurar

        let mensaje = 'Error al registrar el correo';

        // Extraer mensaje del error (probando diferentes estructuras)
        if (err.error?.message) {
          mensaje = err.error.message;
        } else if (err.error?.error) {
          mensaje = err.error.error;
        } else if (err.message) {
          mensaje = err.message;
        }

        // Personalizar si es un error de duplicado
        if (mensaje.toLowerCase().includes('ya existe')) {
          mensaje = `El correo ya esta registrado en el sistema.`;
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

    // Validar solo si se escribio clave
    if (this.recurso.clave && this.recurso.clave !== this.recurso.repetirClave) {
      this.snackbar.warning('Claves no coinciden', 'Las claves deben ser iguales');
      return;
    }

    const dominio = this.dominios.find(d => d.codigo === Number(this.recurso.dominioCodigo));
    if (!dominio) {
      this.snackbar.error('Error', 'Dominio no encontrado');
      return;
    }

const direccion = `${this.recurso.usuario.toUpperCase()}@${dominio.nombre.toUpperCase()}.COM`;

    // Construir payload: solo incluir clave si el usuario la escribio
    const payload: any = {
      direccion: direccion,
      activo: this.recurso.activo
    };
    if (this.recurso.clave && this.recurso.clave.trim() !== '') {
      payload.clave = this.recurso.clave;
    }

    this.enviando = true;
    this.registroCorreoService.editar(this.idOriginal, payload).subscribe({
      next: (resp) => {
        this.snackbar.success('Correo actualizado', `${resp.direccion}`);
        this.limpiarFormulario();
        this.enviando = false;
      },
      error: (err) => {
        const mensaje = err.error?.message || err.message || 'Error al actualizar';
        this.snackbar.error('Error', mensaje);
        this.enviando = false;
      }
    });
  }


  // ========== LIMPIAR ==========
  limpiarFormulario(): void {
    this.recurso = {
      tipoCodigo: null,
      dominioCodigo: null,
      usuario: '',
      clave: '',
      repetirClave: '',
      activo: true
    };
    this.modoEdicion = false;
    this.idOriginal = null;
    this.mostrarModalBuscar = false;
    this.busquedaModal = '';
    this.resultadosBusqueda = [];
  }

  // ========== BUSCADOR PARA EDITAR ==========
  abrirModalBuscar(): void {
    this.mostrarModalBuscar = true;
    this.busquedaModal = '';
    this.resultadosBusqueda = [];
  }

  cerrarModalBuscar(): void {
    this.mostrarModalBuscar = false;
    this.busquedaModal = '';
    this.resultadosBusqueda = [];
  }

  buscarEnModal(): void {
    if (this.busquedaModal.length < 2) {
      this.resultadosBusqueda = [];
      return;
    }
    this.buscando = true;
    this.registroCorreoService.buscar(this.busquedaModal).subscribe({
      next: (data) => {
        this.resultadosBusqueda = data;
        this.buscando = false;
      },
      error: () => {
        this.resultadosBusqueda = [];
        this.buscando = false;
        this.snackbar.error('Error', 'No se pudieron buscar correos');
      }
    });
  }

  seleccionarCorreo(correo: any): void {
    this.modoEdicion = true;
    this.idOriginal = correo.codigo;

    // Establecer el tipo de recurso (CORREO)
    // Buscar el tipo "CORREO" en la lista de tiposRecurso
    const tipoCorreo = this.tiposRecurso.find(t => t.nombre === 'CORREO');
    this.recurso.tipoCodigo = tipoCorreo ? tipoCorreo.codigo : null;

    // Extraer usuario y dominio de la dirección
    const partes = correo.direccion.split('@');
    this.recurso.usuario = partes[0]; // usuario en minúsculas

    // Limpiar el dominio: eliminar extension (.COM, .com, etc.) y convertir a minusculas para buscar
    let nombreDominio = partes[1].split('.')[0].toLowerCase();

    // Buscar el dominio en la lista (ignorando mayusculas/minusculas)
    const dominioEncontrado = this.dominios.find(d =>
      d.nombre.toLowerCase() === nombreDominio
    );

    this.recurso.dominioCodigo = dominioEncontrado ? dominioEncontrado.codigo : null;

    this.recurso.clave = ''; // No se devuelve la clave
    this.recurso.repetirClave = ''; // Limpiar también la repeticion
    this.recurso.activo = correo.activo;

    this.snackbar.success('Correo seleccionado', `Editando: ${correo.direccion}`);
    this.cerrarModalBuscar();
  }

  // ========== PERMISOS ==========
  get puedeEditarRegistro(): boolean {
    return this.permisoModuloService.puede('registro', 'editar');
  }


  // MOSTRAR CLAVE CORREO
  toggleMostrarClave(): void {
    this.mostrarClave = !this.mostrarClave;
  }
  toggleMostrarRepetirClave(): void {
    this.mostrarRepetirClave = !this.mostrarRepetirClave;
  }


}
