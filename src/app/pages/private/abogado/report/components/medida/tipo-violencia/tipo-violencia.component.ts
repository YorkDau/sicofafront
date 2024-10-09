import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { AbogadoService } from '../../../../services/abogado.service';

@Component({
  selector: 'app-tipo-violencia',
  templateUrl: './tipo-violencia.component.html',
  styleUrls: ['./tipo-violencia.component.scss']
})
export class TipoViolenciaComponent implements OnInit, OnDestroy {

  public listaTipoViolencia: DominioInterface[] = [];

  private tipoViolenciaObs = this.abogadoService.tipoViolencia$;
  private tipoVSub!: Subscription;

  constructor(private abogadoService: AbogadoService) { }

  ngOnInit(): void {
    this.tipoVSub = this.tipoViolenciaObs
      .subscribe(tv => {
        if (tv.length) {
          this.listaTipoViolencia = tv;
          this.listaTipoViolencia = this.listaTipoViolencia.filter(t => t.seleccionado);
        }
      });
  }

  ngOnDestroy(): void {
    if (this.tipoVSub)
      this.tipoVSub.unsubscribe();
  }

}
