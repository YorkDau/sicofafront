import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CodigosPerfil } from 'src/app/constants';
import { UserInterface } from 'src/app/interfaces/usuario.interface';

@Component({
  selector: 'app-observaciones-auto',
  templateUrl: './observaciones-auto.component.html',
  styleUrls: ['./observaciones-auto.component.scss']
})
export class ObservacionesAutoComponent implements OnInit {

  @Output() comentarios = new EventEmitter<string>();
  @Output() checkComisario = new EventEmitter<boolean>();
  @Input() observaciones: string = '';
  @Input() mostrarObservaciones!: boolean;
  
  public user!: UserInterface | undefined;
  public COMISARIO = CodigosPerfil.COMISARIO;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
  }

  /**
   * @description emite el texto escrito
   */
  emitirObservaciones() {
    this.comentarios.emit(this.observaciones);
  }


  /**
   * @description emite la selección del check
   */
  emitircheckComisario() {
    this.checkComisario.emit(this.mostrarObservaciones);
  }

}
