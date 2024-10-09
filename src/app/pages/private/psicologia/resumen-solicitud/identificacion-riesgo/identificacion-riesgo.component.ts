import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-identificacion-riesgo',
  templateUrl: './identificacion-riesgo.component.html',
  styleUrls: ['./identificacion-riesgo.component.scss'],
})
export class IdentificacionRiesgoComponent {
  @ViewChild('stepper') stepper!: MatStepper;

  public orientation: StepperOrientation = 'horizontal';
  public selectedTab: number = 1;

  constructor(private title: Title) {
    this.title.setTitle('SICOFA - Identificación riesgo');
    if (window.screen.width <= 768) {
      this.orientation = 'vertical';
    } else {
      this.orientation = 'horizontal';
    }
  }

  /**
   * @description cambia valores del tab
   * @param tab valor del tab
   */
  cambiarTab(tab: number) {
    this.selectedTab = tab;
  }
}
