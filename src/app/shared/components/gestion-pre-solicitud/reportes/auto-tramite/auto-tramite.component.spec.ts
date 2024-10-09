import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoTramiteComponent } from './auto-tramite.component';

describe('AutoTramiteComponent', () => {
  let component: AutoTramiteComponent;
  let fixture: ComponentFixture<AutoTramiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutoTramiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoTramiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
