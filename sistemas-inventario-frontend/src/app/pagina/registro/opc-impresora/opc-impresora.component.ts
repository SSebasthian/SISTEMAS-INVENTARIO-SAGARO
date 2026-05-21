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
import { ModeloLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_Modelo.interface'
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';

import { ImpresoraService } from '../../../arquitectura/servicio/registro/RegistroImpresora.service';
import { ImpresoraRegistro } from './../../../arquitectura/interface/Registro/ImpresoraRegistro.interface';
import { ImpresoraLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/ImpresoraRespuesta.interface';


@Component({
  selector: 'app-opc-impresora',
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatAutocompleteModule],
  templateUrl: './opc-impresora.component.html',
  styleUrl: './opc-impresora.component.css'
})
export class OpcImpresoraComponent implements OnInit {

  // ID catálogo IMPRESORA
  private readonly CATALOGO_IMPRESORA_ID = 3;

  // LISTAS
  tipos: TipoLlamarDatos[] = [];
  marcas: MarcaLlamarDatos[] = [];
  modelos: ModeloLlamarDatos[] = [];
  imagenModeloSeleccionado: SafeResourceUrl = '';

  // Variables para guardar la selección actual del usuario
  serial: string = '';
  plaqueta: string = '';
  facturaCompra: string = '';
  fechaCompra: string = '';
  descripcion: string = '';
  estado: string = '';
  propiedad: string = '';
  tipoRecarga: string = '';

  // SELECCIONES
  tipoSeleccionado: TipoLlamarDatos | null = null;
  marcaSeleccionada: MarcaLlamarDatos | null = null;
  modeloSeleccionado: ModeloLlamarDatos | null = null;

  // =========== VARIABLES DE ESTADO ==============
  enviando = false;


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

  // ========== MODO EDICIÓN ==========
  modoEdicion: boolean = false;
  serialOriginal: string = '';

  // ========== VARIABLES PARA BUSCADOR ==========
  mostrarModalBuscarImpresora: boolean = false;
  busquedaImpresoraModal: string = '';
  resultadosBusquedaModal: ImpresoraLlamarDatos[] = [];
  buscandoModal: boolean = false;


  constructor(
    private registroCatalogoService: RegistroCatalogoService,
    private sanitizer: DomSanitizer,
    private notificacionSnackbarService: NotificacionSnackbarService,
    private impresoraService: ImpresoraService
  ) { }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {

    const catalogoId = this.CATALOGO_IMPRESORA_ID;

    // Cargar tipos
    this.registroCatalogoService.getTiposPorCatalogo(catalogoId).subscribe(data => {
      this.tipos = data;
    });

    this.registroCatalogoService.getTiposPorCatalogo(catalogoId).subscribe(data => this.tipos = data);

  }

  // Cambio de tipo
  onTipoChange(): void {

    this.marcas = [];
    this.modelos = [];

    this.marcaSeleccionada = null;
    this.modeloSeleccionado = null;

    this.imagenModeloSeleccionado = '';

    if (this.tipoSeleccionado) {

      this.registroCatalogoService
        .getMarcasPorTipo(this.tipoSeleccionado.codigo)
        .subscribe(data => {
          this.marcas = data;
        });

    }
  }

  // Al cambiar marca, carga modelos correspondientes
  onMarcaChange(): void {
    // Si seleccionó "NUEVA MARCA"
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
    // Si seleccionó "NUEVO MODELO"
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
        `La marca "${marcaSeleccionada.descripcion}" ya existe en ${this.tipoSeleccionado?.descripcion}. Se ha seleccionado automáticamente.`);
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



  // ========== MÉTODOS PARA MODAL MODELO ==========

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
        `El modelo "${modeloSeleccionado.descripcion}" ya existe. Se ha seleccionado automáticamente.`);
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




  // Convertir texto a mayúsculas mientras escribe
  convertirMayusculas(): void {

    this.nuevaMarcaDescripcion = this.nuevaMarcaDescripcion.toUpperCase();
    this.filtrarMarcas(); // Llamar al filtro después de convertir

    this.nuevaModeloDescripcion = this.nuevaModeloDescripcion.toUpperCase();
    this.filtrarModelos(); // Llamar al filtro después de convertir
  }




  // ================== REGISTRAR DISPOSITIVO ==========================

  registrarImpresora(): void {

    // Si está en modo edición, llamar a editarImpresora()
    if (this.modoEdicion) {
      this.editarImpresora();
      return;
    }


    if (this.enviando) return; // Evitar envíos múltiples


    // ===== VALIDACIONES DE CAMPOS OBLIGATORIOS =====

    // Serial
    if (!this.serial || this.serial.trim() === '') {
      this.notificacionSnackbarService.warning('Campo requerido', 'Ingrese el serial de la impresora');
      return;
    }

    // Propiedad
    if (!this.propiedad || this.propiedad.trim() === '') {
      this.notificacionSnackbarService.warning('Campo requerido', 'Seleccione la propiedad');
      return;
    }

    // Tipo
    if (!this.tipoSeleccionado) {
      this.notificacionSnackbarService.warning('Campo requerido', 'Seleccione un tipo de impresora');
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


    // Tipo Recarga
    if (!this.tipoRecarga || this.tipoRecarga.trim() === '') {
      this.notificacionSnackbarService.warning('Campo requerido', 'Seleccione el tipo de recarga');
      return;
    }

    // Estado
    if (!this.estado || this.estado.trim() === '') {
      this.notificacionSnackbarService.warning('Campo requerido', 'Seleccione el estado de la impresora');
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

    const plaquetaFinal = this.plaqueta && this.plaqueta.trim() !== '' ? this.plaqueta : 'NO TIENE';
    const descripcionFinal = this.descripcion && this.descripcion.trim() !== '' ? this.descripcion : 'SIN DESCRIPCIÓN';
    const facturaFinal = this.facturaCompra && this.facturaCompra.trim() !== '' ? this.facturaCompra : 'NO TIENE';
    const fechaFinal = this.fechaCompra && this.fechaCompra.trim() !== '' ? this.fechaCompra : null;

    // ===== ARMAR OBJETO PARA ENVIAR =====

    const impresoraData: ImpresoraRegistro = {
      serial: this.serial.trim().toUpperCase(),
      propiedad: this.propiedad.trim(),
      plaqueta: plaquetaFinal,
      tipoRecarga: this.tipoRecarga,
      facturaCompra: facturaFinal,
      fechaCompra: fechaFinal,
      estado: this.estado,
      descripcion: descripcionFinal,
      tipo: { codigo: this.tipoSeleccionado.codigo },
      marca: { codigo: this.marcaSeleccionada.codigo },
      modelo: { codigo: this.modeloSeleccionado.codigo }
    };


    // ===== ENVIAR AL BACKEND =====

    this.impresoraService.registrarImpresora(impresoraData).subscribe({
      next: (respuesta) => {
        console.log('Impresora registrada:', respuesta);
        this.notificacionSnackbarService.success(
          'Registro exitoso',
          `Impresora ${respuesta.serial} registrada correctamente`
        );
        this.limpiarFormulario();
      },
      error: (error) => {
        console.error('Error al registrar:', error);
        let mensajeError = 'Error al registrar la impresora';

        if (error.error?.message) {
          mensajeError = error.error.message;
        } else if (error.message) {
          mensajeError = error.message;
        }

        this.notificacionSnackbarService.error('Error', mensajeError);
      }
    });
  }

  // ========== LIMPIAR FORMULARIO ==========

  limpiarFormulario(): void {
    this.serial = '';
    this.propiedad = '';
    this.plaqueta = '';
    this.tipoRecarga = '';
    this.facturaCompra = '';
    this.fechaCompra = '';
    this.descripcion = '';
    this.estado = '';

    this.tipoSeleccionado = null;
    this.marcaSeleccionada = null;
    this.modeloSeleccionado = null;

    this.marcas = [];
    this.modelos = [];
    this.imagenModeloSeleccionado = '';

    this.modoEdicion = false;  // ← Asegúrate que esta línea existe
    this.serialOriginal = '';  // ← También resetear serialOriginal

    // Recargar datos iniciales
    this.cargarDatosIniciales();
  }


  // ========== MÉTODOS PARA BUSCADOR ==========

  compararPorCodigo(obj1: any, obj2: any): boolean {
    if (!obj1 || !obj2) return obj1 === obj2;
    return obj1.codigo === obj2.codigo;
  }


  abrirModalBuscarImpresora(): void {
    this.mostrarModalBuscarImpresora = true;
    this.busquedaImpresoraModal = '';
    this.resultadosBusquedaModal = [];
  }

  cerrarModalBuscarImpresora(): void {
    this.mostrarModalBuscarImpresora = false;
    this.busquedaImpresoraModal = '';
    this.resultadosBusquedaModal = [];
  }

  buscarImpresorasEnModal(): void {
    if (!this.busquedaImpresoraModal || this.busquedaImpresoraModal.length < 2) {
      this.resultadosBusquedaModal = [];
      return;
    }

    this.buscandoModal = true;

    this.impresoraService.buscarImpresoras(this.busquedaImpresoraModal).subscribe({
      next: (impresoras) => {
        this.resultadosBusquedaModal = impresoras;
        this.buscandoModal = false;
      },
      error: (err) => {
        console.error('Error al buscar impresoras', err);
        this.resultadosBusquedaModal = [];
        this.buscandoModal = false;
        this.notificacionSnackbarService.error('Error', 'No se pudieron buscar las impresoras');
      }
    });
  }

  seleccionarImpresoraDelModal(impresora: ImpresoraLlamarDatos): void {
    this.modoEdicion = true;
    this.serialOriginal = impresora.serial;

    this.serial = impresora.serial;
    this.propiedad = impresora.propiedad;
    this.plaqueta = impresora.plaqueta || 'NO TIENE';
    this.tipoRecarga = impresora.tipoRecarga;
    this.facturaCompra = impresora.facturaCompra || 'NO TIENE';
    this.fechaCompra = impresora.fechaCompra || '';
    this.descripcion = impresora.descripcion || '';
    this.estado = impresora.estado;

    // Cargar selecciones
    this.tipoSeleccionado = impresora.tipo;
    this.marcaSeleccionada = impresora.marca;
    this.modeloSeleccionado = impresora.modelo;

    // Cargar listas dependientes
    if (this.tipoSeleccionado) {
      this.registroCatalogoService.getMarcasPorTipo(this.tipoSeleccionado.codigo)
        .subscribe(data => this.marcas = data);
    }

    if (this.marcaSeleccionada && this.tipoSeleccionado) {
      this.registroCatalogoService.getModelosPorMarcaYTipo(
        this.marcaSeleccionada.codigo,
        this.tipoSeleccionado.codigo
      ).subscribe(data => this.modelos = data);
    }

    // Cargar imagen del modelo
    if (impresora.modelo?.rutaImagen) {
      let urlLimpia = impresora.modelo.rutaImagen.split('&token=')[0];
      this.imagenModeloSeleccionado = this.sanitizer.bypassSecurityTrustResourceUrl(urlLimpia);
    } else {
      this.imagenModeloSeleccionado = '';
    }

    this.notificacionSnackbarService.success('Impresora cargada', `Editando: ${impresora.serial}`);
    this.cerrarModalBuscarImpresora();
  }

  // ========== EDITAR IMPRESORA ==========
  editarImpresora(): void {
    if (this.enviando) return;

    // Validaciones
    if (!this.serial || !this.propiedad || !this.tipoSeleccionado || !this.marcaSeleccionada ||
      !this.modeloSeleccionado || !this.tipoRecarga || !this.estado) {
      this.notificacionSnackbarService.warning('Campos incompletos', 'Todos los campos son obligatorios');
      return;
    }

    this.enviando = true;

    const plaquetaFinal = this.plaqueta?.toUpperCase() || 'NO TIENE';
    const descripcionFinal = this.descripcion?.toUpperCase() || 'SIN DESCRIPCIÓN';
    const facturaFinal = this.facturaCompra?.toUpperCase() || 'NO TIENE';
    const fechaFinal = this.fechaCompra || null;

    const impresoraData: ImpresoraRegistro = {
      serial: this.serialOriginal,
      propiedad: this.propiedad.toUpperCase(),
      plaqueta: plaquetaFinal,
      tipoRecarga: this.tipoRecarga.toUpperCase(),
      facturaCompra: facturaFinal,
      fechaCompra: fechaFinal,
      estado: this.estado,
      descripcion: descripcionFinal,
      tipo: { codigo: this.tipoSeleccionado.codigo },
      marca: { codigo: this.marcaSeleccionada.codigo },
      modelo: { codigo: this.modeloSeleccionado.codigo }
    };

    this.impresoraService.editarImpresora(this.serialOriginal, impresoraData).subscribe({
      next: (respuesta) => {
        this.notificacionSnackbarService.success('Impresora actualizada', `Serial: ${respuesta.serial}`);
        this.limpiarFormulario();
        this.enviando = false;
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        const mensaje = err.error?.message || 'Error al actualizar la impresora';
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


  // ========== MÉTODO PARA SANITIZAR IMÁGENES ==========
  imagenImpresorasFiltradas(url: string | undefined): SafeResourceUrl {
    if (!url || url === '') {
      return '';
    }
    // Limpiar la URL de tokens si es necesario
    let urlLimpia = url.split('&token=')[0];
    return this.sanitizer.bypassSecurityTrustResourceUrl(urlLimpia);
  }

}