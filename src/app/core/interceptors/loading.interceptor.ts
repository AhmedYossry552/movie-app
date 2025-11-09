import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { LoaderService } from '../services/loader.service';

/**
 * HTTP Interceptor to show/hide loader during HTTP requests
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);

  // Show loader
  loaderService.show();

  // Hide loader when request completes (success or error)
  return next(req).pipe(
    finalize(() => loaderService.hide())
  );
};
