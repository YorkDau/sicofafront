import { formatDate } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImagenesModal } from 'src/app/constants';
import { PreSolicitudService } from 'src/app/pages/private/services/pre-solicitud.service';
import { Modales } from 'src/app/shared/modals';
import { PdfExport } from '../pdf-export';

interface infoReporte {
  ciudad: string,
  nombreComisario: string,
  nombreVictima: string,
  numeroDocumentoVictima: string,
  codigoSolicitud: string,
  nombreComisaria: string,
  nombreDenunciante: string
}


@Component({
  selector: 'app-auto-tramite',
  templateUrl: './auto-tramite.component.html',
  styleUrls: ['./auto-tramite.component.scss']
})
export class AutoTramiteComponent implements OnInit {

  idSolicitud!: number;
  informacion: infoReporte | null = null;

  dia = formatDate(new Date(), 'dd', 'es');
  mes = formatDate(new Date(), 'MMMM', 'es');
  anio = formatDate(new Date(), 'yyyy', 'es'); 

  constructor(
    private presolicitudService: PreSolicitudService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
  }

  generarPDF() {
    let info = JSON.parse(sessionStorage.getItem("info")!);
    this.presolicitudService.getInfoReporte(info.idSolicitud)
      .subscribe({
        next: ({ data }) => {
          this.informacion = data;
          setTimeout(() => {
            PdfExport.generarPdfOrientaciones();
          }, 1000);
        },
        error: () => {
          Modales.modalInformacion(
            'Error al obtener la informacion del reporte',
            this.dialog,
            ImagenesModal.EXCLAMACION
          );
        }
      });
  }

}
