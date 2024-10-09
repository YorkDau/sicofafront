import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PATH_SERVER } from 'src/app/constants';
import { ResponseInterface } from 'src/app/interfaces/response.interface';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  private api = PATH_SERVER;
  constructor(private http: HttpClient) { }

  public changePassword(
    password: string
  ): Observable<ResponseInterface>{
    return this.http.post<ResponseInterface>(
      `${this.api}/Login/Cambioclave`,
      {password}
    )
  }

  public resetPassword(
    email: string
  ): Observable<ResponseInterface>{
    return this.http.post<ResponseInterface>(
      `${this.api}/Login/ResetPassword`,
      {email}
    );
  }
}
