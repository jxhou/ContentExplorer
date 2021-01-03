import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpParams, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getToken();

    if (!token) {
      return next.handle(req);
    }

    /* example to update the params
    const modifiedReq = req.clone({
      params: new HttpParams().set('Authorization', token)
    });
    */

    // Add token to every request.
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const modifiedReq = req.clone({
      headers: req.headers.set('Authorization', token)
    });

    // Or one liner to clone and set new header
    // const authReq = req.clone({ setHeaders: { Authorization: token } });

    // send cloned request with header to the next handler.
    return next.handle(modifiedReq);
  }
}
