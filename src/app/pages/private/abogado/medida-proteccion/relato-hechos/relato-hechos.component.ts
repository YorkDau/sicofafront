import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CodigosRespuesta, ImagenesModal, Mensajes, Regex } from 'src/app/constants';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { SharedService } from 'src/app/services/shared.service';
import { Modales } from 'src/app/shared/modals';
import { IdentificacionDelRiesgoService } from '../../../psicologia/services/identificacion-del-riesgo.service';
import { AbogadoService } from '../../services/abogado.service';

@Component({
  selector: 'app-relato-hechos',
  templateUrl: './relato-hechos.component.html',
  styleUrls: ['./relato-hechos.component.scss'],
  providers: [DatePipe],
})
export class RelatoHechosComponent implements OnInit {
  @Input() listaTipoV: DominioInterface[] = [];

  private objSolicitud!: any;

  public relatoForm!: FormGroup;
  public testimonialForm!: FormGroup;
  public listaTextos: DominioInterface[] = [];
  public listaTipoViolencia: DominioInterface[] = [];

  constructor(
    private abogadoService: AbogadoService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private sharedService: SharedService,
    private identificacionRiesgoService: IdentificacionDelRiesgoService
  ) {
    this.objSolicitud = JSON.parse(sessionStorage.getItem('info')!);
  }

  ngOnInit(): void {
    this.cargarForms();
    this.obtenerInfoHechos();
    this.cargarRelatoHechos();
    this.cargarTipoViolencia();
    this.obtenerTestimonial();
    this.testimonialForm.valueChanges.subscribe((t) => {
      this.abogadoService.emitirTestimonial(t);
    });
  }

  /**
   * @description carga los objetos formularios
   */
  private cargarForms() {
    this.relatoForm = this.fb.group({
      fecha: { value: '', disabled: true },
      hora: { value: '', disabled: true },
      descripcionHechos: { value: '', disabled: true },
      lugarHechos: { value: '', disabled: true },
    });

    this.testimonialForm = this.fb.group({
      pruebas: '',
      nombre: '',
      celular: '',
      direccion: '',
      correo: ['', Validators.pattern(Regex.EMAIL)],
      texto1: '',
      observaciones: '',
    });
  }

  /**
   * @description consulta info de los hechos de la solicitud
   */
  private obtenerInfoHechos() {
    const { idSolicitud } = this.objSolicitud;
    this.identificacionRiesgoService
      .getDescripcionHechosPorSolicitud(idSolicitud)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            const { fecha, hora, descripcionHechos, lugarHechos } = data.data;
            this.relatoForm.patchValue({
              fecha: this.datePipe.transform(fecha, 'dd/MM/yyyy'),
              hora,
              descripcionHechos,
              lugarHechos,
            });
            this.abogadoService.emitirObjRelato(data.data);
          } else {
            Modales.modalInformacion(
              Mensajes.MENSAJE_ERROR_G,
              this.dialog,
              ImagenesModal.EXCLAMACION
            );
          }
        },
      });
  }

  /**
   * @description llama servicio cargas relato hechos
   */
  private cargarRelatoHechos() {
    this.sharedService.getDominio('Texto_fijo').subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.listaTextos = data.data;
        }
      },
    });
  }

  /**
   * @description llama servicio cargas relato hechos
   */
  private cargarTipoViolencia() {
    this.sharedService.getDominio('Tipo_violencia_Medida').subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.listaTipoViolencia = data.data;
        }
      },
    });
  }

  /**
   * @description marca o desmarca los campos dominio tipo violencia
   * @param idTipoV id dominio
   */
  public marcarTipoViolencia(idTipoV: number) {
    setTimeout(() => {
      this.listaTipoViolencia.forEach((element) => {
        if (element.id_Dominio === idTipoV)
          element.seleccionado = !element.seleccionado;
      });
      this.abogadoService.emitirTipoViolencia(this.listaTipoViolencia);
    }, 100);
  }

  /**
   * @description llama servicio para obtener testimonial
   */
  private obtenerTestimonial() {
    this.abogadoService
      .obtenerTestimonial(this.objSolicitud.idSolicitud)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            this.testimonialForm.patchValue({
              pruebas: data.data.pruebasDocumento,
              nombre: data.data.nombreTestigo,
              celular: data.data.celularTestigo,
              direccion: data.data.direccionTestigo,
              correo: data.data.correoTestigo,
              texto1: data.data.textoFijoA,
              observaciones: data.data.textoFijoB,
            });
            this.cargarTipoViolenciaSel(data.data.tipoViolencia);
          }
        },
      });
  }

  /**
   * @description marca los tipos de violencia que se guardaron
   * @param lista arreglo de ids tipos de violencia
   */
  private cargarTipoViolenciaSel(lista: number[]) {
    if (lista.length) {
      setTimeout(() => {
        lista.forEach((e) => {
          this.listaTipoViolencia.forEach((tv) => {
            if (tv.id_Dominio === e) {
              tv.seleccionado = true;
            }
          });
        });
        this.abogadoService.emitirTipoViolencia(this.listaTipoViolencia);
      }, 100);
    }
  }

  /**
   * @description filtra solo números
   * @param input entrada
   */
  public formatInput(input: HTMLInputElement) {
    input.value = input.value.replace(Regex.NUMERO_G, '');
  }
}
