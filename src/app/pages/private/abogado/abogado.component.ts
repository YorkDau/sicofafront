import { Component } from '@angular/core';
import { EncabezadoPrivateStepEnum } from 'src/app/shared/components/general/encabezado-private/encabezado-private.component';
@Component({
  selector: 'app-abogado',
  templateUrl: './abogado.component.html',
  styleUrls: ['./abogado.component.scss'],
})
export class AbogadoComponent {
  get step() {
    return EncabezadoPrivateStepEnum.ABOGADO;
  }
}
