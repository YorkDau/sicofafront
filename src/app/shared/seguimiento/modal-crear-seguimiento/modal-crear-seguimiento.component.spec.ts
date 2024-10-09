import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalCrearSeguimientoComponent } from './modal-crear-seguimiento.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppMaterialModule } from '../../../app.material.module';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SharedService } from 'src/app/services/shared.service';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import { CodigosRespuesta } from '../../../constants';

const mockResponse = {
  statusCode: CodigosRespuesta.OK,
  message: 'Test response',
  data: [],
};

let mostrarMensajeInformativo: boolean = false;

let myForm!: FormGroup;

describe('Prueba componente ModalCrearSeguimientoComponent', () => {
  let component: ModalCrearSeguimientoComponent;
  let fixture: ComponentFixture<ModalCrearSeguimientoComponent>;
  let sharedService: SharedService;
  let seguimientosService: SeguimientoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        AppMaterialModule,
      ],
      declarations: [ModalCrearSeguimientoComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
        {
          provide: Router,
          useValue: {},
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCrearSeguimientoComponent);
    component = fixture.componentInstance;
    component.mostrarMensajeInformativo = mostrarMensajeInformativo;

    fixture.detectChanges();
    sharedService = fixture.debugElement.injector.get(SharedService);
    seguimientosService = fixture.debugElement.injector.get(SeguimientoService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('consultar Tipos de Documentos', () => {
    const spyTipoDocumento = jest
      .spyOn(sharedService, 'getDominio')
      .mockReturnValueOnce(of(mockResponse));
    component.ngOnInit();
    expect(spyTipoDocumento).toHaveBeenCalled();
  });

  it('consultar codigos de solicitud', () => {
    const spySelectCodigo = jest
      .spyOn(seguimientosService, 'getCodigoSolicitudesPorPersona')
      .mockReturnValueOnce(of(mockResponse));
    component.cargaSelectCodigoSolicitud();
    expect(spySelectCodigo).toHaveBeenCalled();
  });


});
