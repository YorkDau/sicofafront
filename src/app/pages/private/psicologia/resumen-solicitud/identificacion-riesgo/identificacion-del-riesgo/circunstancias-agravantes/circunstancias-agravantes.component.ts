import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { CodigosRespuesta } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import {
  FormTipoViolenciaInterface,
  RespuestaTipoViolencia,
} from '../../../../interfaces/involucrado.interface';
import { IdentificacionDelRiesgoService } from '../../../../services/identificacion-del-riesgo.service';

@Component({
  selector: 'app-circunstancias-agravantes',
  templateUrl: './circunstancias-agravantes.component.html',
  styleUrls: ['./circunstancias-agravantes.component.scss'],
})
export class CircunstanciasAgravantesComponent implements AfterViewInit {
  @Output() siguientePaso: EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'> =
    new EventEmitter<'Cancelar' | 'Anterior' | 'Siguiente'>();

  public tipos = [{ id: 7, nombre: 'CIRCUNSTANCIAS AGRAVANTES' }];
  public currentIndex: number = 0;
  public institucionSeleccionada: { [id: number]: string } = {};

  public listFormTipoViolencia: FormTipoViolenciaInterface[] = [];
  public dataPost!: RespuestaTipoViolencia;

  private tarea = JSON.parse(sessionStorage.getItem('info')!);

  // Opciones para el select de fuerzas armadas
  public fuerzasArmadasOptions = [
    { value: 'Policía', label: 'Policía' },
    { value: 'Ejército Nacional', label: 'Ejército Nacional' },
    { value: 'ESMAD', label: 'ESMAD' },
    { value: 'Otra', label: 'Otra' }
  ];

  // Opciones para el select de antecedentes
  public antecedentesOptions = [
    { label: 'Judiciales', value: 'Judiciales' },
    { label: 'Interdiciplinarios', value: 'Interdiciplinarios' },
    { label: 'Tribunales', value: 'Tribunales' },
    { label: 'Otros', value: 'Otros' }
  ];

  constructor(private identificacionService: IdentificacionDelRiesgoService) {}

  ngAfterViewInit(): void {
    this.getListFormTipoViolencia(7);
  }

  // Método para verificar si es la pregunta de fuerzas armadas
  public isFuerzasArmadas(descripcion: string): boolean {
    return descripcion.includes('fuerzas armadas');
  }

  // Método para verificar si es la pregunta de antecedentes judiciales
  public isAntecedentesJudiciales(descripcion: string): boolean {
    return descripcion.includes('antecedentes judiciales');
  }

  // Método para manejar el cambio en el select de fuerzas armadas
  public onFuerzaArmadaChange(idQuestionario: string, value: string) {
    this.listFormTipoViolencia = this.listFormTipoViolencia.map(item => {
      if (item.idQuestionario === Number(idQuestionario)) {
        return { ...item, fuerzaArmadaSeleccionada: value };
      }
      return item;
    });
  }

  // Método para manejar el cambio en el select de antecedentes
  public onAntecedenteChange(idQuestionario: string, value: string) {
    this.listFormTipoViolencia = this.listFormTipoViolencia.map(item => {
      if (item.idQuestionario === Number(idQuestionario)) {
        return { ...item, antecedenteSeleccionado: value };
      }
      return item;
    });
  }

  /**
   * @description evento se ejecuta cuando se marca en si cualquier campo
   * @param event para obtener la informacion
   * @param tipoViolencia obtiene el tipo de violencia
   */
  public habilitarRadioMes(event: any, tipoViolencia: number) {
    const { name, value } = event.target;
    console.log(name, value, tipoViolencia);
    const idCuestionario = event.target.name;
    const pregunta = event.target.value === 'undefined' ? undefined : Boolean(JSON.parse(event.target.value));
    const puntuacion = pregunta === undefined ? undefined : (pregunta ? 1 : 0);
    this.listFormTipoViolencia = this.listFormTipoViolencia.map(
      (item: FormTipoViolenciaInterface) => {
        if (
          item.idTipoViolencia === tipoViolencia &&
          item.idQuestionario === idCuestionario
        ) {
          // Si es "NO", limpiamos las selecciones
          const fuerzaArmadaSeleccionada = pregunta && this.isFuerzasArmadas(item.descripcion) 
            ? item.fuerzaArmadaSeleccionada 
            : undefined;
          
          const antecedenteSeleccionado = pregunta && this.isAntecedentesJudiciales(item.descripcion)
            ? item.antecedenteSeleccionado
            : undefined;
          
          return {
            ...item,
            puntuacionPrevio: puntuacion,
            mesPrevio: pregunta,
            fuerzaArmadaSeleccionada,
            antecedenteSeleccionado
          };
        }
        return item;
      }
    );
    console.log(idCuestionario, pregunta, puntuacion);
    this.setListadoRespuestas(+idCuestionario, pregunta);
  }
  /**
   * @description funcion para modificar el listado de respuesta
   * @param idCuestionario
   * @param puntuacion
   */
  private setListadoRespuestas(idCuestionario: number, puntuacion?: boolean) {
    const index = this.dataPost.listadoRespuestas.findIndex(
      (item) => item.idCuestionario == idCuestionario
    );
    this.dataPost.listadoRespuestas[index] = {
      idCuestionario,
      mes: puntuacion,
      puntuacion: puntuacion,
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
          this.listFormTipoViolencia = this.listFormTipoViolencia.map(
            (item: FormTipoViolenciaInterface) => {
              return {
                ...item,
                puntuacionPrevio: item.puntuacionPrevio ?? undefined,
                mesPrevio: item.mesPrevio ?? undefined,
              };
            }
          );
          console.log(this.listFormTipoViolencia)
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
        }
      });
  }
}