import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom } from 'rxjs';
import { LIMITE_CARGA, Mensajes } from 'src/app/constants';
import { ArchivoInterface } from '../../interfaces/shared.interfaces';
import { SharedService } from '../../services/shared.service';
import { Modales } from '../modals';

@Component({
  selector: 'app-carga-archivo',
  templateUrl: './carga-archivo.component.html',
  styleUrls: ['./carga-archivo.component.scss'],
})
export class CargaArchivoComponent implements OnChanges {
  /**
   * Es el output del base64 del archivo seleccionado.
   * Cuando es null o string vacio es porque se utilizó la opcion de borrar
   */
  @Output() baseArchivo = new EventEmitter<string | null>();
  /*
   * Pasando el parametro idArchivo e idSolicitud el
   * componente cargará el archivo al hacer click en descargar.
   */
  @Input() archivoCargado: ArchivoInterface | null = null;
  /**
   * Apariencia de botón normal o boton de iconos
   */
  @Input() apariencia: 'normal' | 'icon' | 'new' = 'normal';
  /**
   * Mostrar u ocultar el boton de descargar cuando hay un archivo seleccionado o cargado
   */
  @Input() downloadIcon: boolean = true;
  /**
   * Mostrar u ocultar el boton de cargar (sirve en caso que solo se quiera ver el de descargar o eliminar)
   */
  @Input() uploadIcon: boolean = true;
  /**
   * Mostrar u ocultar el boton de eliminar
   */
  @Input() deleteIcon: boolean = true;
  /**
   * Si queremos eliminar el archivo del blob storage (requiere el parametro archivoCargado)
   */
  @Input() deleteAction: boolean = true;
  /**
   * Deshabilita el boton de descargar en caso que sea visible
   */
  @Input() disableDownload: boolean = false;
  /**
   * Deshabilita el boton de cargar en caso que sea visible
   */
  @Input() disableUpload: boolean = false;
  /**
   * Limpia los inputs y archivos seleccionados una vez son enviados en baseArchivo
   */
  @Input() reset: boolean = false;
  /**
   * Es el texto para el boton de cargar
   */
  @Input() textoCargar!: string;
  /**
   * Es el texto para el boton de descargar
   */
  @Input() textoDescargar!: string;

  public file!: File | null;

  constructor(
    private spinner: NgxSpinnerService,
    private modales: Modales,
    private sharedService: SharedService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {}
  /**
   * @description regresa el archivo seleccionado
   */
  retornarArchivo(e: any, input: HTMLInputElement) {
    this.file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    if (this.file && this.validacionesArchivo(this.file)) {
      this.retornarArchivoBase64().then((d: any) => {
        const archivo = d.split(',');
        this.baseArchivo.emit(archivo[1]);
      });
    }
    if (this.reset) {
      this.borrarArchivoCargadoLocalmente(input);
    }
  }

  /**
   * @description borra el archivo localmente (este cambio no se aplica en la base de datos, solo en la sesión)
   */
  borrarArchivo(input: HTMLInputElement) {
    this.modales
      .modalConfirmacion(
        `Estás a punto de borrar el archivo. ¿Estás seguro? Esta acción no se puede deshacer.`
      )
      .subscribe(async (result) => {
        if (result) {
          if (
            this.archivoCargado &&
            this.archivoCargado.idArchivo &&
            this.archivoCargado.idSolicitud &&
            this.deleteAction
          ) {
            const eliminado = await lastValueFrom(
              this.sharedService.EliminarDocumentoPorID({
                idSolicitudServicio: this.archivoCargado.idSolicitud,
                idSolicitudServicioAnexo: this.archivoCargado.idArchivo,
              })
            );
            if (eliminado && eliminado.statusCode == 200) {
              this.modales.modalExito('Archivo eliminado exitosamente');
            } else {
              this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
            }
          }
          this.baseArchivo.emit('');
          this.borrarArchivoCargadoLocalmente(input);
        }
      });
  }

  /**
   * Borra el archivo cargado en el input
   * @param input
   */
  borrarArchivoCargadoLocalmente(input: HTMLInputElement) {
    input.value = '';
    this.file = null;
    this.archivoCargado = null;
  }
  /**
   * @description retorna file a string base64
   * @param file archivo
   * @returns promesa
   */
  toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  /**
   * @description valida extensión archivo
   * @param fileName nombre archivo
   * @returns boleano
   */
  validarExtensionArchivo(fileName: string) {
    let resultado = false;
    const allowedFiles = '.pdf';
    const regex = /(?:\.([^.]+))?$/;
    const extension = regex.exec(fileName);
    if (undefined !== extension && null !== extension) {
      if (allowedFiles === extension[0]) {
        resultado = true;
      }
    }
    return resultado;
  }

  /**
   * @description valida tamaño archivo pdf
   * @param size tamaño archivo
   * @returns boleano
   */
  validarTamanioArchivo(size: number) {
    return (size / 1024 / 1024).toFixed(4) <= LIMITE_CARGA ? true : false;
  }

  /**
   * @description valida que cumpla con el máximo permitido en la carga
   * @param file archivo
   * @returns boleano
   */
  validacionesArchivo(file: File): boolean {
    let resultado: boolean = false;
    if (this.validarExtensionArchivo(file.name)) {
      if (this.validarTamanioArchivo(file.size)) {
        resultado = true;
      }
    }
    return resultado;
  }

  /**
   * @description llama función para retornar archivo en base64
   * @returns promesa con archivo en base64
   */
  async retornarArchivoBase64() {
    return this.toBase64(this.file!);
  }

  async archivoCargadoToFile(
    nombreArchivo: string,
    base64: string,
    mimeType: 'application/pdf' = 'application/pdf'
  ) {
    const url = `data:application/pdf;base64,${base64}`;
    const urlToFile = async () => {
      const res = await fetch(url);
      const buf = await res.arrayBuffer();
      return new File([buf], nombreArchivo ? nombreArchivo : 'Archivo', {
        type: mimeType ? mimeType : 'application/pdf',
      });
    };
    return urlToFile();
  }

  async abrirArchivo() {
    if (!this.file) {
      await this.consultarArchivo();
    }
    if (this.file) {
      window.open(URL.createObjectURL(this.file));
    }
  }

  async consultarArchivo() {
    if (
      this.archivoCargado &&
      this.archivoCargado.idArchivo &&
      this.archivoCargado.idSolicitud
    ) {
      this.spinner.show();
      const resultArchivo = await lastValueFrom(
        this.sharedService.ObtenerArchivoPorId(
          this.archivoCargado.idSolicitud,
          this.archivoCargado.idArchivo
        )
      );
      if (resultArchivo && resultArchivo.statusCode == 200) {
        this.archivoCargado.base64 = resultArchivo.data;
        if (this.archivoCargado.base64) {
          this.file = await this.archivoCargadoToFile(
            this.archivoCargado.nombreArchivo
              ? this.archivoCargado.nombreArchivo
              : 'archivo',
            this.archivoCargado.base64,
            this.archivoCargado.mimeType
          );
        } else {
          this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
        }
        this.spinner.hide();
      }
    }
  }
}
