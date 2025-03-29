import { Component } from '@angular/core';
import { EncabezadoPrivateStepEnum } from 'src/app/shared/components/general/encabezado-private/encabezado-private.component';

@Component({
  selector: 'app-trabajador-social',
  templateUrl: './trabajador-social.component.html',
  styles: [],
})
export class TrabajadorSocialComponent {
  get step() {
    return EncabezadoPrivateStepEnum.PSICOLOGO;
  }
}
