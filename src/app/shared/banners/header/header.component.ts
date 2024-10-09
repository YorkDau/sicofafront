import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CodigosPerfil } from 'src/app/constants';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { SharedService } from 'src/app/services/shared.service';

interface us {
  nombre: string;
  roles?: any[];
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  private bsModuloActual = this.sharedService.bsModuloActual$;
  private subModActual!: Subscription;

  public nombreComisaria: string = 'Comisaría de Familia';
  public mostrarMenu: boolean = false;
  public rolSeleccionado: string = '';

  currentUser!: UserInterface | undefined;
  loadMenu: boolean = false;

  public usuario: us = {
    nombre: 'Comisaría User',
    roles: [],
  };

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.loadPage$.subscribe((data) => {
      if (data) {
        this.loadMenu = true;
        this.currentUser = this.authService.currentUserValue;
        this.rolSeleccionado = this.currentUser?.perfil!;
        this.obtenerPerfil(this.currentUser?.perfil!);
      }
    });
  }

  ngOnInit(): void {
    this.subModActual = this.bsModuloActual.subscribe(
      (v) => (this.mostrarMenu = v)
    );
  }

  ngOnDestroy(): void {
    if (this.subModActual) {
      this.subModActual.unsubscribe();
    }
  }

  /**
   * @description cierra la sesión del usuario
   */
  public cerrarSesion() {
    this.authService.cerrarSesion();
  }

  private obtenerPerfil(perfil: string) {
    switch (perfil) {
      case CodigosPerfil.AUXILIAR:
        this.llenarArrayUsuario('Auxiliar', CodigosPerfil.AUXILIAR);
        break;
      case CodigosPerfil.ABOGADO:
        this.llenarArrayUsuario('Abogado', CodigosPerfil.ABOGADO);
        break;
      case CodigosPerfil.COMISARIO:
        this.llenarArrayUsuario('Comisario', CodigosPerfil.COMISARIO);
        break;
      case CodigosPerfil.PSICOLOGO:
        this.llenarArrayUsuario('Psicólogo', CodigosPerfil.PSICOLOGO);
        break;
      case CodigosPerfil.TRABAJADORSOCIAL:
        this.llenarArrayUsuario(
          'Trabajador Social',
          CodigosPerfil.TRABAJADORSOCIAL
        );
        break;
      case CodigosPerfil.ADMINISTRADOR:
        this.llenarArrayUsuario('Administrador', CodigosPerfil.ADMINISTRADOR);
        break;
      default:
        break;
    }
  }

  /**
   * @description llena un objeto array para simular usuarios
   */
  llenarArrayUsuario(nombre: string, cod: string) {
    this.usuario.roles!.push({ nombre, cod });
  }
}
