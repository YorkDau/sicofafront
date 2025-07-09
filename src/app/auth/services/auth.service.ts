import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { isJSON } from 'class-validator';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { UserInterface } from 'src/app/interfaces/usuario.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = `${PATH_SERVER}/Login`;
  private loadPage = new BehaviorSubject<boolean>(false);
  public loadPage$ = this.loadPage.asObservable();
  public perfilesList: PerfilAuth[] = [];
  public comisariasList: ComisariaAuth[] = [];
  public id_comisaria: any;

  public nombrePerfilSeleccionado: string | null = null; 
  
  private _selectedComisariaSubject: BehaviorSubject<any>;
  public selectedComisaria$: Observable<any>;

  constructor(private http: HttpClient, private router: Router) {
    this.setComisariasPerfiles();
    this._selectedComisariaSubject = new BehaviorSubject<any>(this.getselectComisariaValue(this.id_comisaria));
    this.selectedComisaria$ = this._selectedComisariaSubject.asObservable();
    
    this.getselectProfileName(); 
  }

  setComisariasPerfiles() {
    let perfiles_comisarias: any = sessionStorage.getItem(
      environment.PERFILES_COMISARIAS
    );
    perfiles_comisarias = perfiles_comisarias
      ? (JSON.parse(perfiles_comisarias) as PerfilesComisariasAuth)
      : null;
    if (perfiles_comisarias) {
      this.perfilesList = perfiles_comisarias.perfiles;
      this.comisariasList = perfiles_comisarias.comisarias;
    }
  }

  get perfiles(): any {
    this.setComisariasPerfiles();
    return this.perfilesList.map((val) => val.perfil);
  }

  get currentUserValue() {
    const user = sessionStorage.getItem(environment.USER_INFO);
    return user && isJSON(user) ? JSON.parse(user) : undefined;
  }

  set currentUserValue(user: UserInterface | undefined) {
    sessionStorage.setItem(environment.USER_INFO, JSON.stringify(user));
  }

  public setComisariaAndProfileSelection(_id_comisaria: any, _nombrePerfil: string | null) { 
    this.id_comisaria = _id_comisaria;
    this.nombrePerfilSeleccionado = _nombrePerfil; 
    
    sessionStorage.setItem(environment.SELECTED_COMISARIA_ID, _id_comisaria.toString());
    if (_nombrePerfil) { 
      sessionStorage.setItem(environment.SELECTED_PROFILE_NAME, _nombrePerfil);
    } else {
      sessionStorage.removeItem(environment.SELECTED_PROFILE_NAME);
    }
    
    this._selectedComisariaSubject.next(_id_comisaria); 
  }

  public getselectComisariaValue(id_comisaria: any): any {
    if (this.id_comisaria === undefined || this.id_comisaria === null) {
      const storedId = sessionStorage.getItem(environment.SELECTED_COMISARIA_ID);
      if (storedId) {
        this.id_comisaria = Number(storedId);
        console.log('AuthService LOG: getselectComisariaValue cargado desde sessionStorage:', this.id_comisaria);
      }
    }
    console.log('AuthService LOG: getselectComisariaValue devolviendo:', this.id_comisaria);
    return this.id_comisaria;
  }

  public getselectProfileName(): string | null {
    if (this.nombrePerfilSeleccionado === null) {
      const storedProfileName = sessionStorage.getItem(environment.SELECTED_PROFILE_NAME);
      if (storedProfileName) {
        this.nombrePerfilSeleccionado = storedProfileName;
        console.log('AuthService LOG: getselectProfileName cargado desde sessionStorage:', this.nombrePerfilSeleccionado);
      }
    }
    console.log('AuthService LOG: getselectProfileName devolviendo:', this.nombrePerfilSeleccionado);
    return this.nombrePerfilSeleccionado;
  }

  public emitirLoadPage(value: boolean) {
    this.loadPage.next(value);
  }

  login(loginReq: any): Observable<ResponseInterface> {
    return this.http
      .post<any>(`${this.api}/Ingreso`, loginReq)
      .pipe(tap((resp: ResponseInterface) => this.save(resp)));
  }

  /**
   * @description cierra la sesión del usuario
   */
  cerrarSesion() {
    sessionStorage.clear();
    this.currentUserValue = undefined;
    this.id_comisaria = undefined;
    this.nombrePerfilSeleccionado = null;
    if (this._selectedComisariaSubject) {
        this._selectedComisariaSubject.next(undefined);
    }
    window.location.reload();
    this.router.navigate(['./login']);
  }

  private save(resp: ResponseInterface) {
    if (resp.statusCode === 200) {
      sessionStorage.setItem(environment.JWT_TOKEN, resp.data.token);
      sessionStorage.setItem(
        environment.PERFILES_COMISARIAS,
        JSON.stringify({
          perfiles: resp.data.perfiles,
          comisarias: resp.data.comisarias,
        })
      );
      let obj: UserInterface = {
        usuario: resp.data.idComisaria, // Esto parece incorrecto, ¿no debería ser resp.data.usuario o similar?
        perfil: null,
        userID: resp.data.userID,
        idComisaria: resp.data.idComisaria, 
        reset: resp.data.reset,
      };
      this.currentUserValue = obj;

      if (resp.data.comisarias && resp.data.comisarias.length === 1 && resp.data.perfiles && resp.data.perfiles.length === 1) {
          const onlyComisaria = resp.data.comisarias[0];
          const onlyPerfil = resp.data.perfiles[0];
          if (onlyPerfil.idComisaria === onlyComisaria.idComisaria) {
              this.setComisariaAndProfileSelection(onlyComisaria.idComisaria, onlyPerfil.nombrePerfil); 
          }
      } else {
          sessionStorage.removeItem(environment.SELECTED_COMISARIA_ID);
          sessionStorage.removeItem(environment.SELECTED_PROFILE_NAME); 
          this.id_comisaria = undefined;
          this.nombrePerfilSeleccionado = null;
          if (this._selectedComisariaSubject) {
            this._selectedComisariaSubject.next(undefined);
          }
      }
    }
  }
}

export interface PerfilesComisariasAuth {
  perfiles: PerfilAuth[];
  comisarias: ComisariaAuth[];
}
export interface ComisariaAuth {
  idComisaria: number;
  nombreComisaria: string;
}

export interface PerfilAuth {
  idComisaria: number;
  perfil: string;
  nombrePerfil: string;
}
