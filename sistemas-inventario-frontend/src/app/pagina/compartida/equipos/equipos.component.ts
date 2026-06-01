import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { EquipoDeComputoLlamarDatos } from './../../../arquitectura/interface/LlamarDatos/EquipoDeComputoRespuesta.interface';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';
import { ConsultarEquipoService } from '../../../arquitectura/servicio/consulta/ConsultarEquipo.service';
import { A11yModule } from "@angular/cdk/a11y";


@Component({
  selector: 'app-equipos',
  imports: [CommonModule, FormsModule, MatIconModule, A11yModule],
  templateUrl: './equipos.component.html',
  styleUrl: './equipos.component.css'
})


export class EquiposComponent implements OnInit {

  // PROPIEDADES
  equipos: EquipoDeComputoLlamarDatos[] = [];
  equiposFiltrados: EquipoDeComputoLlamarDatos[] = [];
  equiposPaginados: EquipoDeComputoLlamarDatos[] = [];
  filtroActivo: string | null = null;
  detalleVisible: string | null = null;
  terminoBusqueda: string = '';
  searchExpanded: boolean = false;

  // PAGINACION
  registrosPorPagina: number = 10;
  paginaActual: number = 1;
  totalPaginas: number = 1;


  constructor(
    private consultarEquipoService: ConsultarEquipoService,
    private notificacionSnackbarService: NotificacionSnackbarService,
    private elementRef: ElementRef //CERRAR FILTRO AL DAR CLIC AFUERA
  ) { }

  ngOnInit(): void {
    this.cargarEquipos();
  }

  cargarEquipos(): void {
    this.consultarEquipoService.listarEquipos().subscribe({
      next: (data) => {
        this.equipos = data;
        this.equiposFiltrados = [...data];
        this.actualizarPaginacion();
      },
      error: (err) => {
        console.error('Error al cargar equipos:', err);
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar los equipos');
      }
    });
  }

  // ========== FILTROS ==========

  filtros: any = {
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
    estado: {
      valor: ''
    },
    procesador: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    ram: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    disco: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    sistemaOperativo: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    facturaCompra: {
      operador: 'AND',
      reglas: [{ condicion: 'Contiene', valor: '' }]
    },
    fechaCompra: {
      operador: 'AND',
      reglas: [{ condicion: 'La fecha es', valor: '' }]
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
    let equiposFiltradosPorColumnas = this.equipos.filter(equipo => {
      return this.aplicarFiltroTipo(equipo) &&
        this.aplicarFiltroMarca(equipo) &&
        this.aplicarFiltroModelo(equipo) &&
        this.aplicarFiltroSerial(equipo) &&
        this.aplicarFiltroPlaqueta(equipo) &&
        this.aplicarFiltroEstado(equipo) &&
        this.aplicarFiltroProcesador(equipo) &&
        this.aplicarFiltroRam(equipo) &&
        this.aplicarFiltroDisco(equipo) &&
        this.aplicarFiltroSO(equipo) &&
        this.aplicarFiltroFacturaCompra(equipo) &&
        this.aplicarFiltroFechaCompra(equipo);
    });
    if (this.terminoBusqueda && this.terminoBusqueda.trim() !== '') {
      this.equiposFiltrados = equiposFiltradosPorColumnas.filter(equipo => {
        const textoBusqueda = `${equipo.tipo?.descripcion || ''} ${equipo.marca?.descripcion || ''} ${equipo.modelo?.descripcion || ''} ${equipo.serial} ${equipo.plaqueta} ${equipo.procesador} ${equipo.ram} ${equipo.disco} ${equipo.sistemaOperativo?.descripcion || ''}`.toLowerCase();
        return textoBusqueda.includes(this.terminoBusqueda.toLowerCase());
      });
    } else {
      this.equiposFiltrados = equiposFiltradosPorColumnas;
    }
    const hayFiltrosActivos = this.hayFiltrosActivos() || (this.terminoBusqueda && this.terminoBusqueda.trim() !== '');
    if (hayFiltrosActivos) {
      this.paginaActual = 1;
    }
    const totalPaginasCalculadas = Math.ceil(this.equiposFiltrados.length / this.registrosPorPagina);
    if (this.paginaActual > totalPaginasCalculadas && totalPaginasCalculadas > 0) {
      this.paginaActual = totalPaginasCalculadas;
    }
    this.actualizarPaginacion();
    this.cerrarFiltro();
  }


  limpiarFiltro(columna: string): void {
    if (columna === 'estado') {
      this.filtros.estado.valor = '';
    } else {
      this.filtros[columna].reglas = [{ condicion: 'Empieza con', valor: '' }];
      this.filtros[columna].operador = 'AND';
    }
    this.aplicarFiltros();
    this.cerrarFiltro();
  }


  limpiarTodosLosFiltros(): void {
    this.filtros.tipo.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.tipo.operador = 'AND';
    this.filtros.marca.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.marca.operador = 'AND';
    this.filtros.modelo.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.modelo.operador = 'AND';
    this.filtros.serial.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.serial.operador = 'AND';
    this.filtros.plaqueta.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.plaqueta.operador = 'AND';
    this.filtros.estado.valor = '';
    this.filtros.procesador.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.procesador.operador = 'AND';
    this.filtros.ram.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.ram.operador = 'AND';
    this.filtros.disco.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.disco.operador = 'AND';
    this.filtros.sistemaOperativo.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.sistemaOperativo.operador = 'AND';
    this.filtros.fechaCompra.reglas = [{ condicion: 'La fecha es', valor: '' }];
    this.filtros.fechaCompra.operador = 'AND';
    this.terminoBusqueda = '';
    this.paginaActual = 1;
    this.registrosPorPagina = 10;
    this.aplicarFiltros();
  }


  // Métodos de filtro
  aplicarFiltroTipo(equipo: EquipoDeComputoLlamarDatos): boolean {
    const filtro = this.filtros.tipo;
    const valor = equipo.tipo?.descripcion?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroMarca(equipo: EquipoDeComputoLlamarDatos): boolean {
    const filtro = this.filtros.marca;
    const valor = equipo.marca?.descripcion?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroModelo(equipo: EquipoDeComputoLlamarDatos): boolean {
    const filtro = this.filtros.modelo;
    const valor = equipo.modelo?.descripcion?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroSerial(equipo: EquipoDeComputoLlamarDatos): boolean {
    const filtro = this.filtros.serial;
    const valor = equipo.serial?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroPlaqueta(equipo: EquipoDeComputoLlamarDatos): boolean {
    const filtro = this.filtros.plaqueta;
    const valor = equipo.plaqueta?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroEstado(equipo: EquipoDeComputoLlamarDatos): boolean {
    const filtroValor = this.filtros.estado.valor;
    if (!filtroValor) return true;
    return equipo.estado === filtroValor;
  }

  aplicarFiltroProcesador(equipo: EquipoDeComputoLlamarDatos): boolean {
    const filtro = this.filtros.procesador;
    const valor = equipo.procesador?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroRam(equipo: EquipoDeComputoLlamarDatos): boolean {
    const filtro = this.filtros.ram;
    const valor = `${equipo.ram} ${equipo.tipoRam}`.toLowerCase();
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroDisco(equipo: EquipoDeComputoLlamarDatos): boolean {
    const filtro = this.filtros.disco;
    const valor = `${equipo.disco} ${equipo.tipoDisco}`.toLowerCase();
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroSO(equipo: EquipoDeComputoLlamarDatos): boolean {
    const filtro = this.filtros.sistemaOperativo;
    const valor = `${equipo.sistemaOperativo?.descripcion || ''} ${equipo.versionSO?.descripcion || ''}`.toLowerCase();
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroFacturaCompra(equipo: EquipoDeComputoLlamarDatos): boolean {
    const filtro = this.filtros.facturaCompra;
    const valor = equipo.facturaCompra?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroFechaCompra(equipo: EquipoDeComputoLlamarDatos): boolean {
    const filtro = this.filtros.fechaCompra;
    // Verificar si hay alguna regla con valor (ya sea fecha o texto)
    const hayFiltroActivo = filtro.reglas.some((regla: any) =>
      regla.valor !== '' && regla.valor !== null && regla.valor !== undefined
    );
    if (!hayFiltroActivo) return true;
    // Evaluar cada regla
    const resultados = filtro.reglas.map((regla: any) => {
      if (!regla.valor) return true;
      // Si la condición es de texto (buscar en factura)
      if (!regla.condicion.includes('fecha')) {
        const textoFactura = equipo.facturaCompra?.toLowerCase() || '';
        const filtroValor = regla.valor.toString().toLowerCase();
        switch (regla.condicion) {
          case 'Contiene': return textoFactura.includes(filtroValor);
          case 'Empieza con': return textoFactura.startsWith(filtroValor);
          case 'Termina con': return textoFactura.endsWith(filtroValor);
          case 'Iguales': return textoFactura === filtroValor;
          default: return true;
        }
      }
      // Si es condición de fecha
      const valorFecha = equipo.fechaCompra;
      if (!valorFecha) return false;
      const fechaValor = new Date(valorFecha);
      fechaValor.setHours(0, 0, 0, 0);
      const fechaFiltro = new Date(regla.valor);
      fechaFiltro.setHours(0, 0, 0, 0);
      switch (regla.condicion) {
        case 'La fecha es': return fechaValor.getTime() === fechaFiltro.getTime();
        case 'La fecha no es': return fechaValor.getTime() !== fechaFiltro.getTime();
        case 'La fecha es anterior': return fechaValor.getTime() < fechaFiltro.getTime();
        case 'La fecha es despues': return fechaValor.getTime() > fechaFiltro.getTime();
        default: return true;
      }
    });
    // Aplicar operador (AND/OR) - Corregido: agregar tipo boolean a los parámetros
    if (filtro.operador === 'AND') {
      return resultados.every((r: boolean) => r === true);
    } else {
      return resultados.some((r: boolean) => r === true);
    }
  }



  // BUSCADOR

  buscarEquipos(): void {
    if (this.terminoBusqueda.trim() === '') {
      this.aplicarFiltros();
    } else {
      let equiposFiltradosPorFiltros = this.equipos.filter(equipo => {
        return this.aplicarFiltroTipo(equipo) &&
          this.aplicarFiltroMarca(equipo) &&
          this.aplicarFiltroModelo(equipo) &&
          this.aplicarFiltroSerial(equipo) &&
          this.aplicarFiltroPlaqueta(equipo) &&
          this.aplicarFiltroEstado(equipo) &&
          this.aplicarFiltroProcesador(equipo) &&
          this.aplicarFiltroRam(equipo) &&
          this.aplicarFiltroDisco(equipo) &&
          this.aplicarFiltroSO(equipo) &&
          this.aplicarFiltroFacturaCompra(equipo) &&
          this.aplicarFiltroFechaCompra(equipo);
      });
      this.equiposFiltrados = equiposFiltradosPorFiltros.filter(equipo => {
        const textoBusqueda = `${equipo.tipo?.descripcion || ''} ${equipo.marca?.descripcion || ''} ${equipo.modelo?.descripcion || ''} ${equipo.serial} ${equipo.plaqueta} ${equipo.procesador} ${equipo.ram} ${equipo.disco} ${equipo.sistemaOperativo?.descripcion || ''} ${equipo.facturaCompra || ''}`.toLowerCase();
        return textoBusqueda.includes(this.terminoBusqueda.toLowerCase());
      });
      this.paginaActual = 1;
      this.actualizarPaginacion();
      this.cerrarFiltro();
    }
  }


  get busqueda(): boolean {
    return this.terminoBusqueda !== '' && this.terminoBusqueda !== null;
  }


  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.buscarEquipos();
  }


  toggleSearch(): void {
    this.searchExpanded = !this.searchExpanded;
    if (!this.searchExpanded) {
      this.terminoBusqueda = '';
      this.buscarEquipos();
    }
  }


  // PAGINACION


  actualizarPaginacion(): void {
    if (this.equiposFiltrados.length === 0) {
      this.equiposPaginados = [];
      this.totalPaginas = 1;
      this.paginaActual = 1;
      return;
    }
    if (this.registrosPorPagina >= this.equiposFiltrados.length) {
      this.equiposPaginados = [...this.equiposFiltrados];
      this.totalPaginas = 1;
      this.paginaActual = 1;
    } else {
      this.totalPaginas = Math.ceil(this.equiposFiltrados.length / this.registrosPorPagina);
      if (this.paginaActual > this.totalPaginas) this.paginaActual = this.totalPaginas;
      if (this.paginaActual < 1) this.paginaActual = 1;
      const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
      const fin = inicio + this.registrosPorPagina;
      this.equiposPaginados = this.equiposFiltrados.slice(inicio, fin);
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
    return Math.min(this.paginaActual * this.registrosPorPagina, this.equiposFiltrados.length);
  }



  // ESTADISTICAS


  obtenerTotalEquipos(): number {
    return this.equipos.length;
  }

  obtenerEquiposActivos(): number {
    return this.equipos.filter(e => e.activo === true).length;
  }

  obtenerEquiposInactivos(): number {
    return this.equipos.filter(e => e.activo === false).length;
  }

  obtenerEquiposPorEstado(estado: string): number {
    return this.equipos.filter(e => e.estado === estado).length;
  }



  // DETALLES TARJETAS


  toggleDetalle(tipo: string): void {
    this.detalleVisible = this.detalleVisible === tipo ? null : tipo;
  }


  // Totales por tipo
  obtenerTotalPorTipo(tipo: string): number {
    return this.equipos.filter(e => e.tipo?.descripcion === tipo).length;
  }


  // Activos por tipo
  obtenerActivosPorTipo(tipo: string): number {
    return this.equipos.filter(e => e.tipo?.descripcion === tipo && e.activo === true).length;
  }


  // Inactivos por tipo
  obtenerInactivosPorTipo(tipo: string): number {
    return this.equipos.filter(e => e.tipo?.descripcion === tipo && e.activo === false).length;
  }


  // Disponibles por tipo
  obtenerDisponiblesPorTipo(tipo: string): number {
    return this.equipos.filter(e => e.tipo?.descripcion === tipo && e.estado === 'DISPONIBLE').length;
  }



  // UTILIDADES


  dividirModelo(texto: string): string[] {
    if (!texto) return ['', ''];
    const palabras = texto.split(' ');
    // Si tiene exactamente 2 palabras, poner cada una en una línea
    if (palabras.length === 2) {
      return [palabras[0], palabras[1]];
    }
    // Buscar la primera palabra que contenga un número
    for (let i = 0; i < palabras.length; i++) {
      const palabra = palabras[i];
      // Si la palabra contiene un número
      if (/\d/.test(palabra)) {
        // Cortar ANTES de esa palabra
        const primeraLinea = palabras.slice(0, i).join(' ');
        const segundaLinea = palabras.slice(i).join(' ');
        // Si la primera línea está vacía, poner la palabra con número en la primera línea
        if (primeraLinea === '') {
          return [palabra, palabras.slice(i + 1).join(' ')];
        }
        return [primeraLinea, segundaLinea];
      }
    }
    // Si no hay palabra con número y tiene más de 2 palabras, dividir por la mitad
    const mitad = Math.ceil(palabras.length / 2);
    const primeraLinea = palabras.slice(0, mitad).join(' ');
    const segundaLinea = palabras.slice(mitad).join(' ');
    return [primeraLinea, segundaLinea];
  }


  dividirProcesador(texto: string): string[] {
    if (!texto) return ['', ''];
    const palabras = texto.split(' ');
    if (palabras.length <= 3) {
      return [texto, ''];
    }
    const primerasTres = palabras.slice(0, 3).join(' ');
    const resto = palabras.slice(3).join(' ');
    return [primerasTres, resto];
  }


  getEstadoCorto(estado: string): string {
    const estados: { [key: string]: string } = {
      'BUEN ESTADO': 'OPTIMO',
      'ESTADO REGULAR': 'REGULAR',
      'ESTADO DEFICIENTE': 'DEFICIENTE',
      'INOPERATIVO': 'INOPERABLE'
    };
    return estados[estado] || estado;
  }


  obtenerEstadoColor(estado: string): string {
    const colores: { [key: string]: string } = {
      'BUEN ESTADO': '#b7f3b9',
      'ESTADO REGULAR': '#4481f344',
      'ESTADO DEFICIENTE': '#f0950d6c',
      'INOPERATIVO': '#f443365d',
    };
    return colores[estado] || '#9e9e9e';
  }


  obtenerColorTexto(estado: string): string {
    const colores: { [key: string]: string } = {
      'BUEN ESTADO': '#35da3b',
      'ESTADO REGULAR': '#1693f8',
      'ESTADO DEFICIENTE': '#c07504',
      'INOPERATIVO': '#c5170b',
    };
    return colores[estado] || '#6c757d';
  }



  // EVENTOS


  @HostListener('document:click', ['$event'])
  clickFueraDelFiltro(event: MouseEvent): void {
    const elementoClickeado = event.target as HTMLElement;
    const clicDentroFiltro = this.elementRef.nativeElement
      .querySelector('.filtro')
      ?.contains(elementoClickeado);
    const clicEnBotonFiltro = elementoClickeado.closest('th a');
    if (!clicDentroFiltro && !clicEnBotonFiltro) {
      this.cerrarFiltro();
    }
  }



  // FRILTROS TABLA REGLAS


  agregarReglaTexto(columna: string): void {
    if (this.filtros[columna].reglas.length >= 2) return;
    this.filtros[columna].reglas.push({
      condicion: 'Contiene',
      valor: ''
    });
  }


  eliminarReglaTexto(columna: string, index: number): void {
    this.filtros[columna].reglas.splice(index, 1);
  }


  agregarReglaFecha(columna: string): void {
    if (this.filtros[columna].reglas.length >= 2) return;
    this.filtros[columna].reglas.push({
      condicion: 'La fecha es',
      valor: ''
    });
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
    return operador === 'AND' ? resultados.every(r => r === true) : resultados.some(r => r === true);
  }


  evaluarReglasFecha(valor: string, reglas: any[], operador: string): boolean {
    const fechaValor = new Date(valor);
    fechaValor.setHours(0, 0, 0, 0);
    const resultados = reglas.map(regla => {
      if (!regla.valor) return true;
      const fechaFiltro = new Date(regla.valor);
      fechaFiltro.setHours(0, 0, 0, 0);
      switch (regla.condicion) {
        case 'La fecha es': return fechaValor.getTime() === fechaFiltro.getTime();
        case 'La fecha no es': return fechaValor.getTime() !== fechaFiltro.getTime();
        case 'La fecha es anterior': return fechaValor.getTime() < fechaFiltro.getTime();
        case 'La fecha es despues': return fechaValor.getTime() > fechaFiltro.getTime();
        default: return true;
      }
    });
    return operador === 'AND' ? resultados.every(r => r === true) : resultados.some(r => r === true);
  }


  filtroTieneValor(columna: string): boolean {
    if (columna === 'estado') {
      return this.filtros.estado.valor !== '' && this.filtros.estado.valor !== null;
    } else {
      const filtro = this.filtros[columna];
      if (filtro && filtro.reglas && Array.isArray(filtro.reglas)) {
        return filtro.reglas.some((regla: any) =>
          regla.valor !== '' && regla.valor !== null && regla.valor !== undefined
        );
      }
      return false;
    }
  }


  hayFiltrosActivos(): boolean {
    const columnasTexto = ['tipo', 'marca', 'modelo', 'serial', 'plaqueta', 'procesador', 'ram', 'disco', 'sistemaOperativo', 'fechaCompra'];
    for (const columna of columnasTexto) {
      const filtro = this.filtros[columna];
      if (filtro && filtro.reglas && Array.isArray(filtro.reglas)) {
        const tieneValor = filtro.reglas.some((regla: any) =>
          regla.valor !== '' && regla.valor !== null && regla.valor !== undefined
        );
        if (tieneValor) return true;
      }
    }
    if (this.filtros.estado.valor !== '' && this.filtros.estado.valor !== null) return true;
    return false;
  }


}

