import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-incumplimiento',
  templateUrl: './incumplimiento.component.html',
})
export class IncumplimientoComponent {
  @Input() datosIncumplimiento: any;

  public fechaActual = new Date();
}
