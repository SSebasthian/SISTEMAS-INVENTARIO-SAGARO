import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EquipoDeComputoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/EquipoDeComputoRespuesta.interface';
import { PermisoModuloService } from '../../../arquitectura/servicio/autenticacion/permiso-modulo.service';
import { RegistroEquipoService } from '../../../arquitectura/servicio/registro/RegistroEquipo.service';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';
import { RegistroCatalogoService } from '../../../arquitectura/servicio/registro/RegistroCatalogo.service';


@Component({
  selector: 'app-opc-equipo-visualizar',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule, MatDialogModule],
  templateUrl: './opc-equipo-visualizar.component.html',
  styleUrl: './opc-equipo-visualizar.component.css'
})
export class OpcEquipoVisualizarComponent {
  imagenModelo: SafeResourceUrl | null = null;
  puedeEditar: boolean = false;
  modoEdicion: boolean = false;
  equipoEdit: any = {};
  enviando = false;
  equipo: any; 
  // Listas para los selects (CATALOGOS)
  tipos: any[] = [];
  marcas: any[] = [];
  modelos: any[] = [];
  sistemasOperativos: any[] = [];
  versionesSO: any[] = [];

   constructor(
    public dialogRef: MatDialogRef<OpcEquipoVisualizarComponent>,
    // Cambiamos la inyeccion para recibir el equipo y la funcion
    @Inject(MAT_DIALOG_DATA) public data: { equipo: EquipoDeComputoLlamarDatos, recargarTabla: Function }, 
    private sanitizer: DomSanitizer,
    private permisoModuloService: PermisoModuloService,
    private registroEquipoService: RegistroEquipoService,
    private notificacionSnackbarService: NotificacionSnackbarService,
    private registroCatalogoService: RegistroCatalogoService
  ) { 
    // Asignamos el equipo de los datos a la propiedad equipo
    this.equipo = this.data.equipo;
  }


  ngOnInit(): void {
    this.puedeEditar = this.permisoModuloService.puede('registro', 'editar');

    if (this.equipo.modelo?.rutaImagen) {
      const urlLimpia = this.equipo.modelo.rutaImagen.split('&token=')[0];
      this.imagenModelo = this.sanitizer.bypassSecurityTrustResourceUrl(urlLimpia);
    }

    // Clonamos el equipo para no modificar el original hasta guardar
    this.equipoEdit = JSON.parse(JSON.stringify(this.equipo));
  }



  get puedeEditarRegistro(): boolean {
    return this.permisoModuloService.puede('registro', 'editar');
  }

  // --- NUEVOS METODOS PARA CARGAR CATALOGOS ---

  activarEdicion() {
    this.modoEdicion = true;
    this.cargarCatalogosIniciales();
  }

  cargarCatalogosIniciales() {
    const catalogoId = 1; // El ID de tu catAlogo de equipos

    // 1. Cargar tipos y SO
    this.registroCatalogoService.getTiposPorCatalogo(catalogoId).subscribe(data => this.tipos = data);
    this.registroCatalogoService.getSistemasOperativosPorCatalogo(catalogoId).subscribe(data => this.sistemasOperativos = data);

    // 2. Cargar marcas del tipo actual
    if (this.equipo.tipo) {
      this.registroCatalogoService.getMarcasPorTipo(this.equipo.tipo.codigo).subscribe(data => this.marcas = data);
    }

    // 3. Cargar modelos de la marca actual
    if (this.equipo.marca && this.equipo.tipo) {
      this.registroCatalogoService.getModelosPorMarcaYTipo(this.equipo.marca.codigo, this.equipo.tipo.codigo).subscribe(data => this.modelos = data);
    }

    // 4. Cargar versiones del SO actual
    if (this.equipo.sistemaOperativo) {
      this.registroCatalogoService.getVersionesPorSO(this.equipo.sistemaOperativo.codigo).subscribe(data => this.versionesSO = data);
    }
  }

  // Al cambiar el Tipo, recargamos Marcas
  onTipoChangeEdicion() {
    this.marcas = [];
    this.modelos = [];
    this.equipoEdit.marca = null;
    this.equipoEdit.modelo = null;
    if (this.equipoEdit.tipo) {
      this.registroCatalogoService.getMarcasPorTipo(this.equipoEdit.tipo.codigo).subscribe(data => this.marcas = data);
    }
  }

  // Al cambiar la Marca, recargamos Modelos
  onMarcaChangeEdicion() {
    this.modelos = [];
    this.equipoEdit.modelo = null;
    if (this.equipoEdit.marca && this.equipoEdit.tipo) {
      this.registroCatalogoService.getModelosPorMarcaYTipo(this.equipoEdit.marca.codigo, this.equipoEdit.tipo.codigo).subscribe(data => this.modelos = data);
    }
  }

  // Al cambiar el SO, recargamos Versiones
  onSOChangeEdicion() {
    this.versionesSO = [];
    this.equipoEdit.versionSO = null;
    if (this.equipoEdit.sistemaOperativo) {
      this.registroCatalogoService.getVersionesPorSO(this.equipoEdit.sistemaOperativo.codigo).subscribe(data => this.versionesSO = data);
    }
  }

  compararPorCodigo(obj1: any, obj2: any): boolean {
    if (!obj1 || !obj2) return obj1 === obj2;
    return obj1.codigo === obj2.codigo;
  }

  // --- GUARDAR ---
  guardarCambios() {
    if (this.enviando) return;
    this.enviando = true;

    const equipoData: any = {
      serial: this.equipoEdit.serial,
      plaqueta: this.equipoEdit.plaqueta || 'NO TIENE',
      facturaCompra: this.equipoEdit.facturaCompra || 'NO TIENE',
      fechaCompra: this.equipoEdit.fechaCompra || null,
      activo: this.equipoEdit.activo,
      descripcion: this.equipoEdit.descripcion || 'SIN DESCRIPCION',
      estado: this.equipoEdit.estado,
      ram: this.equipoEdit.ram,
      tipoRam: this.equipoEdit.tipoRam,
      procesador: this.equipoEdit.procesador,
      disco: this.equipoEdit.disco,
      tipoDisco: this.equipoEdit.tipoDisco,
      bits: this.equipoEdit.bits,
      tipo: { codigo: this.equipoEdit.tipo?.codigo },
      marca: { codigo: this.equipoEdit.marca?.codigo },
      modelo: { codigo: this.equipoEdit.modelo?.codigo },
      sistemaOperativo: { codigo: this.equipoEdit.sistemaOperativo?.codigo },
      versionSO: { codigo: this.equipoEdit.versionSO?.codigo }
    };

    this.registroEquipoService.editarEquipo(this.equipo.serial, equipoData).subscribe({
      next: (respuesta) => {
        this.notificacionSnackbarService.success('Equipo actualizado', `Serial: ${respuesta.serial}`);
        this.enviando = false;
        
        // Actualizamos el modal y salimos del modo edición
        this.equipo = JSON.parse(JSON.stringify(this.equipoEdit));
        this.modoEdicion = false;

        // --- NUEVO: Recargar la tabla de equipos ---
        if (this.data.recargarTabla) {
          this.data.recargarTabla();
        }
      },
      error: (err) => {
        const mensaje = err.error?.message || 'Error al actualizar el equipo';
        this.notificacionSnackbarService.error('Error', mensaje);
        this.enviando = false;
      }
    });
  }

  cerrar() { 
    // Al cerrar, le decimos a la tabla que recargue por si hubo cambios
    if (this.data && this.data.recargarTabla) {
      this.data.recargarTabla();
    }
    this.dialogRef.close(); 
  }


  getEstadoColor(estado: string): string {
    const colores: any = { 'BUEN ESTADO': '#2e7d32', 'ESTADO REGULAR': '#1976d2', 'ESTADO DEFICIENTE': '#ed6c02', 'INOPERATIVO': '#d32f2f' };
    return colores[estado] || '#333';
  }



  soloNumerosEdicion(event: KeyboardEvent): void {
    const tecla = event.key;
    const teclasPermitidas = [
      'Backspace', 'Delete', 'Tab', 'Enter', 'Escape',
      'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'
    ];

    if (teclasPermitidas.includes(tecla)) return;

    if (!/^[0-9]$/.test(tecla)) {
      event.preventDefault();
    }
  }

  // Formatea el valor a "numero GB"
  formatearRamEdicion(): void {
    const numeros = this.equipoEdit.ram.replace(/[^0-9]/g, '');

    if (numeros && numeros !== '') {
      this.equipoEdit.ram = `${numeros} GB`;
    } else {
      this.equipoEdit.ram = '';
    }
  }
}