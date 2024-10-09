import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompetenciaPardComponent } from './competencia-pard.component';

describe('CompetenciaPardComponent', () => {
  let component: CompetenciaPardComponent;
  let fixture: ComponentFixture<CompetenciaPardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompetenciaPardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompetenciaPardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
