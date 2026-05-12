import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CatalogoService } from '../../../arquitectura/servicio/LlamarDatos/catalogo.service';
import { TipoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_Tipo.interface';
import { MarcaLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_Marca.interface';
import { ModeloLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_Modelo.interface';

@Component({
  selector: 'app-opc-impresora',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './opc-impresora.component.html',
  styleUrl: './opc-impresora.component.css'
})
export class OpcImpresoraComponent implements OnInit{

  // LISTAS
  tipos: TipoLlamarDatos[] = [];
  marcas: MarcaLlamarDatos[] = [];
  modelos: ModeloLlamarDatos[] = [];

  // SELECCIONES
  tipoSeleccionado: TipoLlamarDatos | null = null;
  marcaSeleccionada: MarcaLlamarDatos | null = null;
  modeloSeleccionado: ModeloLlamarDatos | null = null;

  // IMAGEN
  imagenModeloSeleccionado: SafeResourceUrl = '';

  // ID catálogo IMPRESORA
  private readonly CATALOGO_IMPRESORA_ID = 3;

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

  // Cambio de marca
  onMarcaChange(): void {

    this.modelos = [];
    this.modeloSeleccionado = null;

    this.imagenModeloSeleccionado = '';

    if (this.marcaSeleccionada && this.tipoSeleccionado) {

      this.catalogoService
        .getModelosPorMarcaYTipo(
          this.marcaSeleccionada.codigo,
          this.tipoSeleccionado.codigo
        )
        .subscribe(data => {
          this.modelos = data;
        });

    }
  }

  // Cambio modelo
  onModeloChange(): void {

    if (
      this.modeloSeleccionado &&
      this.modeloSeleccionado.rutaImagen
    ) {

      this.imagenModeloSeleccionado =
        this.sanitizer.bypassSecurityTrustResourceUrl(
          this.modeloSeleccionado.rutaImagen
        );

    } else {

      this.imagenModeloSeleccionado = '';

    }
  }
}
