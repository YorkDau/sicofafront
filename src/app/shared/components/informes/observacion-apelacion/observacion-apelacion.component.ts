import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { SharedService } from 'src/app/services/shared.service';
import { Modales } from 'src/app/shared/modals';

@Component({
  selector: 'app-observacion-apelacion',
  templateUrl: './observacion-apelacion.component.html',
  styleUrls: ['./observacion-apelacion.component.scss'],
})
export class ObservacionApelacionComponent implements OnInit {
  public myForm!: FormGroup;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  listaObservaciones: any = [];
  public objSol = JSON.parse(sessionStorage.getItem('info')!);
  public dataSource = new MatTableDataSource<any>(this.listaObservaciones);

  public columnas: string[] = ['observacion', 'fecha_observacion'];

  constructor(
    private fb: FormBuilder,
    private _sharedService: SharedService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    console.log(this.objSol);
    this.cargarForm();
    this.consultarObservaciones();
  }

  cargarForm() {
    this.myForm = this.fb.group({
      observacion: ['',[Validators.required]],
    });
  }

  consultarObservaciones() {
    this._sharedService
      .ConsultarObservacionesApelaciones(this.objSol.id_solicitud_servicio)
      .subscribe({
        next: (data: any) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            if (data.data.datosPaginados.length > 0) {
              this.listaObservaciones = data.data.datosPaginados;
              this.dataSource = new MatTableDataSource(this.listaObservaciones);
              this.dataSource.paginator = this.paginator;
            }
          }
        },
        error: () => {
          Modales.modalInformacion(
            Mensajes.MENSAJE_ERROR_G,
            this.dialog,
            ImagenesModal.EXCLAMACION
          );
        },
      });
  }

  guardarObservacion(){
    let request = {
      observacion: this.myForm.controls['observacion'].value,
      id_solicitud_servicio: this.objSol.id_solicitud_servicio
    }
    if (this.myForm.valid) {
      this._sharedService.guardarObservacionesApelaciones(request).subscribe({
        next:(data:any) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            if (data.data) {
              Modales.modalInformacion(
                Mensajes.MENSAJE_EXITO,
                this.dialog,
                ImagenesModal.OK
              );
            }
            this.myForm.reset();
            this.consultarObservaciones();
          }
        },
        error: () => {
          Modales.modalInformacion(
            Mensajes.MENSAJE_ERROR_G,
            this.dialog,
            ImagenesModal.EXCLAMACION
          );
        },
      });
    }else{
      Modales.modalInformacion(
        Mensajes.MENSAJE_CAMPO_OBSERVACIONES,
        this.dialog,
        ImagenesModal.EXCLAMACION
      );
    }
  }
}
