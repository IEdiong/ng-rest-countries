import { inject } from '@angular/core';
import {
  HttpRequest,
  HttpEvent,
  HttpContextToken,
  HttpResponse,
  HttpHandlerFn,
} from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { CacheService } from '@core/services';
import { ICountry } from '@shared/interfaces';

export const CACHING_ENABLED = new HttpContextToken<boolean>(() => false);

export function cachingInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> {
  const cacheService = inject(CacheService);

  if (req.context.get(CACHING_ENABLED)) {
    const cachedResponse = cacheService.get(req.urlWithParams);

    if (cachedResponse) {
      return of(new HttpResponse({ body: cachedResponse }));
    }

    return next(req).pipe(
      tap((event: HttpEvent<unknown>) => {
        if (event instanceof HttpResponse && event.body !== null) {
          cacheService.put(req.urlWithParams, event.body as ICountry[]);
        }
      }),
    );
  } else {
    return next(req);
  }
}
