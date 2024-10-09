import { Routes } from '@angular/router';
import { CiudadanoComponent } from './ciudadano/ciudadano.component';
import { RegistrarCiudadanoComponent } from './ciudadano/registrar-ciudadano/registrar-ciudadano.component';
import { HistorialCiudadanoComponent } from './ciudadano/historial-ciudadano/historial-ciudadano.component';
import { RecepcionComponent } from './recepcion/recepcion.component';
import { SolicitudComponent } from './solicitud/solicitud.component';
import { HomeComponent } from 'src/app/shared/components/home/home.component';
import { GestionPreSolicitudComponent } from 'src/app/shared/components/gestion-pre-solicitud/gestion-pre-solicitud.component';
import { RecepcionPreSolicitudComponent } from 'src/app/shared/components/gestion-pre-solicitud/recepcion-pre-solicitud/recepcion-pre-solicitud.component';
import { RevisionLegalPreSolicitudComponent } from 'src/app/shared/components/gestion-pre-solicitud/revision-legal-pre-solicitud/revision-legal-pre-solicitud.component';
import { VerificacionPreSolicitudComponent } from 'src/app/shared/components/gestion-pre-solicitud/verificacion-pre-solicitud/verificacion-pre-solicitud.component';
import { CargarPruebasComponent } from './cargar-pruebas/cargar-pruebas/cargar-pruebas.component';
import { AudienciaComponent } from 'src/app/shared/audiencia/audiencia.component';
import { InicioCasosComponent } from 'src/app/shared/components/inicio-casos/inicio-casos.component';
import { InformesDinamicosComponent } from 'src/app/shared/components/informes/informes-dinamicos/informes-dinamicos.component';
import { FormatosVaciosComponent } from 'src/app/shared/components/informes/formatos-vacios/formatos-vacios.component';
import { UsuarioComponent } from './usuario/usuario.component';
import { RegistrarUsuarioComponent } from './usuario/registrar-usuario/registrar-usuario.component';
import { PerfilComponent } from './perfil/perfil.component';
import { RegistrarPerfilComponent } from './perfil/registrar-perfil/registrar-perfil.component';

export const mainRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'recepcion-auxiliar', component: RecepcionComponent },
  { path: 'ciudadano', component: CiudadanoComponent },
  { path: 'solicitud', component: SolicitudComponent },
  { path: 'solicitud/:id', component: SolicitudComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'perfil', component: PerfilComponent },
  {
    path: 'registro-presolicitud',
    component: GestionPreSolicitudComponent,
    children: [
      {
        path: '',
        component: RecepcionPreSolicitudComponent,
      },
      {
        path: 'legal',
        component: RevisionLegalPreSolicitudComponent,
      },
      {
        path: 'verificacion',
        component: VerificacionPreSolicitudComponent,
      },
    ],
  },
  {
    path: 'presolicitud',
    component: GestionPreSolicitudComponent,
    children: [
      {
        path: '',
        component: RecepcionPreSolicitudComponent,
      },
      {
        path: 'legal',
        component: RevisionLegalPreSolicitudComponent,
      },
      {
        path: 'verificacion',
        component: VerificacionPreSolicitudComponent,
      },
    ],
  },
  {
    path: 'registro-ciudadano',
    component: RegistrarCiudadanoComponent,
  },
  {
    path: 'registro-perfil',
    component: RegistrarPerfilComponent,
  },
  {
    path: 'registro-perfil/:id_perfil',
    component: RegistrarPerfilComponent,
  },
  {
    path: 'registro-usuario',
    component: RegistrarUsuarioComponent,
  },
  {
    path: 'registro-ciudadano/:id_ciudadano',
    component: RegistrarCiudadanoComponent,
  },
  {
    path: 'historial-ciudadano/:id_ciudadano',
    component: HistorialCiudadanoComponent,
  },
  {
    path: 'psicologia',
    loadChildren: () =>
      import('./psicologia/psicologia.module').then((m) => m.PsicologiaModule),
  },
  {
    path: 'abogado',
    loadChildren: () =>
      import('./abogado/abogado.module').then((m) => m.AbogadoModule),
  },
  {
    path: 'trabajador-social',
    loadChildren: () =>
      import('./trabajador-social/trabajador-social.module').then(
        (m) => m.TrabajadorSocialModule
      ),
  },
  // Rutas creadas provisionalmente
  {
    path: 'comisario',
    loadChildren: () =>
      import('./comisario/comisario.module').then((m) => m.ComisarioModule),
  },
  {
    path: 'abo-comi',
    children: [
      {
        path: 'cargar-pruebas/:id',
        component: CargarPruebasComponent,
      },
    ],
  },
  // Nuevo estandar rutas por hu
  { path: 'casos', component: InicioCasosComponent },
  { path: 'programacion/:id', component: AudienciaComponent },
  {
    path: 'quorum/:id',
    loadChildren: () =>
      import('./quorum/quorum.module').then((m) => m.QuorumModule),
  },
  {
    path: 'cargar-pruebas/:id',
    loadChildren: () =>
      import('./cargar-pruebas/cargar-pruebas.module').then(
        (m) => m.CargarPruebasModule
      ),
  },
  {
    path: 'reportes/formatos-vacios',
    component: FormatosVaciosComponent,
  },
  {
    path: 'reportes/generar-reportes',
    component: InformesDinamicosComponent,
  },
  {
    path: 'cargar-pruebas/:id',
    loadChildren: () =>
      import('./cargar-pruebas/cargar-pruebas.module').then(
        (m) => m.CargarPruebasModule
      ),
  },
  {
    path: 'administrador',
    loadChildren: () =>
      import('./administrador/administrador.module').then(
        (m) => m.AdministradorModule
      ),
  },
];
