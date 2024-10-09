import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetPerfilComponent } from './set-perfil.component';

describe('SetPerfilComponent', () => {
  let component: SetPerfilComponent;
  let fixture: ComponentFixture<SetPerfilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetPerfilComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetPerfilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
