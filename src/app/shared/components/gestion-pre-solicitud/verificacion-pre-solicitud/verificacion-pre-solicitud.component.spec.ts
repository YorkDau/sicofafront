import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificacionPreSolicitudComponent } from './verificacion-pre-solicitud.component';

describe('VerificacionPreSolicitudComponent', () => {
  let component: VerificacionPreSolicitudComponent;
  let fixture: ComponentFixture<VerificacionPreSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VerificacionPreSolicitudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificacionPreSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
