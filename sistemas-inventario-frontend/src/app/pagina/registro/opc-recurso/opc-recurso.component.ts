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
import { RegistroCuentaService } from '../../../arquitectura/servicio/registro/RegistroCuenta.service';
import { ConsultarPlataformaService } from '../../../arquitectura/servicio/consulta/ConsultarPlataforma.service';
import { ConsultarPlataformaRolService } from '../../../arquitectura/servicio/consulta/ConsultarPlataformaRol.service';




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
  claveCifrada: string = '';
  mostrarRepetirClave = false;
  editarNuevaClave: boolean = false;

  recurso: any = {
    tipoCodigo: null,
    subtipoCodigo: null,
    operador: '',
    identificador: '',
    confirmarIdentificador: '',
    clave: '',
    nuevaClave: '',
    repetirClave: '',
    plataformaCodigo: null,
    plataformaRolCodigo: null,
    activo: true
  };


  // =====ESTADO DEL COMPONENTE =============
  enviando = false;
  modoEdicion = false;
  idOriginal: number | null = null;
  recursoEnUso: boolean = false;



  // ========== MODALES Y LISTAS AUX ==========
  mostrarModalBuscar = false;
  filtroBusquedaModal: string = '';
  registrosActivos: any[] = [];

  plataformas: any[] = [];
  roles: any[] = [];





  constructor(
    private registroCorreoService: RegistroCorreoService,
    private registroLineaTelefonoService: RegistroLineaTelefonoService,
    private registroCuentaService: RegistroCuentaService,
    private consultaRecursoService: ConsultaRecursoService,
    private consultarRecursoTipoService: ConsultarRecursoTipoService,
    private snackbar: NotificacionSnackbarService,
    private permisoModuloService: PermisoModuloService,
    private consultarPlataformaService: ConsultarPlataformaService,
    private consultarPlataformaRolService: ConsultarPlataformaRolService,
  ) { }

  ngOnInit(): void {
    this.cargarDatos();
  }


  // ================================
  //  CARGA INICIAL DE DATOS
  // ================================


  cargarDatos(): void {
    this.consultaRecursoService.listarActivos().subscribe({
      next: (data) => {
        this.tiposRecurso = data;
        // Seleccionar PLATAFORMA por defecto si no hay tipo seleccionado
        if (!this.recurso.tipoCodigo) {
          const tipoPlataforma = data.find(t => t.nombre === 'PLATAFORMA' || t.nombre === 'PLATAFORMAS');
          if (tipoPlataforma) {
            this.recurso.tipoCodigo = tipoPlataforma.codigo;
            this.onTipoChange(); // esto carg subtipos, registros, etc.
          }
        }
      },
      error: () => this.snackbar.error('Error', 'No se pudieron cargar los tipos de recurso')
    });
  }

  // ================================
  //  MANEJO DE CAMBIOS DE TIPO
  // ================================

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
      this.editarNuevaClave = false;
    } else {
      this.subtipos = [];
      this.registrosActivos = [];
    }
  }

  cargarSubtipos(recursoCodigo: number): void {
    this.consultarRecursoTipoService.listarPorRecurso(recursoCodigo).subscribe({
      next: (data) => {
        // FILTRAMOS: Excluimos el que tenga codigo 0 o se llame "NO APLICA"
        this.subtipos = data.filter((s: any) =>
          s.codigo !== 0 &&
          s.nombre?.toUpperCase() !== 'NO APLICA'
        );
      },
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
        error: () => this.snackbar.error('Error', 'No se pudieron cargar los telefonos activos')
      });

    } else if (tipoNombre === 'PLATAFORMA') {
      this.registroCuentaService.listarTodos().subscribe({
        next: (data) => { this.registrosActivos = data; },
        error: () => this.snackbar.error('Error', 'No se pudieron cargar las cuentas')
      });

    } else {
      this.registrosActivos = [];
    }
  }



  // ================================
  //  CAMBIOS EN PLATAFORMAS
  // ================================


  onSubtipoChange(): void {
    const subtipoCodigo = Number(this.recurso.subtipoCodigo);
    if (subtipoCodigo) {
      this.consultarPlataformaService.listarPorTipo(subtipoCodigo).subscribe({
        next: (data) => {
          this.plataformas = data;
          this.recurso.plataformaCodigo = null; // resetear seleccion
        },
        error: () => this.snackbar.error('Error', 'No se pudieron cargar las plataformas')
      });
    } else {
      this.plataformas = [];
      this.recurso.plataformaCodigo = null;
    }
  }

  onPlataformaChange(): void {
    const plataformaCodigo = Number(this.recurso.plataformaCodigo);
    this.cargarRolesPorPlataforma(plataformaCodigo);
  }

  cargarRolesPorPlataforma(plataformaCodigo: number): void {
    if (plataformaCodigo) {
      this.consultarPlataformaRolService.listarPorPlataforma(plataformaCodigo).subscribe({
        next: (data) => {
          this.roles = data;
          this.recurso.plataformaRolCodigo = null; // resetear seleccion
        },
        error: () => this.snackbar.error('Error', 'No se pudieron cargar los roles')
      });
    } else {
      this.roles = [];
      this.recurso.plataformaRolCodigo = null;
    }
  }


  // ================================
  //  REGISTRAR
  // ================================


  registrar(): void {
    if (this.enviando) return;

    // Validacion comun: solo tipoCodigo
    if (!this.recurso.tipoCodigo) {
      this.snackbar.warning('Campos incompletos', 'Seleccione un tipo de recurso');
      return;
    }

    const tipo = this.tiposRecurso.find(t => t.codigo === Number(this.recurso.tipoCodigo));
    if (!tipo) {
      this.snackbar.error('Error', 'Tipo de recurso nolido');
      return;
    }

    let payload: any = {};
    let servicio: any;

    if (tipo.nombre === 'CORREO') {
      // Validaciones especificas CORREO
      if (!this.recurso.subtipoCodigo || !this.recurso.identificador || !this.recurso.clave || !this.recurso.repetirClave) {
        this.snackbar.warning('Campos incompletos', 'Todos los campos son obligatorios');
        return;
      }
      if (this.recurso.clave !== this.recurso.repetirClave) {
        this.snackbar.warning('Claves no coinciden', 'Las claves deben ser iguales');
        return;
      }
      const subtipo = this.subtipos.find(s => s.codigo === Number(this.recurso.subtipoCodigo));
      if (!subtipo) {
        this.snackbar.error('Error', 'Subtipo nolido');
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
      if (!this.recurso.subtipoCodigo || !this.recurso.identificador || !this.recurso.confirmarIdentificador || !this.recurso.operador) {
        this.snackbar.warning('Campos incompletos', 'Todos los campos son obligatorios');
        return;
      }
      if (this.recurso.identificador !== this.recurso.confirmarIdentificador) {
        this.snackbar.warning('Numeros no coinciden', 'Los numeros deben ser iguales');
        return;
      }

      // VALIDACION segun tipo de linea
      if (!this.numeroValidoSegunTipo) {
        this.snackbar.warning('Numero invalido', this.mensajeErrorNumero);
        return;
      }

      // VALIDACION de duplicado
      if (this.lineaExisteExacta) {
        this.snackbar.warning('Numero duplicado', 'Ya existe un numero con este tipo de linea');
        return;
      }

      const subtipo = this.subtipos.find(s => s.codigo === Number(this.recurso.subtipoCodigo));
      if (!subtipo) {
        this.snackbar.error('Error', 'Subtipo no valido');
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


    } else if (tipo.nombre === 'PLATAFORMA') {
      // Validaciones especificas PLATAFORMAS
      if (!this.recurso.plataformaCodigo || !this.recurso.plataformaRolCodigo || !this.recurso.usuario) {
        this.snackbar.warning('Campos incompletos', 'Seleccione plataforma, rol y escriba usuario');
        return;
      }
      payload = {
        plataformaCodigo: this.recurso.plataformaCodigo,
        plataformaRolCodigo: this.recurso.plataformaRolCodigo,
        usuario: this.recurso.usuario,
        activo: this.recurso.activo
      };
      servicio = this.registroCuentaService;

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



  // ================================
  //  EDITAR
  // ================================


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
      // Validar que si escribio nueva clave, tenga al menos 3 caracteres (opcional)
      if (this.recurso.nuevaClave && this.recurso.nuevaClave.length > 0 && this.recurso.nuevaClave.length < 3) {
        this.snackbar.warning('Clave muy corta', 'La nueva clave debe tener al menos 3 caracteres');
        return;
      }

      const direccion = `${this.recurso.identificador.toUpperCase()}@${subtipo.nombre.toUpperCase()}.COM`;
      payload = { direccion, activo: this.recurso.activo };

      // Solo enviamos la clave si el usuario escribio una nueva
      if (this.recurso.nuevaClave && this.recurso.nuevaClave.trim() !== '') {
        payload.clave = this.recurso.nuevaClave;
      }

      servicio = this.registroCorreoService;


    } else if (tipo.nombre === 'PLATAFORMA') {
      // Validar campos obligatorios
      if (!this.recurso.usuario) {
        this.snackbar.warning('Campos incompletos', 'El usuario es obligatorio');
        return;
      }
      if (!this.recurso.plataformaRolCodigo) {
        this.snackbar.warning('Campos incompletos', 'Seleccione un rol');
        return;
      }
      payload = {
        usuario: this.recurso.usuario,
        plataformaRolCodigo: this.recurso.plataformaRolCodigo,
        activo: this.recurso.activo
      };
      servicio = this.registroCuentaService;

    } else {
      this.snackbar.warning('Tipo no soportado', 'Este tipo de recurso aun no esta implementado');
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


  // ================================
  //  MODAL DE BUSQUEDA
  // ================================

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


  get registrosFiltrados(): any[] {
    if (!this.filtroBusquedaModal || this.filtroBusquedaModal.length < 2) {
      return [];
    }
    const filtro = this.filtroBusquedaModal.toLowerCase();
    return this.registrosActivos.filter(item => {
      let campo = '';
      if (this.tipoSeleccionado?.nombre === 'CORREO') {
        campo = item.direccion;
      } else if (this.tipoSeleccionado?.nombre === 'LINEATELEFONICA') {
        campo = item.numero;
      } else if (this.tipoSeleccionado?.nombre === 'PLATAFORMA') {
        // Buscar por usuario o nombre de plataforma
        campo = item.usuario + ' ' + (item.plataforma?.descripcion || '');
      }
      return campo && campo.toLowerCase().includes(filtro);
    });
  }


  seleccionarRegistro(registro: any): void {
    this.modoEdicion = true;
    this.idOriginal = registro.codigo;
    this.recurso.tipoCodigo = this.tipoSeleccionado?.codigo;

    // ============ CORREO ============
    if (this.tipoSeleccionado?.nombre === 'CORREO') {

      this.registroCorreoService.estaAsignado(registro.codigo).subscribe({
        next: (resp: any) => {
          this.recursoEnUso = resp.asignado === true;
        },
        error: () => this.recursoEnUso = false
      });


      const partes = registro.direccion.split('@');
      this.recurso.identificador = partes[0];

      const nombreDominio = partes[1].split('.')[0].toLowerCase();
      const subtipo = this.subtipos.find(s => s.nombre.toLowerCase() === nombreDominio);
      this.recurso.subtipoCodigo = subtipo ? subtipo.codigo : null;

      // Guardamos el hash cifrado
      this.claveCifrada = registro.clave || '';

      // Ponemos puntitos si hay clave, para que el input no se vea vacio
      this.recurso.clave = this.claveCifrada ? '••••••••' : '';
      this.editarNuevaClave = false;
      this.recurso.nuevaClave = '';
      this.mostrarClave = false;
      this.mostrarRepetirClave = false;
    }

    // ============ LINEA TELEFONICA ============
    else if (this.tipoSeleccionado?.nombre === 'LINEATELEFONICA') {
      this.recurso.identificador = registro.numero;
      this.recurso.confirmarIdentificador = registro.numero;
      this.recurso.operador = registro.operador;
      this.recurso.subtipoCodigo = registro.recursoTipo?.codigo || null;
      this.recurso.clave = '';
      this.recurso.repetirClave = '';
    }

    // ============ PLATAFORMA ============
    else if (this.tipoSeleccionado?.nombre === 'PLATAFORMA') {
      this.recurso.usuario = registro.usuario;
      const subtipoCodigo = registro.plataforma?.recursoTipo?.codigo || null;
      this.recurso.subtipoCodigo = subtipoCodigo;

      if (subtipoCodigo) {
        this.consultarPlataformaService.listarPorTipo(subtipoCodigo).subscribe({
          next: (plataformas) => {
            this.plataformas = plataformas;
            this.recurso.plataformaCodigo = registro.plataforma?.codigo || null;

            if (this.recurso.plataformaCodigo) {
              this.consultarPlataformaRolService.listarPorPlataforma(this.recurso.plataformaCodigo).subscribe({
                next: (roles) => {
                  this.roles = roles;
                  const rolEncontrado = roles.find(r => r.codigo === registro.plataformaRol?.codigo);
                  this.recurso.plataformaRolCodigo = rolEncontrado ? rolEncontrado.codigo : null;
                },
                error: () => this.snackbar.error('Error', 'No se pudieron cargar los roles')
              });
            }
          },
          error: () => this.snackbar.error('Error', 'No se pudieron cargar las plataformas')
        });
      }
    }

    // ============ ESTADO COMuN ============
    this.recurso.activo = registro.activo;
    this.snackbar.success('Registro seleccionado', `Editando: ${this.tipoSeleccionado?.nombre}`);
    this.cerrarModalBuscar();
  }



  // ========== MeTODO PARA EL OJITO ==========
  verClaveOriginal(): void {
    // Si ya tenemos la clave REAL cargada (no puntitos), solo ocultamos/mostramos
    if (this.recurso.clave && this.recurso.clave !== '••••••••') {
      this.mostrarClave = !this.mostrarClave;
      return;
    }

    if (!this.idOriginal) return;

    // Peticion al backend para descifrar
    this.registroCorreoService.verClaveDesencriptada(this.idOriginal).subscribe({
      next: (respuesta) => {
        this.recurso.clave = respuesta.clave || '';
        this.mostrarClave = true;
      },
      error: () => {
        this.snackbar.error('Error', 'No se pudo obtener la clave del servidor');
        this.mostrarClave = false;
      }
    });
  }



  // ================================
  //  UTILIDADES
  // ================================


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


  limpiarFormulario(): void {
    this.recurso = {
      tipoCodigo: this.recurso.tipoCodigo,
      subtipoCodigo: null,
      identificador: '',
      confirmarIdentificador: '',
      clave: '',
      nuevaClave: '',
      repetirClave: '',
      operador: '',
      usuario: '',
      plataformaCodigo: null,
      plataformaRolCodigo: null,
      activo: true
    };

    this.claveCifrada = '';
    this.plataformas = [];
    this.roles = [];
    this.modoEdicion = false;
    this.idOriginal = null;
    this.mostrarModalBuscar = false;
    this.filtroBusquedaModal = '';
  }



  validarCambioEstado(event: Event): void {
    // Si estamos creando (!modoEdicion) o el recurso e en uso (recursoEnUso)
    if (!this.modoEdicion || this.recursoEnUso) {
      event.preventDefault(); // Evita que el clic llegue al switch
      event.stopPropagation();

      if (!this.modoEdicion) {
        this.snackbar.warning('Accion no permitida', 'No puedes cambiar el estado al crear un recurso. Por defecto sera ACTIVO.');
      } else if (this.recursoEnUso) {
        this.snackbar.error('Accion bloqueada', 'No se puede cambiar el estado porque el recurso esta en uso.');
      }
    }
  }




  // ============ CORREOS ============


  get registrosCoincidentes(): any[] {
    // No mostrar nada si no hay texto
    const texto = (this.recurso.identificador || '').toLowerCase().trim();
    if (!texto) return [];

    // No mostrar nada si estamos editando
    if (this.modoEdicion) return [];

    // Filtrar por el campo correspondiente segun el tipo
    return this.registrosActivos.filter(item => {
      if (this.tipoSeleccionado?.nombre === 'CORREO') {
        const cuerpo = (item.direccion || '').split('@')[0].toLowerCase();
        return cuerpo.includes(texto);
      } else if (this.tipoSeleccionado?.nombre === 'LINEATELEFONICA') {
        return (item.numero || '').toLowerCase().includes(texto);
      } else if (this.tipoSeleccionado?.nombre === 'PLATAFORMA') {
        return (item.usuario || '').toLowerCase().includes(texto);
      }
      return false;
    }).slice(0, 5); //ximo 5 sugerencias
  }




  get coincidenciasCorreo(): any[] {
    if (!this.recurso.identificador || this.recurso.identificador.length < 2) {
      return [];
    }

    const texto = this.recurso.identificador.toLowerCase().trim();

    // CASO 1: Ya selecciono un dominio
    if (this.recurso.subtipoCodigo) {
      const subtipo = this.subtipos.find(s => s.codigo === Number(this.recurso.subtipoCodigo));
      if (!subtipo) return [];

      const dominioActual = subtipo.nombre.toLowerCase();
      const correoCompleto = `${texto}@${dominioActual}.com`;

      // Buscamos si ese correo exacto existe
      const correoExacto = this.registrosActivos.find(item =>
        (item.direccion || '').toLowerCase() === correoCompleto
      );

      // Si el correo exacto existe, lo devolvemos (para que salga la alerta roja).
      // Si NO existe, devolvemos un array vacio (no muestra nada).
      return correoExacto ? [correoExacto] : [];
    }

    // CASO 2: Aun no ha seleccionado dominio (solo escribe el cuerpo)
    // Mostramos sugerencias parciales
    return this.registrosActivos
      .filter(item => {
        const cuerpo = (item.direccion || '').split('@')[0].toLowerCase();
        return cuerpo.includes(texto);
      })
      .slice(0, 5);
  }


  get correoExisteExacto(): boolean {
    if (!this.recurso.identificador || !this.recurso.subtipoCodigo) return false;
    const texto = this.recurso.identificador.toLowerCase().trim();
    if (!texto) return false;
    const subtipo = this.subtipos.find(s => s.codigo === Number(this.recurso.subtipoCodigo));
    if (!subtipo) return false;
    const correoCompleto = `${texto}@${subtipo.nombre.toLowerCase()}.com`;
    return this.registrosActivos.some(item =>
      (item.direccion || '').toLowerCase() === correoCompleto
    );
  }

  esCoincidenciaExacta(item: any): boolean {
    if (!this.recurso.identificador || !this.recurso.subtipoCodigo) return false;
    const texto = this.recurso.identificador.toLowerCase().trim();
    const subtipo = this.subtipos.find(s => s.codigo === Number(this.recurso.subtipoCodigo));
    if (!subtipo) return false;
    const correoCompleto = `${texto}@${subtipo.nombre.toLowerCase()}.com`;
    return (item.direccion || '').toLowerCase() === correoCompleto;
  }

  get dominioSeleccionado(): string {
    if (!this.recurso.subtipoCodigo) return '';
    const subtipo = this.subtipos.find(s => s.codigo === Number(this.recurso.subtipoCodigo));
    return subtipo ? subtipo.nombre.toUpperCase() : '';
  }

  get correoCompleto(): string {
    if (!this.recurso.identificador || !this.dominioSeleccionado) return '';
    return `${this.recurso.identificador.toUpperCase()}@${this.dominioSeleccionado}.COM`;
  }




  // ============ LINEA TELEFONICA ============

  get coincidenciasLinea(): any[] {
    if (!this.recurso.identificador || this.recurso.identificador.toString().length < 2) {
      return [];
    }

    const texto = this.recurso.identificador.toString().toLowerCase().trim();

    // CASO 1: Ya hay un tipo de linea seleccionado
    if (this.recurso.subtipoCodigo) {
      const subtipo = this.subtipos.find(s => s.codigo === Number(this.recurso.subtipoCodigo));
      if (!subtipo) return [];

      // Mostramos los numeros del mismo tipo que contengan el texto
      return this.registrosActivos
        .filter(item =>
          (item.numero || '').toString().includes(texto) &&
          item.recursoTipo?.codigo === subtipo.codigo
        )
        .slice(0, 5);
    }

    // CASO 2: Sin tipo de linea -> mostrar todos los que coincidan
    return this.registrosActivos
      .filter(item => (item.numero || '').toString().includes(texto))
      .slice(0, 5);
  }

  get lineaExisteExacta(): boolean {
    if (!this.recurso.identificador || !this.recurso.subtipoCodigo) return false;
    const texto = this.recurso.identificador.toString().toLowerCase().trim();
    if (!texto) return false;
    const subtipo = this.subtipos.find(s => s.codigo === Number(this.recurso.subtipoCodigo));
    if (!subtipo) return false;

    return this.registrosActivos.some(item =>
      (item.numero || '').toString() === texto &&
      item.recursoTipo?.codigo === subtipo.codigo
    );
  }

  esCoincidenciaExactaLinea(item: any): boolean {
    if (!this.recurso.identificador || !this.recurso.subtipoCodigo) return false;
    const texto = this.recurso.identificador.toString().toLowerCase().trim();
    const subtipo = this.subtipos.find(s => s.codigo === Number(this.recurso.subtipoCodigo));
    if (!subtipo) return false;

    return (item.numero || '').toString() === texto &&
      item.recursoTipo?.codigo === subtipo.codigo;
  }

  get tipoLineaSeleccionado(): string {
    if (!this.recurso.subtipoCodigo) return '';
    const subtipo = this.subtipos.find(s => s.codigo === Number(this.recurso.subtipoCodigo));
    return subtipo ? subtipo.nombre.toUpperCase() : '';
  }

  get lineaCompleta(): string {
    if (!this.recurso.identificador || !this.tipoLineaSeleccionado) return '';
    return `${this.recurso.identificador} (${this.tipoLineaSeleccionado})`;
  }

  // ============ VALIDACION MOVIL / FIJO ============

   get numeroValidoMovil(): boolean {
    if (!this.recurso.identificador) return false;
    const numero = this.recurso.identificador.toString();
    // Movil: exactamente 10 digitos (sin importar el prefijo)
    return /^\d{10}$/.test(numero);
  }

  get numeroValidoFijo(): boolean {
    if (!this.recurso.identificador) return false;
    // Fijo: exactamente 4 digitos (extension)
    return /^\d{4}$/.test(this.recurso.identificador.toString());
  }

  get tipoLineaEsMovil(): boolean {
    if (!this.recurso.subtipoCodigo) return false;
    const subtipo = this.subtipos.find(s => s.codigo === Number(this.recurso.subtipoCodigo));
    return subtipo ? subtipo.nombre.toUpperCase().includes('MOVIL') : false;
  }

  get tipoLineaEsFijo(): boolean {
    if (!this.recurso.subtipoCodigo) return false;
    const subtipo = this.subtipos.find(s => s.codigo === Number(this.recurso.subtipoCodigo));
    return subtipo ? (subtipo.nombre.toUpperCase().includes('FIJO') || subtipo.nombre.toUpperCase().includes('FIJA')) : false;
  }

  get numeroValidoSegunTipo(): boolean {
    if (!this.recurso.identificador) return true;
    if (this.tipoLineaEsMovil) return this.numeroValidoMovil;
    if (this.tipoLineaEsFijo) return this.numeroValidoFijo;
    // Sin tipo: acepta cualquier numero entre 4 y 10 digitos
    return /^\d{4,10}$/.test(this.recurso.identificador.toString());
  }

  get mensajeErrorNumero(): string {
    if (!this.recurso.identificador) return '';
    if (!this.numeroValidoSegunTipo) {
      if (this.tipoLineaEsMovil) {
        return 'Un numero movil debe tener 10 digitos';
      }
      if (this.tipoLineaEsFijo) {
        return 'Una extension fija debe tener exactamente 4 digitos';
      }
      return 'El numero debe tener entre 4 y 10 digitos';
    }
    return '';
  }

   get operadoresDisponibles(): { valor: string, texto: string }[] {
    // Si es fijo, solo SAGARO
    if (this.tipoLineaEsFijo) {
      return [{ valor: 'SAGARO', texto: 'SAGARO' }];
    }
    // Si es móvil o no hay tipo: CLARO y MOVISTAR
    return [
      { valor: 'CLARO', texto: 'CLARO' },
      { valor: 'MOVISTAR', texto: 'MOVISTAR' }
    ];
  }

}
