import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AbogadoService } from '../../../../services/abogado.service';

@Component({
  selector: 'app-datos-a',
  templateUrl: './datos-a.component.html',
  styleUrls: ['./datos-a.component.scss']
})
export class DatosAComponent implements OnInit, OnDestroy {

  @Input() agresor: any;
  @Input() hechos: any;

  public relato: any;
  private relatoObs = this.abogadoService.relatoBS$;
  private relatoSub!: Subscription;

  constructor(private abogadoService: AbogadoService) { }


  ngOnDestroy(): void {
    if (this.relatoSub)
      this.relatoSub.unsubscribe();
  }

  ngOnInit(): void {
    this.relatoSub = this.relatoObs.subscribe(r => this.relato = r);
  }

}
