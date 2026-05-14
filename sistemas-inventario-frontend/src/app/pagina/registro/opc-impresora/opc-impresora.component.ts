import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CatalogoService } from '../../../arquitectura/servicio/LlamarDatos/catalogo.service';
import { TipoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_Tipo.interface';
import { MarcaLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_Marca.interface';
import { ModeloLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_Modelo.interface';

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

  // SELECCIONES
  tipoSeleccionado: TipoLlamarDatos | null = null;
  marcaSeleccionada: MarcaLlamarDatos | null = null;
  modeloSeleccionado: ModeloLlamarDatos | null = null;

  // ========== VARIABLES PARA MODAL DE MARCA ==========
  mostrarModalMarca = false;
  nuevaMarcaDescripcion = '';

  // ========== VARIABLES PARA MODAL DE MODELO ==========
  mostrarModalModelo = false;
  nuevaModeloDescripcion = '';

  tipoRecarga: string = '';


  constructor(
    private catalogoService: CatalogoService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    this.catalogoService
      .getTiposPorCatalogo(this.CATALOGO_IMPRESORA_ID)
      .subscribe(data => {
        this.tipos = data;
      });
  }

  // Cambio de tipo
  onTipoChange(): void {

    this.marcas = [];
    this.modelos = [];

    this.marcaSeleccionada = null;
    this.modeloSeleccionado = null;

    this.imagenModeloSeleccionado = '';

    if (this.tipoSeleccionado) {

      this.catalogoService
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
      this.catalogoService.getModelosPorMarcaYTipo(
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
    this.mostrarModalMarca = true;
    this.nuevaMarcaDescripcion = '';
  }

  // Cerrar modal
  cerrarModalMarca(): void {
    this.mostrarModalMarca = false;
    this.nuevaMarcaDescripcion = '';
  }

  // Crear marca
  crearMarca() {

  }




  // ========== MÉTODOS PARA MODAL DE MARCA ==========

  // Abrir modal
  abrirModalModelo(): void {
    this.mostrarModalModelo = true;
    this.nuevaModeloDescripcion = '';
  }

  // Cerrar modal
  cerrarModalModelo(): void {
    this.mostrarModalModelo = false;
    this.nuevaModeloDescripcion = '';
  }

  // Crear Modelo
  crearModelo() {

  }

}
