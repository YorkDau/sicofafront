import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionPreSolicitudComponent } from './gestion-pre-solicitud.component';

describe('GestionPreSolicitudComponent', () => {
  let component: GestionPreSolicitudComponent;
  let fixture: ComponentFixture<GestionPreSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GestionPreSolicitudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionPreSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
