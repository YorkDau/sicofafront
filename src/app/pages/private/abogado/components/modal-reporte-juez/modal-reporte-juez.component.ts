import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Mensajes } from 'src/app/constants';
import { ReporteAbogadoPDF } from '../../report/report-pdf';
interface TipoReporteJuez {
  nombre: string;
  valor: string;
}
@Component({
  selector: 'app-modal-reporte-juez',
  templateUrl: './modal-reporte-juez.component.html',
  styleUrls: ['./modal-reporte-juez.component.scss'],
})
export class ModalReporteJuezComponent {
  public listaReporte: TipoReporteJuez[] = [
    {
      nombre: 'Envío apelación al juez de familia',
      valor: '#medida-auto',
    },
    {
      nombre: 'Resolver recurso de apelación',
      valor: '#resolver-recurso',
    },
    {
      nombre: 'Auto se declara desierto el recurso de apelación',
      valor: '#desierto-recurso',
    },
    {
      nombre: 'Auto cumpliendo lo ordenado por el juez',
      valor: '#ordenado-juez',
    },
  ];

  public tipoReporte: string = '';
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;

  constructor(private dialogRef: MatDialogRef<ModalReporteJuezComponent>) {}

  /**
   * @description cierra modal
   */
  cerrarModal() {
    this.dialogRef.close();
  }

  /**
   * @description genera reporte según seleccion
   */
  public generarReporte() {
    if (this.tipoReporte !== '') {
      ReporteAbogadoPDF.ReporteJuez(this.tipoReporte);
      this.mostrarValidaciones = false;
    } else {
      this.mostrarValidaciones = true;
    }
  }

  /**
   * @description asigna a la variable el reporte a generar
   * @param valor reporte a generar
   */
  public seleccionarTipoReporte(valor: string) {
    this.tipoReporte = valor;
  }
}
