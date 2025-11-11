import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CodigosPerfil, InfoRecepcionMensaje } from 'src/app/constants';

@Component({
  selector: 'app-main-recepcion',
  templateUrl: './main-recepcion.component.html',
})
export class MainRecepcionComponent implements OnInit {
  public tituloMensaje: string = '';
  public tab1Mensaje: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    const { perfil } = this.authService.currentUserValue!;
    this.asignarMensajeXPerfil(perfil!);
  }

  /**
   * @description asigna mensaje sin registros según perfil
   */
  asignarMensajeXPerfil(perfil: string) {
    switch (perfil) {
      case CodigosPerfil.ABOGADO:
        this.tituloMensaje = InfoRecepcionMensaje.ABOGADOT;
        this.tab1Mensaje = InfoRecepcionMensaje.ABOGADOP1;
        break;
      case CodigosPerfil.COMISARIO:
        this.tituloMensaje = InfoRecepcionMensaje.COMISARIOT;
        this.tab1Mensaje = InfoRecepcionMensaje.COMISARIOP1;
        break;
      case CodigosPerfil.PSICOLOGO:
        this.tituloMensaje = InfoRecepcionMensaje.PSICOLOGIAT;
        this.tab1Mensaje = InfoRecepcionMensaje.PSICOLOGIAP1;
        break;
      case CodigosPerfil.TRABAJADORSOCIAL:
        this.tituloMensaje = InfoRecepcionMensaje.TRABAJADORST;
        this.tab1Mensaje = InfoRecepcionMensaje.TRABAJADORP1;
        break;
      default:
        break;
    }
  }
}
