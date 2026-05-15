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
import { SOLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_SO.interface';
import { VersionSOLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_VersionSO.interface';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';



@Component({
  selector: 'app-opc-dispositivo',
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatAutocompleteModule],
  templateUrl: './opc-dispositivo.component.html',
  styleUrl: './opc-dispositivo.component.css'
})
export class OpcDispositivoComponent implements OnInit {

  // DISPOSITIVO MOVIL
  private readonly CATALOGO_DISPOSITIVO_MOVIL_ID = 2;

  // LISTAS
  tipos: TipoLlamarDatos[] = [];
  marcas: MarcaLlamarDatos[] = [];
  modelos: ModeloLlamarDatos[] = [];
  imagenModeloSeleccionado: SafeResourceUrl = '';
  sistemasOperativos: SOLlamarDatos[] = [];
  versionesSO: VersionSOLlamarDatos[] = [];

  // SELECCIONES
  tipoSeleccionado: TipoLlamarDatos | null = null;
  marcaSeleccionada: MarcaLlamarDatos | null = null;
  modeloSeleccionado: ModeloLlamarDatos | null = null;
  soSeleccionado: SOLlamarDatos | null = null;
  versionSOSeleccionada: VersionSOLlamarDatos | null = null;

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



  constructor(
    private registroCatalogoService: RegistroCatalogoService,
    private sanitizer: DomSanitizer,
    private notificacionSnackbarService: NotificacionSnackbarService
  ) { }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {

    const catalogoId = this.CATALOGO_DISPOSITIVO_MOVIL_ID;

    // TIPOS
    this.registroCatalogoService
      .getTiposPorCatalogo(catalogoId)
      .subscribe(data => this.tipos = data);

    // SO
    this.registroCatalogoService
      .getSistemasOperativosPorCatalogo(catalogoId)
      .subscribe(data => this.sistemasOperativos = data);
  }

  // CAMBIO TIPO
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

  // Al cambiar SO, carga versiones correspondientes
  onSOChange(): void {
    this.versionesSO = [];
    this.versionSOSeleccionada = null;
    if (this.soSeleccionado) {
      this.registroCatalogoService.getVersionesPorSO(this.soSeleccionado.codigo).subscribe(data => this.versionesSO = data);
    }
  }

  // Al cambiar versión SO
  onVersionSOChange(): void {
    // Si seleccionó "NUEVA VERSION"
    if (this.versionSOSeleccionada === ('new' as any)) {
      this.abrirModalVersionSO();
      this.versionSOSeleccionada = null;
      return;
    }

    // Aquí puedes agregar lógica adicional si es necesario
    // Por ejemplo, validar o cargar algo cuando se selecciona una versión existente
    if (this.versionSOSeleccionada) {
      console.log('Versión seleccionada:', this.versionSOSeleccionada);
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




  // ========== MÉTODOS PARA MODAL DE MODELO ==========

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
      this.notificacionSnackbarService.info('Versión SO existente',
        `La versión "${versionSeleccionada.descripcion}" ya existe. Se ha seleccionado automáticamente.`);
      this.versionSOSeleccionada = versionSeleccionada;  // ← CORREGIDO: versionSeleccionada
      this.cerrarModalVersionSO();
    }
  }


  // Crear VersionSO
  crearVersionSO(): void {
    if (!this.nuevaVersionSODescripcion.trim()) {
      this.notificacionSnackbarService.warning('Campo requerido', 'Ingrese el nombre de la versión');
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
      this.notificacionSnackbarService.info('Versión existente',
        `La versión "${versionExistente.descripcion}" ya existe para ${this.soSeleccionado?.descripcion}.`);
      this.versionSOSeleccionada = versionExistente;
      this.cerrarModalVersionSO();
      return;
    }

    // Crear nueva versión en el backend
    this.registroCatalogoService.crearVersionSO(
      this.nuevaVersionSODescripcion.toUpperCase(),
      this.soSeleccionado.codigo
    ).subscribe({
      next: (nuevaVersion: VersionSOLlamarDatos) => {
        // Agregar a la lista de versiones
        this.versionesSO.push(nuevaVersion);
        this.versionesSO.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        // Seleccionar la nueva versión
        this.versionSOSeleccionada = nuevaVersion;
        this.notificacionSnackbarService.success('Versión creada',
          `Versión "${nuevaVersion.descripcion}" creada exitosamente`);
        this.cerrarModalVersionSO();
      },
      error: (err) => {
        const mensaje = err.error?.message || 'Error al crear la versión';
        this.notificacionSnackbarService.error('Error', mensaje);
      }
    });
  }



  // ================== MEMORIA RAM  - ALMACENAMIENTO  ==========================
  tamanoRamReal: number | null = null;
  tamanoRamMostrar: string = '';
  tamanoAlmacenamientoReal: number | null = null;
  tamanoAlmacenamientoMostrar: string = '';


  // Método genérico para permitir solo números
  soloNumeros(event: KeyboardEvent): void {
    const tecla = event.key;
    const teclasPermitidas = [
      'Backspace', 'Delete', 'Tab', 'Enter', 'Escape',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'
    ];

    if (teclasPermitidas.includes(tecla)) {
      return;
    }

    if (!/^[0-9]$/.test(tecla)) {
      event.preventDefault();
    }
  }

  // Formatear RAM
  formatearRam(): void {
    const numeros = this.tamanoRamMostrar.replace(/[^0-9]/g, '');

    if (numeros && numeros !== '') {
      this.tamanoRamReal = parseInt(numeros);
      this.tamanoRamMostrar = `${numeros} GB`;
    } else {
      this.tamanoRamReal = null;
      this.tamanoRamMostrar = '';
    }
  }

  // Formatear ALMACENAMIENTO
  formatearAlmacenamiento(): void {
    const numeros = this.tamanoAlmacenamientoMostrar.replace(/[^0-9]/g, '');

    if (numeros && numeros !== '') {
      this.tamanoAlmacenamientoReal = parseInt(numeros);
      this.tamanoAlmacenamientoMostrar = `${numeros} GB`;
    } else {
      this.tamanoAlmacenamientoReal = null;
      this.tamanoAlmacenamientoMostrar = '';
    }
  }

  

  // Convertir texto a mayúsculas mientras escribe
  convertirMayusculas(): void {
    
    this.nuevaMarcaDescripcion = this.nuevaMarcaDescripcion.toUpperCase();
    this.filtrarMarcas(); // Llamar al filtro después de convertir

    this.nuevaModeloDescripcion = this.nuevaModeloDescripcion.toUpperCase();
    this.filtrarModelos(); // Llamar al filtro después de convertir
  
    this.nuevaVersionSODescripcion = this.nuevaVersionSODescripcion.toUpperCase();
    this.filtrarVersionesSo(); // Llamar al filtro después de convertir
  }

}
