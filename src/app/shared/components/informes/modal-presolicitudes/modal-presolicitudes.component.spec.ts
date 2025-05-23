import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalPresolicitudesComponent } from './modal-presolicitudes.component';

describe('ModalPresolicitudesComponent', () => {
  let component: ModalPresolicitudesComponent;
  let fixture: ComponentFixture<ModalPresolicitudesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalPresolicitudesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPresolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
