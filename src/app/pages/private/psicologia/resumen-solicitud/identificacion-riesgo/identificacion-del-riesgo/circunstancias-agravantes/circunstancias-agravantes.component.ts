import { AfterViewInit, Component, EventEmitter, Output } from '@angular/core';
import { CodigosRespuesta } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import {
  FormTipoViolenciaInterface,
  RespuestaTipoViolencia,
} from '../../../../interfaces/involucrado.interface';
import { IdentificacionDelRiesgoService } from '../../../../services/identificacion-del-riesgo.service';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { SharedService } from 'src/app/services/shared.service';

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
  public listaFuerzasArmadas!: DominioInterface[];
  public listaAntecedentesDisciplinarios!: DominioInterface[];

  
  private tarea = JSON.parse(sessionStorage.getItem('info')!);

  constructor(
    private identificacionService: IdentificacionDelRiesgoService,
    private sharedService: SharedService
  ) {}

  ngAfterViewInit(): void {
    this.getListFormTipoViolencia(7);
    this.getListaFuerzasArmadas();
    this.getListaAntecedentesDisciplinarios();
  }
  private async getListaFuerzasArmadas() {
    const result = await this.sharedService.getDominioFromLocal('FuerzasArmadas');
    this.listaFuerzasArmadas = result;
    console.log("FuerzasArmadas",result)
  }
    private async getListaAntecedentesDisciplinarios() {
    const result = await this.sharedService.getDominioFromLocal('AntecedentesDisciplinarios');
    this.listaAntecedentesDisciplinarios = result;
    console.log("AntecedentesDisciplinarios",result)
  }

  public isFuerzasArmadas(descripcion: string): boolean {
    return descripcion.toLowerCase().includes('fuerzas armadas');
  }

  public isAntecedentesJudiciales(descripcion: string): boolean {
    return descripcion.toLowerCase().includes('antecedentes judiciales');
  }

  public getRadioValue(tipo: FormTipoViolenciaInterface): boolean | undefined {
    if (tipo.puntuacionPrevio === undefined) return undefined;
    if (tipo.puntuacionPrevio === 0 || tipo.puntuacionPrevio === null)
      return false;
    return true;
  }

  public habilitarRadioMes(event: any, idTipoViolencia: number) {
    const idCuestionario = parseInt(event.target.name, 10);
    const valor = event.target.value;

    let pregunta: boolean | undefined;
    if (valor === 'undefined') {
      pregunta = undefined;
    } else {
      pregunta = valor === 'true';
    }

    const puntuacion = pregunta === undefined ? undefined : pregunta ? 1 : 0;

    this.listFormTipoViolencia = this.listFormTipoViolencia.map((item) => {
      if (
        item.idTipoViolencia === idTipoViolencia &&
        item.idQuestionario === idCuestionario
      ) {
        if (pregunta === false || pregunta === undefined) {
          if (this.isFuerzasArmadas(item.descripcion)) {
            item.fuerzaArmadaSeleccionada = undefined;
          }
          if (this.isAntecedentesJudiciales(item.descripcion)) {
            item.antecedenteSeleccionado = undefined;
          }
        }
        return {
          ...item,
          puntuacionPrevio: puntuacion,
          mesPrevio: pregunta,
          selectedOption: pregunta,
        };
      }
      return item;
    });

    this.setListadoRespuestas(idCuestionario, pregunta);
  }

  public onFuerzaArmadaChange(idQuestionario: number, selectedValue: string) {
    this.listFormTipoViolencia = this.listFormTipoViolencia.map((item) => {
      if (item.idQuestionario === idQuestionario) {
        return { ...item, fuerzaArmadaSeleccionada: selectedValue };
      }
      return item;
    });
  }

  public onAntecedentesChange(
    idQuestionario: number,
    selectedOptions: HTMLOptionsCollection
  ) {
    const values = Array.from(selectedOptions).map(
      (option) => (option as HTMLOptionElement).value
    );
    this.listFormTipoViolencia = this.listFormTipoViolencia.map((item) => {
      if (item.idQuestionario === idQuestionario) {
        return { ...item, antecedentesSeleccionados: values };
      }
      return item;
    });
  }

  private setListadoRespuestas(idCuestionario: number, puntuacion?: boolean) {
    const index = this.dataPost.listadoRespuestas.findIndex(
      (item) => item.idCuestionario === idCuestionario
    );
    if (index !== -1) {
      this.dataPost.listadoRespuestas[index] = {
        idCuestionario,
        mes: puntuacion,
        puntuacion: puntuacion === true,
      };
    } else {
      this.dataPost.listadoRespuestas.push({
        idCuestionario,
        mes: puntuacion,
        puntuacion: puntuacion === true,
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
      .getTipoViolencia(
        this.tarea.idSolicitud,
        tipoViolencia,
        this.tarea.idTarea
      )
      .subscribe((data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.listFormTipoViolencia = data.data;

          // Inicializa selectedOption para cada elemento después de cargar los datos
          this.listFormTipoViolencia = this.listFormTipoViolencia.map(
            (item: FormTipoViolenciaInterface) => {
              let initialSelectedOption: boolean | undefined;
              if (
                item.puntuacionPrevio === 0 ||
                item.puntuacionPrevio === null
              ) {
                initialSelectedOption = false; // Corresponde a 'NO'
              } else if (item.puntuacionPrevio === 1) {
                initialSelectedOption = true; // Corresponde a 'SI'
              } else {
                initialSelectedOption = undefined;
              }

              return {
                ...item,
                puntuacionPrevio: item.puntuacionPrevio ?? undefined,
                mesPrevio: item.mesPrevio ?? initialSelectedOption,
                selectedOption: initialSelectedOption,
              };
            }
          );
        }
        this.setInitialDataPost();
      });
  }

  private setInitialDataPost() {
    this.listFormTipoViolencia.forEach((item) => {
      this.dataPost.listadoRespuestas.push({
        idCuestionario: item.idQuestionario,
        mes: item.mesPrevio,
        puntuacion: item.puntuacionPrevio === 1 ? true : false,
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
    this.identificacionService
      .postFormTipoViolencia(this.dataPost)
      .subscribe((data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.siguientePaso.emit('Siguiente');
        }
      });
  }
}
