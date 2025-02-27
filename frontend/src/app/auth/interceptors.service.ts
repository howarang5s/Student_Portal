import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class InterceptorsService implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Interceptor: Error status:', error.status);
        console.log('Interceptor: Error response:', error);
        if (error.status === 401 || error.status === 403 ) {
          console.log('Interceptor: Unauthorized request detected. Redirecting to login.');
          localStorage.removeItem('token');
          document.cookie = 'connect.sid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost;';
          this.router.navigate(['/auth/login']);
        }
        return throwError(error);
      })
    );
  }
}