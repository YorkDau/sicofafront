import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CodigosRespuesta, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { SharedService } from 'src/app/services/shared.service';
import { Modales } from 'src/app/shared/modals';
import { setComisariaList, unsetComisariaList, unsetHorario } from 'src/app/store/public/actions/public.actions';
import { CiudadInterface } from '../interfaces/ciudad.interface';
import { ComisariaInterface } from '../interfaces/comisaria.interface';
import { DepartamentoInterface } from '../interfaces/departamento.interface';
import { ComisariaService } from '../services/comisaria.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  public searchForm!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public listaComisarias: ComisariaInterface[] = [];
  public listaDepartamentos: DepartamentoInterface[] = [];
  public listaCiudad: CiudadInterface[] = [];

  constructor(private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private comisariaService: ComisariaService,
    private store: Store<{ comisaria: ComisariaInterface[] }>,
    private sharedService: SharedService) { }

  ngOnInit(): void {
    this.cargarForm();
    this.consultarDepartamentos();
    this.sharedService.emitirModulo(false);
  }

  /**
   * @description carga form
   */
  cargarForm() {
    this.searchForm = this.fb.group({
      departamento: ['', Validators.required],
      ciudad: ['', Validators.required]
    });
  }


  /**
   * @description llama servicio consultarDepartamentos
   */
  private consultarDepartamentos() {
    this.comisariaService.getDepartamentos().subscribe(
      (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.listaDepartamentos = data.data.datosPaginados;
        }
      }
    )
  }


  /**
   * @description llama servicio getCiudades
   * @param e event
   */
  public getCiudades(e: any) {
    const depID = e.target.value;

    this.comisariaService.getCiudades(depID).subscribe(
      (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.listaCiudad = data.data.datosPaginados;
          this.searchForm.controls['ciudad'].setValue('');
        }
      }
    )
  }

  get departamento() {

    if (this.searchForm.get('departamento')?.hasError('required')) {
      return Mensajes.CAMPO_OBLIGATORIO;
    } else {
      return '';
    }

  }

  get ciudad() {

    if (this.searchForm.get('ciudad')?.hasError('required')) {
      return Mensajes.CAMPO_OBLIGATORIO;
    } else {
      return '';
    }

  }

  /**
   * @description valida que el formulario sea correcto para llamar funciones
   */
  public buscarComisaria() {

    if (this.searchForm.valid) {
      this.store.dispatch(unsetComisariaList());
      this.getComisaria();
      this.router.navigate(['/public/comisaria']);
    } else {
      this.mostrarValidaciones = true;
    }

  }

  /**
   * @description llama servicio getComisarias
   */
  private getComisaria() {

    const { ciudad } = this.searchForm.value;

    this.comisariaService.getComisarias(+ciudad).subscribe(
      (data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {

          const { totalRegistros } = data.data;

          if (data.data.datosPaginados.item2.length > 0 && totalRegistros > 0) {
            this.listaComisarias = data.data.datosPaginados.item2;
            this.listaComisarias.forEach(c => c.seleccionado = false);
            this.store.dispatch(setComisariaList({ comisaria: this.listaComisarias, item: data.data.datosPaginados.item1 }));
            this.store.dispatch(unsetHorario());
            this.mostrarMensajeLlamada(data.data.datosPaginados.item1);
          }

        }
      }
    );
  }



  /**
   * @description muestra modal de info según ciudad
   * @param item msj llamada de vida
   */
  mostrarMensajeLlamada(item: string) {

    if (item) {
      this.modalInformacion(item, this.dialog, 'assets/images/telefono.svg');
    } else {
      this.modalInformacion(Mensajes.MENSAJE_CITA, this.dialog, 'assets/images/exclamacion.svg');
    }
  }

  /**
   * @description abre modal de info según categoría
   */
  private modalInformacion(mensaje: string, dialog: MatDialog, image: string) {
    Modales.modalInformacion(mensaje, dialog, image);
  }

}