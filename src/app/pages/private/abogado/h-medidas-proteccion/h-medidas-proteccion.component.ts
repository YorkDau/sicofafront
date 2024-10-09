import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CodigosRespuesta, ImagenesModal, Mensajes, TiposDocumentoCarga } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { ArchivoInterface, CargarArchivoInterface } from 'src/app/interfaces/shared.interfaces';
import { SharedService } from 'src/app/services/shared.service';
import { Modales } from 'src/app/shared/modals';
import { AbogadoService } from '../services/abogado.service';

@Component({
  selector: 'app-h-medidas-proteccion',
  templateUrl: './h-medidas-proteccion.component.html',
  styleUrls: ['./h-medidas-proteccion.component.scss'],
})
export class HMedidasProteccionComponent implements OnInit {

  private objSol!: any;
  private archivo!: string | null;
  public archivoConusltado: ArchivoInterface | null = null;;

  constructor(private router: Router,
    private dialog: MatDialog,
    private abogadoService: AbogadoService,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    if (sessionStorage.getItem('info')){
      this.objSol = JSON.parse(sessionStorage.getItem('info')!);
      this.consultarArchivo();
    }
    else{
      this.redireccionar();
    }
  }

  /**
   * @description asigna a una variable el archivo cargado
   * @param e archivo
   */
  public enviarArchivo(e: string) {
    
    this.archivo = e;
    if(!e)
    this.archivoConusltado = null
  }

  /**
   * @description muestra modal de cancelar solicitud
   */
  public cancelarSolicitud() {
    Modales.modalConfirmacion(Mensajes.MENSAJE_CANCELAR_SOL, this.dialog, ImagenesModal.EXCLAMACION)
      .subscribe(res => {
        if (res) {
          this.redireccionar();
        }
      });
  }


  /**
   * @description llama servicio cerrar actuación
   */
  public cerrarActuacion() {

    if (this.archivoConusltado && this.archivoConusltado.idArchivo && this.archivoConusltado.idArchivo > 0) {

      const obj = this.retornarObjCerrarActuacion();
      this.abogadoService.cerrarActuacion(obj)
        .subscribe({
          next: (data: ResponseInterface) => {
            if (data.statusCode === CodigosRespuesta.OK) {
              Modales.modalExito(Mensajes.MENSAJE_CERRAR_SOLICITUD, ImagenesModal.OK, this.dialog);
              this.redireccionar();
            } else {
              Modales.modalInformacion(Mensajes.MENSAJE_ERROR_G, this.dialog, ImagenesModal.EXCLAMACION);
            }
          }, error: () => {
            Modales.modalInformacion(Mensajes.MENSAJE_ERROR_G, this.dialog, ImagenesModal.EXCLAMACION);
          }
        });
    } else {
      Modales.modalInformacion(Mensajes.MENSAJE_SIN_ARCHIVO, this.dialog, ImagenesModal.EXCLAMACION);
    }
  }


  /**
   * @description arma objeto para cerrar la actuación
   * @returns interface
   */
  private retornarObjCerrarActuacion(): any {
    return {
      tareaID: this.objSol.idTarea,
      userID: 0,
      perfilCod: ''
    };
  }


  /**
   * @description muestra modal cerrar actuación
   */
  public modalConfirmaCerrarActuacion() {
    Modales.modalConfirmacion(Mensajes.MENSAJE_CERRAR_ACT, this.dialog, ImagenesModal.EXCLAMACION)
      .subscribe(res => {
        if (res)
          this.cerrarActuacion();
      });
  }


  /**
   * @description redirecciona a la ruta casos
   */
  private redireccionar() {
    this.router.navigate(['../abogado/casos']);
  }


  /**
   * @description llama servicio cargar archivo
   */
  public guardarArchivo() {

    if (this.archivo && this.archivo !== '') {

      const obj = this.crearObjGuardarArchivo();
      this.sharedService.guardarArchivo(obj)
        .subscribe({
          next: (data: ResponseInterface) => {
            if (data.statusCode === CodigosRespuesta.OK) {
              Modales.modalExito(Mensajes.MENSAJE_CARGA, ImagenesModal.OK, this.dialog);
              this.consultarArchivo();
            } else {
              Modales.modalExito(Mensajes.MENSAJE_CARGA_ERROR, ImagenesModal.EXCLAMACION, this.dialog);
            }
          }
        });

    } 
    else {
      Modales.modalInformacion(Mensajes.MENSAJE_SIN_ARCHIVO, this.dialog, ImagenesModal.EXCLAMACION);
    }

  }

  public consultarArchivo(){
    this.sharedService.ConsultarArchivos(this.objSol.idSolicitud,
              TiposDocumentoCarga.SOLICITUD_DE_MEDIDAS_DE_PROTECCIÓN)
              .subscribe({
                next: (data: ResponseInterface) => {
                  if (data.statusCode === CodigosRespuesta.OK && data.data && data.data.length) {
                    this.archivoConusltado = {idArchivo:data.data[0].idSolicitudDocumento,
                                             nombreArchivo:data.data[0].nombreDocumento,
                                             idSolicitud:this.objSol.idSolicitud}
                  } 
                }
              });
  }


  /**
   * @description arma interfacepara guardar
   * @returns interface armada
   */
  private crearObjGuardarArchivo(): CargarArchivoInterface {
    return {
      nombrearchivo: null,
      tipoDocumento: TiposDocumentoCarga.SOLICITUD_DE_MEDIDAS_DE_PROTECCIÓN,
      idSolicitudServicio: this.objSol.idSolicitud,
      entrada: this.archivo!
    };
  }

}
