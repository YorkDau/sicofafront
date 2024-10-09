import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-datos-denunciado',
  templateUrl: './datos-denunciado.component.html',
  styleUrls: ['./datos-denunciado.component.scss'],
})
export class DatosDenunciadoComponent {
  @Input() datosAgresor: any;
  @Input() victimaSecundaria: any[]=[];
}
