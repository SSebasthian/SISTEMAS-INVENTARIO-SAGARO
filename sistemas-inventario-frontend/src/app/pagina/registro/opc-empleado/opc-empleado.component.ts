import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { A11yModule } from "@angular/cdk/a11y";
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import { RegistroEmpleadoService } from '../../../arquitectura/servicio/registro/RegistroEmpleado.service';
import { EmpleadoRegistro } from '../../../arquitectura/interface/Registro/EmpleadoRegistro.interface';
import { EmpleadoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/EmpleadoRespuesta.interface';
import { AreaLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/AreaRespuesta.interface';
import { CargoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/CargoRespuesta.interface';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';

import { PermisoModuloService } from '../../../arquitectura/servicio/autenticacion/permiso-modulo.service';


@Component({
  selector: 'app-opc-empleado',
  imports: [MatIconModule, FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatAutocompleteModule, MatSelectModule, A11yModule],
  templateUrl: './opc-empleado.component.html',
  styleUrl: './opc-empleado.component.css'
})
export class OpcEmpleadoComponent implements OnInit {

  // ========== DATOS PRINCIPALES ==========
  areas: AreaLlamarDatos[] = [];
  cargos: CargoLlamarDatos[] = [];

  // ========== MODELO DEL EMPLEADO ==========
  empleado: EmpleadoRegistro = {
    cedula: '',
    nombre: '',
    apellido: '',
    fechaIngreso: '',
    areaCodigo: 0,
    cargoCodigo: 0
  };

  // ========== VARIABLES DE ESTADO ==========
  enviando = false;

  // ========== VARIABLES PARA MODALES ==========
  mostrarModalArea = false;
  nuevaAreaDescripcion = '';
  areasFiltradas: AreaLlamarDatos[] = [];

  mostrarModalCargo = false;
  cargoSeleccionadoId: number | null = null;
  todosLosCargos: CargoLlamarDatos[] = [];

  // ========== MODO EDICIÓN ==========
  modoEdicion: boolean = false;
  cedulaOriginal: string = '';
  equipoSeleccionado: any = null;

  // ========== VARIABLES PARA BUSCADOR ==========
  mostrarModalBuscarCedula: boolean = false;
  busquedaCedulaModal: string = '';
  resultadosBusquedaModal: EmpleadoLlamarDatos[] = [];
  buscandoModal: boolean = false;


  constructor(
    private registroEmpleadoService: RegistroEmpleadoService,
    private notificacionSnackbarService: NotificacionSnackbarService,
    private route: ActivatedRoute,
    private router: Router,
    private permisoModuloService: PermisoModuloService
  ) { }


  // Propiedad computada para el permiso
  get puedeEditarRegistro(): boolean {
    return this.permisoModuloService.puede('registro', 'editar');
  }

  // Determina si debe mostrar el botón Editar
  get mostrarBotonEditar(): boolean {
    // SOLO si tiene permiso Y no está editando
    if (this.puedeEditarRegistro && !this.modoEdicion) {
      return true;
    }
    return false;
  }

  // Determina si debe mostrar el botón Limpiar
  get mostrarBotonLimpiar(): boolean {
    // Muestra Limpiar en dos casos:
    // 1. Está en modo edición (cualquier usuario)
    // 2. No tiene permiso de editar (siempre)
    if (this.modoEdicion || !this.puedeEditarRegistro) {
      return true;
    }
    return false;
  }

  
  ngOnInit(): void {
    this.cargarAreas();
    this.cargarTodosLosCargos();

    // Verificar si viene una cédula en la URL para editar
    const cedulaParam = this.route.snapshot.paramMap.get('cedula');
    if (cedulaParam) {
      this.cargarEmpleadoParaEditar(cedulaParam);
    }
  }

  cargarAreas(): void {
    this.registroEmpleadoService.getAreas().subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (err) => {
        console.error('Error al cargar areas', err);
        this.notificacionSnackbarService.error('Error al cargar areas', 'No se pudo obtener la lista de areas');
      }
    });
  }


  onAreaChange(event: any): void {
    const valorSeleccionado = event.target.value;

    // Si seleccionó la opción de crear nueva área (valor 'new' como string)
    if (valorSeleccionado === 'new') {
      this.abrirModalArea();
      // Restaurar el valor anterior del select a 0 (número)
      this.empleado.areaCodigo = 0;
      return;
    }

    // Convertir a número
    this.empleado.areaCodigo = Number(valorSeleccionado);

    // Cargar los cargos del área seleccionada
    this.cargos = [];
    this.empleado.cargoCodigo = 0;

    if (this.empleado.areaCodigo && this.empleado.areaCodigo !== 0) {
      this.registroEmpleadoService.getCargosPorArea(this.empleado.areaCodigo).subscribe({
        next: (data) => {
          this.cargos = data;
        },
        error: (err) => {
          console.error('Error al cargar cargos', err);
          this.notificacionSnackbarService.error('Error al cargar cargos', 'No se pudieron cargar los cargos para esta area');
        }
      });
    }
  }

  cargarTodosLosCargos(): void {
    this.registroEmpleadoService.getTodosLosCargos().subscribe({
      next: (data) => {
        this.todosLosCargos = data;
      },
      error: (err) => {
        console.error('Error al cargar todos los cargos', err);
        this.notificacionSnackbarService.error('Error', 'No se pudieron cargar los cargos');
      }
    });
  }


  onCargoChange(event: any): void {
    const valorSeleccionado = event.target.value;

    // Si seleccionó la opción de crear nuevo cargo
    if (valorSeleccionado === 'new') {
      this.abrirModalCargo();
      // Restaurar el valor anterior del select a 0
      this.empleado.cargoCodigo = 0;
      return;
    }

    // Convertir a número
    this.empleado.cargoCodigo = Number(valorSeleccionado);
  }

  registrar(): void {
    if (this.enviando) return;

    if (!this.empleado.cedula || !this.empleado.nombre || !this.empleado.apellido ||
      !this.empleado.fechaIngreso || !this.empleado.areaCodigo || !this.empleado.cargoCodigo) {
      this.notificacionSnackbarService.warning('Campos incompletos', 'Todos los campos son obligatorios');
      return;
    }

    this.enviando = true;
    this.registroEmpleadoService.registrarEmpleado(this.empleado).subscribe({
      next: (respuesta: EmpleadoLlamarDatos) => {
        this.notificacionSnackbarService.success('Empleado registrado', `${respuesta.nombre} ${respuesta.apellido}`);
        this.limpiarFormulario();
        this.enviando = false;
      },
      error: (err) => {
        console.error('Error al registrar', err);
        const mensaje = err.error?.message || 'Error en el servidor';
        this.notificacionSnackbarService.error('Error al registrar empleado', mensaje);
        this.enviando = false;
      }
    });
  }

  limpiarFormulario(): void {
    // Limpiar datos del empleado
    this.empleado = {
      cedula: '',
      nombre: '',
      apellido: '',
      fechaIngreso: '',
      areaCodigo: 0,
      cargoCodigo: 0
    };
    // Limpiar listas
    this.cargos = [];
    // Resetear modo edición
    this.modoEdicion = false;
    this.cedulaOriginal = '';
    // Limpiar variables de búsqueda
    this.mostrarModalBuscarCedula = false;
    this.busquedaCedulaModal = ''; //
    this.resultadosBusquedaModal = [];
    // Recargar áreas
    this.cargarAreas();

  }

  // ========== MÉTODOS PARA CREAR ÁREA ==========
  abrirModalArea(): void {
    this.mostrarModalArea = true;
    this.nuevaAreaDescripcion = '';
    this.areasFiltradas = [];
  }

  cerrarModalArea(): void {
    this.mostrarModalArea = false;
    this.nuevaAreaDescripcion = '';
    this.areasFiltradas = [];
  }

  filtrarAreas(): void {
    const texto = this.nuevaAreaDescripcion?.toLowerCase() || '';

    if (texto.length > 0) {
      this.areasFiltradas = this.areas
        .filter(area => area.descripcion.toLowerCase().includes(texto))
        .slice(0, 10); // Máximo 10 sugerencias
    } else {
      this.areasFiltradas = [];
    }
  }

  seleccionarAreaExistente(event: any): void {
    const areaSeleccionada = this.areas.find(
      a => a.descripcion === event.option.value
    );

    if (areaSeleccionada) {
      this.notificacionSnackbarService.info('Área existente',
        `El área "${areaSeleccionada.descripcion}" ya existe. Se ha seleccionado automáticamente.`);
      this.empleado.areaCodigo = areaSeleccionada.codigo;
      this.cerrarModalArea();

      // Cargar cargos del área seleccionada
      this.cargos = [];
      this.empleado.cargoCodigo = 0;
      this.registroEmpleadoService.getCargosPorArea(areaSeleccionada.codigo).subscribe({
        next: (data) => {
          this.cargos = data;
        },
        error: (err) => console.error('Error al cargar cargos', err)
      });
    }
  }

  crearArea(): void {
    if (!this.nuevaAreaDescripcion.trim()) {
      this.notificacionSnackbarService.warning('Campo requerido', 'Ingrese la descripción del área');
      return;
    }

    // Verificar si ya existe exactamente igual
    const areaExistente = this.areas.find(
      a => a.descripcion.toLowerCase() === this.nuevaAreaDescripcion.toLowerCase()
    );

    if (areaExistente) {
      this.notificacionSnackbarService.info('Área existente',
        `El área "${areaExistente.descripcion}" ya existe. Se ha seleccionado automáticamente.`);
      this.empleado.areaCodigo = areaExistente.codigo;
      this.cerrarModalArea();
      return;
    }

    // Crear nueva área
    this.registroEmpleadoService.crearArea(this.nuevaAreaDescripcion).subscribe({
      next: (nuevaArea: AreaLlamarDatos) => {
        this.areas.push(nuevaArea);
        this.empleado.areaCodigo = nuevaArea.codigo;
        this.notificacionSnackbarService.success('Área creada', `Área "${nuevaArea.descripcion}" creada exitosamente`);
        this.cerrarModalArea();

        // Recargar cargos
        this.cargos = [];
        this.empleado.cargoCodigo = 0;
        this.registroEmpleadoService.getCargosPorArea(nuevaArea.codigo).subscribe({
          next: (data) => this.cargos = data,
          error: (err) => console.error('Error al cargar cargos', err)
        });
      },
      error: (err) => {
        const mensaje = err.error?.message || 'Error al crear el área';
        this.notificacionSnackbarService.error('Error', mensaje);
      }
    });
  }




  // ========== MÉTODOS PARA CREAR CARGO ==========
  abrirModalCargo(): void {
    if (!this.empleado.areaCodigo || this.empleado.areaCodigo === 0) {
      this.notificacionSnackbarService.warning('Área requerida', 'Primero debe seleccionar un área');
      return;
    }

    // Recargar lista actualizada de cargos
    this.cargarTodosLosCargos();

    this.mostrarModalCargo = true;
    this.cargoSeleccionadoId = null;
  }

  cerrarModalCargo(): void {
    this.mostrarModalCargo = false;
    this.cargoSeleccionadoId = null;
  }

  asignarCargoSeleccionado(): void {
    if (!this.cargoSeleccionadoId) {
      this.notificacionSnackbarService.warning('Selección requerida', 'Debe seleccionar un cargo');
      return;
    }

    const cargoSeleccionado = this.todosLosCargos.find(c => c.codigo === this.cargoSeleccionadoId);

    if (!cargoSeleccionado) {
      this.notificacionSnackbarService.error('Error', 'Cargo no encontrado');
      return;
    }

    // Verificar si ya está asociado a esta área
    const yaAsociado = this.cargos.some(c => c.codigo === cargoSeleccionado.codigo);

    if (yaAsociado) {
      this.notificacionSnackbarService.info('Cargo ya asociado',
        `El cargo "${cargoSeleccionado.descripcion}" ya está en esta área.`);
      this.empleado.cargoCodigo = cargoSeleccionado.codigo;
      this.cerrarModalCargo();
      return;
    }

    // Asociar el cargo al área actual
    this.registroEmpleadoService.crearCargo(cargoSeleccionado.descripcion, this.empleado.areaCodigo).subscribe({
      next: (resp: any) => {
        // Agregar a la lista local si no existe
        if (!this.cargos.some(c => c.codigo === cargoSeleccionado.codigo)) {
          this.cargos.push(cargoSeleccionado);
          this.cargos.sort((a, b) => a.descripcion.localeCompare(b.descripcion));
        }
        this.empleado.cargoCodigo = cargoSeleccionado.codigo;
        this.notificacionSnackbarService.success('Cargo asignado',
          `Cargo "${cargoSeleccionado.descripcion}" asignado al área`);
        this.cerrarModalCargo();
      },
      error: (err) => {
        console.error('Error al asignar cargo', err);
        this.notificacionSnackbarService.error('Error', 'No se pudo asignar el cargo');
      }
    });
  }

  // Método para obtener el nombre del área seleccionada
  obtenerNombreArea(): string {
    if (!this.empleado.areaCodigo || this.empleado.areaCodigo === 0) {
      return 'No seleccionada';
    }

    const area = this.areas.find(a => a.codigo === this.empleado.areaCodigo);
    return area ? area.descripcion : 'Área no encontrada';
  }

  obtenerNombreCargoSeleccionado(): string {
    if (!this.cargoSeleccionadoId) return '';
    const cargo = this.todosLosCargos.find(c => c.codigo === this.cargoSeleccionadoId);
    return cargo ? cargo.descripcion : '';
  }



  // ========== CARGAR EMPLEADO PARA EDITAR ==========

  cargarEmpleadoParaEditar(cedula: string): void {
    this.registroEmpleadoService.obtenerEmpleado(cedula).subscribe({
      next: (empleado: EmpleadoLlamarDatos) => {
        this.modoEdicion = true;
        this.cedulaOriginal = empleado.cedula;

        this.empleado.cedula = empleado.cedula;
        this.empleado.nombre = empleado.nombre;
        this.empleado.apellido = empleado.apellido;
        this.empleado.fechaIngreso = empleado.fechaIngreso;
        this.empleado.areaCodigo = empleado.area?.codigo || 0;
        this.empleado.cargoCodigo = empleado.cargo?.codigo || 0;

        // Cargar cargos del área seleccionada
        if (this.empleado.areaCodigo && this.empleado.areaCodigo !== 0) {
          this.registroEmpleadoService.getCargosPorArea(this.empleado.areaCodigo).subscribe({
            next: (data) => {
              this.cargos = data;
            },
            error: (err) => console.error('Error al cargar cargos', err)
          });
        }

        this.notificacionSnackbarService.info('Modo edición', `Editando: ${empleado.nombre} ${empleado.apellido}`);
      },
      error: (error) => {
        this.notificacionSnackbarService.error('Error', 'No se pudo cargar el empleado');
        this.router.navigate(['/empleados']);
      }
    });
  }


  // ========== EDITAR EMPLEADO ==========
  editar(): void {
    if (this.enviando) return;

    if (!this.empleado.nombre || !this.empleado.apellido ||
      !this.empleado.fechaIngreso || !this.empleado.areaCodigo || !this.empleado.cargoCodigo) {
      this.notificacionSnackbarService.warning('Campos incompletos', 'Todos los campos son obligatorios');
      return;
    }

    this.enviando = true;

    this.registroEmpleadoService.editarEmpleado(this.cedulaOriginal, this.empleado).subscribe({
      next: (respuesta: EmpleadoLlamarDatos) => {
        this.notificacionSnackbarService.success('Empleado actualizado', `${respuesta.nombre} ${respuesta.apellido}`);
        this.limpiarFormulario();
        this.enviando = false;
      },
      error: (err) => {
        console.error('Error al actualizar', err);
        const mensaje = err.error?.message || 'Error en el servidor';
        this.notificacionSnackbarService.error('Error al actualizar empleado', mensaje);
        this.enviando = false;
      }
    });
  }

  // ========== METODOS PARA BUSCADOR DE CEDULA ==========

  //abrir modal
  abrirModalBuscarCedula(): void {
    this.mostrarModalBuscarCedula = true;
    this.busquedaCedulaModal = '';
    this.resultadosBusquedaModal = [];
  }

  // Cerrar modal
  cerrarModalBuscarCedula(): void {
    this.mostrarModalBuscarCedula = false;
    this.busquedaCedulaModal = '';
    this.resultadosBusquedaModal = [];
  }


  // Buscar empleados en el modal
  buscarEmpleadosEnModal(): void {
    if (!this.busquedaCedulaModal || this.busquedaCedulaModal.length < 2) {
      this.resultadosBusquedaModal = [];
      return;
    }

    this.buscandoModal = true;

    // Un solo método que busca en cédula, nombre y apellido
    this.registroEmpleadoService.buscarEmpleados(this.busquedaCedulaModal).subscribe({
      next: (empleados) => {
        this.resultadosBusquedaModal = empleados;
        this.buscandoModal = false;
      },
      error: (err) => {
        console.error('Error al buscar empleados', err);
        this.resultadosBusquedaModal = [];
        this.buscandoModal = false;
        this.notificacionSnackbarService.error('Error', 'No se pudieron buscar los empleados');
      }
    });
  }

  // Seleccionar empleado desde el modal y cargar en el formulario
  seleccionarEmpleadoDelModal(empleado: EmpleadoLlamarDatos): void {
    this.modoEdicion = true;
    this.cedulaOriginal = empleado.cedula;

    this.empleado.cedula = empleado.cedula;
    this.empleado.nombre = empleado.nombre;
    this.empleado.apellido = empleado.apellido;
    this.empleado.fechaIngreso = empleado.fechaIngreso;
    this.empleado.areaCodigo = empleado.area?.codigo || 0;
    this.empleado.cargoCodigo = empleado.cargo?.codigo || 0;
    this.cargos = [];

    // Cargar cargos del área seleccionada
    if (this.empleado.areaCodigo && this.empleado.areaCodigo !== 0) {
      this.registroEmpleadoService.getCargosPorArea(this.empleado.areaCodigo).subscribe({
        next: (data) => {
          this.cargos = data;
        },
        error: (err) => console.error('Error al cargar cargos', err)
      });
    }

    // Mensaje de éxito al seleccionar usuario
    this.notificacionSnackbarService.success('Usuario seleccionado', `${empleado.nombre} ${empleado.apellido}`);

    this.cerrarModalBuscarCedula();
  }

  limpiarFormularioEditar(): void {
    this.limpiarFormulario();

    // Mensaje de éxito al limpiar formulario
    this.notificacionSnackbarService.info('Formulario limpiado',
      'Todos los campos han sido restablecidos');
  }


}
