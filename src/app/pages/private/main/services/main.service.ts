import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PATH_SERVER } from "src/app/constants";
import { ResponseInterface } from "src/app/interfaces/response.interface";


@Injectable({
  providedIn: 'root',
})
export class MainService {
  private api = PATH_SERVER;

  constructor(private http: HttpClient) {}

  public convert(
    from: string,
    to: string,
    base64: string
  ): Observable<ResponseInterface> {
    return this.http.post<ResponseInterface>(
      `${this.api}/Conversor`,
      {
        from,
        to,
        base64
      }
    );
  }
}