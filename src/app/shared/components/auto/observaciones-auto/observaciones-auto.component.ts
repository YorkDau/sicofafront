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
  @Input() observacionCierre: string = '';
  
  @Input() mostrarObservaciones: boolean = false; // por defecto en "NO"
  @Input() cierre?: boolean = false;

  // 🔹 Salidas
  @Output() comentarios = new EventEmitter<string>();
  @Output() checkComisario = new EventEmitter<boolean>();
  @Output() checkCierre = new EventEmitter<boolean | undefined>();
  @Output() cambioRemision = new EventEmitter<boolean>();
  @Output() cambioAdjuntoAutoCierre = new EventEmitter<string>();
  @Output() cambioObservacionCierre = new EventEmitter<string>();
  
  
  public info: any;

  // 🔹 Propiedades internas
  public esNecesarioRemitir: boolean = false; // por defecto "NO"
  public user!: UserInterface | undefined;
  public COMISARIO = CodigosPerfil.COMISARIO;
  public idAdjuntoAuto:Number = 0;

  constructor(private authService: AuthService) {
    this.info = JSON.parse(sessionStorage.getItem('info')!);
  }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    this.cierre = this.esAdultoMayor() ? false : undefined;
    this.emitirCheckCierre();
  }

  /**
   * @description Emite el texto de las observaciones
   */
  emitirObservaciones(): void {
    this.comentarios.emit(this.observaciones);
  }

  
  /**
   * @description Emite el texto de las observacionCierre
   */
  emitirObservacionesCierre(): void {
    this.cambioObservacionCierre.emit(this.observacionCierre);
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
   * @description Emite si requiere ajuste adicional
   */
  emitirCheckCierre(): void {
    if (this.cierre) {
      this.esNecesarioRemitir = false;
      this.emitirRemision();
    }
    this.checkCierre.emit(this.cierre);
  }
  

  /**
   * @description Emite si es necesario remitir
   */
  emitirRemision(): void {
    this.cambioRemision.emit(this.esNecesarioRemitir);
  }
  esAdultoMayor() {
    return this.info.tipoProceso.indexOf("Adulto Mayor") > -1
  }

  
  emitirAutoCierre(base64: string): void {
    if (base64) {
      this.cambioAdjuntoAutoCierre.emit(base64);
    }
  }
}
