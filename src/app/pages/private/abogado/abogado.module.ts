import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbogadoRoutingModule } from './abogado-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AbogadoComponent } from './abogado.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { GestionRemisionComponent } from './gestion-remision/gestion-remision.component';
import { GenerarRemisionComponent } from './gestion-remision/generar-remision/generar-remision.component';
import { HMedidasProteccionComponent } from './h-medidas-proteccion/h-medidas-proteccion.component';
import { MedidaProteccionComponent } from './medida-proteccion/medida-proteccion.component';
import { AgresorComponent } from './medida-proteccion/agresor/agresor.component';
import { VictimaComponent } from './medida-proteccion/victima/victima.component';
import { RelatoHechosComponent } from './medida-proteccion/relato-hechos/relato-hechos.component';

import { ImprimirFirmarCargarComponent } from './imprimir-firmar-cargar/imprimir-firmar-cargar.component';
import { NotificacionesImplicadosComponent } from './notificaciones-implicados/notificaciones-implicados.component';
import { ReportesComponent } from './gestion-remision/generar-remision/reportes/reportes.component';
import { RemisionApoyoPolicivoMujerComponent } from './gestion-remision/generar-remision/reportes/remision-apoyo-policivo-mujer/remision-apoyo-policivo-mujer.component';
import { DenunciaFiscaliaComponent } from './gestion-remision/generar-remision/reportes/denuncia-fiscalia/denuncia-fiscalia.component';
import { VisitaDomiciliariaComponent } from './gestion-remision/generar-remision/reportes/visita-domiciliaria/visita-domiciliaria.component';
import { RemisionSistemaSaludComponent } from './gestion-remision/generar-remision/reportes/remision-sistema-salud/remision-sistema-salud.component';
import { SolicitudProtocologoRiesgoComponent } from './gestion-remision/generar-remision/reportes/solicitud-protocologo-riesgo/solicitud-protocologo-riesgo.component';
import { NumhMedidaComponent } from './report/components/medida/numh-medida/numh-medida.component';
import { DatosVComponent } from './report/components/medida/datos-v/datos-v.component';
import { DatosAComponent } from './report/components/medida/datos-a/datos-a.component';
import { RelatoUltComponent } from './report/components/medida/relato-ult/relato-ult.component';
import { TipoViolenciaComponent } from './report/components/medida/tipo-violencia/tipo-violencia.component';
import { PruebasAportarComponent } from './report/components/medida/pruebas-aportar/pruebas-aportar.component';
import { TestimonialComponent } from './report/components/medida/testimonial/testimonial.component';
import { RemisionPersoneriaComponent } from './gestion-remision/generar-remision/reportes/remision-personeria/remision-personeria.component';
import { MedicinaLegalComponent } from './gestion-remision/generar-remision/reportes/medicina-legal/medicina-legal.component';
import { SecretariaMujerComponent } from './gestion-remision/generar-remision/reportes/secretaria-mujer/secretaria-mujer.component';
import { PsicologiaExternaComponent } from './gestion-remision/generar-remision/reportes/psicologia-externa/psicologia-externa.component';
import { SolicitudHistoriaClinicaComponent } from './gestion-remision/generar-remision/reportes/solicitud-historia-clinica/solicitud-historia-clinica.component';
import { OtorgamientoMedidasProteccionComponent } from './gestion-remision/generar-remision/reportes/otorgamiento-medidas-proteccion/otorgamiento-medidas-proteccion.component';
import { ReporteMedidaComponent } from './report/components/medida/reporte-medida.component';
import { DecisionJuezComponent } from './components/decision-juez/decision-juez.component';
import { ListaArchivosComponent } from './components/lista-archivos/lista-archivos.component';
import { ModalMedidasAutoComponent } from './components/modal-medidas-auto/modal-medidas-auto.component';
import { ModalCargarDocumentoComponent } from './components/modal-cargar-documento/modal-cargar-documento.component';
import { ModalReporteJuezComponent } from './components/modal-reporte-juez/modal-reporte-juez.component';
import { ApelacionMedidaComponent } from './report/components/auto-juez/apelacion-medida/apelacion-medida.component';
import { ResolverRecursoComponent } from './report/components/auto-juez/resolver-recurso/resolver-recurso.component';
import { DesiertoRecursoComponent } from './report/components/auto-juez/desierto-recurso/desierto-recurso.component';
import { OrdenadoJuezComponent } from './report/components/auto-juez/ordenado-juez/ordenado-juez.component';
import { PruebasPardComponent } from './components/caso-pard/pruebas-pard/pruebas-pard.component';
import { DecretarDesistirPardComponent } from './components/caso-pard/decretar-desistir-pard/decretar-desistir-pard.component';
import { GridPardComponent } from './components/caso-pard/grid-pard/grid-pard.component';
import { ContenedorPardComponent } from './components/caso-pard/contenedor-pard.component';
import { DecretoPruebasComponent } from './report/components/decreto-pruebas/decreto-pruebas.component';
import { NotificacionXAvisoComponent } from './report/components/notificacion-x-aviso/notificacion-x-aviso.component';
import { NotificacionXEstadoComponent } from './report/components/notificacion-x-estado/notificacion-x-estado.component';
import { NotificacionesPardComponent } from './components/caso-pard/notificaciones-pard/notificaciones-pard.component';
import { TablaEstadoComponent } from './report/components/notificacion-x-estado/tabla-estado.component';
import { ComentariosEstadoComponent } from './report/components/notificacion-x-estado/comentarios-estado.component';
import { CompetenciaPardComponent } from './components/competencia-pard/competencia-pard.component';

@NgModule({
  declarations: [
    AbogadoComponent,
    HMedidasProteccionComponent,
    MedidaProteccionComponent,
    AgresorComponent,
    VictimaComponent,
    RelatoHechosComponent,
    GestionRemisionComponent,
    GenerarRemisionComponent,
    ImprimirFirmarCargarComponent,
    ReporteMedidaComponent,
    NumhMedidaComponent,
    DatosVComponent,
    DatosAComponent,
    RelatoUltComponent,
    TipoViolenciaComponent,
    PruebasAportarComponent,
    TestimonialComponent,
    NotificacionesImplicadosComponent,
    ReportesComponent,
    RemisionApoyoPolicivoMujerComponent,
    DenunciaFiscaliaComponent,
    VisitaDomiciliariaComponent,
    RemisionSistemaSaludComponent,
    SolicitudProtocologoRiesgoComponent,
    RemisionPersoneriaComponent,
    MedicinaLegalComponent,
    SecretariaMujerComponent,
    PsicologiaExternaComponent,
    SolicitudHistoriaClinicaComponent,
    OtorgamientoMedidasProteccionComponent,
    DecisionJuezComponent,
    ListaArchivosComponent,
    ModalMedidasAutoComponent,
    ModalCargarDocumentoComponent,
    ModalReporteJuezComponent,
    ApelacionMedidaComponent,
    ResolverRecursoComponent,
    DesiertoRecursoComponent,
    OrdenadoJuezComponent,
    PruebasPardComponent,
    DecretarDesistirPardComponent,
    GridPardComponent,
    ContenedorPardComponent,
    DecretoPruebasComponent,
    NotificacionXAvisoComponent,
    NotificacionXEstadoComponent,
    NotificacionesPardComponent,
    TablaEstadoComponent,
    ComentariosEstadoComponent,
    CompetenciaPardComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AbogadoRoutingModule,
    SharedModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
  ],
  exports: [AbogadoComponent],
})
export class AbogadoModule {}
