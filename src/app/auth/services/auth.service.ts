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

  constructor(private http: HttpClient, private router: Router) {
    this.setComisariasPerfiles();
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

  public selectComisariaValue(_id_comisaria: any) {
    this.id_comisaria = _id_comisaria;
  }

  public getselectComisariaValue(): any {
    return this.id_comisaria;
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
        usuario: resp.data.idComisaria,
        perfil: null,
        userID: resp.data.userID,
        idComisaria: resp.data.idComisaria,
        reset: resp.data.reset,
      };
      this.currentUserValue = obj;
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
