import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RegistroEmpleadoService } from '../../../arquitectura/servicio/registro/RegistroEmpleado.service';
import { EmpleadoRegistro } from '../../../arquitectura/interface/Registro/EmpleadoRegistro.interface';
import { EmpleadoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/EmpleadoRespuesta.interface';
import { AreaLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/AreaRespuesta.interface';
import { CargoLlamarDatos } from '../../../arquitectura/interface/LlamarDatos/CargoRespuesta.interface';


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

  constructor(private registroEmpleadoService: RegistroEmpleadoService) { }


  ngOnInit(): void {
    this.cargarAreas();
  }

  cargarAreas(): void {
    this.registroEmpleadoService.getAreas().subscribe({
      next: (data) => {
        this.areas = data;
      },
      error: (err) => {
        console.error('Error al cargar áreas', err);
        alert('No se pudieron cargar las áreas');
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
          alert('No se pudieron cargar los cargos para esta área');
        }
      });
    }
  }

  registrar(): void {
    if (!this.empleado.cedula || !this.empleado.nombre || !this.empleado.apellido ||
      !this.empleado.fechaIngreso || !this.empleado.areaCodigo || !this.empleado.cargoCodigo) {
      alert('Todos los campos son obligatorios');
      return;
    }

    this.registroEmpleadoService.registrarEmpleado(this.empleado).subscribe({
      next: (respuesta: EmpleadoLlamarDatos) => {
        alert(`Empleado ${respuesta.nombre} ${respuesta.apellido} registrado correctamente en ${respuesta.area.descripcion} - ${respuesta.cargo.descripcion}`);
        this.limpiarFormulario();
      },
      error: (err) => {
        console.error('Error al registrar', err);
        const mensaje = err.error?.message || 'Error en el servidor';
        alert(`Error: ${mensaje}`);
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
