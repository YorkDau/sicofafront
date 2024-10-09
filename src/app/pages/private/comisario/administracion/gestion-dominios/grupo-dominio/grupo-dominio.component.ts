import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Params } from '@angular/router';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import {
  AuroraActionColumn,
  AuroraTableColumn,
} from '../../../../../../shared/table/table.component';
import { DominioInterface } from '../../../../interfaces/ciudadano.interface';
import {
  detalleDominioInterface,
  DominiosInterface,
} from '../../interfaces/dominios.interface';
import { GestionDominioService } from '../../services/gestion-dominio.service';
import { ModalDominioComponent } from '../modal-dominio/modal-dominio.component';

@Component({
  selector: 'app-grupo-dominio',
  templateUrl: './grupo-dominio.component.html',
  styleUrls: ['./grupo-dominio.component.scss'],
})
export class GrupoDominioComponent implements OnInit {
  public myForm = new FormGroup({
    nombreDominio: new FormControl(''),
  });
  public tipoDominio: string = '';
  public EnviarActionsGestionGrupos: boolean = true;
  public dominios: DominiosInterface[] = [];
  public columns: AuroraTableColumn[] = [
    { name: 'id', title: 'id del dominio' },
    { name: 'codigo', title: 'Código del dominio' },
    {
      name: 'nombre',
      title: 'nombre del dominio',
      render: (value) => {
        return value.replace('_', ' ');
      },
    },
    { name: 'actions', title: 'acciones' },
  ];

  public actions: AuroraActionColumn[] = [
    {
      icon: 'edit',
      tooltip: 'Modificar dominio',
      tooltipPosition: 'right',
      accion: (row: DominiosInterface) => {
        this.abrirModalModificarDominio(row.id);
      },
    },
  ];
  constructor(
    private _activedRouter: ActivatedRoute,
    private gestionDominioService: GestionDominioService,
    private _dialog: MatDialog,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getTipoDominio();
    this.getGrupoDominio();
  }

  /**
   * @description Obtiene el tipo de Doominio por medio de la ruta
   */

  private getTipoDominio() {
    this._activedRouter.params.subscribe((params: Params) => {
      this.tipoDominio = params.tipoDominio;
    });
  }
  /**
   * @description cargar Form de la busqueda
   */
  private cargarForm() {
    this.myForm = this.fb.group({});
  }

  /**
   * @descripcion obtiene la lista de Dominios segun el tipo de dominio
   */
  private getGrupoDominio() {
    this.gestionDominioService
      .getListaDominiosPorGrupo(this.tipoDominio)
      .subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            this.dominios = data.data;
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
   * @description abre el modal para la creacion de un nuevo dominio
   */
  public abrirModalCrearDominio() {
    const dialogRef = this._dialog.open(ModalDominioComponent, {
      panelClass: 'roundedModal',
      disableClose: true,
      minWidth: '600px',
      minHeight: '300px',
      data: {
        tipoDominio: this.tipoDominio,
        flag: true,
      },
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp === true) {
        this.getGrupoDominio();
      }
    });
  }
  /**
   * @description abre el modal para la modificacion de un dominio
   * @param e
   */
  public abrirModalModificarDominio(e: number) {
    const dialogRef = this._dialog.open(ModalDominioComponent, {
      panelClass: 'roundedModal',
      disableClose: true,
      width: '600px',
      height: '400px',
      data: {
        tipoDominio: this.tipoDominio,
        flag: false,
        idDominio: e,
      },
    });
    dialogRef.afterClosed().subscribe((resp) => {
      if (resp === true) {
        this.getGrupoDominio();
      }
    });
  }

  private msgError() {
    Modales.modalExito(
      Mensajes.MENSAJE_ERROR_G,
      ImagenesModal.EXCLAMACION,
      this._dialog
    );
  }

  replaceSpaces(input: HTMLInputElement) {
    input.value = input.value.replace(/ /gi, '_');
  }
}
