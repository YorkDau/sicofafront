import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { CodigosRespuesta, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { ModalInfoComponent } from 'src/app/shared/modal-info/modal-info.component';
import { Modales } from 'src/app/shared/modals';
import { AppState } from 'src/app/store/app.reducer';
import { setHorario, unsetHorario } from 'src/app/store/public/actions/public.actions';
import { CitaInterface } from '../../interfaces/cita.interface';
import { ComisariaInterface } from '../../interfaces/comisaria.interface';
import { ComisariaService } from '../../services/comisaria.service';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.scss']
})
export class HorarioComponent implements OnInit, OnDestroy {

  @Output() selHorario = new EventEmitter<boolean>();

  public listaCita: CitaInterface[] = [];
  public objComisaria!: ComisariaInterface;
  public subHorario!: Subscription;

  private horarioSel!: CitaInterface;
  private idCitaSel: number = 0;

  constructor(private store: Store<AppState>,
    private comisariaService: ComisariaService,
    private dialog: MatDialog) { }

  ngOnDestroy(): void {
    if (this.subHorario) {
      this.subHorario.unsubscribe();
    }
  }

  ngOnInit(): void {

    this.store.select('comisaria')
      .subscribe(({ comisaria }) => this.objComisaria = comisaria!);

    if (this.objComisaria) {
      this.listaCita = this.objComisaria.disponibilidadCitasList;
    }
  }


  /**
   * @description hace dispatch del horario seleccionado
   * @param horario objeto horario
   * @param idhoraCita id de la hora
   */
  seleccionarHorario(horario: CitaInterface, idhoraCita: number) {
    this.horarioSel = horario;
    this.idCitaSel = idhoraCita;
  }


  /**
   * @description valida que haya seleccionado un horario
   */
  validarHorarioSeleccionado() {

    if (this.idCitaSel > 0) {
      this.reservarHorario(this.idCitaSel);
    } else {
      this.selHorario.emit(false);
      this.dialog.open(ModalInfoComponent, {
        panelClass: 'modal-info',
        data: {
          mensaje: 'Seleccione un horario para continuar',
          image: 'assets/images/exclamacion.svg'
        }
      });
    }

  }

  /**
   * @description llama servicio reservar horario
   * @param idhoraCita id hora cita
   */
  reservarHorario(idhoraCita: number) {
    this.comisariaService.getDisponibilidadCitas(idhoraCita)
      .subscribe((data: ResponseInterface) => {

        if (data.statusCode === CodigosRespuesta.OK) {
          if (data.data.datosPaginados === 'Cita Reservada con exito') {
            const horario = this.horarioSel;
            this.store.dispatch(setHorario({ horario, idhoraCita }));
            this.selHorario.emit(true);
          } else {
            this.store.dispatch(unsetHorario())
            this.selHorario.emit(false);
            Modales.modalInformacion(Mensajes.MENSAJE_CITA_OC, this.dialog, 'assets/images/exclamacion.svg');
          }
        }

      });
  }

}
