import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionPreSolicitudComponent } from './recepcion-pre-solicitud.component';

describe('RecepcionPreSolicitudComponent', () => {
  let component: RecepcionPreSolicitudComponent;
  let fixture: ComponentFixture<RecepcionPreSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecepcionPreSolicitudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecepcionPreSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
