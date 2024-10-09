import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import {
  InvolucradosInterface,
  TreeInterface,
} from 'src/app/interfaces/auto.interface';
import { AutoService } from 'src/app/pages/private/abogado/services/auto.service';

@Component({
  selector: 'app-involucrados-auto',
  templateUrl: './involucrados.component.html',
  styleUrls: ['./involucrados.component.scss'],
})
export class InvolucradosComponent implements OnInit, OnDestroy {
  private autoHijoSub!: Subscription;

  public listaInvolucrados: InvolucradosInterface[] = [];
  public objTree!: TreeInterface;
  public titulo: string = '';
  public defaultTitulo =
    'Seleccione La Víctimas Y/o El Agresor Relacionado A Esta Medida De Protección';

  constructor(private autoService: AutoService) {}

  ngOnDestroy(): void {
    if (this.autoHijoSub) {
      this.autoHijoSub.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.autoHijoSub = this.autoService.seccionHija$.subscribe((h) => {
      if (h) {
        this.listaInvolucrados = h;
      }
    });
  }

  /**
   * @description selecciona o desselecciona los hijos
   * @param involucrado objeto sección
   */
  seleccionarDesMedidas(involucrado: InvolucradosInterface) {
    setTimeout(() => {
      this.listaInvolucrados.forEach((i) => {
        if (i.idInvolucrado === involucrado.idInvolucrado) i.estado = !i.estado;
      });
      this.objTree.seccion.involucrados = this.listaInvolucrados;
      this.autoService.emitirSeccionHijaSeleccionada(this.objTree);
    }, 100);
  }
}
