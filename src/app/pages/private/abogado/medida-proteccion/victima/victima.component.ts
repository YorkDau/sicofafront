import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
@Component({
  selector: 'app-victima',
  templateUrl: './victima.component.html',
  styleUrls: ['./victima.component.scss'],
})
export class VictimaComponent implements OnInit {
  @Input() victima: any;
  public victimaForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cargarForm();
    this.llenarDatosVictima();
  }

  /**
   * @description carga form
   */
  private cargarForm() {
    this.victimaForm = this.fb.group({
      primerApellido: { value: '', disabled: true },
      segundoApellido: { value: '', disabled: true },
      barrio: { value: '', disabled: true },
      correo: { value: '', disabled: true },
      estadoCivil: { value: '', disabled: true },
      nivelEstudio: { value: '', disabled: true },
      primerNombre: { value: '', disabled: true },
      segundoNombre: { value: '', disabled: true },
      numeroDocumento: { value: '', disabled: true },
      ocupacion: { value: '', disabled: true },
      parentesco: { value: '', disabled: true },
      telefono: { value: '', disabled: true },
      tipoDocumento: { value: '', disabled: true },
      direccion: { value: '', disabled: true },
    });
  }

  /**
   * @description llena el formulario con la info de la víctima
   */
  private llenarDatosVictima() {
    this.victimaForm.patchValue({
      primerApellido: this.victima.primerApellido,
      segundoApellido: this.victima.segundoApellido,
      barrio: this.victima.barrio,
      correo: this.victima.correo,
      estadoCivil: this.victima.estadoCivil,
      nivelEstudio: this.victima.nivelEstudio,
      primerNombre: this.victima.primerNombre,
      segundoNombre: this.victima.segundoNombre,
      numeroDocumento: this.victima.numeroDocumento,
      ocupacion: this.victima.ocupacion,
      parentesco: this.victima.parentesco,
      telefono: this.victima.telefono,
      tipoDocumento: this.victima.tipoDocumento,
      direccion: this.victima.direccion,
    });
  }
}
