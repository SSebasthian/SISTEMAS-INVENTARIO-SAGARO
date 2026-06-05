import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon'
import { AreaLlamarDatos } from './../../../arquitectura/interface/LlamarDatos/AreaRespuesta.interface';
import { CargoLlamarDatos } from './../../../arquitectura/interface/LlamarDatos/CargoRespuesta.interface';
import { EmpleadoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/EmpleadoRespuesta.interface';
import { AsignacionPorEmpleado } from '../../../arquitectura/interface/LlamarDatos/AsignacionPorEmpleado.interface';
import { ConsultarAsignacionesService } from '../../../arquitectura/servicio/consulta/ConsultarAsignaciones.service';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';
import { ConsultarEmpleadoService } from '../../../arquitectura/servicio/consulta/ConsultarEmpleado.service';
import { A11yModule } from "@angular/cdk/a11y";
import { forkJoin } from 'rxjs';



@Component({
  selector: 'app-empleados',
  imports: [CommonModule, FormsModule, MatIconModule, A11yModule],

  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.css'
})

export class EmpleadosComponent implements OnInit {

  areas: AreaLlamarDatos[] = [];
  areaSeleccionada!: number;
  cargos: CargoLlamarDatos[] = [];
  cargoSeleccionado!: number;
  empleados: EmpleadoLlamarDatos[] = [];
  empleadosFiltrados: EmpleadoLlamarDatos[] = [];
  asignacionesPorEmpleado: Map<string, AsignacionPorEmpleado[]> = new Map();
  filtroActivo: string | null = null;
  terminoBusqueda: string = '';
  searchExpanded: boolean = false;

  // Propiedades para paginación
  registrosPorPagina: number = 10;
  paginaActual: number = 1;
  totalPaginas: number = 1;
  empleadosPaginados: EmpleadoLlamarDatos[] = [];

  constructor(
    private consultarEmpleadoService: ConsultarEmpleadoService,
    private notificacionSnackbarService: NotificacionSnackbarService,
    private consultarAsignacionesService: ConsultarAsignacionesService,
    private elementRef: ElementRef //CERRAR FILTRO AL DAR CLIC AFUERA
  ) { }

  ngOnInit(): void {
    this.cargarEmpleados();
  }


  cargarEmpleados(): void {
    this.consultarEmpleadoService.listarEmpleados().subscribe({
      next: (data) => {
        console.log('Empleados cargados:', data.length);
        this.empleados = data;
        this.empleadosFiltrados = [...data];
        this.actualizarPaginacion();

        // Ahora que los empleados están cargados, carga las asignaciones
        this.cargarAsignacionesParaEmpleados();
      },
      error: (err) => {
        console.error('Error al cargar empleados:', err);
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar los empleados');
      }
    });
  }

  cargarAsignacionesParaEmpleados(): void {
    if (!this.empleados || this.empleados.length === 0) {
      console.log('No hay empleados para cargar asignaciones');
      return;
    }

    // Crear un array de observables para cada empleado
    const observables = this.empleados.map(empleado =>
      this.consultarAsignacionesService.obtenerAsignacionesPorEmpleado(empleado.cedula)
    );

    // Esperar a que todas las peticiones terminen
    forkJoin(observables).subscribe({
      next: (resultados) => {
        //console.log('Todas las asignaciones cargadas:', resultados);

        // Guardar los resultados en el Map
        this.empleados.forEach((empleado, index) => {
          this.asignacionesPorEmpleado.set(empleado.cedula, resultados[index]);
        });

        // Forzar actualización de la vista (opcional)
        this.empleadosFiltrados = [...this.empleados];
        this.actualizarPaginacion();
      },
      error: (err) => {
        console.error('Error cargando asignaciones:', err);
      }
    });
  }

  // Obtener asignaciones de un empleado
  getAsignaciones(cedula: string): AsignacionPorEmpleado[] {
    return this.asignacionesPorEmpleado.get(cedula) || [];
  }

  // Contar por tipo de catálogo (1=Equipo, 2=Movil, 3=Impresora)
  contarPorCatalogo(asignaciones: AsignacionPorEmpleado[], catalogoCodigo: number): number {
    return asignaciones.filter(a => a.catalogoCodigo === catalogoCodigo).length;
  }

  // Generar tooltip con los detalles

  getTooltipItems(asignaciones: AsignacionPorEmpleado[], catalogoCodigo: number): any[] {
    const filtradas = asignaciones.filter(a => a.catalogoCodigo === catalogoCodigo);
    return filtradas.map(a => ({
      marca: a.marca,
      modelo: a.modelo,
      serial: a.serialActivo
    }));
  }

  getAvatarColor(nombre: string): string {
    const colores = ['#3f51b5', '#f44336', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4'];
    return colores[nombre.charCodeAt(0) % colores.length];
  }


  formatearCedula(cedula: string): string {
    if (!cedula) return '';
    // Ejemplo: 12345678 -> 12.345.678
    return cedula.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }


  // ========== MÉTODOS DE FILTRO ==========

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

  filtros: any = {
    area: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    cargo: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    cedula: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    nombre: {
      operador: 'AND',
      reglas: [{ condicion: 'Empieza con', valor: '' }]
    },
    ingreso: {
      operador: 'AND',
      reglas: [{ condicion: 'La fecha es', valor: '' }]
    },
    retiro: {
      operador: 'AND',
      reglas: [{ condicion: 'La fecha es', valor: '' }]
    },
    estado: {
      valor: ''
    },
    asignaciones: {
      valor: ''
    }
  };


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

  limpiarFiltro(columna: string): void {
  if (columna === 'estado') {
    this.filtros.estado.valor = '';
  } else if (columna === 'asignaciones') {
    this.filtros.asignaciones.valor = 'TODOS';
  } else {
    this.filtros[columna].reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros[columna].operador = 'AND';
  }
  this.aplicarFiltros();
  this.cerrarFiltro();
}

  aplicarFiltros(): void {
    // Primero aplicar los filtros por columna
    let empleadosFiltradosPorColumnas = this.empleados.filter(empleado => {
      return this.aplicarFiltroArea(empleado) &&
        this.aplicarFiltroCargo(empleado) &&
        this.aplicarFiltroCedula(empleado) &&
        this.aplicarFiltroNombre(empleado) &&
        this.aplicarFiltroIngreso(empleado) &&
        this.aplicarFiltroRetiro(empleado) &&
        this.aplicarFiltroEstado(empleado);
    });

    // Luego aplicar la búsqueda general si hay término de búsqueda
    if (this.terminoBusqueda && this.terminoBusqueda.trim() !== '') {
      this.empleadosFiltrados = empleadosFiltradosPorColumnas.filter(empleado => {
        const textoBusqueda = `${empleado.nombre} ${empleado.apellido} ${empleado.cedula} ${empleado.area?.descripcion || ''} ${empleado.cargo?.descripcion || ''}`.toLowerCase();
        return textoBusqueda.includes(this.terminoBusqueda.toLowerCase());
      });
    }

    // Finalmente aplicar el filtro de asignaciones
    this.empleadosFiltrados = empleadosFiltradosPorColumnas.filter(empleado => {
      return this.aplicarFiltroAsignaciones(empleado);
    });



    // Verificar si hay algún filtro con valor
    const hayFiltrosActivos = this.hayFiltrosActivos() || (this.terminoBusqueda && this.terminoBusqueda.trim() !== '');

    if (hayFiltrosActivos) {
      this.paginaActual = 1;
    }

    // Verificar que la página actual no sea mayor que el total de páginas
    const totalPaginasCalculadas = Math.ceil(this.empleadosFiltrados.length / this.registrosPorPagina);
    if (this.paginaActual > totalPaginasCalculadas && totalPaginasCalculadas > 0) {
      this.paginaActual = totalPaginasCalculadas;
    }

    // Actualizar la paginación
    this.actualizarPaginacion();
    this.cerrarFiltro();
  }


  // Filtro ÁREA
  aplicarFiltroArea(empleado: EmpleadoLlamarDatos): boolean {
    const filtro = this.filtros.area;
    const valor = empleado.area?.descripcion?.toLowerCase() || '';

    if (!filtro.reglas[0].valor) return true;

    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  // Filtro CARGO
  aplicarFiltroCargo(empleado: EmpleadoLlamarDatos): boolean {
    const filtro = this.filtros.cargo;
    const valor = empleado.cargo?.descripcion?.toLowerCase() || '';

    if (!filtro.reglas[0].valor) return true;

    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  // Filtro CÉDULA
  aplicarFiltroCedula(empleado: EmpleadoLlamarDatos): boolean {
    const filtro = this.filtros.cedula;
    const valor = empleado.cedula?.toLowerCase() || '';
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(valor, filtro.reglas, filtro.operador);
  }

  // Filtro NOMBRE
  aplicarFiltroNombre(empleado: EmpleadoLlamarDatos): boolean {
    const filtro = this.filtros.nombre;
    const nombreCompleto = `${empleado.nombre} ${empleado.apellido}`.toLowerCase();
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglas(nombreCompleto, filtro.reglas, filtro.operador);
  }

  // Filtro FECHA INGRESO
  aplicarFiltroIngreso(empleado: EmpleadoLlamarDatos): boolean {
    const filtro = this.filtros.ingreso;
    const valor = empleado.fechaIngreso;
    if (!filtro.reglas[0].valor) return true;
    return this.evaluarReglasFecha(valor, filtro.reglas, filtro.operador);
  }

  // Filtro FECHA RETIRO
  aplicarFiltroRetiro(empleado: EmpleadoLlamarDatos): boolean {
    const filtro = this.filtros.retiro;
    const valor = empleado.fechaRetiro;
    if (!filtro.reglas[0].valor) return true;
    if (!valor) return false;
    return this.evaluarReglasFecha(valor, filtro.reglas, filtro.operador);
  }

  // Filtro ESTADO
  aplicarFiltroEstado(empleado: EmpleadoLlamarDatos): boolean {
    const filtroValor = this.filtros.estado.valor;
    if (!filtroValor) return true;
    if (filtroValor === 'ACTIVO') return empleado.activo === true;
    if (filtroValor === 'INACTIVO') return empleado.activo === false;
    return true;
  }


  // Evaluar reglas de texto
  evaluarReglas(valor: string, reglas: any[], operador: string): boolean {
    const resultados = reglas.map(regla => {
      if (!regla.valor) return true;
      const filtroValor = regla.valor.toLowerCase();
      switch (regla.condicion) {
        case 'Empieza con':
          return valor.startsWith(filtroValor);
        case 'Contiene':
          return valor.includes(filtroValor);
        case 'No contiene':
          return !valor.includes(filtroValor);
        case 'Termina con':
          return valor.endsWith(filtroValor);
        case 'Iguales':
          return valor === filtroValor;
        case 'No es igual':
          return valor !== filtroValor;
        default:
          return true;
      }
    });

    if (operador === 'AND') {
      return resultados.every(r => r === true);
    } else {
      return resultados.some(r => r === true);
    }
  }

  // Evaluar reglas de fecha
  evaluarReglasFecha(valor: string, reglas: any[], operador: string): boolean {
    const fechaValor = new Date(valor);
    fechaValor.setHours(0, 0, 0, 0);
    const resultados = reglas.map(regla => {
      if (!regla.valor) return true;
      const fechaFiltro = new Date(regla.valor);
      fechaFiltro.setHours(0, 0, 0, 0);
      switch (regla.condicion) {
        case 'La fecha es':
          return fechaValor.getTime() === fechaFiltro.getTime();
        case 'La fecha no es':
          return fechaValor.getTime() !== fechaFiltro.getTime();
        case 'La fecha es anterior':
          return fechaValor.getTime() < fechaFiltro.getTime();
        case 'La fecha es despues':
          return fechaValor.getTime() > fechaFiltro.getTime();
        default:
          return true;
      }
    });

    if (operador === 'AND') {
      return resultados.every(r => r === true);
    } else {
      return resultados.some(r => r === true);
    }
  }

  aplicarFiltroAsignaciones(empleado: EmpleadoLlamarDatos): boolean {
    const filtroValor = this.filtros.asignaciones.valor;
    if (!filtroValor || filtroValor === 'TODOS') return true;

    const asignaciones = this.getAsignaciones(empleado.cedula);

    switch (filtroValor) {
      case 'CON_ASIGNACION':
        return asignaciones.length > 0;
      case 'SIN_ASIGNACION':
        return asignaciones.length === 0;
      case 'CON_EQUIPO':
        return asignaciones.some(a => a.catalogoCodigo === 1);
      case 'CON_MOVIL':
        return asignaciones.some(a => a.catalogoCodigo === 2);
      case 'CON_IMPRESORA':
        return asignaciones.some(a => a.catalogoCodigo === 3);
      default:
        return true;
    }
  }

  limpiarTodosLosFiltros(): void {
    // Reiniciar filtros de texto
    this.filtros.area.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.area.operador = 'AND';
    this.filtros.cargo.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.cargo.operador = 'AND';
    this.filtros.cedula.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.cedula.operador = 'AND';
    this.filtros.nombre.reglas = [{ condicion: 'Empieza con', valor: '' }];
    this.filtros.nombre.operador = 'AND';
    this.filtros.ingreso.reglas = [{ condicion: 'La fecha es', valor: '' }];
    this.filtros.ingreso.operador = 'AND';
    this.filtros.retiro.reglas = [{ condicion: 'La fecha es', valor: '' }];
    this.filtros.retiro.operador = 'AND';
    this.filtros.estado.valor = '';
    this.terminoBusqueda = '';
    this.filtros.asignaciones.valor = 'TODOS';
    // Resetear paginación
    this.paginaActual = 1;
    this.registrosPorPagina = 10;
    // Aplicar filtros (que mostrará todos)
    this.aplicarFiltros();
  }


  filtroTieneValor(columna: string): boolean {
    if (columna === 'estado') {
      return this.filtros.estado.valor !== '' && this.filtros.estado.valor !== null;
    } else if (columna === 'asignaciones') {
      return this.filtros.asignaciones.valor !== '' && this.filtros.asignaciones.valor !== null && this.filtros.asignaciones.valor !== 'TODOS';
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

  // Método auxiliar para verificar si hay filtros activos
  hayFiltrosActivos(): boolean {
    const columnasTexto = ['area', 'cargo', 'cedula', 'nombre', 'ingreso', 'retiro'];
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
    if (this.filtros.asignaciones.valor !== '' && this.filtros.asignaciones.valor !== null && this.filtros.asignaciones.valor !== 'TODOS') return true;
    return false;
  }


  toggleSearch(): void {
    this.searchExpanded = !this.searchExpanded;
    if (!this.searchExpanded) {
      this.terminoBusqueda = '';
      this.buscarEmpleados();
    }
  }

  buscarEmpleados(): void {
    if (this.terminoBusqueda.trim() === '') {
      // Si no hay término de búsqueda, aplicar solo los filtros existentes
      this.aplicarFiltros();
    } else {
      // Primero aplicar los filtros normales
      let empleadosFiltradosPorFiltros = this.empleados.filter(empleado => {
        return this.aplicarFiltroArea(empleado) &&
          this.aplicarFiltroCargo(empleado) &&
          this.aplicarFiltroCedula(empleado) &&
          this.aplicarFiltroNombre(empleado) &&
          this.aplicarFiltroIngreso(empleado) &&
          this.aplicarFiltroRetiro(empleado) &&
          this.aplicarFiltroEstado(empleado);
      });

      // Luego aplicar la búsqueda general
      this.empleadosFiltrados = empleadosFiltradosPorFiltros.filter(empleado => {
        const textoBusqueda = `${empleado.nombre} ${empleado.apellido} ${empleado.cedula} ${empleado.area?.descripcion || ''} ${empleado.cargo?.descripcion || ''}`.toLowerCase();
        return textoBusqueda.includes(this.terminoBusqueda.toLowerCase());
      });

      // Resetear a la primera página y actualizar paginación
      this.paginaActual = 1;
      this.actualizarPaginacion();
      this.cerrarFiltro();
    }
  }

  // Agrega esta propiedad para controlar el ícono de limpiar
  get busqueda(): boolean {
    return this.terminoBusqueda !== '' && this.terminoBusqueda !== null;
  }

  // Método para limpiar la búsqueda
  limpiarBusqueda(): void {
    this.terminoBusqueda = '';
    this.buscarEmpleados();
  }



  // PAGINACION

  // Método para actualizar la paginación
  actualizarPaginacion(): void {

    // Si no hay empleados filtrados, limpiar la paginación
    if (this.empleadosFiltrados.length === 0) {
      this.empleadosPaginados = [];
      this.totalPaginas = 1;
      this.paginaActual = 1;
      return;
    }

    // Si el número de registros por página es igual o mayor al total
    if (this.registrosPorPagina >= this.empleadosFiltrados.length) {
      // Mostrar todos los registros
      this.empleadosPaginados = [...this.empleadosFiltrados];
      this.totalPaginas = 1;
      this.paginaActual = 1;
    } else {
      // Calcular total de páginas
      this.totalPaginas = Math.ceil(this.empleadosFiltrados.length / this.registrosPorPagina);

      // Asegurar que la página actual sea válida
      if (this.paginaActual > this.totalPaginas) {
        this.paginaActual = this.totalPaginas;
      }
      if (this.paginaActual < 1) {
        this.paginaActual = 1;
      }

      // Calcular índices para la página actual
      const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
      const fin = inicio + this.registrosPorPagina;
      this.empleadosPaginados = this.empleadosFiltrados.slice(inicio, fin);
    }
  }


  // Cambiar número de registros por página
  cambiarRegistrosPorPagina(): void {
    this.paginaActual = 1;
    this.actualizarPaginacion();
  }

  // Navegación de páginas
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
    return Math.min(this.paginaActual * this.registrosPorPagina, this.empleadosFiltrados.length);
  }




  // OPTENES ESTADISTICAS EMPLEADOS

  obtenerEmpleadosActivos(): number {
    return this.empleados.filter(emp => emp.activo === true).length;
  }

  obtenerEmpleadosInactivos(): number {
    return this.empleados.filter(emp => emp.activo === false).length;
  }


  // CERRAR FILTRO DANDO CLICK AFUERA
  @HostListener('document:click', ['$event'])
  clickFueraDelFiltro(event: MouseEvent): void {

    const elementoClickeado = event.target as HTMLElement;

    // Verifica si el click fue dentro del filtro
    const clicDentroFiltro = this.elementRef.nativeElement
      .querySelector('.filtro')
      ?.contains(elementoClickeado);

    // Verifica si fue click en el icono del filtro
    const clicEnBotonFiltro = elementoClickeado
      .closest('th a');

    // Si NO fue dentro del filtro NI en el botón → cerrar
    if (!clicDentroFiltro && !clicEnBotonFiltro) {
      this.cerrarFiltro();
    }
  }
}

