import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarCiudadanoComponent } from './registrar-ciudadano.component';

describe('RegistrarCiudadanoComponent', () => {
  let component: RegistrarCiudadanoComponent;
  let fixture: ComponentFixture<RegistrarCiudadanoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarCiudadanoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarCiudadanoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
