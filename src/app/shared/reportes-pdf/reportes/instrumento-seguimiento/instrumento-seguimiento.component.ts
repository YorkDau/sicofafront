import { Component, OnInit } from '@angular/core';
import { DominioInterface } from '../../../../interfaces/dominio.interface';
import { HijoInvolucrado } from '../../../../pages/private/psicologia/interfaces/involucrado.interface';
import { SharedService } from '../../../../services/shared.service';

@Component({
  selector: 'app-instrumento-seguimiento',
  templateUrl: './instrumento-seguimiento.component.html',
})
export class InstrumentoSeguimientoComponent implements OnInit {
  public listaTipoDocumento: DominioInterface[] = [];
  public listaTipoRelacion: DominioInterface[] = [];
  public listaSexo: DominioInterface[] = [];
  public listaDiscapacidad: DominioInterface[] = [];
  public hijos: HijoInvolucrado[] = [{}, {}, {}, {}, {}];
  constructor(private sharedService: SharedService) {}

  ngOnInit(): void {
    this.getInitialData();
  }

  /**
   * consulta todos los dominios necesarios en este reporte
   */
  getInitialData() {
    return Promise.all([
      this.getListaTipoDocumento(),
      this.getListaSexo(),
      this.getListaDiscapacidad(),
      this.getListaTipoRelacion(),
    ]);
  }

  /**
   * @description carga el select de Tipo Documento
   */
  private async getListaTipoDocumento() {
    const result = await this.sharedService.getDominioFromLocal(
      'Tipo_identificacion'
    );
    this.listaTipoDocumento = result;
    return Promise.resolve(result ? true : false);
  }

  /**
   * @description obtiene la lista de sexo
   */
  private async getListaSexo() {
    const result = await this.sharedService.getDominioFromLocal('Sexo');
    this.listaSexo = result;
    return Promise.resolve(result ? true : false);
  }

  /**
   * @description obtiene la lista de discapacidad
   */
  private async getListaDiscapacidad() {
    const result = await this.sharedService.getDominioFromLocal('Discapacidad');
    this.listaDiscapacidad = result;
    return Promise.resolve(result ? true : false);
  }

  /**
   * @description obtiene la lista de relacion con el agresor
   */
  private async getListaTipoRelacion() {
    const result = await this.sharedService.getDominioFromLocal(
      'Tipo_Relacion'
    );
    this.listaTipoRelacion = result;
    return Promise.resolve(result ? true : false);
  }

  public buscarDominio(
    tipoDominio:
      | 'Tipo_identificacion'
      | 'Sexo'
      | 'Genero'
      | 'Nivel_Academico'
      | 'Discapacidad'
      | 'Tipo_Cultura'
      | 'Tipo_Relacion'
      | 'Estado_Civil',
    idDominio: number,
    codigo: boolean = false
  ) {
    let dominio = '';
    let listaDominios: DominioInterface[] = [];
    switch (tipoDominio) {
      case 'Discapacidad':
        listaDominios = this.listaDiscapacidad;
        break;
      case 'Sexo':
        listaDominios = this.listaSexo;
        break;
      case 'Tipo_Relacion':
        listaDominios = this.listaTipoRelacion;
        break;
      case 'Tipo_identificacion':
        listaDominios = this.listaTipoDocumento;
        break;
    }
    listaDominios.forEach((element) => {
      if (element.id_Dominio == idDominio) {
        dominio = codigo ? element.codigo : element.nombre_Dominio;
      }
    });
    return dominio;
  }

  public listarDominios(
    tipoDominio:
      | 'Tipo_identificacion'
      | 'Sexo'
      | 'Genero'
      | 'Nivel_Academico'
      | 'Discapacidad'
      | 'Tipo_Cultura'
      | 'Tipo_Relacion'
      | 'Estado_Civil',

    codigo: boolean = false
  ) {
    let domains: string[] = [];
    let listaDominios: DominioInterface[] = [];
    switch (tipoDominio) {
      case 'Discapacidad':
        listaDominios = this.listaDiscapacidad;
        break;
      case 'Sexo':
        listaDominios = this.listaSexo;
        break;
      case 'Tipo_Relacion':
        listaDominios = this.listaTipoRelacion;
        break;
      case 'Tipo_identificacion':
        listaDominios = this.listaTipoDocumento;
        break;
    }
    listaDominios.forEach((element) => {
      if (element.tipo_Dominio == tipoDominio) {
        domains.push(codigo ? element.codigo : element.nombre_Dominio);
      }
    });
    return domains;
  }
}
