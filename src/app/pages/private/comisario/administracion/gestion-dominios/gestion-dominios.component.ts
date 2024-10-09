import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { Modales } from 'src/app/shared/modals';
import {
  AuroraActionColumn,
  AuroraTableColumn,
} from '../../../../../shared/table/table.component';
import { TipoDeDominiosInterface } from '../interfaces/dominios.interface';
import { GestionDominioService } from '../services/gestion-dominio.service';

@Component({
  selector: 'app-gestion-dominios',
  templateUrl: './gestion-dominios.component.html',
  styleUrls: ['./gestion-dominios.component.scss'],
})
export class GestionDominiosComponent implements OnInit {
  public EnviarActionsGestionDominios: boolean = true;
  public myForm: FormGroup = new FormGroup({
    nombreTipoDominio: new FormControl(''),
  });
  public dominios: TipoDeDominiosInterface[] = [];
  public columns: AuroraTableColumn[] = [
    {
      name: 'nombreDominio',
      title: 'Tipo de dominio',
      render: (value) => {
        return value.replace('_', ' ');
      },
    },
    { name: 'actions', title: 'acciones' },
  ];

  public actions: AuroraActionColumn[] = [
    {
      imagen: 'assets/images/irProceso.svg',
      tooltip: 'Ver el grupo de este dominio',
      tooltipPosition: 'right',
      accion: (row: TipoDeDominiosInterface, router) => {
        router.navigate(['/comisario/grupo-dominio/', row.nombreDominio]);
      },
    },
  ];

  constructor(
    private dominiosService: GestionDominioService,
    private _dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getListaDominios();
  }

  get hasFilter() {
    return this.myForm.get('nombreTipoDominio')?.value;
  }
  /**
   * @descripition obtiene la lisrta de los tipos de dominios
   */
  private getListaDominios() {
    this.dominiosService.getListaDominios().subscribe({
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
