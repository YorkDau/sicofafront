import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom, Subject } from 'rxjs';
import { DominiosEvaluacionOrientacion } from '../../../../constants';
import { DominioInterface } from '../../../../interfaces/dominio.interface';
import { SugerenciaApoyo } from '../../../../pages/private/interfaces/psicologia.interface';
import { ReportesService } from '../../../../services/reportes.services';
import { SharedService } from '../../../../services/shared.service';
import { SharedFunctions } from '../../../functions';
import {
  DatosIdentificacionEntrevista,
  EntrevistaPsicologicaEmocionalPdfInterface,
  EntrevistaPsicologicaFuncionario,
  RespuestaEntrevistaAB,
} from '../interfaces/entrevista-psicologica-emocional-pdf.interface';

@Component({
  selector: 'app-entrevista-psicologica-emocional-pdf',
  templateUrl: './entrevista-psicologica-emocional-pdf.component.html',
  styleUrls: ['./entrevista-psicologica-emocional-pdf.component.scss'],
})
export class EntrevistaPsicologicaEmocionalPdfComponent
  implements AfterViewInit, OnChanges
{
  @Input() idSolicitud!: number;
  @Input() temp: number = 0;

  public listaTipoDocumento: DominioInterface[] = [];
  public listaLugarExpedicion: DominioInterface[] = [];
  public listaSexo: DominioInterface[] = [];
  public listaGenero: DominioInterface[] = [];
  public listaNivelAcademico: DominioInterface[] = [];
  public listaDiscapacidad: DominioInterface[] = [];
  public listaCultura: DominioInterface[] = [];
  public listaTipoRelacion: DominioInterface[] = [];
  public listaEstadoCivil: DominioInterface[] = [];
  public listaOtros: DominioInterface[] = [];

  public reporte!: EntrevistaPsicologicaEmocionalPdfInterface;
  public datosIdentificacion!: DatosIdentificacionEntrevista;
  public funcionario!: EntrevistaPsicologicaFuncionario | null;
  public antecendentesYSituacionActual!: RespuestaEntrevistaAB;
  public conclusionYRecomendacion!: RespuestaEntrevistaAB;
  public descripcionRedApoyo!: RespuestaEntrevistaAB;
  public motivo!: RespuestaEntrevistaAB;
  public procedimientoMetodologia!: RespuestaEntrevistaAB;
  public descripcionPercepcionDeLaVictima!: RespuestaEntrevistaAB;
  public relatoDeLosHechos!: RespuestaEntrevistaAB;
  public checksPercepcionDeLaVictima: SugerenciaApoyo[] = [];
  public checksRedesApoyo: SugerenciaApoyo[] = [];
  public checksTiposRedesApoyo: SugerenciaApoyo[] = [];

  public date = new Date();

  public valoresCargados = false;
  constructor(
    private sharedService: SharedService,
    private reportesService: ReportesService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    this.datosIdentificacion = {};
    this.antecendentesYSituacionActual = {};
    this.conclusionYRecomendacion = {};
    this.descripcionRedApoyo = {};
    this.motivo = {};
    this.procedimientoMetodologia = {};
    this.descripcionPercepcionDeLaVictima = {};
    this.relatoDeLosHechos = {};
    this.checksPercepcionDeLaVictima = [];
    this.checksRedesApoyo = [];
    this.checksTiposRedesApoyo = [];
    if (
      (changes['temp'] && this.temp > 0) ||
      (changes['idSolicitud'] && this.idSolicitud)
    ) {
      this.getInitialData();
    }
  }
  /**
   * consulta todos los dominios necesarios en este reporte
   */
  getInitialData() {
    Promise.all([
      this.getListaTipoDocumento(),
      this.getListaSexo(),
      this.getListaIdentidadGenero(),
      this.getListaDiscapacidad(),
      this.getListaNivelAcademico(),
      this.getListaCultura(),
      this.getListaTipoRelacion(),
      this.getListaEstadoCivil(),
      this.getInformacionReporte(),
    ]).then((values) => {
      this.valoresCargados = true;
      this.spinner.show();
      setTimeout(() => {
        SharedFunctions.generarPdfEntrevista();
        this.spinner.hide();
      }, 1000);
    });
  }

  ngAfterViewInit(): void {}

  private async getInformacionReporte() {
    if (this.idSolicitud > 0) {
      const result = await lastValueFrom(
        this.reportesService.getEntrevistaPsicologicaEmocional(this.idSolicitud)
      );
      if (result && result.statusCode == 200) {
        this.reporte = result.data;
        this.funcionario = this.reporte.funcionario || null;

        this.antecendentesYSituacionActual =
          this.reporte.antecendentesYSituacionActual;
        this.conclusionYRecomendacion = this.reporte.conclusionYRecomendacion;
        this.datosIdentificacion = {
          ...this.reporte.datosIdentificacion1,
          ...this.reporte.datosIdentificacion2,
        };
        this.motivo = this.reporte.motivo;
        this.descripcionPercepcionDeLaVictima =
          this.reporte.percepcionDeLaVíctima1;
        this.checksPercepcionDeLaVictima = this.reporte.percepcionDeLaVíctima2;
        this.procedimientoMetodologia = this.reporte.procedimientoMetodologia;
        this.descripcionRedApoyo = this.reporte.redesApoyo1;
        this.checksRedesApoyo = this.reporte.redesApoyo2;
        this.checksTiposRedesApoyo = this.reporte.redesApoyo3;
        this.relatoDeLosHechos = this.reporte.relatoDeLosHechos;
      }
    } else {
      this.checksRedesApoyo = await this.cargarChecks(
        DominiosEvaluacionOrientacion.Red_apoyo
      );
      this.checksTiposRedesApoyo = await this.cargarChecks(
        DominiosEvaluacionOrientacion.Tipo_red_apoyo
      );
      this.checksPercepcionDeLaVictima = await this.cargarChecks(
        DominiosEvaluacionOrientacion.Persistencia
      );
    }
    return Promise.resolve(true);
  }
  private async cargarChecks(tipoDominio: string) {
    const result: DominioInterface[] =
      await this.sharedService.getDominioFromLocal(tipoDominio);
    return result.map((value) => {
      return {
        nombreDominio: value.nombre_Dominio,
        idDominio: value.id_Dominio,
        respuesta: false,
      } as SugerenciaApoyo;
    });
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
   * @description obtiene la lista de Identidad Genero
   */
  private async getListaIdentidadGenero() {
    const result = await this.sharedService.getDominioFromLocal('Genero');
    this.listaGenero = result;
    return Promise.resolve(result ? true : false);
  }

  /**
   * @description obtiene la lista de Nivel Academico
   */
  private async getListaNivelAcademico() {
    const result = await this.sharedService.getDominioFromLocal(
      'Nivel_Academico'
    );
    this.listaNivelAcademico = result;
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
   * @description obtiene la lista de cultura
   */
  private async getListaCultura() {
    const result = await this.sharedService.getDominioFromLocal('Tipo_Cultura');
    this.listaCultura = result;
    return Promise.resolve(result ? true : false);
  }

  /**
   * @description obtiene la lista de tipo relacion
   */
  private async getListaTipoRelacion() {
    const result = await this.sharedService.getDominioFromLocal(
      'Tipo_Relacion'
    );
    this.listaTipoRelacion = result;
    return Promise.resolve(result ? true : false);
  }
  /**
   * @description obtiene la lista de estado civil
   */
  private async getListaEstadoCivil() {
    const result = await this.sharedService.getDominioFromLocal('Estado_Civil');
    this.listaEstadoCivil = this.listaEstadoCivil.concat(result);
    return Promise.resolve(true);
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
      case 'Estado_Civil':
        listaDominios = this.listaEstadoCivil;
        break;
      case 'Genero':
        listaDominios = this.listaGenero;
        break;
      case 'Nivel_Academico':
        listaDominios = this.listaNivelAcademico;
        break;
      case 'Sexo':
        listaDominios = this.listaSexo;
        break;
      case 'Tipo_Cultura':
        listaDominios = this.listaCultura;
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
      case 'Estado_Civil':
        listaDominios = this.listaEstadoCivil;
        break;
      case 'Genero':
        listaDominios = this.listaGenero;
        break;
      case 'Nivel_Academico':
        listaDominios = this.listaNivelAcademico;
        break;
      case 'Sexo':
        listaDominios = this.listaSexo;
        break;
      case 'Tipo_Cultura':
        listaDominios = this.listaCultura;
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

  /**
   * concatena el nombre completo de la victima
   * @returns
   */
  public getNombreCompletoVictima() {
    return this.datosIdentificacion &&
      this.datosIdentificacion.nombres &&
      this.datosIdentificacion.apellidos
      ? this.datosIdentificacion.nombres +
          ' ' +
          this.datosIdentificacion.apellidos
      : '';
  }
}
