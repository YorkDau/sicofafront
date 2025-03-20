import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservacionApelacionComponent } from './observacion-apelacion.component';

describe('ObservacionApelacionComponent', () => {
  let component: ObservacionApelacionComponent;
  let fixture: ComponentFixture<ObservacionApelacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ObservacionApelacionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservacionApelacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
