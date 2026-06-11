import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { ImpresoraLlamarDatos } from './../../../arquitectura/interface/LlamarDatos/ImpresoraRespuesta.interface';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';
import { ConsultarImpresoraService } from '../../../arquitectura/servicio/consulta/ConsultarImpresora.service';
import { ConsultarAsignacionesService } from '../../../arquitectura/servicio/consulta/ConsultarAsignaciones.service';
import { RegistrarAsignacionesService } from '../../../arquitectura/servicio/registro/RegistrarAsignaciones.service';
import { A11yModule } from '@angular/cdk/a11y';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AsigImpresoraComponent } from '../../asignaciones/asig-impresora/asig-impresora.component';
import { AreaLlamarDatos } from './../../../arquitectura/interface/LlamarDatos/AreaRespuesta.interface';




@Component({
  selector: 'app-impresoras',
  imports: [CommonModule, FormsModule, MatIconModule, A11yModule],
  templateUrl: './impresoras.component.html',
  styleUrl: './impresoras.component.css'
})
export class ImpresorasComponent implements OnInit {

  // PROPIEDADES
  impresoras: ImpresoraLlamarDatos[] = [];
  impresorasFiltradas: ImpresoraLlamarDatos[] = [];
  impresorasPaginadas: ImpresoraLlamarDatos[] = [];
  filtroActivo: string | null = null;
  detalleVisible: string | null = null;
  terminoBusqueda: string = '';
  searchExpanded: boolean = false;
  areas: AreaLlamarDatos[] = [];

  // PAGINACION
  registrosPorPagina: number = 10;
  paginaActual: number = 1;
  totalPaginas: number = 1;

  constructor(
    private consultarImpresoraService: ConsultarImpresoraService,
    private notificacionSnackbarService: NotificacionSnackbarService,
    private consultarAsignacionesService: ConsultarAsignacionesService,
    private registrarAsignacionesService: RegistrarAsignacionesService,
    private elementRef: ElementRef,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.cargarImpresoras();
  }

  cargarImpresoras(): void {
    this.consultarImpresoraService.listarImpresoras().subscribe({
      next: (impresoras) => {
        const peticiones = impresoras.map(impresora =>
          this.consultarAsignacionesService.obtenerAsignacionActual(impresora.serial)
        );
        forkJoin(peticiones).subscribe({
          next: (respuestas: any[]) => {
            this.impresoras = impresoras.map((impresora, index) => {
              const asignacion = respuestas[index];
              if (asignacion?.activo) {
                impresora.asignado = true;
                if (asignacion.empleadoNombre) {
                  impresora.tipoAsignacion = 'empleado';
                  impresora.asignadoA = `${asignacion.empleadoNombre} ${asignacion.empleadoApellido}`;
                  impresora.asignadoCedula = asignacion.empleadoCedula;
                  impresora.asignadoArea = asignacion.areaDescripcion || null;
                  impresora.fechaAsignacion = asignacion.fechaAsignacion;
                } else if (asignacion.areaDescripcion) {
                  impresora.tipoAsignacion = 'area';
                  impresora.asignadoA = asignacion.areaDescripcion;
                  impresora.fechaAsignacion = asignacion.fechaAsignacion;
                }
                impresora.asignacionId = asignacion.consecutivo;
                // Guardar observaciones original
                let obs = asignacion.observaciones || '';
                impresora.observacionesOriginal = obs.replace(/^ASIGNACION:\s*/, '');
                impresora.observaciones = asignacion.observaciones;
              } else {
                impresora.asignado = false;
                impresora.tipoAsignacion = null;
                impresora.asignadoA = null;
                impresora.asignadoCedula = null;
                impresora.asignadoArea = null;
                impresora.fechaAsignacion = null;
                impresora.observaciones = null;
                impresora.observacionesOriginal = null;
                impresora.asignacionId = null;
              }
              return impresora;
            });
            this.impresorasFiltradas = [...this.impresoras];
            this.actualizarPaginacion();
          },
          error: (err) => {
            console.error('Error al obtener asignaciones de impresoras:', err);
            this.impresoras = impresoras;
            this.impresorasFiltradas = [...this.impresoras];
            this.actualizarPaginacion();
          }
        });
      },
      error: (err) => {
        console.error('Error al cargar impresoras:', err);
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar las impresoras');
      }
    });
  }

  // ========== FILTROS ==========

  filtros: any = {
    propiedad: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    tipo: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    marca: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    modelo: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    serial: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    plaqueta: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    tipoRecarga: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    estado: {
      valor: ''
    },
    facturaCompra: {
      operador: 'AND',
      reglas: [{ condicion: 'Contiene', valor: '' }]
    },
    fechaCompra: {
      operador: 'AND',
      reglas: [{ condicion: 'La fecha es', valor: '' }]
    },
    asignacion: {
      valor: ''
    }
  };

  abrirFiltro(columna: string): void {
    if (this.filtroActivo === columna) {
      this.filtroActivo = null;
      return;
    }
    this.filtroActivo = columna;
  }

  cerrarFiltro(): void {
    this.filtroActivo = null;
  }

  aplicarFiltros(): void {
    let filtrados = this.impresoras.filter(imp => {
      return this.aplicarFiltroPropiedad(imp) &&
        this.aplicarFiltroTipo(imp) &&
        this.aplicarFiltroMarca(imp) &&
        this.aplicarFiltroModelo(imp) &&
        this.aplicarFiltroSerial(imp) &&
        this.aplicarFiltroPlaqueta(imp) &&
        this.aplicarFiltroTipoRecarga(imp) &&
        this.aplicarFiltroEstado(imp) &&
        this.aplicarFiltroFacturaCompra(imp) &&
        this.aplicarFiltroFechaCompra(imp) &&
        this.aplicarFiltroAsignacion(imp);
    });

    if (this.terminoBusqueda.trim()) {
      filtrados = filtrados.filter(imp => {
        const texto = `${imp.propiedad} ${imp.tipo?.descripcion || ''} ${imp.marca?.descripcion || ''} ${imp.modelo?.descripcion || ''} ${imp.serial} ${imp.plaqueta} ${imp.tipoRecarga || ''} ${imp.facturaCompra || ''}`.toLowerCase();
        return texto.includes(this.terminoBusqueda.toLowerCase());
      });
    }

    this.impresorasFiltradas = filtrados;
    this.paginaActual = 1;
    this.actualizarPaginacion();
    this.cerrarFiltro();
  }

  limpiarFiltro(columna: string): void {
    if (columna === 'estado') {
      this.filtros.estado.valor = '';
    } else if (columna === 'asignacion') {
      this.filtros.asignacion.valor = '';
    } else {
      // Para los filtros con reglas (tipo, marca, etc.)
      this.filtros[columna].reglas = [{ condicion: 'Empieza con', valor: '' }];
      this.filtros[columna].operador = 'AND';
    }
    this.aplicarFiltros();
    this.cerrarFiltro();
  }

  limpiarTodosLosFiltros(): void {
    const columnas = ['propiedad', 'tipo', 'marca', 'modelo', 'serial', 'plaqueta', 'tipoRecarga', 'facturaCompra', 'fechaCompra'];
    columnas.forEach(col => {
      this.filtros[col].reglas = [{ condicion: col === 'facturaCompra' ? 'Contiene' : 'Empieza con', valor: '' }];
      this.filtros[col].operador = 'AND';
    });
    this.filtros.estado.valor = '';
    this.filtros.asignacion.valor = '';
    this.terminoBusqueda = '';
    this.paginaActual = 1;
    this.registrosPorPagina = 10;
    this.aplicarFiltros();
  }

  // ========== METODOS DE FILTRO INDIVIDUALES ==========
  aplicarFiltroPropiedad(imp: ImpresoraLlamarDatos): boolean {
    const f = this.filtros.propiedad;
    const v = imp.propiedad.toLowerCase() || '';
    return !f.reglas[0].valor || this.evaluarReglas(v, f.reglas, f.operador);
  }
  aplicarFiltroTipo(imp: ImpresoraLlamarDatos): boolean {
    const f = this.filtros.tipo;
    const v = imp.tipo?.descripcion?.toLowerCase() || '';
    return !f.reglas[0].valor || this.evaluarReglas(v, f.reglas, f.operador);
  }
  aplicarFiltroMarca(imp: ImpresoraLlamarDatos): boolean {
    const f = this.filtros.marca;
    const v = imp.marca?.descripcion?.toLowerCase() || '';
    return !f.reglas[0].valor || this.evaluarReglas(v, f.reglas, f.operador);
  }
  aplicarFiltroModelo(imp: ImpresoraLlamarDatos): boolean {
    const f = this.filtros.modelo;
    const v = imp.modelo?.descripcion?.toLowerCase() || '';
    return !f.reglas[0].valor || this.evaluarReglas(v, f.reglas, f.operador);
  }
  aplicarFiltroSerial(imp: ImpresoraLlamarDatos): boolean {
    const f = this.filtros.serial;
    const v = imp.serial?.toLowerCase() || '';
    return !f.reglas[0].valor || this.evaluarReglas(v, f.reglas, f.operador);
  }
  aplicarFiltroPlaqueta(imp: ImpresoraLlamarDatos): boolean {
    const f = this.filtros.plaqueta;
    const v = imp.plaqueta?.toLowerCase() || '';
    return !f.reglas[0].valor || this.evaluarReglas(v, f.reglas, f.operador);
  }
  aplicarFiltroTipoRecarga(imp: ImpresoraLlamarDatos): boolean {
    const f = this.filtros.tipoRecarga;
    const v = imp.tipoRecarga?.toLowerCase() || '';
    return !f.reglas[0].valor || this.evaluarReglas(v, f.reglas, f.operador);
  }
  aplicarFiltroEstado(imp: ImpresoraLlamarDatos): boolean {
    const val = this.filtros.estado.valor;
    return !val || imp.estado === val;
  }
  aplicarFiltroFacturaCompra(imp: ImpresoraLlamarDatos): boolean {
    const f = this.filtros.facturaCompra;
    const v = imp.facturaCompra?.toLowerCase() || '';
    return !f.reglas[0].valor || this.evaluarReglas(v, f.reglas, f.operador);
  }
  aplicarFiltroFechaCompra(imp: ImpresoraLlamarDatos): boolean {
    const f = this.filtros.fechaCompra;
    const hayActivo = f.reglas.some((r: any) => r.valor?.trim());
    if (!hayActivo) return true;
    const resultados = f.reglas.map((regla: any) => {
      if (!regla.valor) return true;
      // Si es condición de texto (buscar en factura)
      if (!regla.condicion.includes('fecha')) {
        const textoFactura = imp.facturaCompra?.toLowerCase() || '';
        const filtroValor = regla.valor.toString().toLowerCase();
        switch (regla.condicion) {
          case 'Contiene': return textoFactura.includes(filtroValor);
          case 'Empieza con': return textoFactura.startsWith(filtroValor);
          case 'Termina con': return textoFactura.endsWith(filtroValor);
          case 'Iguales': return textoFactura === filtroValor;
          default: return true;
        }
      }
      // Condición de fecha
      const valorFecha = imp.fechaCompra;
      if (!valorFecha) return false;
      const fechaValor = new Date(valorFecha); fechaValor.setHours(0, 0, 0, 0);
      const fechaFiltro = new Date(regla.valor); fechaFiltro.setHours(0, 0, 0, 0);
      switch (regla.condicion) {
        case 'La fecha es': return fechaValor.getTime() === fechaFiltro.getTime();
        case 'La fecha no es': return fechaValor.getTime() !== fechaFiltro.getTime();
        case 'La fecha es anterior': return fechaValor.getTime() < fechaFiltro.getTime();
        case 'La fecha es despues': return fechaValor.getTime() > fechaFiltro.getTime();
        default: return true;
      }
    });
    return f.operador === 'AND' ? resultados.every((r: boolean) => r) : resultados.some((r: boolean) => r);
  }

  aplicarFiltroAsignacion(equipo: ImpresoraLlamarDatos): boolean {
    const filtroValor = this.filtros.asignacion.valor;
    if (!filtroValor) return true;
    // Tratar undefined/null como false (disponible)
    const asignadoReal = equipo.asignado === true;
    return (filtroValor === 'true') === asignadoReal;
  }



  // ========== BUSCADOR GLOBAL ==========
  buscarImpresoras(): void {
    if (!this.terminoBusqueda.trim()) {
      this.aplicarFiltros();
      return;
    }
    let filtrados = this.impresoras.filter(imp => {
      return this.aplicarFiltroPropiedad(imp) &&
        this.aplicarFiltroTipo(imp) &&
        this.aplicarFiltroMarca(imp) &&
        this.aplicarFiltroModelo(imp) &&
        this.aplicarFiltroSerial(imp) &&
        this.aplicarFiltroPlaqueta(imp) &&
        this.aplicarFiltroTipoRecarga(imp) &&
        this.aplicarFiltroEstado(imp) &&
        this.aplicarFiltroFacturaCompra(imp) &&
        this.aplicarFiltroFechaCompra(imp);
    });
    this.impresorasFiltradas = filtrados.filter(imp => {
      const texto = `${imp.propiedad} ${imp.tipo?.descripcion || ''} ${imp.marca?.descripcion || ''} ${imp.modelo?.descripcion || ''} ${imp.serial} ${imp.plaqueta} ${imp.tipoRecarga || ''} ${imp.facturaCompra || ''}`.toLowerCase();
      return texto.includes(this.terminoBusqueda.toLowerCase());
    });
    this.paginaActual = 1;
    this.actualizarPaginacion();
    this.cerrarFiltro();
  }

  get busqueda(): boolean {
    return !!this.terminoBusqueda?.trim();
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.buscarImpresoras();
  }

  toggleSearch(): void {
    this.searchExpanded = !this.searchExpanded;
    if (!this.searchExpanded) {
      this.terminoBusqueda = '';
      this.buscarImpresoras();
    }
  }

  // ========== PAGINACION ==========
  actualizarPaginacion(): void {
    const total = this.impresorasFiltradas.length;
    if (total === 0) {
      this.impresorasPaginadas = [];
      this.totalPaginas = 1;
      this.paginaActual = 1;
      return;
    }
    if (this.registrosPorPagina >= total) {
      this.impresorasPaginadas = [...this.impresorasFiltradas];
      this.totalPaginas = 1;
      this.paginaActual = 1;
    } else {
      this.totalPaginas = Math.ceil(total / this.registrosPorPagina);
      if (this.paginaActual > this.totalPaginas) this.paginaActual = this.totalPaginas;
      if (this.paginaActual < 1) this.paginaActual = 1;
      const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
      this.impresorasPaginadas = this.impresorasFiltradas.slice(inicio, inicio + this.registrosPorPagina);
    }
  }

  cambiarRegistrosPorPagina(): void {
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }

  primeraPagina(): void {
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  ultimaPagina(): void {
    this.paginaActual = this.totalPaginas;
    this.actualizarPaginacion();
  }

  calcularHasta(): number {
    return Math.min(this.paginaActual * this.registrosPorPagina, this.impresorasFiltradas.length);
  }


  // ========== ESTADISTICAS ==========
  obtenerTotalImpresoras(): number {
    return this.impresoras.length;
  }

  obtenerImpresorasActivas(): number {
    return this.impresoras.filter(i => i.activo === true).length;
  }

  obtenerImpresorasInactivas(): number {
    return this.impresoras.filter(i => i.activo === false).length;
  }

  obtenerEquiposPorEstado(estado: string): number {
    return this.impresoras.filter(e => e.estado === estado).length;
  }


  obtenerTotalDisponibles(): number {
    return this.impresoras.filter(e => !e.asignado).length;
  }



  // DETALLES TARJETAS
  toggleDetalle(tipo: string): void {
    this.detalleVisible = this.detalleVisible === tipo ? null : tipo;
  }

  // Desglose por tipo (si quieres tarjetas)
  obtenerTotalPorTipo(tipo: string): number {
    return this.impresoras.filter(i => i.tipo?.descripcion === tipo).length;
  }

  obtenerActivosPorTipo(tipo: string): number {
    return this.impresoras.filter(i => i.tipo?.descripcion === tipo && i.activo === true).length;
  }

  obtenerInactivosPorTipo(tipo: string): number {
    return this.impresoras.filter(i => i.tipo?.descripcion === tipo && i.activo === false).length;
  }

  // Equipos NO asignados por tipo especifico
  obtenerDisponiblesPorTipo(tipo: string): number {
    return this.impresoras.filter(e =>
      e.tipo?.descripcion === tipo &&
      !e.asignado
    ).length;
  }







  // ========== UTILIDADES VISUALES ==========

  dividirModelo(texto: string): string[] {
    if (!texto) return ['', ''];
    const palabras = texto.split(' ');
    if (palabras.length === 2) return [palabras[0], palabras[1]];
    for (let i = 0; i < palabras.length; i++) {
      if (/\d/.test(palabras[i])) {
        const primera = palabras.slice(0, i).join(' ');
        const segunda = palabras.slice(i).join(' ');
        if (!primera) return [palabras[i], palabras.slice(i + 1).join(' ')];
        return [primera, segunda];
      }
    }
    const mitad = Math.ceil(palabras.length / 2);
    return [palabras.slice(0, mitad).join(' '), palabras.slice(mitad).join(' ')];
  }

  dividirTexto(texto: string): string[] {
    if (!texto) return ['', ''];
    const partes = texto.split(' ');
    if (partes.length <= 2) return [partes[0], partes.slice(1).join(' ')];
    const mitad = Math.ceil(partes.length / 3);
    return [partes.slice(0, mitad).join(' '), partes.slice(mitad).join(' ')];
  }

  getEstadoCorto(estado: string): string {
    const map: any = { 'BUEN ESTADO': 'OPTIMO', 'ESTADO REGULAR': 'REGULAR', 'ESTADO DEFICIENTE': 'DEFICIENTE', 'INOPERATIVO': 'INOPERABLE' };
    return map[estado] || estado;
  }

  obtenerEstadoColor(estado: string): string {
    const map: any = { 'BUEN ESTADO': '#b7f3b9', 'ESTADO REGULAR': '#4481f344', 'ESTADO DEFICIENTE': '#f0950d6c', 'INOPERATIVO': '#f443365d' };
    return map[estado] || '#e0e0e0';
  }

  obtenerColorTexto(estado: string): string {
    const map: any = { 'BUEN ESTADO': '#2e7d32', 'ESTADO REGULAR': '#1565c0', 'ESTADO DEFICIENTE': '#e65100', 'INOPERATIVO': '#c62828' };
    return map[estado] || '#424242';
  }

  // ========== METODOS AUXILIARES DE FILTROS (REGLAS) ==========

  agregarReglaTexto(columna: string): void {
    if (this.filtros[columna].reglas.length < 2)
      this.filtros[columna].reglas.push({ condicion: 'Contiene', valor: '' });
  }
  eliminarReglaTexto(columna: string, index: number): void {
    this.filtros[columna].reglas.splice(index, 1);
  }
  agregarReglaFecha(columna: string): void {
    if (this.filtros[columna].reglas.length < 2)
      this.filtros[columna].reglas.push({ condicion: 'La fecha es', valor: '' });
  }
  eliminarReglaFecha(columna: string, index: number): void {
    this.filtros[columna].reglas.splice(index, 1);
  }

  evaluarReglas(valor: string, reglas: any[], operador: string): boolean {
    const resultados = reglas.map(regla => {
      if (!regla.valor) return true;
      const filtroValor = regla.valor.toLowerCase();
      switch (regla.condicion) {
        case 'Empieza con': return valor.startsWith(filtroValor);
        case 'Contiene': return valor.includes(filtroValor);
        case 'No contiene': return !valor.includes(filtroValor);
        case 'Termina con': return valor.endsWith(filtroValor);
        case 'Iguales': return valor === filtroValor;
        case 'No es igual': return valor !== filtroValor;
        default: return true;
      }
    });
    return operador === 'AND' ? resultados.every(r => r) : resultados.some(r => r);
  }

  filtroTieneValor(columna: string): boolean {
    if (columna === 'estado') return !!this.filtros.estado.valor;
    if (columna === 'asignacion') return !!this.filtros.asignacion.valor;
    const f = this.filtros[columna];
    return f && f.reglas?.some((r: any) => r.valor?.trim());
  }

  hayFiltrosActivos(): boolean {
    const cols = ['tipo', 'marca', 'modelo', 'serial', 'plaqueta', 'tipoRecarga', 'facturaCompra', 'fechaCompra'];
    return cols.some(c => this.filtroTieneValor(c)) || !!this.filtros.estado.valor || !!this.filtros.asignacion.valor;
  }

  // ========== CIERRE DE FILTRO AL HACER CLICK FUERA ==========

  @HostListener('document:click', ['$event'])

  clickFueraDelFiltro(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const dentroFiltro = this.elementRef.nativeElement.querySelector('.filtro')?.contains(target);
    const enBoton = target.closest('th a');
    if (!dentroFiltro && !enBoton) this.cerrarFiltro();
  }





  // MODAL ASIGNAR IMPRESORA

  abrirModalAsignacion(impresora: ImpresoraLlamarDatos): void {
    const dialogRef = this.dialog.open(AsigImpresoraComponent, {
      width: '900px',
      data: { impresora, areas: this.areas }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.success) {
        if (result.devuelta) {
          // Si fue una devolución
          this.notificacionSnackbarService.success('Devolucion Realizada', 'Impresora devuelta correctamente');
        } else {
          // Si fue una asignación
          this.registrarAsignacionesService.asignar(result.data).subscribe({
            next: () => {
              this.notificacionSnackbarService.success('Asignacion Realizada', 'Impresora asignada correctamente');
              this.cargarImpresoras();
            },
            error: (err) => {
              this.notificacionSnackbarService.error('Error', err.error?.error || 'Error al asignar');
            }
          });
        }
        this.cargarImpresoras(); // Recargar lista
      }
    });

  }


}