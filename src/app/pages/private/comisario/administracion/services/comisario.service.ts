import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';
import { TomaDecisionInterface } from '../interfaces/toma-decision.interface';

@Injectable({
  providedIn: 'root',
})
export class ComisarioService {
  private api = PATH_SERVER;
  constructor(private http: HttpClient) {}

  /**
   * @description actualizacion de la informacion de la comisaria
   * @param body
   * @returns observable
   */
  public postTomarDecision(
    body: TomaDecisionInterface
  ): Observable<ResponseInterface> {
    return this.http
      .post<ResponseInterface>(
        `${this.api}/Comisario/RegistrarTomaDecision`,
        body
      )
      .pipe(take(1));
  }
}
