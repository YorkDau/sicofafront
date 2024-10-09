import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { SharedService } from '../../../../../services/shared.service';
import { Modales } from '../../../../../shared/modals';
import { IdentificacionDelRiesgoService } from '../../services/identificacion-del-riesgo.service';
import { DatosInvolucradosComponent } from './datos-involucrados.component';

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

describe('Actualizar involucrados - Datos involucrados', () => {
  let component: DatosInvolucradosComponent;
  let fixture: ComponentFixture<DatosInvolucradosComponent>;
  let identificacionDelRiesgoService: IdentificacionDelRiesgoService;
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
        IdentificacionDelRiesgoService,
        Modales,
        NgxSpinnerService,
        SharedService,
        MatDialog,
        Title,
        FormBuilder,
      ],
      declarations: [DatosInvolucradosComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosInvolucradosComponent);
    component = fixture.componentInstance;
    component.tarea = tarea;
    fixture.detectChanges();
    identificacionDelRiesgoService = fixture.debugElement.injector.get(
      IdentificacionDelRiesgoService
    );
    modales = fixture.debugElement.injector.get(Modales);
    sharedService = fixture.debugElement.injector.get(SharedService);
    spinner = fixture.debugElement.injector.get(NgxSpinnerService);
  });
  beforeEach(() => {
    component.tarea = tarea;
  });
  it('comprobar solicitud y tarea', () => {
    expect(component.tarea).not.toBeNull();
  });

  it('Should create', () => {
    expect(component).toBeTruthy();
  });
});
