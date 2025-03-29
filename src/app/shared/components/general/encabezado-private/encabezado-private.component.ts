import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccionanteDTO } from 'src/app/pages/private/psicologia/interfaces/accionante.interface';
import {
  CodigosRespuesta,
  ImagenesModal,
  Mensajes,
} from '../../../../constants';
import { ResponseInterface } from '../../../../interfaces/response.interface';
import { ResumentCasoPsicologiaService } from '../../../../pages/private/psicologia/services/resumen-solicitud.service';
import { Modales } from '../../../modals';

export enum EncabezadoPrivateStepEnum {
  NA = -1,
  AUXILIAR = 0,
  PSICOLOGO = 1,
  ABOGADO = 2,
  COMISARIO = 3,
}

@Component({
  selector: 'app-encabezado-private',
  templateUrl: './encabezado-private.component.html',
  styleUrls: ['./encabezado-private.component.scss'],
})
export class EncabezadoPrivateComponent implements OnInit {  
  @Input() public step: EncabezadoPrivateStepEnum = -1;

  public accionante!: AccionanteDTO;
  public objSol!: any;

  constructor(
    private resumenService: ResumentCasoPsicologiaService,
    private dialog: MatDialog
  ) {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
  }

  ngOnInit(): void {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
    if (this.objSol) {
      this.resumenService
        .getDetallesCiudadanoAccionante(this.objSol.idSolicitud)
        .subscribe({
          next: (data: ResponseInterface) => {
            if (data.statusCode === CodigosRespuesta.OK) {
              this.accionante = data.data;
            } else {
              Modales.modalInformacion(
                Mensajes.MENSAJE_ERROR_G,
                this.dialog,
                ImagenesModal.EXCLAMACION
              );
            }
          },
          error: () => {
            Modales.modalInformacion(
              Mensajes.MENSAJE_ERROR_G,
              this.dialog,
              ImagenesModal.EXCLAMACION
            );
          },
        });
    }
  }
}
