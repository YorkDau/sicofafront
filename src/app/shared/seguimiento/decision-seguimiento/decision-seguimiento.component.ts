import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';

import {
  CodigosRespuesta,
  Mensajes,
  TiposDocumentoCarga,
} from 'src/app/constants';
import {
  listaMedidasInterface,
  MedidasInterface,
} from '../interfaces/medidas.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { TablaRemisiones } from 'src/app/pages/private/interfaces/remision.interface';
import { SeguimientoService } from 'src/app/services/seguimiento.service';
import { SharedService } from 'src/app/services/shared.service';
import { Modales } from '../../modals';
import {
  validarFechaProrroga,
  validarJustificacionProrroga,
} from './validators';
import { DatePipe, formatDate } from '@angular/common';
import { CargarArchivoProrroga } from '../interfaces/seguimiento.interface';
import { AuthService } from 'src/app/auth/services/auth.service';
import { lastValueFrom } from 'rxjs';
import { GestionUsuariosService } from 'src/app/pages/private/comisario/administracion/services/gestion-usuarios.service';

@Component({
  selector: 'app-decision-seguimiento',
  templateUrl: './decision-seguimiento.component.html',
  styleUrls: ['./decision-seguimiento.component.scss'],
})
export class DecisionSeguimientoComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  public displayedColumns: string[] = ['tipoFormato', 'fecha', 'acciones'];
  public usuarioLogueado: string = '';
  public myForm!: FormGroup;

  public medidasForm: FormGroup[] = [];

  public objSol = JSON.parse(sessionStorage.getItem('info')!);
  private objUser!: any;
  public mostrarValidaciones: boolean = false;
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public archivo: string[] = [];
  public dataSource = new MatTableDataSource<TablaRemisiones>([]);
  public dataSourceList: TablaRemisiones[] = [];
  public medidasProteccionList: MedidasInterface[] = [];
  public medidasAtencionList: MedidasInterface[] = [];
  public medidasEstabilizacionList: MedidasInterface[] = [];
  private medidasProteccionResueltas: MedidasInterface[] = [];
  private medidasAtencionResueltas: MedidasInterface[] = [];
  private medidasEstabilizacionResueltas: MedidasInterface[] = [];
  private medidasData!: listaMedidasInterface | null;
  public minDate: string = formatDate(new Date(), 'yyyy-MM-ddTHH:mm', 'es');
  public medidasProrrogadas: string[] = [];
  public anexeos: number[] = [];
  public variable = true;
  public idTareaInstrumentos!: number;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private seguimientoService: SeguimientoService,
    private sharedService: SharedService,
    private authService: AuthService,
    private gestionUsuariosService: GestionUsuariosService,
    private modales: Modales,
    private datePipe: DatePipe
  ) {
    this.objUser = this.authService.currentUserValue!;
  }

  ngOnInit(): void {
    this.cargarForms();
    this.getUsuarioLogueado();
  }

  ngAfterViewInit() {
    this.cargarTabla();
    this.dataSource.paginator = this.paginator;
  }

  private getUsuarioLogueado() {

    const { userID } = JSON.parse(sessionStorage.getItem('USER_INFO')!);
    this.gestionUsuariosService.UsuarioEspecifico(userID).subscribe({
      next: (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.usuarioLogueado = `${data.data.nombres} ${data.data.apellidos}`;
        } else {
          this.msgError();
        }
      },
      error: () => {
        this.msgError();
      },
    });

  }

  /**
   * d@description Carga las listas de medias de atención, protección y estabilización
   */

  private async getListasMedidas() {
    try {
      const data: ResponseInterface = await lastValueFrom(
        this.seguimientoService.getMedidasEjecutadas(
          this.objSol.idSolicitud,
          this.objUser.userID
        )
      );
      if (data.statusCode === CodigosRespuesta.OK) {
        this.medidasData = data.data;
        this.medidasAtencionList = data.data.medidasDeAtencion;
        this.medidasProteccionList = data.data.medidasDeProteccion;
        this.medidasEstabilizacionList = data.data.medidasDeEstabilizacion;
        this.myForm.controls['justificacion'].setValue(data.data.comentario);
        this.setMedidasAtencionForm();
        this.idTareaInstrumentos = data.data.idTareaInstrumentos;
      }
      return Promise.resolve(true);
    } catch (error) {
      this.msgError();
    }
    return Promise.resolve(false);
  }

  setMedidasAtencionForm() {
    this.medidasAtencionList.forEach((medidas, index) => {
      let medida = this.fb.group(
        {
          id: index,
          idAnexoProrroga: medidas.idAnexoProrroga,
          adjunto: '',
          nombreMedida: [`${medidas.nomMedida}`],
          rCumplimiento: [medidas.estadoMedida, Validators.required],
          fechaProrroga: [medidas.prorroga],
          justificacionProrroga: [medidas.justificacionProrroga],
        },
        {
          validators: [validarFechaProrroga, validarJustificacionProrroga],
        }
      );

      this.medidasForm.push(medida);
    });
  }

  private async postGuardarMedidas(objMedidas: listaMedidasInterface) {
    try {
      const data: ResponseInterface = await lastValueFrom(
        this.seguimientoService.guardarMedidasSeguimiento(objMedidas)
      );
      return Promise.resolve(true);
    } catch (error) {
      this.msgError();
    }
    return Promise.resolve(false);
  }

  /**
   * @description Carga los form y sus validators como tambien los controls
   */
  private cargarForms() {
    this.myForm = this.fb.group({
      medidasDeAtencion: this.fb.array([]),
      medidasDeProteccion: this.fb.array([]),
      medidasDeEstabilizacion: this.fb.array([]),
      rConclusion: ['Si', Validators.required],
      justificacion: ['', Validators.required],
      rIncumplimiento: [0, Validators.required],
    });
  }

  get getMedidasAtencion() {
    return this.myForm.get('medidasDeAtencion') as FormArray;
  }

  get getMedidasProteccion() {
    return this.myForm.get('medidasDeProteccion') as FormArray;
  }

  get getMedidasEstabilizacion() {
    return this.myForm.get('medidasDeEstabilizacion') as FormArray;
  }

  /**
   * @description permite crear el form group para cada una de las medidas de atencion
   */
  private crearControlsMedidaDeAtencion() {
    let section = this.myForm.get('medidasDeAtencion') as FormArray;

    this.medidasAtencionList.forEach((medidas) => {
      section.push(
        this.fb.group(
          {
            nombreMedida: [`${medidas.nomMedida}`],
            rCumplimiento: [medidas.estadoMedida, Validators.required],
            fechaProrroga: [medidas.prorroga],
            justificacionProrroga: [medidas.justificacionProrroga],
          },
          {
            validators: [
              validarFechaProrroga(),
              validarJustificacionProrroga(),
            ],
          }
        )
      );
    });
    this.myForm.updateValueAndValidity();
  }

  /**
   * @description permite crear el form group para cada una de las medidas de protección
   */
  private crearControlsMedidaDeProteccion() {
    let section = this.myForm.get('medidasDeProteccion') as FormArray;

    this.medidasProteccionList.forEach((medidas) => {
      section.push(
        this.fb.group({
          nombreMedida: [`${medidas.nomMedida}`],
          rCumplimiento: [medidas.estadoMedida, Validators.required],
        })
      );
    });
    this.myForm.updateValueAndValidity();
  }

  /**
   * @description permite crear el form group para cada una de las medidas de protección
   */
  private crearControlsMedidaDeEstabilizacion() {
    let section = this.myForm.get('medidasDeEstabilizacion') as FormArray;
    this.medidasEstabilizacionList.forEach((medidas) => {
      section.push(
        this.fb.group({
          nombreMedida: [`${medidas.nomMedida}`],
          rCumplimiento: [medidas.estadoMedida, Validators.required],
        })
      );
    });
    this.myForm.updateValueAndValidity();
  }

  /**
   * @description añade los form groups de las medidas cuando se da click al
   * radiobutton no de la conclusion
   */
  public addCotrolsMedidas() {
    let medidasDeProteccion = this.getMedidasProteccion;
    let medidasAtencion = this.getMedidasAtencion;
    let medidasEstabilizacion = this.getMedidasEstabilizacion;
    if (
      medidasAtencion.length === 0 &&
      medidasDeProteccion.length === 0 &&
      medidasEstabilizacion.length === 0
    ) {
      this.crearControlsMedidaDeAtencion();
      this.crearControlsMedidaDeProteccion();
      this.crearControlsMedidaDeEstabilizacion();
      this.myForm.updateValueAndValidity();
    }
  }

  /**
   * @description elimina los form gropus de las medidas cuando se da click al
   * radiobutton  si de la conclusion
   */

  public eliminarControlsMedidas() {
    let medidasProteccion = this.myForm.get('medidasDeProteccion') as FormArray;
    let medidasAtencion = this.myForm.get('medidasDeAtencion') as FormArray;
    let medidasEstabilizacion = this.myForm.get(
      'medidasDeEstabilizacion'
    ) as FormArray;

    this.myForm.controls['rIncumplimiento'].setValue(0);

    this.medidasEstabilizacionList.forEach((_medidas) => {
      medidasEstabilizacion.controls = medidasEstabilizacion.controls.slice(
        0,
        medidasEstabilizacion.controls.length - 1
      );
      medidasEstabilizacion.updateValueAndValidity();
    });
    this.medidasProteccionList.forEach((_medida) => {
      medidasProteccion.controls = medidasProteccion.controls.slice(
        0,
        medidasProteccion.controls.length - 1
      );
      medidasProteccion.updateValueAndValidity();
    });
    this.medidasAtencionList.forEach((_medidas) => {
      medidasAtencion.controls = medidasAtencion.controls.slice(
        0,
        medidasAtencion.controls.length - 1
      );
      medidasAtencion.updateValueAndValidity();
    });

    medidasProteccion.updateValueAndValidity();
    medidasAtencion.updateValueAndValidity();
    medidasEstabilizacion.updateValueAndValidity();
    this.myForm.updateValueAndValidity();
  }
  /**
   * @descripcion Revisa el tamaño de las listas de las medidas por si llegan a estar vacias todas y no mostrar el acordeon
   * @returns boolean
   */
  public noTieneMedidas(): boolean {
    if (
      this.medidasAtencionList.length <= 0 &&
      this.medidasProteccionList.length <= 0 &&
      this.medidasEstabilizacionList.length <= 0
    ) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * @description Carga la informacion de la tabla de los seguimientos disponibles
   */

  private async cargarTabla() {
    const cargaID = await this.getListasMedidas();
    if (cargaID) {
      this.seguimientoService
        .getTablaSeguimiento(this.idTareaInstrumentos, this.objSol.idSolicitud)
        .subscribe({
          next: (data: ResponseInterface) => {
            if (data.statusCode === CodigosRespuesta.OK) {
              this.dataSourceList = data.data;
              this.dataSource = new MatTableDataSource(this.dataSourceList);
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

  /**
   * @description Descarga el archivo que esta adjunto en la tabla tabla de seguimientos
   * @param row
   */

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
            link.download = `${fileName}.pdf`;
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

  private async postCargarArchivos(body: CargarArchivoProrroga) {
    try {
      const data: ResponseInterface = await lastValueFrom(
        this.sharedService.guardarArchivo(body)
      );
      if (data.statusCode === CodigosRespuesta.OK) {
        this.anexeos.push(data.data);
      }
    } catch (error) {
      this.msgError();
    }
  }

  /**
   * @description hace la validacion para los campos obligatorios
   * @param formulario
   * @param campo
   * @returns
   */
  public isRequired(campo: string): boolean {
    return this.myForm.controls[campo].hasError('required');
  }
  /**
   * @description hace la validacion de los campos dentro del acordeon
   * @param form
   * @param campo
   * @returns boolean
   */
  public isRequiredMedidas(form: FormGroup, campo: string): boolean {
    return form.controls[campo].hasError('required');
  }

  public isRequiredJustificacion(form: FormGroup): boolean {
    return form.hasError('isRequiredJustificacionProrroga');
  }
  /**
   * @description hace la vailidacion de los campos de fecha cuando se es necesario
   * @param form
   * @returns boolean
   */

  public isRequiredFecha(form: FormGroup): boolean {
    return form.hasError('isRequiredFechaProrroga');
  }

  async guardarArchivosCargados() {
    try {
      for (const medidas of this.medidasForm) {
        if (medidas.controls['adjunto'].value != '') {
          await this.postCargarArchivos(
            this.getDataPostArchivoProrroga(
              medidas.controls['adjunto'].value,
              medidas.controls['nombreMedida'].value
            )
          );
        }
      }
      return Promise.resolve(true);
    } catch (error) {
      this.msgError();
    }
    return Promise.resolve(false);
  }

  /**
   * @description llena el json con la informacion de las medidas de proteccion
   */
  private llenarMedidasProteccionResueltas() {
    let medidasProteccion = this.getMedidasProteccion.controls;

    this.medidasProteccionList.forEach((medida, index) => {
      this.medidasProteccionResueltas.push({
        idseguimientoMedidas: medida.idseguimientoMedidas,
        idMedida: medida.idMedida,
        estadoMedida: medidasProteccion[index]?.value['rCumplimiento'],
        prorroga: null,
        justificacionProrroga: null,
        nomMedida: medida.nomMedida,
        textoMedida: medida.textoMedida,
        tipoMedida: medida.tipoMedida,
        idAnexoProrroga: null,
        nombreAnexoProrroga: null,
      });
    });
  }
  /**
   * @description metodo para llenar el json con la informacion de las medidas de estabilizacion
   */
  private llenarMedidasEstabilizacionResueltas() {
    let medidasEstabilizacion = this.getMedidasEstabilizacion;
    this.medidasEstabilizacionList.forEach((medida, index) => {
      this.medidasEstabilizacionResueltas.push({
        idseguimientoMedidas: medida.idseguimientoMedidas,
        idMedida: medida.idMedida,
        estadoMedida:
          medidasEstabilizacion.controls[index].value['rCumplimiento'],
        prorroga: null,
        justificacionProrroga: null,
        nomMedida: medida.nomMedida,
        textoMedida: medida.textoMedida,
        tipoMedida: medida.tipoMedida,
        idAnexoProrroga: null,
        nombreAnexoProrroga: null,
      });
    });
  }
  /**
   * @description metodo para llenar el json con la informacion de las medidas de atencion
   */
  private llenarMedidasAtencioResueltas() {
    let fechaProrroga: string | null;
    let justificacionProrroga: string;
    let idAnexo: number | null;
    let nombreAnexo: string;

    this.medidasForm.forEach((f) => {
      if (f.controls['rCumplimiento'].value === 'PRORROGA') {
        fechaProrroga = this.datePipe.transform(
          f.controls['fechaProrroga'].value,
          'yyyy/MM/dd'
        );
        justificacionProrroga = f.controls['justificacionProrroga'].value;
        idAnexo = this.anexeos[f.controls['id'].value];
        nombreAnexo = f.controls['nombreMedida'].value;
      } else {
        fechaProrroga = null;
        justificacionProrroga = '';
        idAnexo = null;
        nombreAnexo = '';
      }

      this.medidasAtencionResueltas.push({
        idseguimientoMedidas:
          this.medidasAtencionList[f.controls['id'].value].idseguimientoMedidas,
        idMedida: this.medidasAtencionList[f.controls['id'].value].idMedida,
        estadoMedida: f.controls['rCumplimiento'].value,
        prorroga: fechaProrroga,
        justificacionProrroga: justificacionProrroga,
        nomMedida: this.medidasAtencionList[f.controls['id'].value].nomMedida,
        textoMedida:
          this.medidasAtencionList[f.controls['id'].value].textoMedida,
        tipoMedida: this.medidasAtencionList[f.controls['id'].value].tipoMedida,
        idAnexoProrroga: idAnexo,
        nombreAnexoProrroga: nombreAnexo,
      });
    });
  }
  /**
   * @description metodo para llenar el json a enviar al momento de guardar un archivo
   */
  private getDataPostArchivoProrroga(
    archivo: string,
    nombreArchivio: string
  ): CargarArchivoProrroga {
    return {
      entrada: archivo,
      idSolicitudServicio: this.objSol.idSolicitud,
      nombrearchivo: nombreArchivio,
      tipoDocumento: TiposDocumentoCarga.Prorroga_De_Medida,
      idComisaria: this.objUser.idComisaria,
      idUsuario: this.objUser.userID,
    };
  }
  /**
   * @description metodo que devuelve las medias resultas para poder guardarlas
   */
  private get getMedidasResueltas(): listaMedidasInterface {
    return {
      idTareaInstrumentros: null,
      idSolicitudServicio: this.medidasData!.idSolicitudServicio,
      idSeguimiento: this.medidasData!.idSeguimiento,
      idProgramacion: this.medidasData!.idProgramacion,
      usuarioModifica: 1,
      comentario: this.myForm.get('justificacion')?.value,
      medidasDeAtencion: this.medidasAtencionResueltas,
      medidasDeEstabilizacion: this.medidasEstabilizacionResueltas,
      medidasDeProteccion: this.medidasProteccionResueltas,
      medidasDeProteccionEntidad: this.medidasData!.medidasDeProteccionEntidad,
    };
  }

  /**
   * @description devuelve a pagina anterior
   */
  public cancelar() {
    this.modales.modalCancelar('/casos');
  }

  /**
   * @description finaliza la actuacion y genera la siguiente
   */

  public cerrarActuaciones() {
    if (this.myForm.invalid) {
      this.mostrarValidaciones = true;
    } else {
      this.mostrarValidaciones = false;
      this.modales
        .modalConfirmacion(Mensajes.MENSAJE_CERRAR_ACT)
        .subscribe(async (cerrar) => {
          if (cerrar) {
            const isArchivosCargados = await this.guardarArchivosCargados();
            if (isArchivosCargados) {
              this.llenarMedidasAtencioResueltas();
              this.llenarMedidasProteccionResueltas();
              this.llenarMedidasEstabilizacionResueltas();
              this.postGuardarMedidas(this.getMedidasResueltas).then(
                (guardar) => {
                  if (guardar) {
                    this.modales
                      .modalExito('Medidas guardadas exitosamente.')
                      .subscribe(() => {
                        this.sharedService
                          .cerrarActuaciones({
                            tareaID: this.objSol.idTarea,
                            perfilCod: this.objUser.perfil!,
                            userID: this.objUser.userID!,
                            valorEtiqueta:
                              this.myForm.get('rIncumplimiento')?.value,
                          })
                          .subscribe(() => {
                            this.router.navigate(['/casos']);
                          });
                      });
                  }
                }
              );
            }
          }
        });
    }
  }

  /**
   * @description Archiva la diligencia
   */
  public archivarDiligencia() {
    this.modales.modalArchivarDiligencias(this.objSol);
  }

  /**
   * @description redirecciona a la ruta principal de los casos
   */

  redireccionar() {
    this.router.navigate(['../abogado/casos']);
  }
  /**
   * @description mensaje de error para lo servicios
   */
  private msgError() {
    this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
  }
}
