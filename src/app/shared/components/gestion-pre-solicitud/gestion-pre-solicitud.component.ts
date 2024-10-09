import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, Event, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ImagenesModal, Mensajes } from 'src/app/constants';
import { PreSolicitudService } from 'src/app/pages/private/services/pre-solicitud.service';
import { Modales } from '../../modals';

@Component({
  selector: 'app-gestion-pre-solicitud',
  templateUrl: './gestion-pre-solicitud.component.html',
  styleUrls: ['./gestion-pre-solicitud.component.scss']
})
export class GestionPreSolicitudComponent implements OnInit, OnDestroy {

  perfil: string = '';
  activarTabs: boolean = true;
  sub: Subscription;

  constructor(
    private presolicitudService: PreSolicitudService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.sub = this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        if(event.url !== '/registro-presolicitud') {
          this.getPresolicitud();
        } else {
          this.activarTabs = true;
          this.presolicitudService.crear = true;
          this.presolicitudService.emitirPresolicitud(null);
        }
      }
    });
    const { perfil } = this.authService.currentUserValue!;
    this.perfil = perfil!;
  }

  ngOnInit(): void {
    
  }

  getPresolicitud() {
    let info = JSON.parse(sessionStorage.getItem("info")!);
    this.presolicitudService.getPresolicitud(info.idSolicitud)
      .subscribe({
        next: ({ statusCode, data }) => {
          this.activarTabs = true;
          if (statusCode) {
            this.presolicitudService.crear = false;
            this.presolicitudService.emitirPresolicitud(data);
          }
        },
        error: () => {
          this.activarTabs = true;
          Modales.modalInformacion(
            Mensajes.MENSAJE_ERROR_G,
            this.dialog,
            ImagenesModal.EXCLAMACION
          );
        }
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

}
