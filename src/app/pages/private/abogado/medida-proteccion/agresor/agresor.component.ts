import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-agresor',
  templateUrl: './agresor.component.html',
  styleUrls: ['./agresor.component.scss'],
})
export class AgresorComponent implements OnInit {
  @Input() agresor: any;
  public agresorForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cargarForm();
    this.llenarDatosAgresor();
  }

  /**
   * @description carga form
   */
  private cargarForm() {
    this.agresorForm = this.fb.group({
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
      expedida: { value: '', disabled: true },
      edad: { value: '', disabled: true },
    });
  }

  /**
   * @description llena el formulario con la info del agresor
   */
  private llenarDatosAgresor() {
    this.agresorForm.patchValue({
      primerApellido: this.agresor.primerApellido,
      segundoApellido: this.agresor.segundoApellido,
      barrio: this.agresor.barrio,
      correo: this.agresor.correo,
      estadoCivil: this.agresor.estadoCivil,
      nivelEstudio: this.agresor.nivelEstudio,
      primerNombre: this.agresor.primerNombre,
      segundoNombre: this.agresor.segundoNombre,
      numeroDocumento: this.agresor.numeroDocumento,
      ocupacion: this.agresor.ocupacion,
      parentesco: this.agresor.parentesco,
      telefono: this.agresor.telefono,
      tipoDocumento: this.agresor.tipoDocumento,
      direccion: this.agresor.direccion,
      expedida: this.agresor.lugarExpedicionAgresor,
      edad: this.agresor.edad,
    });
  }
}
