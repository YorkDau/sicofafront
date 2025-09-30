import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDetalleSolicitudCiudadanoComponent } from './modal-detalle-solicitud-ciudadano.component';

describe('ModalDetalleSolicitudCiudadanoComponent', () => {
  let component: ModalDetalleSolicitudCiudadanoComponent;
  let fixture: ComponentFixture<ModalDetalleSolicitudCiudadanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalDetalleSolicitudCiudadanoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDetalleSolicitudCiudadanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
