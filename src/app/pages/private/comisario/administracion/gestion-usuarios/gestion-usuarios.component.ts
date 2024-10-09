import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/services/auth.service';
import { CodigosRespuesta, ImagenesModal, Mensajes } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { SharedFunctions } from 'src/app/shared/functions';
import { Modales } from 'src/app/shared/modals';
import { perfilesInterface, usuariosInterface } from '../interfaces/gestion-usuarios.interface';
import { GestionUsuariosService } from '../services/gestion-usuarios.service';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss']
})
export class GestionUsuariosComponent implements OnInit {
  @ViewChild(MatPaginator, {static: true}) paginator!:MatPaginator;
  public displayedColumns: string[] = [
    'numeroDocumento',
    'nombre',
    'estado',
    'correo',
    'perfil',
    'acciones'
  ];
  public myForm!: FormGroup;
  public dataSource = new MatTableDataSource<usuariosInterface>([]);
  public dataSourceList: usuariosInterface[] = [];
  public listaUsuarios: usuariosInterface[] = [];
  public listaPerfiles: perfilesInterface[] = [];
  public arrayNombresPerfiles: any[] = [];
  public idComisaria: number | undefined;
  private user!: UserInterface | undefined;

  constructor(
    private authService: AuthService,
    private gestionUsariosService: GestionUsuariosService,
    private _dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.user = this.authService.currentUserValue;
    this.idComisaria = this.user?.idComisaria;
    this.cargarListaPerfiles();
    this.cargarForm();
  }

  /**
   * @description carga la lista de usuarios existentes
   */
  private cargarListaUsuarios(){
    this.gestionUsariosService.listaUsuariosConId(this.idComisaria).subscribe({
      next:(data: ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.dataSourceList = data.data;
          data.data.forEach((perfil: any, index: any) =>{
            let i = 0;
            while(i < 8){
              if(perfil.perfiles[i] != undefined){
                if(this.arrayNombresPerfiles[index] === undefined){
                  this.arrayNombresPerfiles[index] = '';
                }
                this.arrayNombresPerfiles[index] = this.arrayNombresPerfiles[index] + perfil.perfiles[i].nombrePerfil + ', ' ;
              }
              i++;
            }
          });
          data.data.forEach((perfil:any, index: any) =>{
            perfil.perfiles= this.arrayNombresPerfiles[index];
          });
          this.dataSource = new MatTableDataSource(this.dataSourceList);
          this.dataSource.paginator = this.paginator;
        } else {
          this.msgError();
        }
      },
      error: () => {
        this.msgError();
      }
    });
  }

  /**
   * @description carga la lista de perfiles existentes
   */
  private cargarListaPerfiles(){
    this.gestionUsariosService.getListaPerfiles().subscribe({
      next: (data:ResponseInterface) => {
        if (data.statusCode === CodigosRespuesta.OK) {
          this.listaPerfiles = data.data;
          this.cargarListaUsuarios();
        } else {
          this.msgError();
        }
      },
      error: () => {
        this.msgError();
      }
    });
  }
  /**
   * @description carga el form para la busqueda
   */
  private cargarForm(){
    this.myForm = this.fb.group({
      filtro: [],
      numeroDocumento: []
    });
  }
  public applyFilter(){
    let filterValue = this.myForm.get('filtro')?.value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  /**
   * @description permite que un campo del form reciba solo numeros
   * @param campo
   */
  public soloNumero(campo: string){
    SharedFunctions.soloNumero(campo, this.myForm);
  }

  /**
   * @description permite que un campo del form reciba solo letras
   * @param campo
   */
  public soloLetras(campo: string){
    SharedFunctions.soloLetras(campo, this.myForm);
  }
  private msgError(){
    Modales.modalExito(
      Mensajes.MENSAJE_ERROR_G,
      ImagenesModal.EXCLAMACION,
      this._dialog
    );
  }
}
