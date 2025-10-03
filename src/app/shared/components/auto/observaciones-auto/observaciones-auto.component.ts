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

  // 🔹 Entradas
  @Input() observaciones: string = '';
  @Input() mostrarObservaciones: boolean = false; // por defecto en "NO"

  // 🔹 Salidas
  @Output() comentarios = new EventEmitter<string>();
  @Output() checkComisario = new EventEmitter<boolean>();
  @Output() cambioRemision = new EventEmitter<boolean>();

  // 🔹 Propiedades internas
  public esNecesarioRemitir: boolean = false; // por defecto "NO"
  public user!: UserInterface | undefined;
  public COMISARIO = CodigosPerfil.COMISARIO;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
  }

  /**
   * @description Emite el texto de las observaciones
   */
  emitirObservaciones(): void {
    this.comentarios.emit(this.observaciones);
  }

  /**
   * @description Emite si requiere ajuste adicional
   */
  emitirCheckComisario(): void {
    this.checkComisario.emit(this.mostrarObservaciones);
  }

  /**
   * @description Emite si es necesario remitir
   */
  emitirRemision(): void {
    this.cambioRemision.emit(this.esNecesarioRemitir);
  }
}
