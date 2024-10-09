import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { of } from 'rxjs';
import { EstadosNotificacionImplicado } from '../../../../constants';
import { SharedService } from '../../../../services/shared.service';
import { Modales } from '../../../../shared/modals';
import { NotificacionImplicado } from '../../interfaces/abogado.interface';
import { NotificacionesImplicadoService } from '../services/notificaciones-implicados.service';
import { NotificacionesImplicadosComponent } from './notificaciones-implicados.component';

const mockResponse = {
  statusCode: 200,
  message: 'Test response',
  data: [],
};

const tarea = {
  idSolicitud: 100,
  idTarea: 185,
  codsolicitud: '4892398722022300',
  nombresApellidos: 'Carlos Joel Vila Bringuez',
  tipoProceso: 'Generación del Caso-Notificar la audiencia',
  numeroDocumento: 702869,
  fechaSolicitud: '2022-07-22',
  estado: 'Ejecución',
  path: '../abogado/notificaciones-implicados',
  riesgo: 0,
  ciudadanoID: 0,
  actividad: 'Notificar la audiencia',
  tipoSolicitud: 'SOL',
  pathRetorno: '',
};

const rowEnviado: NotificacionImplicado = {
  estado: EstadosNotificacionImplicado.ENVIADO,
  idAnexo: 0,
  idInvolucrado: 1,
  nombres: 'Nombre aleatorio',
};

const rowNoEnviado: NotificacionImplicado = {
  estado: EstadosNotificacionImplicado.NO_ENVIADO,
  idAnexo: 0,
  idInvolucrado: 1,
  nombres: 'Nombre aleatorio',
};

const rowRecibido: NotificacionImplicado = {
  estado: EstadosNotificacionImplicado.RECIBIDO,
  idAnexo: 1,
  idInvolucrado: 1,
  nombres: 'Nombre aleatorio',
};
describe('Notificaciones Implicados', () => {
  let component: NotificacionesImplicadosComponent;
  let fixture: ComponentFixture<NotificacionesImplicadosComponent>;
  let notificacionesImplicadoService: NotificacionesImplicadoService;
  let modales: Modales;
  let sharedService: SharedService;
  let spinner: NgxSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        NotificacionesImplicadoService,
        Modales,
        NgxSpinnerService,
        SharedService,
        MatDialog,
      ],
      declarations: [NotificacionesImplicadosComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotificacionesImplicadosComponent);
    component = fixture.componentInstance;
    component.tarea = tarea;
    fixture.detectChanges();
    notificacionesImplicadoService = fixture.debugElement.injector.get(
      NotificacionesImplicadoService
    );
    modales = fixture.debugElement.injector.get(Modales);
    sharedService = fixture.debugElement.injector.get(SharedService);
    spinner = fixture.debugElement.injector.get(NgxSpinnerService);
  });

  it('comprobar solicitud y tarea', () => {
    expect(component.tarea).not.toBeNull();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });

  it('consultar notificaciones', () => {
    const spy = jest
      .spyOn(notificacionesImplicadoService, 'consultar')
      .mockReturnValueOnce(of(mockResponse));
    component.consultar();
    expect(spy).toHaveBeenCalled();
  });

  /**
   * @descripcion si el estado es enviado
   */
  it('isEnviado', () => {
    expect(component.isEnviado(rowEnviado)).toBeTruthy();
    expect(component.isEnviado(rowNoEnviado)).toBeFalsy();
    expect(component.isEnviado(rowRecibido)).toBeFalsy();
  });

  /**
   * @descripcion si el estado es no enviado
   */
  it('isNoEnviado', () => {
    expect(component.isNoEnviado(rowEnviado)).toBeFalsy();
    expect(component.isNoEnviado(rowNoEnviado)).toBeTruthy();
    expect(component.isNoEnviado(rowRecibido)).toBeFalsy();
  });

  /**
   * @descripcion si el estado es recibido
   */
  it('isRecibido', () => {
    expect(component.isRecibido(rowEnviado)).toBeFalsy();
    expect(component.isRecibido(rowNoEnviado)).toBeFalsy();
    expect(component.isRecibido(rowRecibido)).toBeTruthy();
  });

  /**
   * @descripcion permite cargar un archivo a partir del base64
   */
  it('cargarArchivo', () => {
    const spyNotificaciones = jest
      .spyOn(notificacionesImplicadoService, 'actualizarNotificacion')
      .mockReturnValueOnce(of(mockResponse));
    const spyModal = jest
      .spyOn(modales, 'modalExito')
      .mockReturnValueOnce(of(true));
    component.cargarArchivo('base64mock', rowEnviado);
    component.cargarArchivo('base64mock', rowRecibido);
    expect(spyNotificaciones).toHaveBeenCalled();
    expect(spyModal).toHaveBeenCalled();
  });

  /**
   * @descripcion permite cargar un archivo a partir del base64
   */
  it('cargarArchivo', () => {
    const spyNotificaciones = jest
      .spyOn(notificacionesImplicadoService, 'actualizarNotificacion')
      .mockReturnValueOnce(of(mockResponse));
    const spyModal = jest
      .spyOn(modales, 'modalExito')
      .mockReturnValueOnce(of(true));
    component.cargarArchivo('base64mock', rowEnviado);
    expect(spyNotificaciones).toHaveBeenCalled();
  });

  /**
   * @descripcion permite editar un archivo a partir del base64
   */
  it('editarArchivo', () => {
    const spyShared = jest
      .spyOn(sharedService, 'editarDocumentoRemision')
      .mockReturnValueOnce(of(mockResponse));
    const spyModal = jest
      .spyOn(modales, 'modalExito')
      .mockReturnValueOnce(of(true));

    component.cargarArchivo('base64mock', rowRecibido);
    expect(spyShared).toHaveBeenCalled();
    expect(spyModal).toHaveBeenCalled();
  });

  /**
   * @descripcion permite consultar la informacion del reporte y generar su visualizacion
   */
  it('visualizarReporte', () => {
    const spyShared = jest
      .spyOn(notificacionesImplicadoService, 'generarNotificacion')
      .mockReturnValueOnce(of(mockResponse));

    component.visualizarReporte(rowNoEnviado);
    expect(spyShared).toHaveBeenCalled();
  });
});
