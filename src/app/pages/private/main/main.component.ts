import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { SharedService } from 'src/app/services/shared.service';
import { SetPerfilComponent } from 'src/app/shared/components/set-perfil/set-perfil.component';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  fecha: Date = new Date();
  openDrawer: boolean = true;
  loadPage: boolean = false;
  currentUser!: UserInterface | undefined;
  perfiles: string[] = [];

  browserRefresh!: boolean;

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private _dialog: MatDialog,
    private router: Router
  ) {
    this.currentUser = this.authService.currentUserValue;
    this.perfiles = this.authService.perfiles;
  }

  ngOnInit(): void {
    if (!this.currentUser?.perfil) {
      if (this.perfiles && this.perfiles.length > 1) {
        this.abrirModalCrearDominio();
      } else {
        if (this.currentUser) {
          this.currentUser.perfil = this.perfiles[0];
          this.currentUser.idComisaria= this.authService.comisariasList[0].idComisaria;
        }
        this.asignarPerfil();
      }
    } else {
      this.asignarPerfil();
    }
  }

  /**
   * @description funcion para abrir o cerrar el sidenav
   */
  public abrirCerrarSidenav() {
    this.openDrawer = !this.openDrawer;
  }

  public abrirModalCrearDominio() {
    const dialogRef = this._dialog.open(SetPerfilComponent, {
      panelClass: '',
      disableClose: true,
      width: '400px',
      data: {
        perfiles: this.authService.perfiles
      },
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp.refresh) {
          this.currentUser!.perfil = resp.perfil;
          this.currentUser!.idComisaria = resp.comisaria;
        this.asignarPerfil();
      }
    });
  }

  /**
   * @description asigna información relacionada al inicio de sesión
   */
  asignarPerfil() {
    this.authService.currentUserValue = this.currentUser;
    this.authService.emitirLoadPage(true);
    this.sharedService.emitirModulo(true);
  }
}
