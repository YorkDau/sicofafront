import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevisionLegalPreSolicitudComponent } from './revision-legal-pre-solicitud.component';

describe('RevisionLegalPreSolicitudComponent', () => {
  let component: RevisionLegalPreSolicitudComponent;
  let fixture: ComponentFixture<RevisionLegalPreSolicitudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevisionLegalPreSolicitudComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevisionLegalPreSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
