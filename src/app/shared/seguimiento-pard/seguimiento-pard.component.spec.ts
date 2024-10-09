import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoPardComponent } from './seguimiento-pard.component';

describe('SeguimientoPardComponent', () => {
  let component: SeguimientoPardComponent;
  let fixture: ComponentFixture<SeguimientoPardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientoPardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoPardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
