import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';
import { CitaInterface } from '../interfaces/cita.interface';

@Component({
  selector: 'app-cita',
  templateUrl: './cita.component.html',
  styleUrls: ['./cita.component.scss']
})
export class CitaComponent implements OnInit {

  public horarioForm!: FormGroup;

  public listaCita: CitaInterface[] = [];
  public nombreComisaria: string = '';


  constructor(private fb: FormBuilder,
    private store: Store<AppState>) { }


  ngOnInit(): void {
    this.horarioForm = this.fb.group({
      horario: [false, Validators.requiredTrue]
    });

    this.store.select('comisaria')
      .subscribe(({ comisaria }) => this.nombreComisaria = comisaria?.nombComisaria!);
  }


  /**
   * @description valida que exista un horario seleccionado
   * @param resultado valor emitido por el form padre
   */
  validarHorarioSeleccionado(resultado: boolean, stepper: MatStepper) {
    this.horarioForm.controls['horario'].setValue(resultado);
    if (this.horarioForm.valid) {
      stepper.next();
    } else {
      stepper.previous();
    }
  }

}

