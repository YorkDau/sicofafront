import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AppMaterialModule } from '../app.material.module';
import { ModalInfoComponent } from './modal-info/modal-info.component';
import { SidenavComponent } from './components/general/sidenav/sidenav.component';
import { ModalExitoComponent } from './modal-exito/modal-exito.component';
import { NoDataComponent } from './components/general/no-data/no-data.component';
import { ModalConfirmacionComponent } from './modal-confirmacion/modal-confirmacion.component';
import { AuroraTableComponent } from './table/table.component';
import { RecepcionCasosComponent } from './components/inicio-casos/recepcion-casos/recepcion-casos.component';
import { CargaArchivoComponent } from './carga-archivo/carga-archivo.component';
import { HeaderComponent } from './banners/header/header.component';
import { FooterComponent } from './banners/footer/footer.component';
import { HomeComponent } from './components/home/home.component';
import { MainRecepcionComponent } from './components/inicio-casos/main-recepcion/main-recepcion.component';
import { SeguridadRedesApoyoPdfComponent } from './reportes-pdf/reportes/seguridad-redes-apoyo-pdf/seguridad-redes-apoyo-pdf.component';
import { InstrumentoRiesgoPdfComponent } from './reportes-pdf/reportes/instrumento-riesgo-pdf/instrumento-riesgo-pdf.component';
import { EntrevistaPsicologicaEmocionalPdfComponent } from './reportes-pdf/reportes/entrevista-psicologica-emocional-pdf/entrevista-psicologica-emocional-pdf.component';
import { ReportesPdfComponent } from './reportes-pdf/reportes-pdf.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { CalendarioComponent } from './audiencia/calendario/calendario.component';
import { GestionPreSolicitudComponent } from './components/gestion-pre-solicitud/gestion-pre-solicitud.component';
import { RecepcionPreSolicitudComponent } from './components/gestion-pre-solicitud/recepcion-pre-solicitud/recepcion-pre-solicitud.component';
import { RevisionLegalPreSolicitudComponent } from './components/gestion-pre-solicitud/revision-legal-pre-solicitud/revision-legal-pre-solicitud.component';
import { VerificacionPreSolicitudComponent } from './components/gestion-pre-solicitud/verificacion-pre-solicitud/verificacion-pre-solicitud.component';

import { GenerarAutoComponent } from './components/auto/generar-auto.component';
import { SeccionesComponent } from './components/auto/secciones/secciones.component';
import { InvolucradosComponent } from './components/auto/involucrados/involucrados.component';
import { ReporteAutoComponent } from './components/auto/report/reporte-auto.component';
import { CabeceraReporteComponent } from './components/auto/cabecera-reporte/cabecera-reporte.component';
import { ObservacionesAutoComponent } from './components/auto/observaciones-auto/observaciones-auto.component';
import { AudienciaComponent } from './audiencia/audiencia.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EncabezadoPrivateComponent } from './components/general/encabezado-private/encabezado-private.component';
import { AutoTramiteComponent } from './components/gestion-pre-solicitud/reportes/auto-tramite/auto-tramite.component';
import { SeguimientoComponent } from './seguimiento/seguimiento.component';
import { ModalCrearSeguimientoComponent } from './seguimiento/modal-crear-seguimiento/modal-crear-seguimiento.component';
import { InicioCasosComponent } from './components/inicio-casos/inicio-casos.component';
import { InstrumentoSeguimientoComponent } from './reportes-pdf/reportes/instrumento-seguimiento/instrumento-seguimiento.component';
import { EjecutarSeguimientoComponent } from './seguimiento/ejecutar-seguimiento/ejecutar-seguimiento.component';
import { DecisionSeguimientoComponent } from './seguimiento/decision-seguimiento/decision-seguimiento.component';
import { GenerarSeguimientoComponent } from './seguimiento/ejecutar-seguimiento/generar-seguimiento/generar-seguimiento.component';
import { FormatosComponent } from './seguimiento/ejecutar-seguimiento/generar-seguimiento/formatos/formatos.component';
import { EntrevistaInterventivaComponent } from './seguimiento/ejecutar-seguimiento/generar-seguimiento/formatos/entrevista-interventiva/entrevista-interventiva.component';
import { EntrevistaDomiciliariaComponent } from './seguimiento/ejecutar-seguimiento/generar-seguimiento/formatos/entrevista-domiciliaria/entrevista-domiciliaria.component';
import { SeguimientoMedidasComponent } from './seguimiento/ejecutar-seguimiento/generar-seguimiento/formatos/seguimiento-medidas/seguimiento-medidas.component';
import { VerificacionProteccionComponent } from './seguimiento/ejecutar-seguimiento/generar-seguimiento/formatos/verificacion-proteccion/verificacion-proteccion.component';
import { SeguimientoMedidasAtencionComponent } from './seguimiento/ejecutar-seguimiento/generar-seguimiento/formatos/seguimiento-medidas-atencion/seguimiento-medidas-atencion.component';
import { RecepcionGenerarCargarComponent } from './components/recepcion-generar-cargar/recepcion-generar-cargar.component';
import { AccionesFormularioComponent } from './components/general/acciones-formulario/acciones-formulario.component';
import { DatosDenuncianteComponent } from './components/recepcion-generar-cargar/report/incumplimiento-medida-reporte/datos-denunciante/datos-denunciante.component';
import { DatosDenunciadoComponent } from './components/recepcion-generar-cargar/report/incumplimiento-medida-reporte/datos-denunciado/datos-denunciado.component';
import { DatosVictimaComponent } from './components/recepcion-generar-cargar/report/incumplimiento-medida-reporte/datos-victima/datos-victima.component';
import { RelacionMedidaComponent } from './components/recepcion-generar-cargar/report/incumplimiento-medida-reporte/relacion-medida/relacion-medida.component';
import { MedidasComplementariasComponent } from './components/recepcion-generar-cargar/report/incumplimiento-medida-reporte/medidas-complementarias/medidas-complementarias.component';
import { IncumplimientoComponent } from './components/recepcion-generar-cargar/report/incumplimiento-medida-reporte/incumplimiento/incumplimiento.component';
import { SolicitudLevantamientoComponent } from './components/recepcion-generar-cargar/report/solicitud-levantamiento/solicitud-levantamiento.component';
import { InformesDinamicosComponent } from './components/informes/informes-dinamicos/informes-dinamicos.component';
import { FormatosVaciosComponent } from './components/informes/formatos-vacios/formatos-vacios.component';
import { SetPerfilComponent } from './components/set-perfil/set-perfil.component';
import { MedidaComponent } from './seguimiento/decision-seguimiento/medida/medida.component';
import { TextoAutoPipe } from '../pipes/texto-auto.pipe';
import { ConsultaGeneralComponent } from './consulta-general/consulta-general.component';
import { TareasComponent } from './consulta-general/tareas/tareas.component';
import { TablaAnexosComponent } from './consulta-general/tabla-anexos/tabla-anexos.component';
import { SeguimientoPardComponent } from './seguimiento-pard/seguimiento-pard.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppMaterialModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  exports: [
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    NoDataComponent,
    AppMaterialModule,
    AuroraTableComponent,
    RecepcionCasosComponent,
    CargaArchivoComponent,
    CalendarioComponent,
    GestionPreSolicitudComponent,
    InstrumentoRiesgoPdfComponent,
    EntrevistaPsicologicaEmocionalPdfComponent,
    SeguridadRedesApoyoPdfComponent,
    GenerarAutoComponent,
    SeccionesComponent,
    InvolucradosComponent,
    ReporteAutoComponent,
    CabeceraReporteComponent,
    ObservacionesAutoComponent,
    AudienciaComponent,
    EncabezadoPrivateComponent,
    InicioCasosComponent,
    InformesDinamicosComponent,
    FormatosVaciosComponent,
    SetPerfilComponent,
    AccionesFormularioComponent,
    TextoAutoPipe
  ],
  declarations: [
    AuroraTableComponent,
    ModalInfoComponent,
    ModalExitoComponent,
    HeaderComponent,
    FooterComponent,
    SidenavComponent,
    NoDataComponent,
    ModalConfirmacionComponent,
    RecepcionCasosComponent,
    HomeComponent,
    MainRecepcionComponent,
    CargaArchivoComponent,
    SeguridadRedesApoyoPdfComponent,
    InstrumentoRiesgoPdfComponent,
    EntrevistaPsicologicaEmocionalPdfComponent,
    ReportesPdfComponent,
    CalendarioComponent,
    GestionPreSolicitudComponent,
    RecepcionPreSolicitudComponent,
    RevisionLegalPreSolicitudComponent,
    VerificacionPreSolicitudComponent,
    GenerarAutoComponent,
    SeccionesComponent,
    InvolucradosComponent,
    ReporteAutoComponent,
    CabeceraReporteComponent,
    ObservacionesAutoComponent,
    AudienciaComponent,
    EncabezadoPrivateComponent,
    AutoTramiteComponent,
    SeguimientoComponent,
    ModalCrearSeguimientoComponent,
    InicioCasosComponent,
    InstrumentoSeguimientoComponent,
    EjecutarSeguimientoComponent,
    DecisionSeguimientoComponent,
    GenerarSeguimientoComponent,
    FormatosComponent,
    EntrevistaInterventivaComponent,
    EntrevistaDomiciliariaComponent,
    SeguimientoMedidasComponent,
    VerificacionProteccionComponent,
    SeguimientoMedidasAtencionComponent,
    RecepcionGenerarCargarComponent,
    AccionesFormularioComponent,
    IncumplimientoComponent,
    DatosDenuncianteComponent,
    DatosDenunciadoComponent,
    DatosVictimaComponent,
    RelacionMedidaComponent,
    MedidasComplementariasComponent,
    SolicitudLevantamientoComponent,
    InformesDinamicosComponent,
    FormatosVaciosComponent,
    SetPerfilComponent,
    MedidaComponent,
    TextoAutoPipe,
    ConsultaGeneralComponent,
    TareasComponent,
    TablaAnexosComponent,
    SeguimientoPardComponent
  ],
  providers: [],
})
export class SharedModule {}
