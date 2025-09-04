import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';

@Injectable({
  providedIn: 'root',
})
export class InvolucradoService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) { }

  /**
   * @description llama servicio consultar involucrados
   * @param data formdata
   * @returns observable
   */
  public getInvolucrados(data: FormData): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Solicitud/consultarInvolucrados`,
      data
    );
  }
}
