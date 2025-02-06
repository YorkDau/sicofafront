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

  public nombreComisaria: string = 'Comisaría de Familia';
  public mostrarMenu: boolean = false;
  public rolSeleccionado: string = '';
  totalNotificaciones: number = 0;

  currentUser!: UserInterface | undefined;
  loadMenu: boolean = false;
  id_comisaria: any;
  solicitudes: any;
  private intervalo: any;
  preSolicitudes: any;
  citasPublicas: any


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
        this.id_comisaria = this.currentUser?.idComisaria;
        this.rolSeleccionado = this.currentUser?.perfil!;
        this.obtenerPerfil(this.currentUser?.perfil!);
        this.cargaNotificaciones();
      }
    });
  }

  cargaNotificaciones() {
    this.sharedService
    .getSolicitudesComisaria(this.id_comisaria)
    .subscribe((data) => {
      if (data.statusCode === CodigosRespuesta.OK) {
        this.solicitudes = data.data;
       if(!data.data.datosPaginados){
        this.preSolicitudes = 0;
       }else{
        this.preSolicitudes = data.data.datosPaginados.length;
       }
      }
    });

    this.sharedService
  
      .getCitasComisaria(this.id_comisaria)
      .subscribe((data) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.solicitudes = data.data;
          if(!data.data.datosPaginados){
            this.citasPublicas = 0;
          }else{
            this.citasPublicas = data.data.datosPaginados.length
          }
         
          this.calcularTotalNotificaciones();
        }
      });

  }

  ngOnInit(): void {
    this.subModActual = this.bsModuloActual.subscribe(
      (v) => (this.mostrarMenu = v)
    );
    this.intervalo = setInterval(() => {
      this.actualizarNotificaciones();
      console.log("noticaciones atualizadas")
    }, 300000); // 300,000 ms = 5 minutos
    
  }

  actualizarNotificaciones(){
    this.cargaNotificaciones()
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


  verDetalle(item: any) {
    // Aquí puedes abrir un modal o redirigir a otra página con más detalles
  }
  calcularTotalNotificaciones() {
    // Sumar la cantidad de pre-solicitudes y citas
    this.totalNotificaciones = this.preSolicitudes + this.citasPublicas;
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
