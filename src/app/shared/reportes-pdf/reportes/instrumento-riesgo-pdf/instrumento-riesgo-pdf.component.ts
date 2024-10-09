import {
  AfterViewInit,
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { lastValueFrom, Subject } from 'rxjs';
import { DominioInterface } from '../../../../interfaces/dominio.interface';
import { ValoracionRiesgo } from '../../../../pages/private/interfaces/psicologia.interface';
import { DescripcionHechosDTO } from '../../../../pages/private/psicologia/interfaces/descripcion-hechos.interface';
import {
  FormTipoViolenciaInterface,
  InvolucradoDTO,
} from '../../../../pages/private/psicologia/interfaces/involucrado.interface';
import { ReportesService } from '../../../../services/reportes.services';
import { SharedService } from '../../../../services/shared.service';
import { SharedFunctions } from '../../../functions';
import { DatosInstitucionesDTO } from '../interfaces/datos-institucionales.interface';
import { ReporteInstrumentoRiesgoInterface } from '../interfaces/instrumento-riesgo.interface';

@Component({
  selector: 'app-instrumento-riesgo-pdf',
  templateUrl: './instrumento-riesgo-pdf.component.html',
  styleUrls: ['./instrumento-riesgo-pdf.component.scss'],
})
export class InstrumentoRiesgoPdfComponent implements AfterViewInit, OnChanges {
  @Input() idSolicitud!: number;
  @Input() temp: number = 0;
  @Output() filasHijos = new EventEmitter<number>();

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

  public reporte!: null | ReporteInstrumentoRiesgoInterface;
  public agresor!: null | InvolucradoDTO;
  public victima!: null | InvolucradoDTO;
  public tiposViolencia: FormTipoViolenciaInterface[] = [];
  public datosInstitucionales!: null | DatosInstitucionesDTO;
  public descripcionHechos!: null | DescripcionHechosDTO;
  public valoracion!: null | ValoracionRiesgo;
  public date = new Date();

  public valoresCargados: boolean = false;
  private numeroHijosVictima: number = 0;
  private numeroHijosAgresor: number = 0;

  constructor(
    private sharedService: SharedService,
    private reportesService: ReportesService,
    private spinnerService: NgxSpinnerService
  ) {
    this.agresor = { hijos: [{}, {}, {}, {}, {}] };
    this.victima = { hijos: [{}, {}, {}, {}, {}] };
    this.tiposViolencia = [];
    this.datosInstitucionales = {};
    this.descripcionHechos = {};
    this.valoracion = { indicadorRiesgo: '', puntuacion: 0 };
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.reporte = null;
    this.agresor = null;
    this.victima = null;
    this.tiposViolencia = [];
    this.datosInstitucionales = null;
    this.descripcionHechos = null;
    this.valoracion = null;
    if (
      (changes['temp'] && this.temp > 0) ||
      (changes['idSolicitud'] && this.idSolicitud > 0)
    ) {
      this.getInitialData();
    }
  }

  /**
   * consulta todos los dominios necesarios en este reporte
   */
  getInitialData() {
    Promise.all([
      this.getListaOtros(),
      this.getListaTipoDocumento(),
      this.getListaSexo(),
      this.getListaIdentidadGenero(),
      this.getListaDiscapacidad(),
      this.getListaNivelAcademico(),
      this.getListaCultura(),
      this.getListaTipoRelacion(),
      this.getListaEstadoCivil(),
      this.getInformacionReporte(),
    ])
      .then((values) => {
        this.valoresCargados = true;
        this.spinnerService.show();
        setTimeout(() => {
          SharedFunctions.generarPdfInstrumentoRiesgo();
          this.spinnerService.hide();
        }, 1000);
      })
      .catch((error) => {});
  }

  ngAfterViewInit(): void {}

  private async getInformacionReporte() {
    const result = await lastValueFrom(
      this.reportesService.getInstrumentoRiesgo(this.idSolicitud)
    );
    if (result && result.statusCode == 200) {
      this.reporte = result.data;
      this.agresor = this.reporte ? this.reporte.agresor : null;
      this.victima = this.reporte ? this.reporte.victima : null;
      console.log(this.victima);

      this.tiposViolencia = this.reporte ? this.reporte.tiposViolencia : [];
      this.datosInstitucionales = this.reporte
        ? this.reporte.institucional
        : null;
      this.descripcionHechos = this.reporte
        ? this.reporte.descripcionHechos
        : null;
      this.valoracion = this.reporte ? this.reporte.valoracion : null;

      if (this.victima) {
        this.numeroHijosVictima = this.victima.hijos!.length;
        if (this.numeroHijosVictima > 0) {
          this.numeroHijosVictima = ++this.numeroHijosVictima;
        }
      }

      if (this.agresor) {
        this.numeroHijosAgresor = this.agresor.hijos!.length;
        if (this.numeroHijosAgresor > 0) {
          this.numeroHijosAgresor = ++this.numeroHijosAgresor;
        }
      }
      if (this.numeroHijosAgresor || this.numeroHijosVictima) {
        this.filasHijos.emit(this.numeroHijosAgresor + this.numeroHijosVictima);
      }
    }
    return Promise.resolve(true);
  }

  /**
   * @description obtiene la lista de opcion Otro
   */
  private async getListaOtros() {
    const result = await this.sharedService.getDominioFromLocal('Tipo_Otro');
    this.listaOtros = result;
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
    await this.getListaOtros();
    const newOtros: DominioInterface = JSON.parse(
      JSON.stringify(this.listaOtros[0])
    );
    newOtros.tipo_Dominio = 'Tipo_Cultura';
    newOtros.nombre_Dominio = 'Ninguna';
    this.listaCultura.push(newOtros);
    console.log(this.listaCultura);

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
  /**
   * @description obtiene la lista de relacion con el agresor
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
   * concatena el nombre completo del involucrado
   * @returns
   */
  public getNombreCompleto(
    involucrado: InvolucradoDTO,
    includeNombres: boolean = false,
    includeApellidos: boolean = false
  ) {
    if (involucrado) {
      const nombres = [
        includeNombres && involucrado.primerNombre
          ? involucrado.primerNombre
          : '',
        includeNombres && involucrado.segundoNombre
          ? involucrado.segundoNombre
          : '',
        includeApellidos && involucrado.primerApellido
          ? involucrado.primerApellido
          : '',
        includeApellidos && involucrado.segundoApellido
          ? involucrado.segundoApellido
          : '',
      ];
      return nombres.join(' ').trim();
    } else {
      return '';
    }
  }

  public listarPreguntas(
    tipoViolencia:
      | 'Percepción de la víctima frente al riesgo de la violencia'
      | 'Sexual'
      | 'Psicológica'
      | 'Física'
      | 'Circunstancias agravantes'
      | 'Coerción o Amenazas'
      | 'Económica'
      | 'Patrimonial'
  ) {
    return this.tiposViolencia.filter((value) => {
      return value.tipoViolencia == tipoViolencia;
    });
  }
}
