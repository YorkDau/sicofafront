import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-datos-victima',
  templateUrl: './datos-victima.component.html',
  styleUrls: ['./datos-victima.component.scss'],
})
export class DatosVictimaComponent {
  @Input() datosVictima: any;
}
