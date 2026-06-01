import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { DispositivoMovilLlamarDatos } from './../../../arquitectura/interface/LlamarDatos/DispositivoMovilRespuesta.interface';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';
import { ConsultarDispositivoService } from './../../../arquitectura/servicio/consulta/ConsultarDispositivo.service';
import { A11yModule } from "@angular/cdk/a11y";

@Component({
  selector: 'app-dispositivos',
  imports: [CommonModule, FormsModule, MatIconModule, A11yModule],
  templateUrl: './dispositivos.component.html',
  styleUrl: './dispositivos.component.css'
})
export class DispositivosComponent implements OnInit {

  // PROPIEDADES
  dispositivos: DispositivoMovilLlamarDatos[] = [];
  dispositivosFiltrados: DispositivoMovilLlamarDatos[] = [];
  dispositivosPaginados: DispositivoMovilLlamarDatos[] = [];
  filtroActivo: string | null = null;
  detalleVisible: string | null = null;
  terminoBusqueda: string = '';
  searchExpanded: boolean = false;

  // PAGINACION
  registrosPorPagina: number = 10;
  paginaActual: number = 1;
  totalPaginas: number = 1;

  constructor(
    private consultarDispositivoService: ConsultarDispositivoService,
    private notificacionSnackbarService: NotificacionSnackbarService,
    private elementRef: ElementRef //CERRAR FILTRO AL DAR CLIC AFUERA
  ) { }

  ngOnInit(): void {
    this.cargarDispositivos();
  }

  cargarDispositivos(): void {
    this.consultarDispositivoService.listarDispositivos().subscribe({
      next: (data) => {
        this.dispositivos = data;
        this.dispositivosFiltrados = [...data];
        this.actualizarPaginacion();
      },
      error: (err) => {
        console.error('Error al cargar dispositivos:', err);
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar los dispositivos');
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
    imei1: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    imei2: {
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
    almacenamiento: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    pulgadas: {
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
    let dispositivosFiltradosPorColumnas = this.dispositivos.filter(dispositivo => {
      return this.aplicarFiltroTipo(dispositivo) &&
        this.aplicarFiltroMarca(dispositivo) &&
        this.aplicarFiltroModelo(dispositivo) &&
        this.aplicarFiltroSerial(dispositivo) &&
        this.aplicarFiltroImei1(dispositivo) &&
        this.aplicarFiltroImei2(dispositivo) &&
        this.aplicarFiltroEstado(dispositivo) &&
        this.aplicarFiltroProcesador(dispositivo) &&
        this.aplicarFiltroRam(dispositivo) &&
        this.aplicarFiltroAlmacenamiento(dispositivo) &&
        this.aplicarFiltroPulgadas(dispositivo) &&
        this.aplicarFiltroSO(dispositivo) &&
        this.aplicarFiltroFacturaCompra(dispositivo) &&
        this.aplicarFiltroFechaCompra(dispositivo);
    });

    if (this.terminoBusqueda && this.terminoBusqueda.trim() !== '') {
      this.dispositivosFiltrados = dispositivosFiltradosPorColumnas.filter(dispositivo => {
        const textoBusqueda = `${dispositivo.tipo?.descripcion || ''} ${dispositivo.marca?.descripcion || ''} ${dispositivo.modelo?.descripcion || ''} ${dispositivo.serial} ${dispositivo.imei1} ${dispositivo.imei2} ${dispositivo.procesador} ${dispositivo.ram} ${dispositivo.almacenamiento} ${dispositivo.pulgadas} ${dispositivo.sistemaOperativo?.descripcion || ''} ${dispositivo.facturaCompra || ''}`.toLowerCase();
        return textoBusqueda.includes(this.terminoBusqueda.toLowerCase());
      });
    } else {
      this.dispositivosFiltrados = dispositivosFiltradosPorColumnas;
    }

    const hayFiltrosActivos = this.hayFiltrosActivos() || (this.terminoBusqueda && this.terminoBusqueda.trim() !== '');
    if (hayFiltrosActivos) {
      this.paginaActual = 1;
    }
    const totalPaginasCalculadas = Math.ceil(this.dispositivosFiltrados.length / this.registrosPorPagina);
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
    this.filtros.imei1.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.imei1.operador = 'AND';
    this.filtros.imei2.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.imei2.operador = 'AND';
    this.filtros.estado.valor = '';
    this.filtros.procesador.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.procesador.operador = 'AND';
    this.filtros.ram.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.ram.operador = 'AND';
    this.filtros.almacenamiento.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.almacenamiento.operador = 'AND';
    this.filtros.pulgadas.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.pulgadas.operador = 'AND';
    this.filtros.sistemaOperativo.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.sistemaOperativo.operador = 'AND';
    this.filtros.facturaCompra.reglas = [{ condicion: 'Contiene', valor: '' }];
    this.filtros.facturaCompra.operador = 'AND';
    this.filtros.fechaCompra.reglas = [{ condicion: 'La fecha es', valor: '' }];
    this.filtros.fechaCompra.operador = 'AND';
    this.terminoBusqueda = '';
    this.paginaActual = 1;
    this.registrosPorPagina = 10;
    this.aplicarFiltros();
  }


  // Métodos de filtro
  aplicarFiltroTipo(dispositivo: DispositivoMovilLlamarDatos): boolean {
    const filtro = this.filtros.tipo;
    const valor = dispositivo.tipo?.descripcion?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroMarca(dispositivo: DispositivoMovilLlamarDatos): boolean {
    const filtro = this.filtros.marca;
    const valor = dispositivo.marca?.descripcion?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroModelo(dispositivo: DispositivoMovilLlamarDatos): boolean {
    const filtro = this.filtros.modelo;
    const valor = dispositivo.modelo?.descripcion?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroSerial(dispositivo: DispositivoMovilLlamarDatos): boolean {
    const filtro = this.filtros.serial;
    const valor = dispositivo.serial?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroImei1(dispositivo: DispositivoMovilLlamarDatos): boolean {
    const filtro = this.filtros.imei1;
    const valor = dispositivo.imei1?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroImei2(dispositivo: DispositivoMovilLlamarDatos): boolean {
    const filtro = this.filtros.imei2;
    const valor = dispositivo.imei2?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroEstado(dispositivo: DispositivoMovilLlamarDatos): boolean {
    const filtroValor = this.filtros.estado.valor;
    if (!filtroValor) return true;
    return dispositivo.estado === filtroValor;
  }

  aplicarFiltroProcesador(dispositivo: DispositivoMovilLlamarDatos): boolean {
    const filtro = this.filtros.procesador;
    const valor = dispositivo.procesador?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroRam(dispositivo: DispositivoMovilLlamarDatos): boolean {
    const filtro = this.filtros.ram;
    const valor = dispositivo.ram?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroAlmacenamiento(dispositivo: DispositivoMovilLlamarDatos): boolean {
    const filtro = this.filtros.almacenamiento;
    const valor = dispositivo.almacenamiento?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroPulgadas(dispositivo: DispositivoMovilLlamarDatos): boolean {
    const filtro = this.filtros.pulgadas;
    const valor = dispositivo.pulgadas?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroSO(dispositivo: DispositivoMovilLlamarDatos): boolean {
    const filtro = this.filtros.sistemaOperativo;
    const valor = `${dispositivo.sistemaOperativo?.descripcion || ''} ${dispositivo.versionSO?.descripcion || ''}`.toLowerCase();
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroFacturaCompra(dispositivo: DispositivoMovilLlamarDatos): boolean {
    const filtro = this.filtros.facturaCompra;
    const valor = dispositivo.facturaCompra?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  aplicarFiltroFechaCompra(dispositivo: DispositivoMovilLlamarDatos): boolean {
    const filtro = this.filtros.fechaCompra;
    const hayFiltroActivo = filtro.reglas.some((regla: any) =>
      regla.valor !== '' && regla.valor !== null && regla.valor !== undefined
    );
    if (!hayFiltroActivo) return true;

    const resultados = filtro.reglas.map((regla: any) => {
      if (!regla.valor) return true;

      if (!regla.condicion.includes('fecha')) {
        const textoFactura = dispositivo.facturaCompra?.toLowerCase() || '';
        const filtroValor = regla.valor.toString().toLowerCase();
        switch (regla.condicion) {
          case 'Contiene': return textoFactura.includes(filtroValor);
          case 'Empieza con': return textoFactura.startsWith(filtroValor);
          case 'Termina con': return textoFactura.endsWith(filtroValor);
          case 'Iguales': return textoFactura === filtroValor;
          default: return true;
        }
      }

      const valorFecha = dispositivo.fechaCompra;
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

    return filtro.operador === 'AND' ? resultados.every((r: boolean) => r === true) : resultados.some((r: boolean) => r === true);
  }



  // BUSCADOR
  buscarDispositivos(): void {
    if (this.terminoBusqueda.trim() === '') {
      this.aplicarFiltros();
    } else {
      let dispositivosFiltradosPorFiltros = this.dispositivos.filter(dispositivo => {
        return this.aplicarFiltroTipo(dispositivo) &&
          this.aplicarFiltroMarca(dispositivo) &&
          this.aplicarFiltroModelo(dispositivo) &&
          this.aplicarFiltroSerial(dispositivo) &&
          this.aplicarFiltroImei1(dispositivo) &&
          this.aplicarFiltroImei2(dispositivo) &&
          this.aplicarFiltroEstado(dispositivo) &&
          this.aplicarFiltroProcesador(dispositivo) &&
          this.aplicarFiltroRam(dispositivo) &&
          this.aplicarFiltroAlmacenamiento(dispositivo) &&
          this.aplicarFiltroPulgadas(dispositivo) &&
          this.aplicarFiltroSO(dispositivo) &&
          this.aplicarFiltroFacturaCompra(dispositivo) &&
          this.aplicarFiltroFechaCompra(dispositivo);
      });

      this.dispositivosFiltrados = dispositivosFiltradosPorFiltros.filter(dispositivo => {
        const textoBusqueda = `${dispositivo.tipo?.descripcion || ''} ${dispositivo.marca?.descripcion || ''} ${dispositivo.modelo?.descripcion || ''} ${dispositivo.serial} ${dispositivo.imei1} ${dispositivo.imei2} ${dispositivo.procesador} ${dispositivo.ram} ${dispositivo.almacenamiento} ${dispositivo.pulgadas} ${dispositivo.sistemaOperativo?.descripcion || ''} ${dispositivo.facturaCompra || ''}`.toLowerCase();
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
    this.buscarDispositivos();
  }


  toggleSearch(): void {
    this.searchExpanded = !this.searchExpanded;
    if (!this.searchExpanded) {
      this.terminoBusqueda = '';
      this.buscarDispositivos();
    }
  }


  // PAGINACION
  actualizarPaginacion(): void {
    if (this.dispositivosFiltrados.length === 0) {
      this.dispositivosPaginados = [];
      this.totalPaginas = 1;
      this.paginaActual = 1;
      return;
    }
    if (this.registrosPorPagina >= this.dispositivosFiltrados.length) {
      this.dispositivosPaginados = [...this.dispositivosFiltrados];
      this.totalPaginas = 1;
      this.paginaActual = 1;
    } else {
      this.totalPaginas = Math.ceil(this.dispositivosFiltrados.length / this.registrosPorPagina);
      if (this.paginaActual > this.totalPaginas) this.paginaActual = this.totalPaginas;
      if (this.paginaActual < 1) this.paginaActual = 1;
      const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
      const fin = inicio + this.registrosPorPagina;
      this.dispositivosPaginados = this.dispositivosFiltrados.slice(inicio, fin);
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
    return Math.min(this.paginaActual * this.registrosPorPagina, this.dispositivosFiltrados.length);
  }


  // ESTADISTICAS
  obtenerTotalDispositivos(): number {
    return this.dispositivos.length;
  }

  obtenerDispositivosActivos(): number {
    return this.dispositivos.filter(d => d.activo === true).length;
  }

  obtenerDispositivosInactivos(): number {
    return this.dispositivos.filter(d => d.activo === false).length;
  }

  obtenerDispositivosPorEstado(estado: string): number {
    return this.dispositivos.filter(d => d.estado === estado).length;
  }

  // DETALLES TARJETAS
  toggleDetalle(tipo: string): void {
    this.detalleVisible = this.detalleVisible === tipo ? null : tipo;
  }

  obtenerTotalPorTipo(tipo: string): number {
    return this.dispositivos.filter(d => d.tipo?.descripcion === tipo).length;
  }

  obtenerActivosPorTipo(tipo: string): number {
    return this.dispositivos.filter(d => d.tipo?.descripcion === tipo && d.activo === true).length;
  }

  obtenerInactivosPorTipo(tipo: string): number {
    return this.dispositivos.filter(d => d.tipo?.descripcion === tipo && d.activo === false).length;
  }

  obtenerDisponiblesPorTipo(tipo: string): number {
    return this.dispositivos.filter(d => d.tipo?.descripcion === tipo && d.estado === 'DISPONIBLE').length;
  }

  // UTILIDADES
  dividirModelo(texto: string): string[] {
    if (!texto) return ['', ''];
    const palabras = texto.split(' ');
    if (palabras.length === 2) {
      return [palabras[0], palabras[1]];
    }
    for (let i = 0; i < palabras.length; i++) {
      const palabra = palabras[i];
      if (/\d/.test(palabra)) {
        const primeraLinea = palabras.slice(0, i).join(' ');
        const segundaLinea = palabras.slice(i).join(' ');
        if (primeraLinea === '') {
          return [palabra, palabras.slice(i + 1).join(' ')];
        }
        return [primeraLinea, segundaLinea];
      }
    }
    const mitad = Math.ceil(palabras.length / 2);
    const primeraLinea = palabras.slice(0, mitad).join(' ');
    const segundaLinea = palabras.slice(mitad).join(' ');
    return [primeraLinea, segundaLinea];
  }

  dividirProcesador(texto: string): string[] {
    if (!texto) return ['', ''];
    const palabras = texto.split(' ');
    if (palabras.length <= 1) {
      return [texto, ''];
    }
    const primerasTres = palabras.slice(0, 1).join(' ');
    const resto = palabras.slice(1).join(' ');
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

  formatearGB(valor: string): string {
    if (!valor) return '';
    // Eliminar espacios entre número y unidad
    return valor.replace(/\s+/g, '');
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

  // FILTROS TABLA REGLAS
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
    const columnasTexto = ['tipo', 'marca', 'modelo', 'serial', 'imei1', 'imei2', 'procesador', 'ram', 'almacenamiento', 'pulgadas', 'sistemaOperativo', 'fechaCompra'];
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
