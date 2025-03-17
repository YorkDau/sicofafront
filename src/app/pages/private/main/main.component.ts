import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { NavigationStart, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { SharedService } from 'src/app/services/shared.service';
import { SetPerfilComponent } from 'src/app/shared/components/set-perfil/set-perfil.component';
import { MainService } from './services/main.service';

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
  @ViewChild('pdfInput') pdfInput!: ElementRef<HTMLInputElement>;

  constructor(
    private _main: MainService,
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
  
  loadPdfFile(): void {
    // Trigger file input click
    this.pdfInput.nativeElement.click();
  }

  handlePdfInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = `${reader.result}`.split(',')[1];
        this._main.convert('pdf', 'doc', base64)
        .subscribe(resp => {
          const { dataUri } = resp.data;
          const database64 = dataUri.split(',')[1];
          const fileData = this.base64ToArrayBuffer(database64);
          const blob = new Blob([fileData], { type: 'application/msword' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'converted.doc';
          a.click();
          window.URL.revokeObjectURL(url);
        })
      };
      reader.onerror = (error) => {
        console.error('Error reading PDF file:', error);
      };
      reader.readAsDataURL(file); // Use DataURL for text data
    }
  }

  private base64ToArrayBuffer(base64: string): Uint8Array {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  }
}
