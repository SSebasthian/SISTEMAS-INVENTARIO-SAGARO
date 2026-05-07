import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroEmpleadoService } from '../../../arquitectura/servicio/registro/RegistroEmpleado.service';
import { EmpleadoRegistro } from '../../../arquitectura/interface/Registro/EmpleadoRegistro.interface';
import { EmpleadoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/EmpleadoRespuesta.interface';
import { AreaLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/AreaRespuesta.interface';
import { CargoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/CargoRespuesta.interface';
import { NotificacionSnackbarService } from '../../../arquitectura/servicio/notificacion/notificacion-snackbar.service';


@Component({
  selector: 'app-opc-empleado',
  imports: [MatIconModule, FormsModule, CommonModule],
  templateUrl: './opc-empleado.component.html',
  styleUrl: './opc-empleado.component.css'
})
export class OpcEmpleadoComponent implements OnInit {

  areas: AreaLlamarDatos[] = [];
  cargos: CargoLlamarDatos[] = [];
  empleado: EmpleadoRegistro = {
    cedula: '',
    nombre: '',
    apellido: '',
    fechaIngreso: '',
    areaCodigo: 0,
    cargoCodigo: 0
  };
  enviando = false;

  constructor(
    private registroEmpleadoService: RegistroEmpleadoService,
    private notificacionSnackbarService: NotificacionSnackbarService
  ) { }


  ngOnInit(): void {
    this.cargarAreas();
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

  onAreaChange(): void {
    this.cargos = [];
    this.empleado.cargoCodigo = 0;
    if (this.empleado.areaCodigo) {
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

  registrar(): void {
    if (this.enviando) return; // evitar doble envío

    if (!this.empleado.cedula || !this.empleado.nombre || !this.empleado.apellido ||
      !this.empleado.fechaIngreso || !this.empleado.areaCodigo || !this.empleado.cargoCodigo) {
      this.notificacionSnackbarService.warning('Campos incompletos', 'Todos los campos son obligatorios');
      return;
    }

    this.registroEmpleadoService.registrarEmpleado(this.empleado).subscribe({
      next: (respuesta: EmpleadoLlamarDatos) => {
        this.notificacionSnackbarService.success('Empleado registrado', `${respuesta.nombre} ${respuesta.apellido}`); this.limpiarFormulario();
      },
      error: (err) => {
        console.error('Error al registrar', err);
        const mensaje = err.error?.message || 'Error en el servidor';
        this.notificacionSnackbarService.error('Error al registrar empleado', mensaje);
      }
    });
  }

  limpiarFormulario(): void {
    this.empleado = {
      cedula: '',
      nombre: '',
      apellido: '',
      fechaIngreso: '',
      areaCodigo: 0,
      cargoCodigo: 0
    };
    this.cargos = [];
  }




}
