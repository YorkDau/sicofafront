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
  @Output() checkCierre = new EventEmitter<boolean | undefined>();
  @Output() cambioRemision = new EventEmitter<boolean>();
  @Output() cambioAdjuntoAutoCierre = new EventEmitter<string>();
  
  
  public info: any;

  // 🔹 Propiedades internas
  public esNecesarioRemitir: boolean = false; // por defecto "NO"
  public user!: UserInterface | undefined;
  public COMISARIO = CodigosPerfil.COMISARIO;
  public idAdjuntoAuto:Number = 0;

  constructor(private authService: AuthService) {
    this.info = JSON.parse(sessionStorage.getItem('info')!);
  }

  
  esNuevaActividadTomarDecision() {
    return this.info.actividad === 'Tomar decisión información'
  }

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
    if (!this.mostrarObservaciones) {
      this.observaciones = "";
      this.emitirObservaciones();
    }
    this.checkComisario.emit(this.mostrarObservaciones);
  }
  

  /**
   * @description Emite si es necesario remitir
   */
  emitirRemision(): void {
    this.cambioRemision.emit(this.esNecesarioRemitir);
  }

  
  emitirAutoCierre(base64: string): void {
    if (base64) {
      this.cambioAdjuntoAutoCierre.emit(base64);
    }
  }
}
