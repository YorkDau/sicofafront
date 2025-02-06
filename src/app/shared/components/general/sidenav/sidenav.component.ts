import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CodigosPerfil } from 'src/app/constants';
import { MenuInterface } from 'src/app/interfaces/menu.interface';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import {
  perfilAuxiliar,
  perfilPsicologo,
  perfilAbogado,
  perfilComisario,
  perfilTrabajadorSocial,
  perfilAdministrador,
} from '../../../rutas-perfiles';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
})
export class SidenavComponent implements OnChanges {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @Input() openDrawer: boolean = true;
  @Output() eventOpenDrawer: EventEmitter<boolean> = new EventEmitter();
  public menuPerfil!: MenuInterface[];
  currentUser!: UserInterface | undefined;

  loadMenu: boolean = false;
  step = 0;

  pruebaMenu: any[] = [];

  constructor(private authService: AuthService) {
    this.authService.loadPage$.subscribe((data) => {
      if (data) {
        this.loadMenu = true;
        this.currentUser = this.authService.currentUserValue;
        this.menuPerfil = SidenavComponent.getRutaPerfil(
          this.currentUser?.perfil!
        );
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['openDrawer'].currentValue) {
      this.step = 1;
    }
  }

  /**
   * @description funcion para mantener abierto el sidenav
   */
  public functionEventOpenDrawers() {
    this.eventOpenDrawer.emit(true);
  }

  setStep(index: number) {
    this.step = index;
  }

  /**
   * @description valida perfil de logueo y retorna arreglo de menú
   * @param perfil perfil de logueo
   * @returns arreglo con menú
   */
  static getRutaPerfil(perfil: string) {
    switch (perfil) {
      case CodigosPerfil.AUXILIAR:
        return perfilAuxiliar;
      case CodigosPerfil.PSICOLOGO:
        return perfilPsicologo;
      case CodigosPerfil.ABOGADO:
        return perfilAbogado;
      case CodigosPerfil.COMISARIO:
        return perfilComisario;
      case CodigosPerfil.TRABAJADORSOCIAL:
        return perfilTrabajadorSocial;
      case CodigosPerfil.ADMINISTRADOR:
        return perfilAdministrador;
      default:
        return perfilAuxiliar;
    }
  }
}
