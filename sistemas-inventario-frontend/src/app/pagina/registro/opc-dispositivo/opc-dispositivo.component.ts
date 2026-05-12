import { Component, OnInit} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CatalogoService } from '../../../arquitectura/servicio/LlamarDatos/catalogo.service';
import { TipoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_Tipo.interface';
import { MarcaLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_Marca.interface';
import { ModeloLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_Modelo.interface';
import { SOLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_SO.interface';
import { VersionSOLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/DispositivoTecnologico_VersionSO.interface';

@Component({
  selector: 'app-opc-dispositivo',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './opc-dispositivo.component.html',
  styleUrl: './opc-dispositivo.component.css'
})
export class OpcDispositivoComponent implements OnInit{

  // LISTAS
  tipos: TipoLlamarDatos[] = [];
  marcas: MarcaLlamarDatos[] = [];
  modelos: ModeloLlamarDatos[] = [];
  sistemasOperativos: SOLlamarDatos[] = [];
  versionesSO: VersionSOLlamarDatos[] = [];

  // SELECCIONES
  tipoSeleccionado: TipoLlamarDatos | null = null;
  marcaSeleccionada: MarcaLlamarDatos | null = null;
  modeloSeleccionado: ModeloLlamarDatos | null = null;
  soSeleccionado: SOLlamarDatos | null = null;
  versionSOSeleccionada: VersionSOLlamarDatos | null = null;

  // IMAGEN
  imagenModeloSeleccionado: SafeResourceUrl = '';

  // DISPOSITIVO MOVIL
  private readonly CATALOGO_DISPOSITIVO_MOVIL_ID = 2;

  constructor(
    private catalogoService: CatalogoService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {

    const catalogoId = this.CATALOGO_DISPOSITIVO_MOVIL_ID;

    // TIPOS
    this.catalogoService
      .getTiposPorCatalogo(catalogoId)
      .subscribe(data => this.tipos = data);

    // SO
    this.catalogoService
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

      this.catalogoService
        .getMarcasPorTipo(this.tipoSeleccionado.codigo)
        .subscribe(data => {
          this.marcas = data;
        });

    }
  }

  // CAMBIO MARCA
  onMarcaChange(): void {

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

  // CAMBIO MODELO
  onModeloChange(): void {

    if (
      this.modeloSeleccionado &&
      this.modeloSeleccionado.rutaImagen
    ) {

      const urlLimpia =
        this.modeloSeleccionado.rutaImagen.split('&token=')[0];

      this.imagenModeloSeleccionado =
        this.sanitizer.bypassSecurityTrustResourceUrl(urlLimpia);

    } else {

      this.imagenModeloSeleccionado = '';

    }
  }

  // CAMBIO SO
  onSOChange(): void {

    this.versionesSO = [];
    this.versionSOSeleccionada = null;

    if (this.soSeleccionado) {

      this.catalogoService
        .getVersionesPorSO(this.soSeleccionado.codigo)
        .subscribe(data => {
          this.versionesSO = data;
        });

    }
  }

}
