import { Component, Input, OnInit } from '@angular/core';
@Component({
  selector: 'app-reporte-medida',
  templateUrl: './reporte-medida.component.html',
  styleUrls: ['./reporte-medida.component.scss']
})
export class ReporteMedidaComponent implements OnInit {


  public ciudad: string = '';
  @Input() victima: any;
  @Input() agresor: any;
  @Input() testimonial: any;

  public fechaActual: Date = new Date();

  ngOnInit(): void {
    const { municipioComisaria } = JSON.parse(sessionStorage.getItem('info')!);
    this.ciudad = municipioComisaria;
  }


}
