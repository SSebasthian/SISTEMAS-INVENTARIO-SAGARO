import { Routes } from '@angular/router';
import { AccesoComponent } from './pagina/autenticacion/acceso/acceso.component';
import { PerfilComponent } from './pagina/autenticacion/perfil/perfil.component';
import { estadoPrivado, estadoPublico } from './arquitectura/guardianRuta/enturamiento.guard';
import { OpcionesComponent } from './pagina/registro/opciones/opciones.component';
import { OpcEmpleadoComponent } from './pagina/registro/opc-empleado/opc-empleado.component';
import { OpcEquipoComponent } from './pagina/registro/opc-equipo/opc-equipo.component';
import { OpcDispositivoComponent } from './pagina/registro/opc-dispositivo/opc-dispositivo.component';
import { OpcImpresoraComponent } from './pagina/registro/opc-impresora/opc-impresora.component';
import { EmpleadosComponent } from './pagina/compartida/empleados/empleados.component';
import { EquiposComponent } from './pagina/compartida/equipos/equipos.component';
import { DispositivosComponent } from './pagina/compartida/dispositivos/dispositivos.component';
import { ImpresorasComponent } from './pagina/compartida/impresoras/impresoras.component';
import { RecursosComponent } from './pagina/compartida/recursos/recursos.component';




export const routes: Routes = [
    {
        path: '',
        component: AccesoComponent,
        canActivate: [estadoPublico]
    },
    {
        path: 'autenticacion',
        children: [
            {
                path: 'acceso',
                component: AccesoComponent,
                canActivate: [estadoPublico]
            },
            {
                path: 'perfil',
                component: PerfilComponent,
                canActivate: [estadoPrivado]
            }
        ]
    },
    {
        path: 'registro',
        children: [
            {
                path: 'opciones',
                component: OpcionesComponent,
                canActivate: [estadoPrivado],
            },
            {
                path: 'opciones',
                component: OpcEmpleadoComponent,
                canActivate: [estadoPrivado],
            },
            {
                path: 'opciones',
                component: OpcEquipoComponent,
                canActivate: [estadoPrivado],
            },
            {
                path: 'opciones',
                component: OpcDispositivoComponent,
                canActivate: [estadoPrivado],
            },
            {
                path: 'opciones',
                component: OpcImpresoraComponent,
                canActivate: [estadoPrivado],
            },
        ],
    },
    {
        path: 'usuarios',
        component: EmpleadosComponent,
        canActivate: [estadoPrivado],
    },
    {
        path: 'equipos',
        component: EquiposComponent,
        canActivate: [estadoPrivado]
    },
    {
        path: 'dispositivos',
        component: DispositivosComponent,
        canActivate: [estadoPrivado]
    },
    {
        path: 'impresoras',
        component: ImpresorasComponent,
        canActivate: [estadoPrivado]
    },
    {
        path: 'recursos',
        component: RecursosComponent,
        canActivate: [estadoPrivado]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
