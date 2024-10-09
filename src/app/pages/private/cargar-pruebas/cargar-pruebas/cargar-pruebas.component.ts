import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TiposDocumentoCarga } from '../../../../constants';
import { Modales } from '../../../../shared/modals';
import {
  NotificacionImplicado,
  PruebaCaso,
} from '../../interfaces/abogado.interface';
import { CargarPruebasService } from '../../abogado/services/cargar-pruebas.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificacionesImplicadoService } from '../../abogado/services/notificaciones-implicados.service';
import { MatPaginator } from '@angular/material/paginator';
import { RecepcionCasosInterface } from '../../../../interfaces/recepcion-casos.interface';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-cargar-pruebas',
  templateUrl: './cargar-pruebas.component.html',
  styleUrls: ['./cargar-pruebas.component.scss'],
})
export class CargarPruebasComponent implements OnInit {
  @ViewChild('paginator') paginator!: MatPaginator;
  private tarea: RecepcionCasosInterface = JSON.parse(
    sessionStorage.getItem('info')!
  );
  public columnas: string[] = [
    'nombrePrueba',
    'descripcionPrueba',
    'tipoPrueba',
    'accion',
  ];
  public dataSource: MatTableDataSource<PruebaCaso> =
    new MatTableDataSource<PruebaCaso>([]);
  public listaInvolucrados: NotificacionImplicado[] = [];
  public form = new FormGroup({
    tipoPrueba: new FormControl('pericial', [Validators.required]),
    nombrePrueba: new FormControl('', [Validators.required]),
    idInvolucrado: new FormControl(''),
  });
  public avisoError: string = '';

  private user!: UserInterface;

  constructor(
    private cargarPruebasService: CargarPruebasService,
    private authService: AuthService,
    private modales: Modales,
    private notificacionesImplicadoService: NotificacionesImplicadoService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.currentUserValue!;
    this.cargarListaInvolucrados();
    this.consultarPruebasCargadas();
  }

  /**
   * @descripcion consulta las pruebas cargadas
   */
  consultarPruebasCargadas() {
    this.cargarPruebasService
      .consultarPruebasCargadas(this.tarea.idSolicitud, this.tarea.idTarea)
      .subscribe((result) => {
        if (result && result.statusCode === 200) {
          this.dataSource.data = result.data;
          this.dataSource.paginator = this.paginator;
        }
      });
  }

  /**
   * @descripcion carga la lista de involucrados
   */
  cargarListaInvolucrados() {
    this.notificacionesImplicadoService
      .consultar(this.tarea.idSolicitud, this.tarea.idTarea)
      .subscribe((result) => {
        if (result && result.statusCode === 200) {
          this.listaInvolucrados = result.data;
        }
      });
  }

  /**
   * @descripcion elimina la prueba seleccionada
   * @param row
   */
  eliminarPrueba(row?: PruebaCaso) {
    if (row) {
      this.cargarPruebasService
        .eliminarPrueba(row.idPrueba, row.idAnexo)
        .subscribe((result) => {
          if (result && result.statusCode === 200) {
            this.modales
              .modalExito('Prueba eliminada correctamente.')
              .subscribe(() => {
                this.consultarPruebasCargadas();
              });
          }
        });
    }
  }
  /**
   * @descripcion cierra las actuaciones
   */
  cerrarActuaciones() {
    this.modales.modalCerrarActuaciones(this.tarea);
  }
  /**
   * @descripcion redirige a la consulta de tareas
   */
  cancelar() {
    this.modales.modalCancelar();
  }
  /**
   * @descripcion archiva las diligencias
   */
  archivarDiligencias() {
    this.modales.modalArchivarDiligencias(this.tarea);
  }
  /**
   * @descripcion carga los archivos a blob storage
   */
  cargarArchivo(base64: string, row?: PruebaCaso) {
    const tipo =
      this.form.get('tipoPrueba')?.value == 'pericial'
        ? TiposDocumentoCarga.PRUEBAS_PERICIALES
        : TiposDocumentoCarga.PRUEBAS_ACCIONANTE_ACCIONADO;
    if (!tipo) {
      this.modales.modalInformacion('Debe seleccionar un tipo de prueba');
    } else if (base64) {
      const idInvolucrado = this.form.get('idInvolucrado')?.value;
      this.cargarPruebasService
        .anadirPrueba({
          entrada: base64,
          idInvolucrado: idInvolucrado ? idInvolucrado : null,
          idSolicitudServicio: this.tarea.idSolicitud,
          idUsuario: this.user.userID,
          nombrearchivo: this.form.get('nombrePrueba')?.value + '',
          tipoDocumento: tipo,
          idTarea: this.tarea.idTarea,
        })
        .subscribe((result) => {
          if (result && result.statusCode === 200) {
            this.modales
              .modalExito('Prueba añadida correctamente.')
              .subscribe(() => {
                this.consultarPruebasCargadas();
              });
          }
          this.resetForm();
        });
    } else {
      this.resetForm();
      this.eliminarPrueba(row);
    }
  }
  /**
   * @descripcion valida que se pueda cargar una prueba
   */
  puedeCargar(): boolean {
    const valueNombrePrueba: string = this.form.get('nombrePrueba')?.value;
    return valueNombrePrueba != ''
      ? this.isValidNombrePrueba(valueNombrePrueba)
      : false;
  }
  /**
   * @descripcion valida el nombre de la prueba no este repetido
   */
  isValidNombrePrueba(valueNombrePrueba: string): boolean {
    this.avisoError = '';
    const idInvolucrado = this.form.get('idInvolucrado')?.value;
    const pericial = this.form.get('tipoPrueba')?.value == 'pericial';
    const isNombrePrueba: PruebaCaso | undefined = this.dataSource.data.find(
      (prueba) => {
        return (
          prueba.nombrePrueba &&
          prueba.nombrePrueba.toUpperCase().trim() ==
            valueNombrePrueba.toUpperCase().trim()
        );
      }
    );
    if (isNombrePrueba && pericial) {
      this.avisoError =
        'No puede cargar una prueba pericial con el mismo nombre.';
      return false;
    }
    if (isNombrePrueba && !pericial && idInvolucrado) {
      const isInvolucrado: PruebaCaso | undefined = this.dataSource.data.find(
        (prueba) => {
          return prueba.idInvolucrado == idInvolucrado;
        }
      );
      if (isInvolucrado) {
        this.avisoError =
          'No puede cargar una prueba del mismo involucrado con el mismo nombre.';
        return false;
      }
    } else if (!pericial && !idInvolucrado) {
      return false;
    }
    return true;
  }
  /**
   * @descripcion resetear el formulario
   */
  resetForm() {
    this.form.get('nombrePrueba')?.setValue('');
    this.form.get('idInvolucrado')?.setValue('');
  }
}
