import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HijosInvolucradosComponent } from './hijos-involucrados.component';

describe('HijosInvolucradosComponent', () => {
  let component: HijosInvolucradosComponent;
  let fixture: ComponentFixture<HijosInvolucradosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HijosInvolucradosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HijosInvolucradosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
