import { finalize, Observable } from 'rxjs';
import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import Pubsub from 'pubsub-js';

let countRequest: number = 0;

export const loaderInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  if (!countRequest) {
    Pubsub.publish('loading', true);
  }
  countRequest++;

  return next(req).pipe(
    finalize(() => {
      countRequest--;
      if (!countRequest) {
        Pubsub.publish('loading', false);
      }
    })
  );
};
