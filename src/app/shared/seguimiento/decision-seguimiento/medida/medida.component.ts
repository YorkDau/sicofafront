import { Component, Input, OnInit } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';
import { ArchivoInterface } from 'src/app/interfaces/shared.interfaces';
import { MedidasInterface } from '../../interfaces/medidas.interface';

@Component({
  selector: 'app-medida',
  templateUrl: './medida.component.html',
  styleUrls: ['./medida.component.scss'],
})
export class MedidaComponent implements OnInit {
  @Input() objSol = JSON.parse(sessionStorage.getItem('info')!);
  @Input() form!: FormGroup;
  @Input() data: MedidasInterface[] = [];

  nombreMedida: string = '';
  numMedida: number = 0;
  variable = true;

  public mostrarValidaciones: boolean = false;

  constructor() {}

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.nombreMedida = this.f.nombreMedida.value;
    this.numMedida = this.f.id.value + 1;
  }

  public enviarArchivo(archivo: string) {
    this.f.adjunto.setValue(archivo);
  }

  public cargarArchivo(): ArchivoInterface | null {
    let n = null;
    if (this.f.idAnexoProrroga.value !== null) {
      n = {
        idArchivo: this.data[this.f.id.value].idAnexoProrroga,
        idSolicitud: this.objSol.idSolicitud,
        nombreArchivo: this.data[this.f.id.value].nomMedida,
      };
    }
    return n;
  }

  public isRequiredMedidas(form: FormGroup, campo: string): boolean {
    return form.controls[campo].hasError('required');
  }

  public isRequiredFecha(form: FormGroup): boolean {
    return form.hasError('isRequiredFechaProrroga');
  }

  public isRequiredJustificacion(form: FormGroup): boolean {
    return form.hasError('isRequiredJustificacionProrroga');
  }
}
