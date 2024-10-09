import {
  AfterContentInit,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { CodigosRespuesta } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import {
  FormTipoViolenciaInterface,
  RespuestaTipoViolencia,
} from '../../../../interfaces/involucrado.interface';
import { IdentificacionDelRiesgoService } from '../../../../services/identificacion-del-riesgo.service';

@Component({
  selector: 'app-tipos-violencia',
  templateUrl: './tipos-violencia.component.html',
  styleUrls: ['./tipos-violencia.component.scss'],
})
export class TiposViolenciaComponent implements AfterContentInit {
  @Output() siguientePaso: EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'> =
    new EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'>();

  public tipoSeleccionado: string = 'Psicológica';
  public tipos = [
    { id: 2, nombre: 'Psicológica' },
    { id: 5, nombre: 'Económica' },
    { id: 4, nombre: 'Patrimonial' },
    { id: 6, nombre: 'Coerción o Amenazas' },
    { id: 1, nombre: 'Física' },
    { id: 3, nombre: 'Sexual' },
  ];
  public currentIndex: number = 0;

  public listFormTipoViolencia: FormTipoViolenciaInterface[] = [];
  public dataPost!: RespuestaTipoViolencia;

  private tarea = JSON.parse(sessionStorage.getItem('info')!);

  constructor(
    private identificacionService: IdentificacionDelRiesgoService,
  ) {}

  ngAfterContentInit(): void {
    this.getListFormTipoViolencia(2);
  }

  /**
   * @description evento se ejecuta cuando se marca en si cualquier campo
   * @param event para obtener la informacion
   * @param tipoViolencia obtiene el tipo de violencia
   */
  public habilitarRadioMes(event: any, tipoViolencia: number) {
    const idCuestionario = event.target.name;
    const pregunta = Boolean(JSON.parse(event.target.value));
    const puntuacion = pregunta ? 1 : 0;
    this.listFormTipoViolencia = this.listFormTipoViolencia.map(
      (item: FormTipoViolenciaInterface) => {
        if (
          item.idTipoViolencia == tipoViolencia &&
          item.idQuestionario == idCuestionario
        ) {
          return {
            ...item,
            puntuacionPrevio: puntuacion,
            mesPrevio: pregunta,
          };
        }
        return item;
      }
    );
    this.setListadoRespuestas(+idCuestionario, pregunta);
  }

  /**
   * @description funcion para modificar el listado de respuesta
   * @param idCuestionario
   * @param puntuacion
   */
  private setListadoRespuestas(idCuestionario: number, puntuacion: boolean) {
    const index = this.dataPost.listadoRespuestas.findIndex(
      (item) => item.idCuestionario == idCuestionario
    );
    this.dataPost.listadoRespuestas[index] = {
      idCuestionario,
      mes: puntuacion,
      puntuacion,
    };
  }

  /**
   * @description funcion para modificar los valores del formulario
   * @param event
   * @param idCuestionario
   */
  public setMesListadoRespuestas(event: any, idCuestionario: number) {
    const mes = Boolean(JSON.parse(event.target.value));

    this.dataPost.listadoRespuestas = this.dataPost.listadoRespuestas.map(
      (item) => {
        if (item.idCuestionario == idCuestionario) {
          return { ...item, mes };
        }
        return item;
      }
    );
  }

  /**
   * @description funcion para obtener el formulario por tipo de violencia
   * @param tipoViolencia
   */
  public getListFormTipoViolencia(tipoViolencia: number) {
    this.dataPost = {
      idTarea: this.tarea.idTarea,
      idSolicitudServicio: this.tarea.idSolicitud,
      idTipoViolencia: tipoViolencia,
      listadoRespuestas: [],
    };
    this.identificacionService
      .getTipoViolencia(
        this.tarea.idSolicitud,
        tipoViolencia,
        this.tarea.idTarea
      )
      .subscribe((data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.listFormTipoViolencia = data.data;
        }
        this.setInitialDataPost();
      });
  }

  /**
   * @description funcion que modifica los valores de entrada de la listaFormulario
   */
  private setInitialDataPost() {
    this.listFormTipoViolencia.forEach((item) => {
      this.dataPost.listadoRespuestas.push({
        idCuestionario: item.idQuestionario,
        mes: item.mesPrevio == null ? false : item.mesPrevio,
        puntuacion:
          item.puntuacionPrevio == null || item.puntuacionPrevio == 0
            ? false
            : true,
      });
    });
  }

  /**
   * @description funcion para cambiar de pagina de tipo de violencia
   * @param tipo
   * @param id
   * @param index
   */
  public tipoViolencia(tipo: string, id: number, index: number) {
    this.getListFormTipoViolencia(id);
    this.tipoSeleccionado = tipo;
    this.currentIndex = index;
  }

  /**
   * @description guarda la informacion del formulario
   */
  public siguiente() {
    this.identificacionService
      .postFormTipoViolencia(this.dataPost)
      .subscribe((data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          //Ultimo (Violencia sexual)
          if (this.currentIndex == this.tipos.length - 1) {
            this.siguientePaso.emit('Siguiente');
            return;
          }
          this.tipoViolencia(
            this.tipos[this.currentIndex + 1].nombre,
            this.tipos[this.currentIndex + 1].id,
            this.currentIndex + 1
          );
        }
      });
  }

  /**
   * @description funcion para volver al listado de tareas
   */
  public cancelar() {
    this.siguientePaso.emit('Cancelar');
  }

  /**
   * @description funcion para volver a la pagina anterior
   */
  public anterior() {
    this.identificacionService
      .postFormTipoViolencia(this.dataPost)
      .subscribe((data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          //Ultimo (Violencia sexual)
          if (this.currentIndex == 0) {
            this.siguientePaso.emit('Anterior');
            return;
          }
          this.tipoViolencia(
            this.tipos[this.currentIndex - 1].nombre,
            this.tipos[this.currentIndex - 1].id,
            this.currentIndex - 1
          );
        }
      });
  }
}
