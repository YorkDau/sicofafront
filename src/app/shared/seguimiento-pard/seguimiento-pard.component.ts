import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { TablaRemisiones } from 'src/app/pages/private/interfaces/remision.interface';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import { lastValueFrom } from 'rxjs';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Modales } from '../modals';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PdfExport } from '../seguimiento/ejecutar-seguimiento/generar-seguimiento/formatos/pdf-exports';
import { GestionUsuariosService } from 'src/app/pages/private/comisario/administracion/services/gestion-usuarios.service';
import { MedidasInterface } from '../seguimiento/interfaces/medidas.interface';
import { SharedService } from 'src/app/services/shared.service';

@Component({
  selector: 'app-seguimiento-pard',
  templateUrl: './seguimiento-pard.component.html',
  styleUrls: ['./seguimiento-pard.component.scss'],
})
export class SeguimientoPardComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public displayedColumns: string[] = ['tipoFormato', 'fecha', 'acciones'];
  public displayedColumnsMedidas: string[] = ['nomMedida'];

  public dataSource = new MatTableDataSource<TablaRemisiones>([]);
  public dataSourceMedidas = new MatTableDataSource<MedidasInterface>([]);

  public objSol = JSON.parse(sessionStorage.getItem('info')!);
  public idTareaInstrumentos!: number;
  public idProgramacion!: number;
  public usuarioLogueado: string = '';

  private objUser!: any;

  // Variables para el formulario de conclusión
  public myForm!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;

  constructor(
    private seguimientoService: SeguimientoService,
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private fb: FormBuilder,
    private modales: Modales,
    private sharedService: SharedService,
    private gestionUsuariosService: GestionUsuariosService
  ) {
    this.objUser = this.authService.currentUserValue!;
    this.initForm();
  }

  ngOnInit(): void {
    this.cargarTabla();
    this.getUsuarioLogueado();
  }

  private initForm(): void {
    this.myForm = this.fb.group({
      rConclusion: ['Si', Validators.required],
      justificacion: [''],
      rIncumplimiento: [0, Validators.required],
      medidas: this.fb.array([]),
    });
  }

  get medidasArray(): FormArray {
    return this.myForm.get('medidas') as FormArray;
  }

  public imprimir() {
    this.generarPDF();
  }
  public generarPDF() {
    PdfExport.generarPdfActa();
  }

  private async cargarTabla() {
    const cargaID = await this.getListasMedidas();
    if (cargaID) {
      this.seguimientoService
        .getTablaSeguimiento(this.idTareaInstrumentos, this.objSol.idSolicitud)
        .subscribe({
          next: (data: ResponseInterface) => {
            if (data.statusCode === CodigosRespuesta.OK) {
              this.dataSource = new MatTableDataSource(data.data);
              this.dataSource.paginator = this.paginator;
            } else {
              this.msgError();
            }
          },
          error: () => {
            this.msgError();
          },
        });
    }
  }

  private async getListasMedidas() {
    try {
      const data: ResponseInterface = await lastValueFrom(
        this.seguimientoService.getMedidasEjecutadasPard(
          this.objSol.idSolicitud,
          this.objUser?.userID!
        )
      );
      if (data.statusCode === CodigosRespuesta.OK) {
        this.dataSourceMedidas = new MatTableDataSource(data.data.medidas);
        this.idTareaInstrumentos = data.data.idTareaInstrumentos;
        this.idProgramacion = data.data.idProgramacion;

        // Inicializar formulario de medidas si hay datos
        if (data.data.medidas && data.data.medidas.length > 0) {
          this.initMedidasForm(data.data.medidas);
        }
      }
      return Promise.resolve(true);
    } catch (error) {
      this.msgError();
      return Promise.resolve(false);
    }
  }

  private initMedidasForm(medidas: MedidasInterface[]): void {
    const medidasArray = this.myForm.get('medidas') as FormArray;
    medidasArray.clear();

    medidas.forEach((medida) => {
      medidasArray.push(
        this.fb.group({
          idMedida: [medida.idMedida],
          nomMedida: [medida.nomMedida],
          rCumplimiento: [
            medida.estadoMedida || 'SIN VERIFICAR',
            Validators.required,
          ],
          observaciones: [medida.textoMedida || ''],
        })
      );
    });
  }

  public isRequired(controlName: string): boolean {
    const control = this.myForm.get(controlName);
    return !!(
      control?.hasError('required') &&
      (control?.touched || this.mostrarValidaciones)
    );
  }

  public isRequiredMedida(formIndex: number, controlName: string): boolean {
    const medidaGroup = this.medidasArray.at(formIndex) as FormGroup;
    return (
      medidaGroup?.controls[controlName]?.hasError('required') &&
      (medidaGroup?.controls[controlName]?.touched || this.mostrarValidaciones)
    );
  }

  public onConclusionChange(value: string): void {
    if (value === 'No') {
      this.myForm.get('rIncumplimiento')?.enable();
    } else {
      this.myForm.get('rIncumplimiento')?.setValue(0);
      this.myForm.get('rIncumplimiento')?.disable();
    }
  }

  public modalConfirmaCerrarActuacion() {
    if (this.myForm.invalid) {
      this.mostrarValidaciones = true;
      return;
    }

    Modales.modalConfirmacion(
      Mensajes.MENSAJE_CERRAR_ACT,
      this.dialog,
      ImagenesModal.EXCLAMACION
    ).subscribe((res) => {
      if (res) this.cerrarActuacion();
    });
  }
  private getUsuarioLogueado() {
    const { userID } = JSON.parse(sessionStorage.getItem('USER_INFO')!);
    this.gestionUsuariosService.UsuarioEspecifico(userID).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.usuarioLogueado = `${data.data.nombres} ${data.data.apellidos}`;
          console.log('Usuario logueado:', this.usuarioLogueado);
        } else {
          this.msgError();
        }
      },
      error: () => {
        this.msgError();
      },
    });
  }

    public descargarArchivo(row: TablaRemisiones) {
      this.sharedService
        .ObtenerArchivoPorId(this.objSol.idSolicitud, row.idAnexo!)
        .subscribe({
          next: (data: ResponseInterface) => {
            if (data.statusCode === CodigosRespuesta.OK) {
              const source = `data:application/pdf;base64,${data.data}`;
              const link = document.createElement('a');
              const fileName = row.nombreRemision;
              link.href = source;
              link.download = `${fileName}`;
              link.click();
            } else {
              this.msgError();
            }
          },
          error: () => {
            this.msgError();
          },
        });
    }
  private async cerrarActuacion() {
  const medidasResueltas = this.obtenerMedidasParaCierre();
  console.log('Medidas a guardar:', medidasResueltas);

  const guardado = await this.guardarMedidasPard(medidasResueltas);

  if (guardado) {
    this.modales.modalExito('Medidas guardadas exitosamente.').subscribe(() => {
      this.procederCierreActuacion();
    });
  }
}
private obtenerMedidasParaCierre(): MedidasInterface[] {
  const medidasFormulario = this.myForm.value.medidas;
  return this.dataSourceMedidas.data.map((medidaOriginal, index) => {
    return {
      idseguimientoMedidas: medidaOriginal.idseguimientoMedidas,
      idMedida: medidaOriginal.idMedida,
      estadoMedida: medidasFormulario[index].rCumplimiento,
      prorroga: null,
      justificacionProrroga: null,
      nomMedida: medidaOriginal.nomMedida,
      textoMedida: medidaOriginal.textoMedida,
      tipoMedida: medidaOriginal.tipoMedida,
      idAnexoProrroga: null,
      nombreAnexoProrroga: null,
    };
  });
}


  private async guardarMedidasPard(medidas: MedidasInterface[]) {
  try {
    const obj: any = {
      idTareaInstrumentros:  this.objSol.idTarea,
      idSolicitudServicio: this.objSol.idSolicitud,
      idSeguimiento: 0, 
      idProgramacion: this.idProgramacion,
      usuarioModifica: this.objUser?.userID,
      comentario: this.myForm.get('justificacion')?.value,
      medidasDeAtencion: [],
      medidasDeEstabilizacion: [],
      medidasDeProteccion: medidas, // 👈 usamos solo esta lista
    };
    console.log('Guardando medidas:', obj);
    const res: ResponseInterface = await lastValueFrom(
      this.seguimientoService.guardarMedidasSeguimiento(obj)
    );

    return res.statusCode === CodigosRespuesta.OK;
  } catch (error) {
    this.msgError();
    return false;
  }
}

private procederCierreActuacion() {
  const objCerrar = this.retornarObjCerrarActuacion();

  this.seguimientoService.cerrarActuaciones(objCerrar).subscribe({
    next: (data: ResponseInterface) => {
      if (data.statusCode === CodigosRespuesta.OK) {
        this.modales.modalExito('Actuación cerrada exitosamente.').subscribe(() => {
          this.router.navigate(['/casos']);
        });
      } else {
        this.msgError();
      }
    },
    error: () => {
      this.msgError();
    },
  });
}

private retornarObjCerrarActuacion(): any {
  return {
    tareaID: this.objSol.idTarea,
    userID: this.objUser?.userID,
    perfilCod: this.objUser?.perfil,
    valorEtiqueta: this.myForm.get('rIncumplimiento')?.value,
  };
}

  public cancelar() {
    this.modales.modalCancelar('/casos');
  }

  private msgError() {
    this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
  }
}
