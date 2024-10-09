import { Component, Input, OnInit } from '@angular/core';
import { DataSeguimiento } from 'src/app/shared/seguimiento/interfaces/seguimiento.interface';

@Component({
  selector: 'app-seguimiento-medidas',
  templateUrl: './seguimiento-medidas.component.html',
  styleUrls: ['./seguimiento-medidas.component.scss']
})
export class SeguimientoMedidasComponent implements OnInit {

  @Input() dataReporte!: DataSeguimiento;

  constructor() { }

  ngOnInit(): void {
  }

}
