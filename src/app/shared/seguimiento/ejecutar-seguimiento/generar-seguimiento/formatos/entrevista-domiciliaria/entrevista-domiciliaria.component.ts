import { Component, Input, OnInit } from '@angular/core';
import { DataSeguimiento } from 'src/app/shared/seguimiento/interfaces/seguimiento.interface';

@Component({
  selector: 'app-entrevista-domiciliaria',
  templateUrl: './entrevista-domiciliaria.component.html',
  styleUrls: ['./entrevista-domiciliaria.component.scss']
})
export class EntrevistaDomiciliariaComponent implements OnInit {

  @Input() dataReporte!: DataSeguimiento;
  constructor() { }

  ngOnInit(): void {
  }

}
