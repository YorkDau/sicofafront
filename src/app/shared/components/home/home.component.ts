import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, PerfilAuth } from '../../../auth/services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface Card {
  title: string;
  description: string;
  icon: string;
  route: string;
  visible: boolean;
  requiredProfileName?: string; 
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  cards: Card[] = [
    {
      title: 'Solicitudes PARD',
      description: 'Registrar un nuevo caso de restablecimiento de derechos en el sistema de información SIGFA.',
      icon: 'add_circle',
      route: 'recepcion-auxiliar',
      visible: false,
      requiredProfileName: 'Auxiliar' 
    },
    {
      title: 'Solicitudes VIF',
      description: 'Registrar un nuevo caso de violencia intrafamiliar en el sistema de información SIGFA.',
      icon: 'add_circle_outline',
      route: 'ciudadano',
      visible: false, 
      requiredProfileName: 'Auxiliar'
    }
  ];


  isAuxiliarSelected: boolean = false; 
  public selectedProfileDisplayName: string | null = null;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('HomeComponent LOG: ngOnInit llamado.');
    this.authService.selectedComisaria$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('HomeComponent LOG: selectedComisaria$ emitió.');
        this.checkIfAuxiliarProfileIsSelected(); 
      });

    this.checkIfAuxiliarProfileIsSelected();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkIfAuxiliarProfileIsSelected(): void {
    const selectedComisariaId = this.authService.getselectComisariaValue(this.authService.id_comisaria);
    const currentSelectedProfileName = this.authService.getselectProfileName(); 
    const allUserProfiles: PerfilAuth[] = this.authService.perfilesList;

    this.selectedProfileDisplayName = currentSelectedProfileName;

    this.cards = this.cards.map(card => {
        const isCardVisible = card.requiredProfileName
            ? (card.requiredProfileName === currentSelectedProfileName)
            : true; 
        return { ...card, visible: isCardVisible };
    });
    const activeAuxProfileForSelectedComisaria = allUserProfiles.find(
      (p) => p.idComisaria === selectedComisariaId && p.perfil === 'AUX'
    );
    this.isAuxiliarSelected = !!activeAuxProfileForSelectedComisaria;
  }

  goToCardRoute(route: string): void {
    this.router.navigate([route]);
  }
}