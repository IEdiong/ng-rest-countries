import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpContextToken,
  HttpResponse,
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from '@core/services';

export const CACHING_ENABLED = new HttpContextToken<boolean>(() => false);

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: CacheService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Check if ther request is cachable
    if (!request.context.get(CACHING_ENABLED)) {
      return next.handle(request);
    }

    // Get cached response from cache service
    const cachedResponse = this.cacheService.get(request.url);

    // If cached response is available
    if (cachedResponse) {
      // return cached response
      // console.log(`Returning cached response`);
      return of(cachedResponse);
    }

    // Else continue with request and cache the response
    return next.handle(request).pipe(
      // tap(() => console.log(`Getting response from server`)),
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          this.cacheService.put(request.url, event);
        }
      })
    );
  }
}
