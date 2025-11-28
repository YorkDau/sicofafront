import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaTrasladoComponent } from './consulta-traslado.component';

describe('ConsultaTrasladoComponent', () => {
  let component: ConsultaTrasladoComponent;
  let fixture: ComponentFixture<ConsultaTrasladoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaTrasladoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaTrasladoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
