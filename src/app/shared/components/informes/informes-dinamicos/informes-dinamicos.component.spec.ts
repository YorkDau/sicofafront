import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformesDinamicosComponent } from './informes-dinamicos.component';

describe('InformesDinamicosComponent', () => {
  let component: InformesDinamicosComponent;
  let fixture: ComponentFixture<InformesDinamicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformesDinamicosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformesDinamicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
