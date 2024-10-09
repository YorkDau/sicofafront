import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';



@Injectable({
  providedIn: 'root'
})
export class PreSolicitudService {

  private api = PATH_SERVER;

  private presolicitudBS = new BehaviorSubject<any>(null);
  public presolicitud$ = this.presolicitudBS.asObservable();

  private _crear: boolean = false;

  set crear(value: boolean) {
    this._crear = value;
  }

  get crear(): boolean {
    return this._crear
  }

  constructor(private http: HttpClient) { }

  public emitirPresolicitud(presolicitud: any) {
    this.presolicitudBS.next(presolicitud);
  }

  public getInfoCiudadano(tipoDoc: number, numDoc: number): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Presolicitud/ObtenerCiudadano/${tipoDoc}/${numDoc}`
    );
  }

  public crearPresolicitud(obj: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Presolicitud/CrearPresolicitud`,
      obj
    );
  }

  public GuardarDecisionJuridica(obj: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Presolicitud/GuardarDecisionJuridica`,
      obj
    );
  }

  public GuardarVerificacionDenuncia(obj: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Presolicitud/GuardarVerificacionDenuncia`,
      obj
    );
  }

  public getPresolicitud(id: number): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Presolicitud/ObtenerPresolicitud/${id}`
    );
  }

  public getInfoReporte(id: number): Observable<ResponseInterface> {
    return this.http.get<ResponseInterface>(
      `${this.api}/Presolicitud/InformacionReporteAbogado/${id}`
    );
  }

  public cerrarActuacion(objTarea: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Tarea/CerrarActuaciones`,
      objTarea
    );
  }

  public cerrarActuacionDenuncia(objTarea: any): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Presolicitud/CerrarActuacionDenuncia`,
      objTarea
    );
  }


}
