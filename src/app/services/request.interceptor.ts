import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, finalize, map, Observable, retry, throwError } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/services/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class RequestInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    let authReq = request;
    authReq = this.addTokenHeader(
      request,
      sessionStorage.getItem(environment.JWT_TOKEN) || ''
    );

    this.spinner.show();
    return next
      .handle(authReq)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (
            error instanceof HttpErrorResponse &&
            error.status === 401 &&
            this.authService.currentUserValue
          ) {
            this.handleUnauthorized();
            return throwError(() => new Error('token no autorizado'));
          } else {
            return this.handleError(error);
          }
        })
      )
      .pipe(
        map<HttpEvent<any>, any>((evt: HttpEvent<any>) => {
          return evt;
        }),
        finalize(() => {
          this.spinner.hide();
        })
      );
  }

  addTokenHeader(req: HttpRequest<any>, token: any) {
    return req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
  }

  handleUnauthorized() {
    sessionStorage.clear();
    this.authService.currentUserValue = undefined;
    this.router.navigate(['./login']);
  }

  /**
   * @description manejo de excepciones http
   * @param error error
   * @returns throwError de la petición
   */
  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // server-side error
      errorMessage = error.error.data;
    }

    return throwError(() => {
      return errorMessage;
    });
  }
}
