import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RegistroCatalogoService } from '../../../arquitectura/servicio/registro/RegistroCatalogo.service';
import { TipoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_Tipo.interface';
import { MarcaLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_Marca.interface';
import { ModeloLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_Modelo.interface';
import { SOLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/SistemaOperativo.interface';
import { VersionSOLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/SistemaOperativo_Version.interface';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';

import { RegistroEquipoService } from './../../../arquitectura/servicio/registro/RegistroEquipo.service';
import { EquipoComputoRegistro } from './../../../arquitectura/interface/Registro/EquipoComputoRegistro.interface';
import { EquipoDeComputoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/EquipoDeComputoRespuesta.interface';

import { PermisoModuloService } from '../../../arquitectura/servicio/autenticacion/permiso-modulo.service';
import { ConsultarAsignacionesService } from '../../../arquitectura/servicio/consulta/ConsultarAsignaciones.service';


@Component({
  selector: 'app-opc-equipo',
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatAutocompleteModule],
  templateUrl: './opc-equipo.component.html',
  styleUrl: './opc-equipo.component.css'
})
export class OpcEquipoComponent implements OnInit {

  // ID del catalogo "EQUIPO DE COMPUTO" en tu base de datos

  private readonly CATALOGO_EQUIPO_COMPUTO_ID = 1;

  // Listas para los selects
  tipos: TipoLlamarDatos[] = [];
  marcas: MarcaLlamarDatos[] = [];
  modelos: ModeloLlamarDatos[] = [];
  imagenModeloSeleccionado: SafeResourceUrl = '';
  sistemasOperativos: SOLlamarDatos[] = [];
  versionesSO: VersionSOLlamarDatos[] = [];

  // Variables para guardar la seleccion actual del usuario

  serial: string = '';
  plaqueta: string = '';
  facturaCompra: string = '';
  fechaCompra: string = '';
  descripcion: string = '';
  estado: string = '';
  ram: string = '';
  tipoRam: string = '';
  disco: string = '';
  tipoDisco: string = '';
  procesador: string = '';
  bits: number | null = null;


  tipoSeleccionado: TipoLlamarDatos | null = null;
  marcaSeleccionada: MarcaLlamarDatos | null = null;
  modeloSeleccionado: ModeloLlamarDatos | null = null;
  soSeleccionado: SOLlamarDatos | null = null;
  versionSOSeleccionada: VersionSOLlamarDatos | null = null;

  // =========== VARIABLES DE ESTADO ==============
  enviando = false;
  sugerenciasSerial: EquipoDeComputoLlamarDatos[] = [];
  private timeoutBusquedaSerial: any = null;


  // ========== VARIABLES PARA MODAL DE MARCA ==========
  mostrarModalMarca = false;
  nuevaMarcaDescripcion = '';
  marcasFiltradas: MarcaLlamarDatos[] = [];
  todasLasMarcas: MarcaLlamarDatos[] = [];

  // ========== VARIABLES PARA MODAL DE MODELO ==========
  mostrarModalModelo = false;
  nuevaModeloDescripcion = '';
  modelosFiltrados: ModeloLlamarDatos[] = [];
  todasLasModelo: ModeloLlamarDatos[] = [];

  // ========== VARIABLES PARA MODAL DE VERSION SO ==========
  mostrarModalVersionSO = false;
  nuevaVersionSODescripcion = '';
  versionesFiltradas: VersionSOLlamarDatos[] = [];
  todasLasVersionesSo: VersionSOLlamarDatos[] = [];

  // ========== MODO EDICIoN ==========
  modoEdicion: boolean = false;
  serialOriginal: string = '';
  equipoSeleccionado: any = null;
  intentadoGuardar = false;

  // ========== VARIABLES PARA BUSCADOR ==========
  mostrarModalBuscarEquipo: boolean = false;
  busquedaEquipoModal: string = '';
  resultadosBusquedaModal: EquipoDeComputoLlamarDatos[] = [];
  buscandoModal: boolean = false;

  equipoEnUso: boolean = false;


  constructor(
    private registroCatalogoService: RegistroCatalogoService,
    private sanitizer: DomSanitizer,
    private notificacionSnackbarService: NotificacionSnackbarService,
    private registroEquipoService: RegistroEquipoService,
    private permisoModuloService: PermisoModuloService,
    private consultarAsignacionesService: ConsultarAsignacionesService
  ) { }

  // Propiedad computada para el permiso
  get puedeEditarRegistro(): boolean {
    return this.permisoModuloService.puede('registro', 'editar');
  }

  // Determina si debe mostrar el boton Editar
  get mostrarBotonEditar(): boolean {
    // SOLO si tiene permiso Y no esta editando
    if (this.puedeEditarRegistro && !this.modoEdicion) {
      return true;
    }
    return false;
  }

  // Determina si debe mostrar el boton Limpiar
  get mostrarBotonLimpiar(): boolean {
    // Muestra Limpiar en dos casos:
    // 1. Esta en modo edicion (cualquier usuario)
    // 2. No tiene permiso de editar (siempre)
    if (this.modoEdicion || !this.puedeEditarRegistro) {
      return true;
    }
    return false;
  }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    const catalogoId = this.CATALOGO_EQUIPO_COMPUTO_ID;

    // Cargar tipos
    this.registroCatalogoService.getTiposPorCatalogo(catalogoId).subscribe(data => {
      this.tipos = data;
    });

    // Cargar sistemas operativos
    this.registroCatalogoService.getSistemasOperativosPorCatalogo(catalogoId).subscribe(data => {
      this.sistemasOperativos = data;
    });

    // Cargar tipos y sistemas operativos del catalogo
    this.registroCatalogoService.getTiposPorCatalogo(catalogoId).subscribe(data => this.tipos = data);
    this.registroCatalogoService.getSistemasOperativosPorCatalogo(catalogoId).subscribe(data => this.sistemasOperativos = data);
  }


  // Cuando cambia el tipo, carga las marcas asociadas a ese tipo
  onTipoChange(): void {
    this.marcas = [];
    this.modelos = [];
    this.marcaSeleccionada = null;
    this.modeloSeleccionado = null;

    // LIMPIAR IMAGEN
    this.imagenModeloSeleccionado = '';

    if (this.tipoSeleccionado) {
      this.registroCatalogoService.getMarcasPorTipo(this.tipoSeleccionado.codigo).subscribe(data => this.marcas = data);
    }
  }



  // Al cambiar marca, carga modelos correspondientes
  onMarcaChange(): void {
    // Si selecciono "NUEVA MARCA"
    if (this.marcaSeleccionada === ('new' as any)) {
      this.abrirModalMarca();
      this.marcaSeleccionada = null;
      return;
    }

    this.modelos = [];
    this.modeloSeleccionado = null;
    this.imagenModeloSeleccionado = '';

    if (this.marcaSeleccionada && this.tipoSeleccionado) {
      this.registroCatalogoService.getModelosPorMarcaYTipo(
        this.marcaSeleccionada.codigo,
        this.tipoSeleccionado.codigo
      ).subscribe(data => {
        this.modelos = data;
      });
    }
  }


  // Cuando cambia el modelo, actualizar la imagen
  onModeloChange(): void {
    // Si selecciono "NUEVO MODELO"
    if (this.modeloSeleccionado === ('new' as any)) {
      this.abrirModalModelo();
      this.modeloSeleccionado = null;
      return;
    }

    if (this.modeloSeleccionado && this.modeloSeleccionado.rutaImagen) {
      let urlLimpia = this.modeloSeleccionado.rutaImagen.split('&token=')[0];
      this.imagenModeloSeleccionado = this.sanitizer.bypassSecurityTrustResourceUrl(urlLimpia);
    } else {
      this.imagenModeloSeleccionado = '';
    }
  }



  // Al cambiar SO, carga versiones correspondientes
  onSOChange(): void {
    this.versionesSO = [];
    this.versionSOSeleccionada = null;
    if (this.soSeleccionado) {
      this.registroCatalogoService.getVersionesPorSO(this.soSeleccionado.codigo).subscribe(data => this.versionesSO = data);
    }
  }



  // Al cambiar version SO
  onVersionSOChange(): void {
    // Si selecciono "NUEVA VERSION"
    if (this.versionSOSeleccionada === ('new' as any)) {
      this.abrirModalVersionSO();
      this.versionSOSeleccionada = null;
      return;
    }

    // Aqui puedes agregar logica adicional si es necesario
    // Por ejemplo, validar o cargar algo cuando se selecciona una version existente
    if (this.versionSOSeleccionada) {
      console.log('Version seleccionada:', this.versionSOSeleccionada);
    }
  }



  // ========== MÉTODOS PARA MODAL DE MARCA ==========

  // Abrir modal
  abrirModalMarca(): void {
    if (!this.tipoSeleccionado) {
      this.notificacionSnackbarService.warning('Tipo requerido', 'Primero debe seleccionar un tipo');
      return;
    }
    this.mostrarModalMarca = true;
    this.nuevaMarcaDescripcion = '';
    this.marcasFiltradas = [];
  }

  // Cerrar modal
  cerrarModalMarca(): void {
    this.mostrarModalMarca = false;
    this.nuevaMarcaDescripcion = '';
    this.marcasFiltradas = [];
  }

  // Filtrar marcas existentes en el tipo seleccionado
  filtrarMarcas(): void {
    const texto = this.nuevaMarcaDescripcion?.toLowerCase() || '';

    if (texto.length > 0) {
      // Filtrar SOLO las marcas del tipo seleccionado
      this.marcasFiltradas = this.marcas
        .filter(marca => marca.descripcion.toLowerCase().includes(texto))
        .slice(0, 10);
    } else {
      this.marcasFiltradas = [];
    }
  }


  // Seleccionar una marca existente
  seleccionarMarcaExistente(event: any): void {
    const marcaSeleccionada = this.marcas.find(
      m => m.descripcion === event.option.value
    );

    if (marcaSeleccionada) {
      this.notificacionSnackbarService.info('Marca existente',
        `La marca "${marcaSeleccionada.descripcion}" ya existe en ${this.tipoSeleccionado?.descripcion}. Se ha seleccionado automaticamente.`);
      this.marcaSeleccionada = marcaSeleccionada;
      this.cerrarModalMarca();
    }
  }


  // Crear marca
  crearMarca(): void {
    if (!this.nuevaMarcaDescripcion.trim()) {
      this.notificacionSnackbarService.warning('Campo requerido', 'Ingrese el nombre de la marca');
      return;
    }

    if (!this.tipoSeleccionado) {
      this.notificacionSnackbarService.warning('Tipo requerido', 'Seleccione un tipo primero');
      return;
    }

    // Verificar si ya existe en el tipo actual
    const marcaExistente = this.marcas.find(
      m => m.descripcion.toLowerCase() === this.nuevaMarcaDescripcion.toLowerCase()
    );

    if (marcaExistente) {
      this.notificacionSnackbarService.info('Marca existente',
        `La marca "${marcaExistente.descripcion}" ya existe en ${this.tipoSeleccionado?.descripcion}.`);
      this.marcaSeleccionada = marcaExistente;
      this.cerrarModalMarca();
      return;
    }

    // Crear nueva marca en el backend
    this.registroCatalogoService.crearMarca(
      this.nuevaMarcaDescripcion,
      this.tipoSeleccionado.codigo
    ).subscribe({
      next: (nuevaMarca: MarcaLlamarDatos) => {
        // Agregar a la lista de marcas del tipo actual
        this.marcas.push(nuevaMarca);
        this.marcas.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        // Seleccionar la nueva marca
        this.marcaSeleccionada = nuevaMarca;
        this.notificacionSnackbarService.success('Marca creada',
          `Marca "${nuevaMarca.descripcion}" creada exitosamente`);
        this.cerrarModalMarca();
      },
      error: (err) => {
        const mensaje = err.error?.message || 'Error al crear la marca';
        this.notificacionSnackbarService.error('Error', mensaje);
      }
    });
  }




  // ========== MÉTODOS PARA MODAL DE MODELO  ==========

  // Abrir modal
  abrirModalModelo(): void {
    if (!this.tipoSeleccionado) {
      this.notificacionSnackbarService.warning('Tipo requerido', 'Primero debe seleccionar un tipo');
      return;
    }
    if (!this.marcaSeleccionada) {
      this.notificacionSnackbarService.warning('Marca requerida', 'Primero debe seleccionar una marca');
      return;
    }
    this.mostrarModalModelo = true;
    this.nuevaModeloDescripcion = '';
    this.modelosFiltrados = [];
  }


  // Cerrar modal
  cerrarModalModelo(): void {
    this.mostrarModalModelo = false;
    this.nuevaModeloDescripcion = '';
    this.modelosFiltrados = [];
  }

  // Filtrar modelo existentes en el tipo seleccionado
  filtrarModelos(): void {
    const texto = this.nuevaModeloDescripcion?.toLowerCase() || '';

    if (texto.length > 0) {
      // Filtrar SOLO las modelo del tipo seleccionado
      this.modelosFiltrados = this.modelos
        .filter(modelo => modelo.descripcion.toLowerCase().includes(texto))
        .slice(0, 10);
    } else {
      this.modelosFiltrados = [];
    }
  }


  // Seleccionar una modelo existente
  seleccionarModeloExistente(event: any): void {
    const modeloSeleccionado = this.modelos.find(
      m => m.descripcion === event.option.value
    );

    if (modeloSeleccionado) {
      this.notificacionSnackbarService.info('Modelo existente',
        `El modelo "${modeloSeleccionado.descripcion}" ya existe. Se ha seleccionado automaticamente.`);
      this.modeloSeleccionado = modeloSeleccionado;
      this.cerrarModalModelo();
    }
  }

  // Crear Modelo
  crearModelo(): void {
    if (!this.nuevaModeloDescripcion.trim()) {
      this.notificacionSnackbarService.warning('Campo requerido', 'Ingrese el nombre del modelo');
      return;
    }

    if (!this.tipoSeleccionado) {
      this.notificacionSnackbarService.warning('Tipo requerido', 'Primero debe seleccionar un tipo');
      return;
    }

    if (!this.marcaSeleccionada) {
      this.notificacionSnackbarService.warning('Marca requerida', 'Primero debe seleccionar una marca');
      return;
    }

    // Verificar si ya existe en la lista actual de modelos
    const modeloExistente = this.modelos.find(
      m => m.descripcion.toLowerCase() === this.nuevaModeloDescripcion.toLowerCase()
    );

    if (modeloExistente) {
      this.notificacionSnackbarService.info('Modelo existente',
        `El modelo "${modeloExistente.descripcion}" ya existe para ${this.marcaSeleccionada?.descripcion} - ${this.tipoSeleccionado?.descripcion}.`);
      this.modeloSeleccionado = modeloExistente;
      this.cerrarModalModelo();
      return;
    }

    // Crear nuevo modelo en el backend
    this.registroCatalogoService.crearModelo(
      this.nuevaModeloDescripcion.toUpperCase(),
      this.tipoSeleccionado.codigo,
      this.marcaSeleccionada.codigo
    ).subscribe({
      next: (nuevoModelo: ModeloLlamarDatos) => {
        // Agregar a la lista de modelos
        this.modelos.push(nuevoModelo);
        this.modelos.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        // Seleccionar el nuevo modelo
        this.modeloSeleccionado = nuevoModelo;
        this.notificacionSnackbarService.success('Modelo creado',
          `Modelo "${nuevoModelo.descripcion}" creado exitosamente`);
        this.cerrarModalModelo();
      },
      error: (err) => {
        const mensaje = err.error?.message || 'Error al crear el modelo';
        this.notificacionSnackbarService.error('Error', mensaje);
      }
    });
  }



  // ========== MÉTODOS PARA MODAL DE VERSION SO ==========

  // Abrir modal
  abrirModalVersionSO(): void {
    if (!this.soSeleccionado) {
      this.notificacionSnackbarService.warning('SO requerido', 'Primero debe seleccionar un Sistema Operativo');
      return;
    }
    this.mostrarModalVersionSO = true;
    this.nuevaVersionSODescripcion = '';
    this.versionesFiltradas = [];
  }

  // Cerrar modal
  cerrarModalVersionSO(): void {
    this.mostrarModalVersionSO = false;
    this.nuevaVersionSODescripcion = '';
    this.versionesFiltradas = [];
  }

  // Filtrar modelo existentes en el tipo seleccionado
  filtrarVersionesSo(): void {
    const texto = this.nuevaVersionSODescripcion?.toLowerCase() || '';

    if (texto.length > 0) {
      this.versionesFiltradas = this.versionesSO
        .filter(version => version.descripcion.toLowerCase().includes(texto))
        .slice(0, 10);
    } else {
      this.versionesFiltradas = [];
    }
  }


  // Seleccionar una version SO existente
  seleccionarVersionSOExistente(event: any): void {
    const versionSeleccionada = this.versionesSO.find(
      v => v.descripcion === event.option.value
    );

    if (versionSeleccionada) {
      this.notificacionSnackbarService.info('Version SO existente',
        `La version "${versionSeleccionada.descripcion}" ya existe. Se ha seleccionado automaticamente.`);
      this.versionSOSeleccionada = versionSeleccionada;  // ← CORREGIDO: versionSeleccionada
      this.cerrarModalVersionSO();
    }
  }


  // Crear VersionSO
  crearVersionSO(): void {
    if (!this.nuevaVersionSODescripcion.trim()) {
      this.notificacionSnackbarService.warning('Campo requerido', 'Ingrese el nombre de la version');
      return;
    }

    if (!this.soSeleccionado) {
      this.notificacionSnackbarService.warning('SO requerido', 'Primero debe seleccionar un Sistema Operativo');
      return;
    }

    // Verificar si ya existe en la lista actual de versiones
    const versionExistente = this.versionesSO.find(
      v => v.descripcion.toLowerCase() === this.nuevaVersionSODescripcion.toLowerCase()
    );

    if (versionExistente) {
      this.notificacionSnackbarService.info('Version existente',
        `La version "${versionExistente.descripcion}" ya existe para ${this.soSeleccionado?.descripcion}.`);
      this.versionSOSeleccionada = versionExistente;
      this.cerrarModalVersionSO();
      return;
    }

    // Crear nueva version en el backend
    this.registroCatalogoService.crearVersionSO(
      this.nuevaVersionSODescripcion.toUpperCase(),
      this.soSeleccionado.codigo
    ).subscribe({
      next: (nuevaVersion: VersionSOLlamarDatos) => {
        // Agregar a la lista de versiones
        this.versionesSO.push(nuevaVersion);
        this.versionesSO.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        // Seleccionar la nueva version
        this.versionSOSeleccionada = nuevaVersion;
        this.notificacionSnackbarService.success('Version creada',
          `Version "${nuevaVersion.descripcion}" creada exitosamente`);
        this.cerrarModalVersionSO();
      },
      error: (err) => {
        const mensaje = err.error?.message || 'Error al crear la version';
        this.notificacionSnackbarService.error('Error', mensaje);
      }
    });
  }



  // ================== TAMAÑO RAM ==========================

  tamanoRamReal: number | null = null;

  // Metodo para permitir solo numeros
  soloNumeros(event: KeyboardEvent): void {
    const tecla = event.key;

    // Permitir teclas de control (backspace, delete, tab, enter, flechas)
    const teclasPermitidas = [
      'Backspace', 'Delete', 'Tab', 'Enter', 'Escape',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'
    ];

    if (teclasPermitidas.includes(tecla)) {
      return; // Permitir estas teclas
    }

    // Permitir solo digitos (0-9)
    if (!/^[0-9]$/.test(tecla)) {
      event.preventDefault();
    }
  }

  // Formatear: al escribir, muestra "numero GB"
  formatearRam(): void {
    // Extraer solo numeros de lo que escribe
    const numeros = this.ram.replace(/[^0-9]/g, '');

    if (numeros && numeros !== '') {
      this.tamanoRamReal = parseInt(numeros);
      this.ram = `${numeros} GB`;
    } else {
      this.tamanoRamReal = null;
      this.ram = '';
    }
  }


  // ================== TAMAÑO DISCO (para servidor) ==========================

  tamanoDiscoReal: number | null = null;

  // Metodo para permitir solo numeros en disco
  soloNumerosDisco(event: KeyboardEvent): void {
    const tecla = event.key;

    // Permitir teclas de control (backspace, delete, tab, enter, flechas)
    const teclasPermitidas = [
      'Backspace', 'Delete', 'Tab', 'Enter', 'Escape',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'
    ];

    if (teclasPermitidas.includes(tecla)) {
      return; // Permitir estas teclas
    }

    // Permitir solo digitos (0-9)
    if (!/^[0-9]$/.test(tecla)) {
      event.preventDefault();
    }
  }

  // Formatear disco: al escribir, muestra "numero TB"
  formatearDisco(): void {
    // Extraer solo numeros de lo que escribe
    const numeros = this.disco.replace(/[^0-9]/g, '');

    if (numeros && numeros !== '') {
      this.tamanoDiscoReal = parseInt(numeros);
      this.disco = `${numeros} TB`;
    } else {
      this.tamanoDiscoReal = null;
      this.disco = '';
    }
  }


  // Convertir texto a mayusculas mientras escribe
  convertirMayusculas(): void {

    this.nuevaMarcaDescripcion = this.nuevaMarcaDescripcion.toUpperCase();
    this.filtrarMarcas(); // Llamar al filtro después de convertir

    this.nuevaModeloDescripcion = this.nuevaModeloDescripcion.toUpperCase();
    this.filtrarModelos(); // Llamar al filtro después de convertir

    this.nuevaVersionSODescripcion = this.nuevaVersionSODescripcion.toUpperCase();
    this.filtrarVersionesSo(); // Llamar al filtro después de convertir
  }








  // ================== REGISTRAR EQUIPO ==========================



  registrarEquipo(): void {


    if (this.estado === 'INOPERATIVO' && this.equipoEnUso) {
      this.notificacionSnackbarService.error('Accion bloqueada', 'El equipo esta en uso. No debe ser inactivado.');
      return;
    }

    // Si esta en modo edicion, llamar a editarEquipo()
    if (this.modoEdicion) {
      this.editarEquipo();
      return;
    }


    if (this.enviando) return; // Evitar envios multiples

    this.intentadoGuardar = true;

    // ========== VALIDACIONES DE CAMPOS OBLIGATORIOS ==========

    // Serial
    if (!this.serial || this.serial.trim() === '') {
      this.notificacionSnackbarService.warning('Campo requerido', 'Ingrese el serial del equipo');
      return;
    }

    // Tipo
    if (!this.tipoSeleccionado) {
      this.notificacionSnackbarService.warning('Campo requerido', 'Seleccione un tipo de equipo');
      return;
    }

    // Marca
    if (!this.marcaSeleccionada) {
      this.notificacionSnackbarService.warning('Campo requerido', 'Seleccione una marca');
      return;
    }

    // Modelo
    if (!this.modeloSeleccionado) {
      this.notificacionSnackbarService.warning('Campo requerido', 'Seleccione un modelo');
      return;
    }

    // Sistema Operativo
    if (!this.soSeleccionado) {
      this.notificacionSnackbarService.warning('Campo requerido', 'Seleccione un sistema operativo');
      return;
    }

    // Sistema Operativo version 
    if (!this.versionSOSeleccionada) {
      this.notificacionSnackbarService.warning('Campo requerido', 'Seleccione una version');
      return;
    }


    // Bits
    if (!this.bits) {
      this.notificacionSnackbarService.warning('Campo requerido', 'Seleccione los bits (32/64)');
      return;
    }

    // RAM
    if (!this.ram || this.ram.trim() === '') {
      this.notificacionSnackbarService.warning('Campo requerido', 'Ingrese el tamaño de RAM');
      return;
    }

    // Tipo de RAM
    if (!this.tipoRam || this.tipoRam.trim() === '') {
      this.notificacionSnackbarService.warning('Campo requerido', 'Seleccione el tipo de RAM');
      return;
    }


    // Procesador
    if (!this.procesador || this.procesador.trim() === '') {
      this.notificacionSnackbarService.warning('Campo requerido', 'Ingrese el procesador');
      return;
    }

    // Disco
    let discoFinal = this.disco;
    if (this.tipoSeleccionado?.codigo === 4) {
      // Es servidor
      if (!this.disco || this.disco.trim() === '') {
        this.notificacionSnackbarService.warning('Campo requerido', 'Ingrese el tamaño del disco');
        return;
      }
      discoFinal = this.disco;
    } else {
      // No es servidor
      if (!this.disco || this.disco.trim() === '') {
        this.notificacionSnackbarService.warning('Campo requerido', 'Seleccione el tamaño del disco');
        return;
      }
      discoFinal = this.disco;
    }

    // Tipo de Disco
    if (!this.tipoDisco || this.tipoDisco.trim() === '') {
      this.notificacionSnackbarService.warning('Campo requerido', 'Seleccione el tipo de disco');
      return;
    }

    // Estado del equipo
    if (!this.estado || this.estado.trim() === '') {
      this.notificacionSnackbarService.warning('Campo requerido', 'Seleccione el estado del equipo');
      return;
    }

    // Tiene factura pero NO tiene fecha
    if (this.facturaCompra && this.facturaCompra.trim() !== '' && !this.fechaCompra) {
      this.notificacionSnackbarService.warning('Campos relacionados', 'Si ingresa una factura, debe ingresar la fecha de compra');
      return;
    }

    // Tiene fecha pero NO tiene factura
    if (this.fechaCompra && this.fechaCompra.trim() !== '' && !this.facturaCompra) {
      this.notificacionSnackbarService.warning('Campos relacionados', 'Si ingresa una fecha de compra, debe ingresar la factura');
      return;
    }

    // ========== ASIGNAR VALORES OPCIONALES CON "NO TIENE" ==========

    // Descripcion - Si esta vacio, poner "SIN DESCRIPCION"
    const descripcionFinal = this.descripcion && this.descripcion.trim() !== '' ? this.descripcion : 'SIN DESCRIPCION';


    // Plaqueta - Si esta vacio, poner "NO TIENE"
    const plaquetaFinal = this.plaqueta && this.plaqueta.trim() !== '' ? this.plaqueta : 'NO TIENE';

    // Factura - Si esta vacio, poner "NO TIENE"
    const facturaFinal = this.facturaCompra && this.facturaCompra.trim() !== '' ? this.facturaCompra : 'NO TIENE';

    // Fecha Compra - Si esta vacio, poner "NO TIENE"
    const fechaFinal = this.fechaCompra && this.fechaCompra.trim() !== '' ? this.fechaCompra : null;



    // ========== ARMAR OBJETO PARA ENVIAR ==========

    const equipoData: EquipoComputoRegistro = {
      serial: this.serial,
      plaqueta: plaquetaFinal,
      facturaCompra: facturaFinal,
      fechaCompra: fechaFinal,
      activo: true,
      descripcion: descripcionFinal,
      estado: this.estado,
      ram: this.ram,
      tipoRam: this.tipoRam,
      procesador: this.procesador,
      disco: discoFinal,
      tipoDisco: this.tipoDisco,
      bits: this.bits,
      tipo: { codigo: this.tipoSeleccionado.codigo },
      marca: { codigo: this.marcaSeleccionada.codigo },
      modelo: { codigo: this.modeloSeleccionado.codigo },
      sistemaOperativo: { codigo: this.soSeleccionado?.codigo ?? 0 },
      versionSO: { codigo: this.versionSOSeleccionada?.codigo ?? 0 }
    };

    this.registroEquipoService.registrarEquipo(equipoData).subscribe({
      next: (respuesta) => {
        console.log('Equipo registrado:', respuesta);
        this.notificacionSnackbarService.success('Equipo registrado', `Serial: ${respuesta.serial}`);
        this.intentadoGuardar = false;
        this.limpiarFormulario();
      },
      error: (err) => {
        console.error('Error:', err);
        const mensaje = err.error?.message || 'Error al registrar el equipo';
        this.notificacionSnackbarService.error('Error', mensaje);
      }
    });
  }

  limpiarFormulario(): void {
    this.serial = '';
    this.plaqueta = '';
    this.facturaCompra = '';
    this.fechaCompra = '';
    this.descripcion = '';
    this.estado = '';
    this.procesador = '';
    this.ram = '';
    this.tipoRam = '';
    this.disco = '';
    this.tipoDisco = '';
    this.bits = null;
    this.disco = '';
    this.tipoSeleccionado = null;
    this.marcaSeleccionada = null;
    this.modeloSeleccionado = null;
    this.soSeleccionado = null;
    this.versionSOSeleccionada = null;
    this.modelos = [];
    this.marcas = [];
    this.versionesSO = [];
    this.imagenModeloSeleccionado = '';

    // Resetear modo edicion
    this.intentadoGuardar = false;
    this.modoEdicion = false;
    this.equipoEnUso = false;
    this.modoEdicion = false;
    this.serialOriginal = '';
    // Recargar datos iniciales
    this.cargarDatosIniciales();

    this.sugerenciasSerial = [];
    if (this.timeoutBusquedaSerial) {
      clearTimeout(this.timeoutBusquedaSerial);
      this.timeoutBusquedaSerial = null;
    }
  }



  // ========== MÉTODOS PARA BUSCADOR ==========

  compararPorCodigo(obj1: any, obj2: any): boolean {
    if (!obj1 || !obj2) return obj1 === obj2;
    return obj1.codigo === obj2.codigo;
  }


  abrirModalBuscarEquipo(): void {
    this.mostrarModalBuscarEquipo = true;
    this.busquedaEquipoModal = '';
    this.resultadosBusquedaModal = [];
  }

  cerrarModalBuscarEquipo(): void {
    this.mostrarModalBuscarEquipo = false;
    this.busquedaEquipoModal = '';
    this.resultadosBusquedaModal = [];
  }

  buscarEquiposEnModal(): void {
    if (!this.busquedaEquipoModal || this.busquedaEquipoModal.length < 2) {
      this.resultadosBusquedaModal = [];
      return;
    }

    this.buscandoModal = true;

    this.registroEquipoService.buscarEquipos(this.busquedaEquipoModal).subscribe({
      next: (equipos) => {
        this.resultadosBusquedaModal = equipos;
        this.buscandoModal = false;
      },
      error: (err) => {
        console.error('Error al buscar equipos', err);
        this.resultadosBusquedaModal = [];
        this.buscandoModal = false;
        this.notificacionSnackbarService.error('Error', 'No se pudieron buscar los equipos');
      }
    });
  }

  seleccionarEquipoDelModal(equipo: EquipoDeComputoLlamarDatos): void {
    this.modoEdicion = true;
    this.serialOriginal = equipo.serial;

    // --- VALIDACION CON LA BASE DE DATOS ---
    this.consultarAsignacionesService.verificarSiEquipoEstaEnUso(equipo.serial).subscribe({
      next: (respuesta: any) => {
        // El backend devuelve { serial, asignado }
        this.equipoEnUso = respuesta?.asignado === true;
      },
      error: (err) => {
        console.error('Error al verificar si esta en uso', err);
        this.equipoEnUso = false;
      }
    });

    this.serial = equipo.serial;
    this.plaqueta = equipo.plaqueta || 'NO TIENE';
    this.facturaCompra = equipo.facturaCompra || 'NO TIENE';
    this.fechaCompra = equipo.fechaCompra || '';
    this.descripcion = equipo.descripcion || '';
    this.estado = equipo.estado;
    this.ram = equipo.ram;
    this.tipoRam = equipo.tipoRam;
    this.procesador = equipo.procesador;
    this.disco = equipo.disco;
    this.tipoDisco = equipo.tipoDisco;
    this.bits = equipo.bits;

    // Cargar selecciones (los objetos completos)
    this.tipoSeleccionado = equipo.tipo;
    this.marcaSeleccionada = equipo.marca;
    this.modeloSeleccionado = equipo.modelo;
    this.soSeleccionado = equipo.sistemaOperativo;
    this.versionSOSeleccionada = equipo.versionSO;


    // Cargar listas dependientes
    if (this.tipoSeleccionado) {
      this.registroCatalogoService.getMarcasPorTipo(this.tipoSeleccionado.codigo)
        .subscribe(data => {
          this.marcas = data;
        });
    }

    if (this.marcaSeleccionada && this.tipoSeleccionado) {
      this.registroCatalogoService.getModelosPorMarcaYTipo(
        this.marcaSeleccionada.codigo,
        this.tipoSeleccionado.codigo
      ).subscribe(data => {
        this.modelos = data;
      });
    }

    if (this.soSeleccionado) {
      this.registroCatalogoService.getVersionesPorSO(this.soSeleccionado.codigo)
        .subscribe(data => {
          this.versionesSO = data;
        });
    }

    // Cargar imagen del modelo
    if (equipo.modelo?.rutaImagen) {
      let urlLimpia = equipo.modelo.rutaImagen.split('&token=')[0];
      this.imagenModeloSeleccionado = this.sanitizer.bypassSecurityTrustResourceUrl(urlLimpia);
    } else {
      this.imagenModeloSeleccionado = '';
    }

    this.notificacionSnackbarService.success('Equipo cargado', `Editando: ${equipo.serial}`);
    this.cerrarModalBuscarEquipo();
  }


  // ========== EDITAR EQUIPO ==========
  editarEquipo(): void {


    if (this.estado === 'INOPERATIVO' && this.equipoEnUso) {
      this.notificacionSnackbarService.error('Accion bloqueada', 'El equipo esta en uso. No debe ser inactivado.');
      return;
    }


    if (this.enviando) return;

    this.intentadoGuardar = true;

    // Validaciones similares a registrar
    if (!this.serial || !this.tipoSeleccionado || !this.marcaSeleccionada ||
      !this.modeloSeleccionado || !this.soSeleccionado || !this.versionSOSeleccionada ||
      !this.bits || !this.ram || !this.tipoRam || !this.procesador ||
      !this.disco || !this.tipoDisco || !this.estado) {
      this.notificacionSnackbarService.warning('Campos incompletos', 'Todos los campos son obligatorios');
      return;
    }

    this.enviando = true;

    // ========== ARMAR OBJETO PARA ENVIAR ==========
    const equipoData: EquipoComputoRegistro = {
      serial: this.serial,
      plaqueta: this.plaqueta || 'NO TIENE',
      facturaCompra: this.facturaCompra || 'NO TIENE',
      fechaCompra: this.fechaCompra || null,
      activo: true,
      descripcion: this.descripcion || 'SIN DESCRIPCION',
      estado: this.estado,
      ram: this.ram,
      tipoRam: this.tipoRam,
      procesador: this.procesador,
      disco: this.disco,
      tipoDisco: this.tipoDisco,
      bits: this.bits,
      tipo: { codigo: this.tipoSeleccionado.codigo },
      marca: { codigo: this.marcaSeleccionada.codigo },
      modelo: { codigo: this.modeloSeleccionado.codigo },
      sistemaOperativo: { codigo: this.soSeleccionado.codigo },
      versionSO: { codigo: this.versionSOSeleccionada.codigo }
    };

    this.registroEquipoService.editarEquipo(this.serialOriginal, equipoData).subscribe({
      next: (respuesta) => {
        this.notificacionSnackbarService.success('Equipo actualizado', `Serial: ${respuesta.serial}`);
        this.intentadoGuardar = false;
        this.limpiarFormulario();
        this.enviando = false;
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        const mensaje = err.error?.message || 'Error al actualizar el equipo';
        this.notificacionSnackbarService.error('Error', mensaje);
        this.enviando = false;
      }
    });
  }


  limpiarFormularioEditar(): void {
    this.limpiarFormulario();

    // Mensaje de éxito al limpiar formulario
    this.notificacionSnackbarService.info('Formulario limpiado',
      'Todos los campos han sido restablecidos');
  }

  // ========== MÉTODO PARA SANITIZAR IMaGENES ==========
  imagenEquiposFiltrados(url: string | undefined): SafeResourceUrl {
    if (!url || url === '') {
      return '';
    }
    // Limpiar la URL de tokens si es necesario
    let urlLimpia = url.split('&token=')[0];
    return this.sanitizer.bypassSecurityTrustResourceUrl(urlLimpia);
  }


  onEstadoChange(): void {
    if (this.estado === 'INOPERATIVO' && this.equipoEnUso) {
      this.notificacionSnackbarService.warning(
        'Equipo en uso',
        'No se puede inactivar porque esta en uso.'
      );
    }
  }




  // ========== SUGERENCIAS DE SERIAL ==========

  onSerialInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const valor = input.value || '';

    this.serial = valor.toUpperCase();
    input.value = this.serial;

    if (this.timeoutBusquedaSerial) {
      clearTimeout(this.timeoutBusquedaSerial);
    }

    this.timeoutBusquedaSerial = setTimeout(() => {
      this.buscarCoincidenciasSerial();
    }, 300);
  }

  buscarCoincidenciasSerial(): void {
    const texto = this.serial?.trim() || '';

    // Si estamos en edición, no buscar
    if (this.modoEdicion) {
      this.resultadosBusquedaModal = [];
      return;
    }

    if (texto.length < 2) {
      this.resultadosBusquedaModal = [];
      return;
    }

    this.registroEquipoService.buscarEquipos(texto).subscribe({
      next: (equipos) => {
        this.resultadosBusquedaModal = equipos;
      },
      error: () => {
        this.resultadosBusquedaModal = [];
      }
    });
  }

  get coincidenciasSerial(): any[] {
    if (!this.serial || this.serial.length < 2) {
      return [];
    }

    const texto = this.serial.toLowerCase().trim();

    if (this.modoEdicion) {
      return [];
    }

    return this.resultadosBusquedaModal
      .filter(eq => (eq.serial || '').toLowerCase().includes(texto))
      .slice(0, 5);
  }

  get serialExisteExacto(): boolean {
    if (!this.serial || this.modoEdicion) return false;
    const texto = this.serial.toLowerCase().trim();
    if (!texto) return false;

    return this.resultadosBusquedaModal.some(eq =>
      (eq.serial || '').toLowerCase() === texto
    );
  }

  esCoincidenciaExactaSerial(item: any): boolean {
    if (!this.serial || this.modoEdicion) return false;
    const texto = this.serial.toLowerCase().trim();
    return (item.serial || '').toLowerCase() === texto;
  }

}





