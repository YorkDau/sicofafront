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

  public listFormTipoViolencia: FormTipoViolenciaInterface[] = [];
  public dataPost!: RespuestaTipoViolencia;

  public fuerzasArmadasOptions = [
    { value: 'Policía', label: 'Policía' },
    { value: 'Ejército Nacional', label: 'Ejército Nacional' },
    { value: 'ESMAD', label: 'ESMAD' },
    { value: 'Otra', label: 'Otra' }
  ];

  public antecedentesOptions = [
    { label: 'Judiciales', value: 'Judiciales' },
    { label: 'Tribunales', value: 'Tribunales' },
    { label: 'Disciplinarios', value: 'Disciplinarios' },
    { label: 'Otros', value: 'Otros' }  
  ];

  private tarea = JSON.parse(sessionStorage.getItem('info')!);

  constructor(private identificacionService: IdentificacionDelRiesgoService) {}

  ngAfterViewInit(): void {
    this.getListFormTipoViolencia(7);
  }

  public isFuerzasArmadas(descripcion: string): boolean {
    return descripcion.toLowerCase().includes('fuerzas armadas');
  }

  public isAntecedentesJudiciales(descripcion: string): boolean {
    return descripcion.toLowerCase().includes('antecedentes judiciales');
  }


  public onFuerzaArmadaChange(idQuestionario: number, selectedOptions: HTMLOptionsCollection) {
    const values = Array.from(selectedOptions).map(option => (option as HTMLOptionElement).value);
    this.listFormTipoViolencia = this.listFormTipoViolencia.map(item => {
      if (item.idQuestionario === idQuestionario) {
        return { ...item, antecedentesSeleccionados: values };
      }
      return item;
    });
  }

  public onAntecedentesChange(idQuestionario: number, selectedOptions: HTMLOptionsCollection) {
    const values = Array.from(selectedOptions).map(option => (option as HTMLOptionElement).value);
    this.listFormTipoViolencia = this.listFormTipoViolencia.map(item => {
      if (item.idQuestionario === idQuestionario) {
        return { ...item, antecedentesSeleccionados: values };
      }
      return item;
    });
  }

  public habilitarRadioMes(event: any, tipoViolencia: number) {
    const idCuestionario = +event.target.name;
    const puntuacion = event.target.value === 'true';

    this.listFormTipoViolencia = this.listFormTipoViolencia.map((item) => {
      if (item.idTipoViolencia === tipoViolencia && item.idQuestionario === idCuestionario) {
        return {
          ...item,
          puntuacionPrevio: puntuacion ? 1 : 0,
          mesPrevio: puntuacion,
          fuerzaArmadaSeleccionada: puntuacion ? item.fuerzaArmadaSeleccionada : undefined,
          antecedentesSeleccionados: puntuacion ? item.antecedenteSeleccionado : []
        };
      }
      return item;
    });

    this.setListadoRespuestas(idCuestionario, puntuacion);
  }

  private setListadoRespuestas(idCuestionario: number, puntuacion: boolean) {
    const index = this.dataPost.listadoRespuestas.findIndex(item => item.idCuestionario === idCuestionario);
    if (index !== -1) {
      this.dataPost.listadoRespuestas[index] = {
        idCuestionario,
        mes: puntuacion,
        puntuacion
      };
    } else {
      this.dataPost.listadoRespuestas.push({
        idCuestionario,
        mes: puntuacion,
        puntuacion
      });
    }
  }

  public getListFormTipoViolencia(tipoViolencia: number) {
    this.dataPost = {
      idTarea: this.tarea.idTarea,
      idSolicitudServicio: this.tarea.idSolicitud,
      idTipoViolencia: tipoViolencia,
      listadoRespuestas: [],
    };

    this.identificacionService
      .getTipoViolencia(this.tarea.idSolicitud, tipoViolencia, this.tarea.idTarea)
      .subscribe((data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.listFormTipoViolencia = data.data;
          this.setInitialDataPost();
        }
      });
  }

  private setInitialDataPost() {
    this.listFormTipoViolencia.forEach((item) => {
      this.dataPost.listadoRespuestas.push({
        idCuestionario: item.idQuestionario,
        mes: item.mesPrevio ?? false,
        puntuacion: item.puntuacionPrevio ? true : false
      });
    });
  }

  public cancelar() {
    this.siguientePaso.emit('Cancelar');
  }

  public anterior() {
    this.siguientePaso.emit('Anterior');
  }

  public siguiente() {
    this.identificacionService.postFormTipoViolencia(this.dataPost)
      .subscribe((data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.siguientePaso.emit('Siguiente');
        }
      });
  }
}
