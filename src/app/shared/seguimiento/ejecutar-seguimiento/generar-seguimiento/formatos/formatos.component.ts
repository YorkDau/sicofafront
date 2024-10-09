import { Component, Input, OnInit } from '@angular/core';
import { DataReporteInterface } from 'src/app/pages/private/interfaces/data-reporte.interface';

@Component({
  selector: 'app-formatos',
  templateUrl: './formatos.component.html',
  styleUrls: ['./formatos.component.scss']
})
export class FormatosComponent implements OnInit {

  @Input() tipoFormato!: string;
  @Input() dataReporte!: DataReporteInterface;

  constructor() { }

  ngOnInit(): void {
  }

}
