import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaApelacionesComponent } from './consulta-apelaciones.component';

describe('ConsultaApelacionesComponent', () => {
  let component: ConsultaApelacionesComponent;
  let fixture: ComponentFixture<ConsultaApelacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaApelacionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaApelacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
