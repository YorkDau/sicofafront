import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { InvolucradosPARD, Mensajes, Regex } from 'src/app/constants';
import { DominioInterface } from 'src/app/interfaces/dominio.interface';
import { SharedService } from 'src/app/services/shared.service';
import { AppState } from 'src/app/store/app.reducer';
import { TrabajadorSocialService } from '../services/trabajador-social.service';
import { ValidarCampos } from '../validar-campos';
import {
  DepartamentoInterface,
  MunicipioInterface,
  PaisInterface,
} from '../../interfaces/ciudadano.interface';
import { SharedFunctions } from 'src/app/shared/functions';

@Component({
  selector: 'app-presunto-involucrado',
  templateUrl: './presunto-involucrado.component.html',
  styles: [],
})
export class PresuntoInvolucradoComponent implements OnInit, OnDestroy {
  @Output() esValidoVictima = new EventEmitter<{
    esVictima: boolean;
    esRepresentante: boolean;
  }>();
  @Input() listaEdad: DominioInterface[] = [
    {
      id_Dominio: 0,
      nombre_Dominio: 'Años',
      tipo_Dominio: '',
      codigo: '',
      tipo_Lista: '',
    },
    {
      id_Dominio: 1,
      nombre_Dominio: 'Meses',
      tipo_Dominio: '',
      codigo: '',
      tipo_Lista: '',
    },
  ];

  public involucradoForm!: FormGroup;
  public mostrarValidaciones = false;
  public listaTipoDocumento: DominioInterface[] = [];
  public selectPaises: PaisInterface[] = [];
  public selectDepartamento: DepartamentoInterface[] = [];
  public selectMunicipio: MunicipioInterface[] = [];
  public msgObligatorio: string = Mensajes.CAMPO_OBLIGATORIO;
  public msgCorreoInv: string = Mensajes.MENSAJE_CORREO_INV;
  public edadMaxima: number = InvolucradosPARD.EDAD_MAXIMA_ACCIONANTE;
  public mensajeEdad: string = InvolucradosPARD.MSJ_EDAD_ACCIONANTE;

  private involucradoSub!: Subscription;
  private tipoDocumentoSub!: Subscription;
  private objSol!: any;

  constructor(
    private fb: FormBuilder,
    private trabajadorSocialService: TrabajadorSocialService,
    private store: Store<AppState>,
    private sharedService: SharedService
  ) {
    this.objSol = JSON.parse(sessionStorage.getItem('info')!);
  }

  ngOnDestroy(): void {
    if (this.involucradoSub) this.involucradoSub.unsubscribe();
    if (this.tipoDocumentoSub) this.tipoDocumentoSub.unsubscribe();
    sessionStorage.removeItem('inv_pard');
    this.trabajadorSocialService.emitirAgresor(true);
  }

  ngOnInit(): void {
    this.involucradoSub = this.trabajadorSocialService.involucrado$.subscribe(
      (v) => (this.mostrarValidaciones = v)
    );

    if (sessionStorage.getItem('inv_pard')) {
      this.ajustarTiposDocumento(false);
    } else {
      this.ajustarTiposDocumento(true);
    }

    this.cargarForm();
    this.cargarFormEdicion();

    // Observa cambios en los campos
    this.involucradoForm
      .get('esVictima')
      ?.valueChanges.subscribe((esVictima) => {
        const esRepresentante =
          this.involucradoForm.get('esRepresentante')?.value;
        this.emitirCambios(esVictima, esRepresentante);

        this.trabajadorSocialService.emitirAgresor(esVictima);


        console.log('esVictima', esVictima);
        console.log('esRepresentante', esRepresentante);

        if (esVictima && esRepresentante) {
          this.edadMaxima = InvolucradosPARD.EDAD_MAXIMA_REPRESENTANTE;
          this.mensajeEdad = InvolucradosPARD.MSJ_EDAD_REPRESENTANTE;
        } else if (esVictima) {
          this.edadMaxima = InvolucradosPARD.EDAD_MAXIMA_ACCIONANTE;
          this.mensajeEdad = InvolucradosPARD.MSJ_EDAD_ACCIONANTE;
        } else {
          this.edadMaxima = InvolucradosPARD.EDAD_MAXIMA_ACCIONADO;
          this.mensajeEdad = InvolucradosPARD.MSJ_EDAD_ACCIONADO;
        }

        this.ajustarTiposDocumento(esVictima);

        this.involucradoForm.controls['tipoDocumento'].setValue(0);
        this.involucradoForm.controls['edad'].setValidators([
          Validators.required,
          Validators.min(0),
          Validators.max(this.edadMaxima),
        ]);
        this.involucradoForm.controls['edad'].updateValueAndValidity();
      });

this.involucradoForm
  .get('esRepresentante')
  ?.valueChanges.subscribe((valor) => {
    const esVictima = this.involucradoForm.get('esVictima')?.value;
    this.emitirCambios(esVictima, valor);

    if (valor) {
      this.involucradoForm.controls['edad'].setValidators([
        Validators.required,
        Validators.min(18), 
        Validators.max(this.edadMaxima),
      ]);
    } else {
      this.involucradoForm.controls['edad'].setValidators([
        Validators.required,
        Validators.min(0),
        Validators.max(this.edadMaxima),
      ]);
    }

    this.involucradoForm.controls['edad'].updateValueAndValidity();
  });
  }

private emitirCambios(esVictima: boolean, esRepresentante: boolean) {
  console.log('Emitiendo cambios - esVictima:', esVictima, 'esRepresentante:', esRepresentante);
  this.esValidoVictima.emit({
    esVictima,
    esRepresentante,
  });
}

  private ajustarTiposDocumento(estado: boolean): void {
    this.tipoDocumentoSub = this.store
      .select('tipo_documento')
      .subscribe(({ tipo_documento }) => {
        this.listaTipoDocumento = tipo_documento;
      });
  }

  private cargarForm(): void {
    this.involucradoForm = this.fb.group({
      idSolicitudServicio: this.objSol.idSolicitud,
      idInvolucrado: 0,
      numeroDocumento: ['', Validators.required],
      tipoDocumento: [0, Validators.min(1)],
      primerNombre: ['', Validators.required],
      segundoNombre: '',
      primerApellido: ['', Validators.required],
      segundoApellido: '',
      esVictima: true,
      esPrincipal: true,
      paisExp: 0,
      departamentoExp: 0,
      municipioExp: 0,
      telefono: '',
      correoElectronico: ['', Validators.pattern(Regex.EMAIL)],
      datosAdicionales: '',
      registroExpedidoEn: 'Notaria',
      esRepresentante: false,
      edadEn: [0],
      nombreEntidadExpedicion: '',
      edad: [
        0,
        [
          Validators.required,
          Validators.min(0),
          Validators.max(this.edadMaxima),
        ],
      ],
    });
  }

  private cargarFormEdicion(): void {
    const obj = JSON.parse(sessionStorage.getItem('inv_pard')!);
    console.log('obj', obj);
    if (obj) {
      this.trabajadorSocialService.emitirAgresor(
        ValidarCampos.validarBooleanos(obj.esVictima)
      );

      this.involucradoForm.patchValue({
        ...obj,
        edadEn: ValidarCampos.validarNumber(obj.edadEn), // <-- agregarlo aquí
        tipoDocumento: ValidarCampos.validarNumber(obj.idTipoDocumento),
        segundoNombre: ValidarCampos.validarString(obj.segundoNombre),
        segundoApellido: ValidarCampos.validarString(obj.segundoApellido),
        telefono: ValidarCampos.validarString(obj.telefono),
        correoElectronico: ValidarCampos.validarString(obj.correoElectronico),
        datosAdicionales: ValidarCampos.validarString(obj.datosAdicionales),
        registroExpedidoEn: ValidarCampos.validarString(obj.registroExpedidoEn),
        nombreEntidadExpedicion: ValidarCampos.validarString(
          obj.nombreEntidadExpedicion
        ),
      });

      this.ajustarEdicionValidacionesEdad(obj.esVictima);
      this.cargaSelectPaises(obj.idTipoDocumento);
      this.cargaSelectDepartamento({ target: { value: obj.paisExp } });
      this.cargaSelectMunicipio({ target: { value: obj.departamentoExp } });
    }
  }

private ajustarEdicionValidacionesEdad(esVictima: boolean): void {
  const esRepresentante = this.involucradoForm.get('esRepresentante')?.value;

  if (esVictima && esRepresentante) {
    this.edadMaxima = InvolucradosPARD.EDAD_MAXIMA_REPRESENTANTE;
    this.mensajeEdad = InvolucradosPARD.MSJ_EDAD_REPRESENTANTE;
    this.involucradoForm.controls['edad'].setValidators([
      Validators.required,
      Validators.min(18), // 👈 obligatorio ser mayor de edad
      Validators.max(this.edadMaxima),
    ]);
  } else if (esVictima) {
    this.edadMaxima = InvolucradosPARD.EDAD_MAXIMA_ACCIONANTE;
    this.mensajeEdad = InvolucradosPARD.MSJ_EDAD_ACCIONANTE;
    this.involucradoForm.controls['edad'].setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(this.edadMaxima),
    ]);
  } else {
    this.edadMaxima = InvolucradosPARD.EDAD_MAXIMA_ACCIONADO;
    this.mensajeEdad = InvolucradosPARD.MSJ_EDAD_ACCIONADO;
    this.involucradoForm.controls['edad'].setValidators([
      Validators.required,
      Validators.min(0),
      Validators.max(this.edadMaxima),
    ]);
  }

  this.involucradoForm.controls['edad'].updateValueAndValidity();
}

  public isRequired(campo: string): boolean {
    return this.involucradoForm.controls[campo]?.hasError('required') ?? false;
  }

  public isMin(campo: string): boolean {
    return this.involucradoForm.controls[campo]?.hasError('min') ?? false;
  }

  public isMax(campo: string): boolean {
    return this.involucradoForm.controls[campo]?.hasError('max') ?? false;
  }

  public patternValid(campo: string): boolean {
    return this.involucradoForm.controls[campo]?.hasError('pattern') ?? false;
  }

  public isColombiano(event: any) {
    if (event.target.value != 0) {
      this.cargaSelectPaises(event.target.value);
    }
  }

  private cargaSelectPaises(idTipDoc: number) {
    this.sharedService.getPaisPorId(idTipDoc).subscribe((paises) => {
      if (paises.statusCode === 200) {
        this.selectPaises = paises.data;
      }
    });
  }

  public cargaSelectDepartamento(event: any) {
    this.sharedService
      .getDepartamentos(event.target.value)
      .subscribe((departamentos) => {
        if (departamentos.statusCode === 200) {
          this.selectDepartamento = departamentos.data;
        }
      });
  }

  public cargaSelectMunicipio(event: any) {
    if (event.target.value != 0) {
      this.sharedService
        .getCiudades(event.target.value)
        .subscribe((municipio) => {
          if (municipio.statusCode === 200) {
            this.selectMunicipio = municipio.data;
          }
        });
    }
  }
}
