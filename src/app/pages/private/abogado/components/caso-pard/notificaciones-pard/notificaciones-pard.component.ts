import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CodigosRespuesta,
  ImagenesModal,
  Mensajes,
  TiposDocumentoCarga,
} from 'src/app/constants';
import { GridInterface } from '../interfaces/grid-interface';
import { Subject, Subscription } from 'rxjs';
import { AbogadoService } from '../../../services/abogado.service';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import { MatDialog } from '@angular/material/dialog';

interface InvolucradosPARD {
  idInvolucrado: number;
  nombreInvolucrado: string;
  selected: boolean;
  idAnexo?: number;
  idDocumento?: number;
}

@Component({
  selector: 'app-notificaciones-pard',
  templateUrl: './notificaciones-pard.component.html',
  styles: [],
})
export class NotificacionesPardComponent implements OnInit, OnDestroy {
  public columnas: GridInterface[] = [];
  public selectedItems: any[] = [];
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public tipoDocumentoPARD = TiposDocumentoCarga.NOTIFICAR_INVOLUCRADOS_PARD;
  public involucradosPARDForm!: FormGroup;
  public listaInvolucrados: InvolucradosPARD[] = [];
  public listaGridInvolucrados!: InvolucradosPARD[];
  public gridInvolucradosSub: Subject<InvolucradosPARD[]> = new Subject();

  private objSol!: any;
  private gridPardSub!: Subscription;

  constructor(
    private fb: FormBuilder,
    private abogadoService: AbogadoService,
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
    this.armarColumnas();
    this.cargarForm();
    this.listadoInvolucrados();
    this.listarInvolucradoNotificados();
    this.gridPardSub = this.abogadoService.gridPard$.subscribe((v) => {
      if (v) {
        this.listadoInvolucrados();
        this.listarInvolucradoNotificados();
      }
    });
  }

  /**
   * @description carga formulario
   */
  private cargarForm(): void {
    this.involucradosPARDForm = this.fb.group({
      involucrados: ['', Validators.required],
    });
  }

  /**
   * @description arma las columnas para enviar al componente de grid
   */
  private armarColumnas(): void {
    this.columnas = [
      {
        key: 'nombreInvolucrado',
        header: 'Nombre involucrado',
      },
    ];
  }

  /**
   * @description selecciona todos los involucrados de la lista
   */
  public onSelectAll(): void {
    this.listaInvolucrados.forEach((v) => (v.selected = true));
    this.involucradosPARDForm.controls['involucrados'].setValue(
      this.listaInvolucrados.filter((v) => v.selected)
    );
  }

  /**
   * @description desselecciona todos los involucrados de la lista
   */
  public onClearAll(): void {
    this.listaInvolucrados.forEach((v) => (v.selected = false));
    this.selectedItems = [];
    this.involucradosPARDForm.controls['involucrados'].setValue([]);
  }

  /**
   * @description valida formulario y llama servicio para que notifique involucrados
   */
  public validarFormulario(): void {
    if (this.involucradosPARDForm.valid) {
      this.guardarNotificacioPard();
    } else {
      this.mostrarValidaciones = true;
    }
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    if (this.involucradosPARDForm.controls[campo]) {
      return this.involucradosPARDForm.controls[campo].hasError('required');
    } else {
      return false;
    }
  }

  /**
   * @description llama servicio que carga el select
   */
  private listadoInvolucrados(): void {
    const { idSolicitud, idTarea } = this.objSol;
    this.listaInvolucrados = [];
    this.abogadoService.listadoInvolucrados(idSolicitud, idTarea).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          if (data.data.length) {
            data.data.forEach((v: InvolucradosPARD) => {
              this.listaInvolucrados.push({
                idInvolucrado: v.idInvolucrado,
                nombreInvolucrado: v.nombreInvolucrado,
                selected: false,
              });
            });
          } else {
            this.listaInvolucrados = [];
          }
        }
      },
      error: () => {
        this.modalError();
      },
    });
  }

  /**
   * @description  llama servicio para llenar la grilla
   */
  private listarInvolucradoNotificados(): void {
    const { idSolicitud, idTarea } = this.objSol;
    this.abogadoService
      .listarInvolucradoNotificados(idSolicitud, idTarea)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            if (data.data.length) {
              this.gridInvolucradosSub.next(data.data);
            }
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

  /**
   * @description llama servicio que guarda los notificados
   */
  private guardarNotificacioPard(): void {
    this.abogadoService
      .guardarNotificacioPard(this.armarObjGuardar())
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            Modales.modalExito(
              Mensajes.MENSAJE_OK,
              ImagenesModal.OK,
              this.dialog
            );
            this.onClearAll();
            this.abogadoService.emitirPARD(true);
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
   * @description arma el objeto para insertar
   * @returns objeto a insertar
   */
  private armarObjGuardar(): any {
    const { idSolicitud, idTarea } = this.objSol;
    const arrayInvolucrados =
      this.involucradosPARDForm.controls['involucrados'].value;

    return {
      involucrados: arrayInvolucrados.map((v: any) => v.idInvolucrado),
      documento: TiposDocumentoCarga.NOTIFICAR_INVOLUCRADOS_PARD,
      idSolicitudServicio: idSolicitud,
      idTarea,
    };
  }
}
