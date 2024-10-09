import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CiudadanoService } from '../ciudadano/services/ciudadano.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { CiudadanoInterface } from '../interfaces/ciudadano.interface';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { CodigosRespuesta, Mensajes } from 'src/app/constants';
import { Modales } from 'src/app/shared/modals';
import { UsuarioService } from './services/usuario.service';
import { SharedService } from 'src/app/services/shared.service';
import * as interfaces from './../interfaces/ciudadano.interface';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit {


  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  public columnas: string[] = ['nombres', 'apellidos', 'tipo_documento', 'numero_documento'
    , 'cargo', 'accion'
  ];

  public dataSource = new MatTableDataSource<CiudadanoInterface>([]);
  public listaCiudadano: CiudadanoInterface[] = [];
  public ciudadanoForm!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public formSubmitted: boolean = false;
  public ocultarPaginador: boolean = true;
  public mostrarOcultarBoton: boolean = true;
  currentUser!: UserInterface | undefined;
  public selectTipoDocumento: interfaces.DominioInterface[] = [];

  constructor(private ciudadanoService: CiudadanoService, private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService,
    private _usuarioService: UsuarioService,
    private sharedService: SharedService,
    ) {
      this.currentUser = this.authService.currentUserValue;
    }

  ngOnInit(): void {
    if(this.authService.currentUserValue?.perfil === "COM"){
      this.mostrarOcultarBoton = false;
    };
    this.ciudadanoForm = this.fb.group({
      nombre_ciudadano: '',
      apellido_ciudadano: '',
      numero_documento: '',
      obl: ['', Validators.required]
    });
    sessionStorage.removeItem('idC');
    sessionStorage.removeItem('ciudadano');
    this.cargaSelectTipoDocumento();
  }

  private cargaSelectTipoDocumento() {
    this.sharedService
      .getDominio('Tipo_identificacion')
      .subscribe((TipoDocumento) => {
        if (TipoDocumento.statusCode === CodigosRespuesta.OK) {
          this.selectTipoDocumento = TipoDocumento.data;
        }
      });
  }

  obtenerTipoDocmuento(id: number): string {
    let tipoDocmuento= this.selectTipoDocumento.filter(x=> x.id_Dominio== id);
    return (tipoDocmuento[0].nombre_Dominio);

  }

  registrarUsuario(){
    this.router.navigate(['/registro-usuario']);

  }
    /**
   * @description llama servicio getCiudadanos
   */
    consultarCiudadano() {

      this.validarCampoObligatorio();

      if (this.ciudadanoForm.valid) {
        this.formSubmitted = true;
        this._usuarioService.getUsuario(this.ciudadanoForm.value)
          .subscribe({
            next: (data: ResponseInterface) => {
              if (data.statusCode === CodigosRespuesta.OK) {
                if (data.data.totalRegistros > 0) {
                  this.listaCiudadano = data.data.datosPaginados;
                  this.dataSource = new MatTableDataSource(this.listaCiudadano);
                  this.mostrarValidaciones = false;
                  this.dataSource.paginator = this.paginator;
                  this.ocultarPaginador = false;
                } else {
                  this.limpiarRegistros();
                }
              }
            },
            error: () => {
              this.limpiarRegistros();
              Modales.modalInformacion(Mensajes.MENSAJE_ERROR_G, this.dialog, 'assets/images/exclamacion.svg');
            }
          });
      } else {
        this.mostrarValidaciones = true;
      }
    }


    /**
     * @description limpia los registros de la grilla
     */
    limpiarRegistros() {
      this.listaCiudadano = [];
      this.dataSource = new MatTableDataSource(this.listaCiudadano);
      this.mostrarValidaciones = false;
    }


    /**
     * @description valida que el form sea correcto para llamar servicio de consulta
     */
    validarCampoObligatorio() {

      const { nombre_ciudadano, apellido_ciudadano, numero_documento } = this.ciudadanoForm.value;

      if (nombre_ciudadano && apellido_ciudadano || numero_documento) {
        this.ciudadanoForm.controls['obl'].setValue('ok');
      } else {
        this.ciudadanoForm.controls['obl'].setValue(null);
      }

    }

    /**
     * @description valida que los campos sean obligatorios o requeridos
     * @param campo variable para ingresar el campo requerido
     */
    public isRequired(campo: string): boolean {
      if (this.ciudadanoForm.controls[campo]) {
        return this.ciudadanoForm.controls[campo].hasError('required');
      } else {
        return false;
      }
    }


    /**
     * @description envía a form historial del ciudadano
     * @param idCiudadano id del ciudadano
     */
    verHistorialCiudadano(ciudadano: CiudadanoInterface) {
      sessionStorage.setItem('ciudadano', JSON.stringify(ciudadano));
      this.router.navigate(['/historial-ciudadano', ciudadano.idCiudadano]);
    }

}
