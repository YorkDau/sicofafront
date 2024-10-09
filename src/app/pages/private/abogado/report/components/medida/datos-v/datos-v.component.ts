import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AbogadoService } from '../../../../services/abogado.service';


@Component({
  selector: 'app-datos-v',
  templateUrl: './datos-v.component.html',
  styleUrls: ['./datos-v.component.scss']
})
export class DatosVComponent implements OnInit, OnDestroy {

  @Input() victima: any;

  private relatoObs = this.abogadoService.relatoBS$;
  private relatoSub!: Subscription;
  public relato: any;

  constructor(private abogadoService: AbogadoService) { }

  ngOnDestroy(): void {
    if (this.relatoSub)
      this.relatoSub.unsubscribe();
  }

  ngOnInit(): void {
    this.relatoSub = this.relatoObs.subscribe(r => this.relato = r);
  }

}
