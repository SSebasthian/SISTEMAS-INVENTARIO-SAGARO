import { Component, OnInit } from '@angular/core';
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
  selector: 'app-opc-equipo',
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './opc-equipo.component.html',
  styleUrl: './opc-equipo.component.css'
})
export class OpcEquipoComponent implements OnInit{

  // Listas para los selects
  tipos: TipoLlamarDatos[] = [];
  marcas: MarcaLlamarDatos[] = [];
  modelos: ModeloLlamarDatos[] = [];
  imagenModeloSeleccionado: SafeResourceUrl = '';
  sistemasOperativos: SOLlamarDatos[] = [];
  versionesSO: VersionSOLlamarDatos[] = [];

  // Variables para guardar la selección actual del usuario
  tipoSeleccionado: TipoLlamarDatos | null = null;
  marcaSeleccionada: MarcaLlamarDatos | null = null;
  modeloSeleccionado: ModeloLlamarDatos | null = null;
  soSeleccionado: SOLlamarDatos | null = null;
  versionSOSeleccionada: VersionSOLlamarDatos | null = null;
  bitsSeleccionado: number | null = null;
  tipoRamSeleccionado: string = '';
  tipoDiscoSeleccionado: string = '';


  // ID del catálogo "EQUIPO DE COMPUTO" en tu base de datos
  private readonly CATALOGO_EQUIPO_COMPUTO_ID = 1;


  constructor(
    private catalogoService: CatalogoService,
    private sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.cargarDatosIniciales();
  }

  cargarDatosIniciales(): void {
    const catalogoId = this.CATALOGO_EQUIPO_COMPUTO_ID;

    // Cargar tipos y sistemas operativos del catálogo
    this.catalogoService.getTiposPorCatalogo(catalogoId).subscribe(data => this.tipos = data);
    this.catalogoService.getSistemasOperativosPorCatalogo(catalogoId).subscribe(data => this.sistemasOperativos = data);

    // Las marcas NO se cargan aquí, se cargarán cuando se seleccione un tipo
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
      this.catalogoService.getMarcasPorTipo(this.tipoSeleccionado.codigo).subscribe(data => this.marcas = data);
    }
  }



  // Al cambiar marca, carga modelos correspondientes
  onMarcaChange(): void {
    this.modelos = [];
    this.modeloSeleccionado = null;

    // LIMPIAR IMAGEN
    this.imagenModeloSeleccionado = '';

    if (this.marcaSeleccionada && this.tipoSeleccionado) {
      this.catalogoService.getModelosPorMarcaYTipo(
        this.marcaSeleccionada.codigo,
        this.tipoSeleccionado.codigo
      ).subscribe(data => {
        this.modelos = data;
        //console.log('Modelos cargados:', data);
      });
    }
  }

  // Cuando cambia el modelo, actualizar la imagen
  onModeloChange(): void {
    if (this.modeloSeleccionado && this.modeloSeleccionado.rutaImagen) {
      // Limpiar la URL eliminando el token
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
      this.catalogoService.getVersionesPorSO(this.soSeleccionado.codigo).subscribe(data => this.versionesSO = data);
    }
  }


}
