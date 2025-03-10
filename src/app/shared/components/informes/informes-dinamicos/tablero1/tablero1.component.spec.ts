import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tablero1Component } from './tablero1.component';

describe('Tablero1Component', () => {
  let component: Tablero1Component;
  let fixture: ComponentFixture<Tablero1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Tablero1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Tablero1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
