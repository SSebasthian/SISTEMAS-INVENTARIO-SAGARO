<h1 align="center"> # Registro-InicioSesion </h1>

## Necesario para Angular
`npm install -g @angular/cli@19`<br>
`ng add @angular/material@19`<br>



## Creación de Proyecto Angular
`ng new registro-y-iniciosesion-frontend` (Se crea con CSS)<br>
`ng generate component pagina/autenticacion/acceso` (Acceso)<br>
`ng generate component pagina/autenticacion/registro` (Registro)<br>
`ng generate service arquitectura/servicio/autenticacion/autenticador` (Servicio Autenticacion)<br>
`Se crea interface inicioSesionSolicitud manualmente` (Interface InicioSesionSolicitud SOLICITUD AUTENTICACION BACKEND)<br>
`Se crea interface inicioSesionRespuesta manualmente` (Interface inicioSesionRespuesta RESPUESTA AUTENTICACION BACKEND)<br>
`ng generate component pagina/autenticacion/perfil` (Perfil)<br>
`ng generate guard arquitectura/guardianRuta/enturamiento` (*)CanActivate (Guardian para Controlar Roles de Acceso)<br>
`ng generate component pagina/permisos/permisos-usuarios` (PERMISOS USUARIOS)<br>
`ng generate component pagina/permisos/permisos-perfil` (PERMISOS PERFIL)<br>
`ng generate component pagina/permisos/permisos-rol` (PERMISOS ROL)<br>
`ng generate component pagina/permisos/permisos-permisos` (PERMISOS PERMISOS)<br>

`ng generate component pagina/permisos/permisos-permisosxrol` (PERMISOS - PERMISOS POR ROL)<br>
`ng generate service arquitectura/servicio/permisos/usuarios-permisos` (Servicio para USUARIOS Permiso)<br>
`ng generate service arquitectura/servicio/permisos/rol-permisos` (Servicio para ROL Permiso)<br>
`ng generate service arquitectura/servicio/permisos/permisos-permisos` (Servicio para PERMISOS Permiso)<br>
`ng generate service arquitectura/servicio/permisos/permisosxrol-permisos` (Servicio para PERMISOS X ROL)<br>
`ng generate service arquitectura/servicio/autenticacion/perfil` (Servicio Autenticacion)<br>

`ng generate service arquitectura/servicio/autenticacion/permiso-modulo` (Servicio PERMISOS X MODULO)<br>
`ng generate component pagina/notificacion` (PERMISOS - PERMISOS POR ROL)<br>
`ng generate service arquitectura/servicio/notificacion/notificacion-snackbar` (Servicio NOTIFICACIONES SNACKBAR)<br>

`ng generate component pagina/menu` (Menu)<br>
`ng generate component pagina/registro/opciones` (Opciones de registro)<br>
`ng generate component pagina/registro/opc-empleado` (Opciones de registro - EMPLEADO)<br>
`ng generate component pagina/registro/opc-equipo` (Opciones de registro - EQUIPO)<br>
`ng generate component pagina/registro/opc-telefono` (Opciones de registro - TELEFONO)<br>
`ng generate component pagina/registro/opc-tablet` (Opciones de registro - TABLET)<br>
`ng generate component pagina/registro/opc-impresora` (Opciones de registro - IMPRESORA)<br>

`Se crea interface Registro EmpleadoRegistro manualmente` (Interface EmpleadoRegistro REGISTRAR EMPLEADO)<br>
`Se crea interface LlamarDatos EmpleadoRespuesta manualmente` (Interface EmpleadoRespuesta LLAMAR DATOS EMPLEADO)<br>
`Se crea interface LlamarDatos AreaRespuesta manualmente` (Interface AreaRespuesta LLAMAR DATOS AREA)<br>
`Se crea interface LlamarDatos CargoRespuesta manualmente` (Interface CargoRespuesta LLAMAR DATOS CARGO)<br>

`Se crea interface LlamarDatos Catalogo manualmente` (Interface Catalogo LLAMAR DATOS CATALOGO)<br>
`Se crea interface LlamarDatos DispositivoTecnologico_Tipo manualmente` (Interface DispositivoTecnologico_Tipo LLAMAR DATOS TIPOS)<br>
`Se crea interface LlamarDatos DispositivoTecnologico_Marca manualmente` (Interface DispositivoTecnologico_Marca LLAMAR DATOS MARCA)<br>
`Se crea interface LlamarDatos DispositivoTecnologico_Modelo manualmente` (Interface DispositivoTecnologico_Modelo LLAMAR DATOS MODELO)<br>
`Se crea interface LlamarDatos DispositivoTecnologico_SO manualmente` (Interface DispositivoTecnologico_SO LLAMAR DATOS SO)<br>
`Se crea interface LlamarDatos DispositivoTecnologico_VersionSO manualmente` (Interface DispositivoTecnologico_VersionSO LLAMAR DATOS VERSION SO)<br>


`ng generate service arquitectura/servicio/registro/RegistroEmpleado` (Servicio REGISTRO EMPLEADO)<br>
`ng generate service arquitectura/servicio/registro/RegistroCatalogo` (Servicio REGISTRO CATALOGO, MARCA, MODELO, VERSION SO)<br>
`ng generate service arquitectura/servicio/LlamarDatos/Catalogo` (Servicio LLAMAR DATOS CATALOGO)<br>


`Se crea interface Registro EquipoComputoRegistro manualmente` (Interface EquipoComputoRegistro REGISTRAR EQUIPO DE COMPUTO)<br>
`Se crea interface Registro EquipoComputoRespuesta manualmente` (Interface EquipoComputoRegistro RESPUESTA EQUIPO DE COMPUTO)<br>
`Se crea interface Registro DispositivoMovilRegistro manualmente` (Interface DispositivoMovilRegistro REGISTRAR DISPOSITIVOS MOVILES)<br>
`Se crea interface Registro DispositivoMovilRespuesta manualmente` (Interface DispositivoMovilRegistro RESPUESTA DISPOSITIVOS MOVILES)<br>
`Se crea interface Registro ImpresoraRegistro manualmente` (Interface ImpresoraRegistro REGISTRAR IMPRESORA<br>
`Se crea interface Registro ImpresoraRespuesta manualmente` (Interface ImpresoraRespuesta RESPUESTA IMPRESORA<br>
`ng generate service arquitectura/servicio/Registro/RegistroEquipo` (Servicio REGISTRAR EQUIPO)<br>
`ng generate service arquitectura/servicio/Registro/RegistroDispositivo` (Servicio REGISTRAR TELEFONOS)<br>
`ng generate service arquitectura/servicio/Registro/RegistroImpresora` (Servicio REGISTRAR IMPRESORA)<br>



`ng generate component pagina/compartida/empleados` (Empleados vista)<br>
`ng generate component pagina/compartida/equipos` (Equipo vista)<br>
`ng generate component pagina/compartida/dispositivos` (Dispositivos vista)<br>


