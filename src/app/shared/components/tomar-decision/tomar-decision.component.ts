import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { NgSelectConfig } from '@ng-select/ng-select';
import { Store } from '@ngrx/store';
import {
  CodigosRespuesta,
  Mensajes,
} from 'src/app/constants';
import { ArchivoInterface } from 'src/app/interfaces/shared.interfaces';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { EntidadInterface } from 'src/app/pages/private/interfaces/solicitud.interface';
import { Modales } from 'src/app/shared/modals';
import { AppState } from 'src/app/store/app.reducer';
import { SolicitudService } from 'src/app/pages/private/services/solicitud.service';


interface infoCiudadano {
  idCiudadano: number;
  nombreCompleto: string;
  nombreCiudadano: string;
  primerApellido: string;
  segundoApellido: string;
  tipoDocumento: string;
  celular: string;
  telefono: string;
  direccion: string;
  edad: number;
  fechaNacimiento: string;
  correoElectronico: string;
  numeroDocumento: string;
  registroCompleto: boolean;
  solicitudesCiudadano: any[];
}

@Component({
  selector: 'app-tomar-decision',
  templateUrl: './tomar-decision.component.html',
  styleUrls: ['./tomar-decision.component.scss'],
})
export class TomarDecisionComponent implements OnInit {

  
  public concilacion: boolean = false;
  public cumpleConcilacion: boolean = false;
  public archivoAdjunto: string = '';
  public observaciones: string = '';
  public selectEntidad: EntidadInterface[] = [];
  

  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public msgInvalido: string = Mensajes.MENSAJE_CAMPO_INV;

  public iFile: ArchivoInterface = {};

  public user!: UserInterface | undefined;

  constructor(
    private store: Store<AppState>,
    private config: NgSelectConfig,
    private datePipe: DatePipe,
    private dialog: MatDialog,
    private modales: Modales,
    private solicitudService: SolicitudService
  ) {
    this.config.notFoundText = 'No se encontraron coincidencias';
  }

  ngOnInit(): void {
    this.cargaSelectEntidad();

    
  }


  cargarArchivo(base64: string) {
    if (base64) {
      this.archivoAdjunto = base64;
    }
  }


  /**
   * @descripcion redirige a la consulta de tareas
   */
  cancelar() {
    this.modales.modalCancelar('/comisario/casos');
  }
  /**
   * @description carga el select de entidad
   */
  private cargaSelectEntidad() {
    this.solicitudService.getEntidades().subscribe((entidad) => {
      if (entidad.statusCode === CodigosRespuesta.OK) {
        this.selectEntidad = entidad.data;
      }
    });
  }
}
