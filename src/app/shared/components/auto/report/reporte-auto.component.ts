import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SeccionesInterface } from 'src/app/interfaces/auto.interface';
import { AutoService } from 'src/app/pages/private/abogado/services/auto.service';

@Component({
  selector: 'app-reporte-auto',
  templateUrl: './reporte-auto.component.html',
  styleUrls: ['./reporte-auto.component.scss'],
})
export class ReporteAutoComponent implements OnInit, OnDestroy {
  public listaSecciones: SeccionesInterface[] = [];
  @Input() tituloReporte: string = '';

  private listaSeccionesSub!: Subscription;

  constructor(private autoService: AutoService) {}

  ngOnDestroy(): void {
    if (this.listaSeccionesSub) this.listaSeccionesSub.unsubscribe();
  }

  ngOnInit(): void {
    this.listaSeccionesSub = this.autoService.seccionesLista$.subscribe((l) => {
      if (l) this.listaSecciones = l;
    });
  }
}
