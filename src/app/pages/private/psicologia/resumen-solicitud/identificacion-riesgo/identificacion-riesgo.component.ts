import { StepperOrientation } from '@angular/cdk/stepper';
import { Component, inject, ViewChild } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-identificacion-riesgo',
  templateUrl: './identificacion-riesgo.component.html',
  styleUrls: ['./identificacion-riesgo.component.scss'],
})
export class IdentificacionRiesgoComponent {
  @ViewChild('stepper') stepper!: MatStepper;
  public orientation: StepperOrientation = 'horizontal';
  public selectedTab = 1;

  constructor(private title: Title, private activedRoute: ActivatedRoute) {
    this.title.setTitle('SICOFA - Identificación riesgo');
    if (window.screen.width <= 768) {
      this.orientation = 'vertical';
    } else {
      this.orientation = 'horizontal';
    }
    this.selectedTab = (this.activedRoute.snapshot.params.tab ?? 1) as number
  }

  /**
   * @description cambia valores del tab
   * @param tab valor del tab
   */
  cambiarTab(tab: number) {
    this.selectedTab = tab;
  }
}
