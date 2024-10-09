import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-datos-denunciante',
  templateUrl: './datos-denunciante.component.html',
  styleUrls: ['./datos-denunciante.component.scss'],
})
export class DatosDenuncianteComponent {
  @Input() adicional: any;
}
