import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { SharedFunctions } from 'src/app/shared/functions';
import { Regex } from '../../../../../../constants';

@Component({
  selector: 'app-hijos-involucrados',
  templateUrl: './hijos-involucrados.component.html',
  styleUrls: ['./hijos-involucrados.component.scss'],
})
export class HijosInvolucradosComponent {
  @Input() form!: FormGroup;
  @Input() listaSexo!: DominioInterface;
  @Input() listaTipoRelacion!: DominioInterface;

  /**
   * @description valida los campos segun el nombre y las condiciones del formulario
   * @param name nombre del campo en el formulario
   * @returns
   */
  public isRequiredField(
    form: FormGroup,
    name: string,
    obligatory: boolean = false
  ) {
    const dirty = form.get(name)?.dirty;
    const required = SharedFunctions.findInvalidControls(form).includes(name);
    const empty =
      typeof form.get(name)?.value == 'string' && form.get(name)?.value == '';
    if (obligatory) {
      return dirty && empty;
    }
    return dirty && required ? !form.get(name)?.valid || empty : false;
  }

  /**
   * @description filtra solo números
   * @param input entrada
   */
  public inputNumber(
    input: HTMLInputElement,
    min: number = 0,
    max: number = 9
  ) {
    let value: number = Number(
      input.value
        .replace(Regex.NUMERO_G, '')
        .substring(0, max > 9 ? max.toString().length : 1)
    );
    if (value < min) {
      value = min;
    }
    if (value > max) {
      value = 0;
    }
    input.value = value + '';
  }
}
