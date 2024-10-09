import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';

import { AbogadoService } from '../services/abogado.service';

import { ReporteAbogadoPDF } from 'src/app/pages/private/abogado/report/report-pdf';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { RelatoHechosComponent } from './relato-hechos/relato-hechos.component';
import { Modales } from 'src/app/shared/modals';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-medida-proteccion',
  templateUrl: './medida-proteccion.component.html',
  styleUrls: ['./medida-proteccion.component.scss']
})
export class MedidaProteccionComponent implements OnInit, OnDestroy {

  public fechaActual: Date = new Date();
  public objSolicitud!: any;
  public victimaForm!: any;
  public agresorForm!: any;
  public relatoHechos: any;
  public tipoViolencia: DominioInterface[] = [];

  private tipoViolenciaObs = this.abogadoService.tipoViolencia$;
  private tipoVSub!: Subscription;

  @ViewChild(RelatoHechosComponent) relatosComponent!: RelatoHechosComponent;

  constructor(private abogadoService: AbogadoService,
    private dialog: MatDialog) {
    this.objSolicitud = JSON.parse(sessionStorage.getItem('info')!)
  }

  ngOnDestroy(): void {
    if (this.tipoVSub)
      this.tipoVSub.unsubscribe();
  }

  ngOnInit(): void {
    this.obtenerInvolucrados();
  }


  /**
   * @description llama servicio obtener involucrado medidas protección
   */
  private obtenerInvolucrados() {
    const { idSolicitud } = this.objSolicitud;

    this.abogadoService.obtenerInvolucrados(idSolicitud)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            this.victimaForm = data.data.victima;
            this.agresorForm = data.data.agresor;
          }
        }
      });
  }


  /**
   * @description llama función generar pdf
   */
  public generarPDF() {
    ReporteAbogadoPDF.medidaProteccion();
  }


  /**
   * @description llama servicio guardar testimonial
   */
  public guardarInfo() {

    const obj = this.armarInterfaceGuardar();
    this.abogadoService.guardarTestimonial(obj)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            Modales.modalExito(Mensajes.MENSAJE_OK, ImagenesModal.OK, this.dialog);
          } else {
            Modales.modalExito(Mensajes.MENSAJE_ERROR_G, ImagenesModal.OK, this.dialog);
          }
        }, error: () => {
          Modales.modalExito(Mensajes.MENSAJE_ERROR_G, ImagenesModal.OK, this.dialog);
        }
      });
  }


  /**
   * @description arma interface para guardar
   * @return objeto a guardar
   */
  private armarInterfaceGuardar(): any {

    const { idSolicitud } = this.objSolicitud;
    const { pruebas, nombre, celular, direccion,
      correo, texto1, observaciones } = this.relatosComponent.testimonialForm.value;

    return {
      idSolicitudServicio: idSolicitud,
      tipoViolencia: this.obtenerTiposViolencia(),
      pruebasDocumento: pruebas,
      nombreTestigo: nombre,
      celularTestigo: celular,
      direccionTestigo: direccion,
      correoTestigo: correo,
      textoFijoA: texto1,
      textoFijoB: observaciones
    };

  }

  /**
   * @description obtiene los tipo de violencia seleccionados
   * @returns arreglo números id tipo violencia
   */
  private obtenerTiposViolencia(): number[] {
    let listaTipoViolencia: DominioInterface[] = [];
    this.tipoViolenciaObs.subscribe(tv => {
      listaTipoViolencia = tv;
      listaTipoViolencia = listaTipoViolencia.filter(t => t.seleccionado);
    });

    return listaTipoViolencia.map(({ id_Dominio }) => id_Dominio);
  }
}
