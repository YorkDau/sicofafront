import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CodigosRespuesta } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { AbogadoService } from '../../../services/abogado.service';
import { GridInterface } from '../interfaces/grid-interface';

@Component({
  selector: 'app-pruebas-pard',
  templateUrl: './pruebas-pard.component.html',
  styles: [],
})
export class PruebasPardComponent implements OnInit, OnDestroy {
  public columnas: GridInterface[] = [];
  public listaPruebas!: any[];

  private objSol!: any;
  private gridPardSub!: Subscription;

  constructor(private abogadoService: AbogadoService) {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
  }

  ngOnDestroy(): void {
    if (this.gridPardSub) {
      this.abogadoService.emitirPARD(false);
      this.gridPardSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.cargarMedidas();
    this.gridPardSub = this.abogadoService.gridPard$.subscribe((v) =>
      v ? this.cargarMedidas() : null
    );
  }

  /**
   * @description arma las columnas para enviar al componente de grid
   */
  private armarColumnas(): void {
    this.columnas = [
      {
        key: 'nombreMedida',
        header: 'Nombre medida',
      },
      {
        key: 'estado',
        header: 'Estado',
      },
    ];
  }

  /**
   * @description llama servicio con las medidas de la solicitud
   */
  private cargarMedidas(): void {
    this.abogadoService
      .consultarMedidasPard(this.objSol.idSolicitud)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            this.listaPruebas = data.data;
            this.armarColumnas();
          }
        },
      });
  }
}
