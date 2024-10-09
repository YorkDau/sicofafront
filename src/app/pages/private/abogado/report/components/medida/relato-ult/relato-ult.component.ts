import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AbogadoService } from '../../../../services/abogado.service';

@Component({
  selector: 'app-relato-ult',
  templateUrl: './relato-ult.component.html',
  styleUrls: ['./relato-ult.component.scss']
})
export class RelatoUltComponent implements OnInit, OnDestroy {

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
