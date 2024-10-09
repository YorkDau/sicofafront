import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import {
  CodigosRespuesta,
  ImagenesModal,
  Mensajes,
  TiposDocumentoCarga,
} from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import { MedidasJuezInterface } from '../../../interfaces/decision-juez';
import { Subject, Subscription } from 'rxjs';
import { AbogadoService } from '../../../services/abogado.service';
import { GridInterface } from '../interfaces/grid-interface';

@Component({
  selector: 'app-decretar-desistir-pard',
  templateUrl: './decretar-desistir-pard.component.html',
  styles: [],
})
export class DecretarDesistirPardComponent implements OnInit, OnDestroy {
  public columnas: GridInterface[] = [];
  public valorRadio: string = 'ADD';
  public listadoMedidas: MedidasJuezInterface[] = [];
  public decretarDesistirForm!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public tipoDocumentoPARD = TiposDocumentoCarga.DECRETAR_DESISTIR_PARD;

  private objSol!: any;
  private gridPardSub!: Subscription;
  public gridInvolucradosSub: Subject<any[]> = new Subject();

  constructor(
    private abogadoService: AbogadoService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {}

  ngOnDestroy(): void {
    if (this.gridPardSub) {
      this.abogadoService.emitirPARD(false);
      this.gridPardSub.unsubscribe();
      this.gridInvolucradosSub.next([]);
    }
  }

  ngOnInit(): void {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
    this.consultarPruebasDecreto('ADD');
    this.armarColumnas();
    this.consultaListaMedidasDecreto();
    this.cargarForm();
    this.gridPardSub = this.abogadoService.gridPard$.subscribe((v) =>
      v ? this.consultaListaMedidasDecreto() : null
    );
  }

  /**
   * @description carga formulario
   */
  private cargarForm(): void {
    this.decretarDesistirForm = this.fb.group({
      idSolicitudServicio: this.objSol.idSolicitud,
      idTarea: this.objSol.idTarea,
      idMedida: [0, Validators.min(1)],
      tipoMedida: 0,
      tipoDecreto: 'ADD',
    });
  }

  /**
   * @description arma las columnas para enviar al componente de grid
   */
  private armarColumnas(): void {
    this.columnas = [
      {
        key: 'nombrePrueba',
        header: 'Nombre prueba',
      },
    ];
  }

  /**
   * @description llama servicio consultar pruebas decreto
   */
  private consultarPruebasDecreto(valor: string): void {
    this.abogadoService
      .consultarPruebasDecreto(this.objSol.idSolicitud, valor)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            if (data.data.length) {
              this.listadoMedidas = data.data;
            } else {
              this.listadoMedidas = [];
            }
          }
        },
      });
  }

  /**
   * @description llama la función según el valor del radio
   */
  public changeRadio(valor: string): void {
    this.consultarPruebasDecreto(valor);
  }

  /**
   * @description llama servicio que llena la grilla
   */
  private consultaListaMedidasDecreto(): void {
    this.abogadoService
      .consultaListaMedidasDecreto(this.objSol.idSolicitud)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            this.gridInvolucradosSub.next(data.data);
            this.consultarPruebasDecreto(
              this.decretarDesistirForm.controls['tipoDecreto'].value
            );
            this.decretarDesistirForm.controls['idMedida'].setValue(0);
          }
        },
      });
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param campo variable para ingresar el campo requerido
   */
  public isMin(campo: string): boolean {
    if (this.decretarDesistirForm.controls[campo]) {
      return this.decretarDesistirForm.controls[campo].hasError('min');
    } else {
      return false;
    }
  }

  /**
   * @description valida formulario y llama función que guarda lo seleccionado
   */
  public guardarMedida(): void {
    if (this.decretarDesistirForm.valid) {
      this.agregarDecreto();
    } else {
      this.mostrarValidaciones = true;
    }
  }

  /**
   * @description llama servicio que guarda el decretar o desistir
   */
  private agregarDecreto(): void {
    this.abogadoService
      .agregarDecreto(this.decretarDesistirForm.value)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            Modales.modalExito(
              Mensajes.MENSAJE_OK,
              ImagenesModal.OK,
              this.dialog
            );
            this.consultaListaMedidasDecreto();
          } else {
            this.modalError();
          }
        },
        error: () => {
          this.modalError();
        },
      });
  }

  /**
   * @description muestra modal error
   */
  private modalError(): void {
    Modales.modalInformacion(
      Mensajes.MENSAJE_ERROR_G,
      this.dialog,
      ImagenesModal.EXCLAMACION
    );
  }
}
