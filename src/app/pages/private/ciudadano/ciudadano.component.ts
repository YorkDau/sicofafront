import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { CodigosRespuesta, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { Modales } from 'src/app/shared/modals';
import { CiudadanoInterface } from '../interfaces/ciudadano.interface';
import { CiudadanoService } from './services/ciudadano.service';
import { AuthService } from 'src/app/auth/services/auth.service';

@Component({
  selector: 'app-ciudadano',
  templateUrl: './ciudadano.component.html',
  styleUrls: ['./ciudadano.component.scss']
})
export class CiudadanoComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  public columnas: string[] = ['nombres', 'apellidos', 'tipo_documento', 'numero_documento'
    , 'numero_solicitudes', 'fecha_ult_solicitud', 'accion'];
  public dataSource = new MatTableDataSource<CiudadanoInterface>([]);
  public listaCiudadano: CiudadanoInterface[] = [];
  public ciudadanoForm!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public formSubmitted: boolean = false;
  public ocultarPaginador: boolean = true;
  public mostrarOcultarBoton: boolean = true;
  currentUser!: UserInterface | undefined;

  constructor(private ciudadanoService: CiudadanoService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private authService: AuthService,
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
  }


  /**
   * @description llama servicio getCiudadanos
   */
  consultarCiudadano() {

    this.validarCampoObligatorio();

    if (this.ciudadanoForm.valid) {
      this.formSubmitted = true;
      this.ciudadanoService.getCiudadanos(this.ciudadanoForm.value)
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
