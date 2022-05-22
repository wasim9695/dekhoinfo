import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/internal/operators';
import {AuthenticationService} from '../authentication/service/authentication.service';
import {ErrorModel} from '../core/models/error';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private errorModel: ErrorModel;
  constructor(private authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      this.errorModel = new ErrorModel(err.error);
      if ((err.status === 401) || ( err.status === 0) || ( err.status === 403) ) {
        // auto logout if 401 or 0 response returned from api
        this.authenticationService.logout();
        location.reload(true);
      }
      return throwError(this.errorModel);
    }));
  }
}
