import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { CiudadanoInterface } from '../interfaces/ciudadano.interface';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { CiudadanoService } from '../ciudadano/services/ciudadano.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { CodigosRespuesta, Mensajes } from 'src/app/constants';
import { Modales } from 'src/app/shared/modals';
import { PerfilService } from './services/perfil.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss'],
})
export class PerfilComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  public columnas: string[] = [
    'nombrePerfil',
    'codigo',
    'estado',
    'accion'
  ];

  public dataSource = new MatTableDataSource<CiudadanoInterface>([]);
  public listaPerfiles: any [] = [];
  public ciudadanoForm!: FormGroup;
  public mostrarValidaciones: boolean = false;
  public formSubmitted: boolean = false;
  public ocultarPaginador: boolean = true;
  public mostrarOcultarBoton: boolean = true;
  currentUser!: UserInterface | undefined;

  constructor(
    private _perfilService: PerfilService,
    private router: Router,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    //if (this.authService.currentUserValue?.perfil === 'COM') {
    //  this.mostrarOcultarBoton = false;
    //}

    this.ciudadanoForm = this.fb.group({
      nombre_ciudadano: '',
      apellido_ciudadano: '',
      numero_documento: '',
      obl: ['', Validators.required],
    });
    sessionStorage.removeItem('idC');
    sessionStorage.removeItem('ciudadano');
  }

  /**
   * @description llama servicio getCiudadanos
   */
  consultarCiudadano() {
    //this.validarCampoObligatorio();

    if (true) {
      this.formSubmitted = true;
      this._perfilService.getPerfiles().subscribe({
        next: (data: ResponseInterface) => {
          if (data.statusCode === CodigosRespuesta.OK) {
            if (data.data.length > 0) {
              this.listaPerfiles = data.data;
              this.dataSource = new MatTableDataSource(this.listaPerfiles);
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
          Modales.modalInformacion(
            Mensajes.MENSAJE_ERROR_G,
            this.dialog,
            'assets/images/exclamacion.svg'
          );
        },
      });
    } else {
      this.mostrarValidaciones = true;
    }
  }

  /**
   * @description limpia los registros de la grilla
   */
  limpiarRegistros() {
    this.listaPerfiles = [];
    this.dataSource = new MatTableDataSource(this.listaPerfiles);
    this.mostrarValidaciones = false;
  }

  /**
   * @description valida que el form sea correcto para llamar servicio de consulta
   */
  validarCampoObligatorio() {
    const { nombre_ciudadano, apellido_ciudadano, numero_documento } =
      this.ciudadanoForm.value;

    if ((nombre_ciudadano && apellido_ciudadano) || numero_documento) {
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

  verPerfil(perfil: any) {
    this.router.navigate(['/registro-perfil', perfil.idPerfil]);
    //sessionStorage.setItem('permiso', JSON.stringify(permiso));
    //this.router.navigate(['/historial-ciudadano', permiso.idPerfil]);
  }

  editar(){
    
  }
}
