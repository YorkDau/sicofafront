import { Component } from '@angular/core';
import { EncabezadoPrivateStepEnum } from 'src/app/shared/components/general/encabezado-private/encabezado-private.component';

@Component({
  selector: 'app-comisario',
  templateUrl: './comisario.component.html',
})
export class ComisarioComponent {
  get step() {
    return EncabezadoPrivateStepEnum.COMISARIO;
  }
}
