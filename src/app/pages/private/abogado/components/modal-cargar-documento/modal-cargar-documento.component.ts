import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import {
  CodigosRespuesta,
  ImagenesModal,
  Mensajes,
  TiposDocumentoCarga,
} from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { Modales } from 'src/app/shared/modals';
import { AbogadoService } from '../../services/abogado.service';

@Component({
  selector: 'app-modal-cargar-documento',
  templateUrl: './modal-cargar-documento.component.html',
  styleUrls: ['./modal-cargar-documento.component.scss'],
})
export class ModalCargarDocumentoComponent implements OnInit {
  @Output() emitirArchivo = new EventEmitter<string>();

  public cargaForm!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;

  private objSol!: any;
  private user!: UserInterface | undefined;

  constructor(
    private dialogRef: MatDialogRef<ModalCargarDocumentoComponent>,
    private authService : AuthService,
    private fb: FormBuilder,
    private abogadoService: AbogadoService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
    this.user = this.authService.currentUserValue!;
    this.cargarForm();
  }

  /**
   * @description carga formulario
   */
  private cargarForm() {
    this.cargaForm = this.fb.group({
      nombrearchivo: ['', Validators.required],
      entrada: ['', Validators.required],
      tipoDocumento: TiposDocumentoCarga.PRUEBA_JUEZ,
      idSolicitudServicio: this.objSol.idSolicitud,
      idTarea: this.objSol.idTarea,
      idInvolucrado: null,
      idUsuario: this.user?.userID,
    });
  }

  /**
   * @description cierra modal y emite si se realizó la carga o no
   * @param estado boleano a emitir
   */
  cerrarModal(estado: boolean) {
    this.abogadoService.emitirCargaJuez(estado);
    this.dialogRef.close();
  }

  /**
   * @description emite el archivo en base64 cargado
   * @param base64 string en base64
   */
  public obtenerArchivo(base64: string) {
    this.emitirArchivo.emit(base64);
    this.cargaForm.controls['entrada'].setValue(base64);
  }

  /**
   * @description valida que esté correcto el formulario para proceder a guardar el archivo
   */
  public guardarDocumento() {
    if (this.cargaForm.valid) {
      this.cargarPruebaJuez();
    } else {
      this.mostrarValidaciones = true;
    }
  }

  /**
   * @description valida que los campos sean obligatorios o requeridos
   * @param campo variable para ingresar el campo requerido
   */
  public isRequired(campo: string): boolean {
    if (this.cargaForm.controls[campo]) {
      return this.cargaForm.controls[campo].hasError('required');
    } else {
      return false;
    }
  }

  /**
   * @description llama servicio que carga el documento
   */
  public cargarPruebaJuez() {
    this.abogadoService.cargarPruebaJuez(this.cargaForm.value).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.cerrarModal(true);
        } else {
          Modales.modalInformacion(
            Mensajes.MENSAJE_ERROR_G,
            this.dialog,
            ImagenesModal.EXCLAMACION
          );
        }
      },
    });
  }
}
