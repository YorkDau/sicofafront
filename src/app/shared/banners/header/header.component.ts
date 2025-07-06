import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CodigosPerfil, CodigosRespuesta } from 'src/app/constants';
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
  private intervalo: any;

  public nombreComisaria: string ='' ;
  public mostrarMenu: boolean = false;
  public rolSeleccionado: string = '';
  public totalNotificaciones: number = 0;

  public currentUser!: UserInterface | undefined;
  public loadMenu: boolean = false;
  public id_comisaria: any;

  public preSolicitudes: number = 0;
  public citasPublicas: number = 0;

  public usuario: us = {
    nombre: 'Comisaría User',
    roles: [],
  };

  constructor(
    private sharedService: SharedService,
    private authService: AuthService,
  ) {
    this.authService.loadPage$.subscribe((data) => {
      if (data) {
        this.loadMenu = true;
        this.authService.selectComisariaValue(this.authService.id_comisaria);
        this.nombreComisaria = Array.isArray(this.authService.comisariasList) && this.authService.comisariasList.length > 0
          ? this.authService.comisariasList[0].nombreComisaria
          : 'Comisaría de Familia';
        this.currentUser = this.authService.currentUserValue;
        this.id_comisaria = this.currentUser?.idComisaria;
        this.rolSeleccionado = this.currentUser?.perfil!;
        this.obtenerPerfil(this.rolSeleccionado);
        this.cargaNotificaciones();
      }
    });
    
  }

  ngOnInit(): void {
    this.subModActual = this.bsModuloActual.subscribe(
      (v) => (this.mostrarMenu = v)
    );
    this.intervalo = setInterval(() => {
      const user = this.authService.currentUserValue;
      if (user) {
        this.actualizarNotificaciones();
      }
    }, 60000*3);    
  }
  

  ngOnDestroy(): void {
    if (this.subModActual) {
      this.subModActual.unsubscribe();
    }
    if (this.intervalo) {
      clearInterval(this.intervalo);
    }
  }

  actualizarNotificaciones() {
    this.cargaNotificaciones();
  }

  cargaNotificaciones() {
    this.sharedService.getSolicitudesComisaria(this.id_comisaria).subscribe((data) => {
      if (data.statusCode === CodigosRespuesta.OK) {
        this.preSolicitudes = data.data?.datosPaginados?.length || 0;
        this.calcularTotalNotificaciones();
      }
    });

    this.sharedService.getCitasComisaria(this.id_comisaria).subscribe((data) => {
      if (data.statusCode === CodigosRespuesta.OK) {
        this.citasPublicas = data.data?.datosPaginados?.length || 0;
        this.calcularTotalNotificaciones();
      }
    });
  }

  calcularTotalNotificaciones() {
    this.totalNotificaciones = this.preSolicitudes + this.citasPublicas;
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
  }

  verDetalle(item: any) {
    // Aquí puedes abrir un modal o redirigir a otra página con más detalles
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
        this.llenarArrayUsuario('Trabajador Social', CodigosPerfil.TRABAJADORSOCIAL);
        break;
      case CodigosPerfil.ADMINISTRADOR:
        this.llenarArrayUsuario('Administrador', CodigosPerfil.ADMINISTRADOR);
        break;
    }
  }

  private llenarArrayUsuario(nombre: string, cod: string) {
    this.usuario.roles!.push({ nombre, cod });
  }
}
