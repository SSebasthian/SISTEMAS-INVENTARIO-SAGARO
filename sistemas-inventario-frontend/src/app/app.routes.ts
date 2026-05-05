import { Routes } from '@angular/router';
import { AccesoComponent } from './pagina/autenticacion/acceso/acceso.component';
import { PerfilComponent } from './pagina/autenticacion/perfil/perfil.component';
import { estadoPrivado, estadoPublico } from './arquitectura/guardianRuta/enturamiento.guard';
import { OpcionesComponent } from './pagina/registro/opciones/opciones.component';
import { OpcEmpleadoComponent } from './pagina/registro/opc-empleado/opc-empleado.component';
import { OpcEquipoComponent } from './pagina/registro/opc-equipo/opc-equipo.component';
import { OpcTelefonoComponent } from './pagina/registro/opc-telefono/opc-telefono.component';
import { OpcTabletComponent } from './pagina/registro/opc-tablet/opc-tablet.component';
import { OpcImpresoraComponent } from './pagina/registro/opc-impresora/opc-impresora.component';


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
                component: OpcTelefonoComponent,
                canActivate: [estadoPrivado],
            },
            {
                path: 'opciones',
                component: OpcTabletComponent,
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
        path: '**',
        redirectTo: ''
    }
];
