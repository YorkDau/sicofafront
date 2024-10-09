import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Store } from '@ngrx/store';
import { lastValueFrom } from 'rxjs';
import { CodigosRespuesta } from 'src/app/constants';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { SharedService } from 'src/app/services/shared.service';
import { AppState } from 'src/app/store/app.reducer';
import { InformacionGeneralInterface, InvolucradosInterface } from './interfaces/tareas.interface';

@Component({
  selector: 'app-consulta-general',
  templateUrl: './consulta-general.component.html',
  styleUrls: ['./consulta-general.component.scss']
})
export class ConsultaGeneralComponent implements OnInit {

  public objSol = JSON.parse(sessionStorage.getItem('info')!);
  public informacionGeneral!: InformacionGeneralInterface;
  public myForm!: FormGroup;
  public listaTipoDocumento: DominioInterface[] = [];
  public tabGeneral: boolean = true;
  public tabTareas: boolean = false;
  public tabAnexos: boolean = false;

  constructor(
    private sharedService: SharedService,
    private fb: FormBuilder,
    private store: Store<AppState>,
  ) { }

  ngOnInit(): void {
    this.cargarForm();
    this.crearControlsInvolucrados();
  }

   /**
   * @description cambia valores opcion1 y opcion2
   * @param tab 
   */
  public cambiarTab(tab: number) {
    if (tab === 0) {
      this.tabGeneral = true;
      this.tabTareas = false;
      this.tabAnexos = false;
    } else if (tab === 1) {
      this.tabGeneral = false;
      this.tabTareas = true;
      this.tabAnexos = false;
    } else {
      this.tabGeneral = false;
      this.tabTareas = false;
      this.tabAnexos = true;
    }
  }
  /**
   * @description carga el form para la informacion general
   */
  private cargarForm(){
    this.myForm = this.fb.group({
      fechaSolicitud: [{value: '', disabled: true}],
      estadoSolicitud: [{value: '', disabled: true}],
      subEstadoSolicitud: [{value: '', disabled: true}],
      relatosHechos: [{value: '', disabled: true}],
      involucrados: this.fb.array([]),
    });
  }


  /**
   * @description carga la informacion de general
   * @returns boolean
   */
  private async getInformacionGeneralAsync(){
    try {
      const data: ResponseInterface = await lastValueFrom(
        this.sharedService.ConsultaGeneral(this.objSol.idSolicitud)
      );
      if (data.statusCode === CodigosRespuesta.OK) {
        this.informacionGeneral = data.data;
        this.myForm.controls['fechaSolicitud'].setValue(this.informacionGeneral.fechaSolicitud);
        this.myForm.controls['estadoSolicitud'].setValue(this.informacionGeneral.estadoSolicitud);
        this.myForm.controls['subEstadoSolicitud'].setValue(this.informacionGeneral.subestadoSolicitud);
        this.myForm.controls['relatosHechos'].setValue(this.informacionGeneral.relatoHechos);
        this.store.select('tipo_documento').subscribe(({tipo_documento}) => {
          this.listaTipoDocumento = tipo_documento;
        });
      }
      return Promise.resolve(true);
    } catch (error) {
      
    }
    return Promise.resolve(false);
  }


  public get involucrados(){
    return this.myForm.get('involucrados') as FormArray;
  }

  /**
   * @description crea la informacion de los involucrados dependiendo de la informacion general
   */
  private async crearControlsInvolucrados() {
    let formInvolucrados = this.myForm.get('involucrados') as FormArray;
    const cargarInvolucrados = await this.getInformacionGeneralAsync();
    if(cargarInvolucrados){
      this.informacionGeneral.involucrados.forEach(involucrado => {
        formInvolucrados.push(
          this.fb.group({
            nombres: [{value: involucrado.nombres, disabled: true}],
            numeroDocumento: [{value: involucrado.numeroDocumento, disabled: true}],
            tipoDocumento: [{value: involucrado.tipoDocumento, disabled: true}],
            tipoInvolucrado: [{value: involucrado.tipoInvolucrado, disabled: true}]
          })
        );
      });
    }
}
}
