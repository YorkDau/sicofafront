import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Mensajes } from 'src/app/constants';
import { Modales } from 'src/app/shared/modals';
import { AppState } from 'src/app/store/app.reducer';
import { setComisaria } from 'src/app/store/public/actions/public.actions';
import { ComisariaInterface } from '../interfaces/comisaria.interface';


@Component({
  selector: 'app-comisaria',
  templateUrl: './comisaria.component.html',
  styleUrls: ['./comisaria.component.scss']
})
export class ComisariaComponent implements OnInit, OnDestroy {

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public columnas: string[] = ['accion', 'nombre', 'horario', 'direccion', 'telefono', 'correo'];
  public dataSource = new MatTableDataSource<ComisariaInterface>([]);
  public listaComisaria: ComisariaInterface[] = [];
  private comisariaID: number = 0;
  private subComisaria!: Subscription;
  public llamadaDeVida = '';

  constructor(private store: Store<AppState>,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnDestroy(): void {
    this.subComisaria.unsubscribe();
  }

  ngOnInit(): void {
    this.subComisaria = this.store.select('comisariaList')
      .subscribe(({ comisaria, item }) => {
        if (comisaria.length > 0) {
          this.listaComisaria = comisaria;
          this.dataSource = new MatTableDataSource(this.listaComisaria);
          this.dataSource.paginator = this.paginator;
        } else {
          this.listaComisaria = [];
          this.dataSource = new MatTableDataSource(this.listaComisaria);
        }
        if (item !== '') {
          this.llamadaDeVida = item;
        } else {
          this.llamadaDeVida = "";
        }
      });

  }


  /**
   * @description redirecciona para agendar cita
   */
  agendarCita() {

    if (this.comisariaID > 0) {

      const obj = this.listaComisaria.find(c => c.comisariaID === this.comisariaID);

      const comisaria: ComisariaInterface = {
        idCiudadMunicipio: obj?.idCiudadMunicipio!,
        comisariaID: obj?.comisariaID!,
        nombComisaria: obj?.nombComisaria!,
        direccion: obj?.direccion!,
        telefono: obj?.telefono!,
        celular: obj?.celular!,
        correo_electronico: obj?.correo_electronico!,
        horarioSemanal: obj?.horarioSemanal!,
        dispAgenda: obj?.dispAgenda!,
        disponibilidadCitasList: obj?.disponibilidadCitasList!
      }

      this.store.dispatch(setComisaria({ comisaria }))
      this.router.navigate([`/public/cita`]);
    } else {
      Modales.modalInformacion(Mensajes.MENSAJE_OBLIGATORIO, this.dialog, 'assets/images/exclamacion.svg');
    }

  }

  /**
  * @description selecciona o deselecciona la comisaría
  * @param codigo sector
  */
  almacenarCodigoComisaria(codigo: number) {
    this.comisariaID = codigo;
  }

}
