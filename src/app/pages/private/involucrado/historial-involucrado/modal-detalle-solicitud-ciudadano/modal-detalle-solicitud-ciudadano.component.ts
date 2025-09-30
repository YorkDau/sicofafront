import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { lastValueFrom } from 'rxjs';
import { Mensajes } from '../../../../../constants';
import { SharedFunctions } from '../../../../../shared/functions';
import { Modales } from '../../../../../shared/modals';
import { CiudadanoDetalleInterface } from '../../../interfaces/ciudadano.interface';
import { SolicitudServicioDetalleInterface, AnexosInterface } from '../../../interfaces/historial.interface';
import { InvolucradoService } from '../../services/involucrado.service';
import { SharedService } from 'src/app/services/shared.service';
import { CodigosRespuesta } from 'src/app/constants';
import * as interfaces from 'src/app/pages/private/interfaces/ciudadano.interface';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app.reducer';

@Component({
  selector: 'app-modal-detalle-solicitud-ciudadano',
  templateUrl: './modal-detalle-solicitud-ciudadano.component.html',
  styleUrls: ['./modal-detalle-solicitud-ciudadano.component.scss']
})
export class ModalDetalleSolicitudCiudadanoComponent implements OnInit {
  public detalleSolicitud!: SolicitudServicioDetalleInterface;
  public anexos: AnexosInterface[] = [];
  public paginatedAnexos: AnexosInterface[] = []; 
  public listaTipoEntidad: interfaces.DominioInterface[] = [];
  public cargando = true;
  public pageSize = 5;
  public pageSizeOptions = [5, 10, 25];
  public currentPage = 0;

  constructor(
    private matDialogRef: MatDialogRef<ModalDetalleSolicitudCiudadanoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id_solicitud: number, ciudadano: CiudadanoDetalleInterface },
    private involucradoService: InvolucradoService,
    private sharedService: SharedService,
    private modales: Modales,
    private store: Store<AppState>,
  ) { 
    if (!this.data.id_solicitud) {
      console.error("Error de enrutamiento: No se obtuvo la identificación de la solicitud");
      this.cerrarModal();
      return;
    }
    if (!this.data.ciudadano) {
      console.error("Error de enrutamiento: No se obtuvo la información del ciudadano");
      this.cerrarModal();
      return;
    }
  }

  async ngOnInit() {
    await this.getSolicitudDetalle();
    await this.cargarAnexos();    

    this.store.select('tipo_entidad').subscribe(({ tipo_entidad }) => {
      this.listaTipoEntidad = tipo_entidad;
    });
  }

  public async getSolicitudDetalle() {
    try {
      this.cargando = true;
      const result = await lastValueFrom(
        this.involucradoService.getSolicitudDetalle(this.data.id_solicitud)
      );
      
      if (!result || result.statusCode !== CodigosRespuesta.OK || !result.data) {
        this.modales.modalInformacion(result?.message || "No se encontró la información de la solicitud.");
        this.cerrarModal();
        return;
      }

      this.detalleSolicitud = result.data;
    } catch (error: any) {
      SharedFunctions.getErrorMessage(error);
      this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
      this.cerrarModal();
    } finally {
      this.cargando = false;
    }
  }

  private async cargarAnexos() {
    try {
      if (this.detalleSolicitud?.anexos) {
        this.mapearAnexos(this.detalleSolicitud.anexos);
        return;
      }
  
      const result = await lastValueFrom(
        this.sharedService.ConsultaGeneral(this.data.id_solicitud)
      );
  
      if (!result || result.statusCode !== CodigosRespuesta.OK || !result.data) {
        console.warn('No se pudieron obtener los anexos:', result?.message);
        return;
      }
  
      if (result.data.anexos) {
        this.mapearAnexos(result.data.anexos);
      } else {
        console.warn('El servicio no devolvió anexos en la respuesta');
      }
    } catch (error) {
      console.error('Error al cargar anexos:', error);
      this.modales.modalInformacion('Error al cargar documentos adjuntos');
    }
  }
  
  private mapearAnexos(anexos: any[]): void {
    this.anexos = anexos.map(anexo => ({
      idAnexo: anexo.idAnexo || anexo.id_anexo,
      nombreDocumento: anexo.nombreArchivo || anexo.nombre_archivo,
      nombreArchivo: anexo.nombreDocumento || anexo.nombre_archivo,
      fechaCreacion: anexo.fechaCreacion || anexo.fecha_creacion
    }));
    
    this.updatePaginatedAnexos();
  }

  private updatePaginatedAnexos(): void {
    const startIndex = this.currentPage * this.pageSize;
    this.paginatedAnexos = this.anexos.slice(startIndex, startIndex + this.pageSize);
  }

  public onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedAnexos();
  }

  public async descargarArchivo(anexo: AnexosInterface) {
    try {
      const result = await lastValueFrom(
        this.sharedService.ObtenerArchivoPorId(this.data.id_solicitud, anexo.idAnexo)
      );

      if (result.statusCode === CodigosRespuesta.OK) {
        const source = `data:application/pdf;base64,${result.data}`;
        const link = document.createElement('a');
        const fileName = anexo.nombreDocumento;
        link.href = source;
        link.download = `${fileName}`;
        link.click();
      } else {
        this.modales.modalInformacion('Error al descargar el archivo');
      }
    } catch (error) {
      console.error('Error descargando anexo:', error);
      this.modales.modalInformacion(Mensajes.MENSAJE_ERROR_G);
    }
  }

  cerrarModal() {
    this.matDialogRef.close();
  }

  printNombreCiudadano() {
    if (this.data.ciudadano) {
      let nombre_completo = "";
      nombre_completo += this.data.ciudadano.nombre_ciudadano ? this.data.ciudadano.nombre_ciudadano + " " : "";
      nombre_completo += this.data.ciudadano.primer_apellido ? this.data.ciudadano.primer_apellido + " " : "";
      nombre_completo += this.data.ciudadano.segundo_apellido ? this.data.ciudadano.segundo_apellido : "";
      return nombre_completo;
    }
    return "N/A";
  }
}