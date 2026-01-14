import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { KpiService } from './kpi.service';

/**
 * Interceptor para KPIs:
 * - Cuenta peticiones HTTP (httpRequests)
 * - Cuenta suscripciones activas aproximadas (activeSubscriptions)
 */
export const kpiHttpInterceptor: HttpInterceptorFn = (req, next) => {
  const kpi = inject(KpiService);

  kpi.incHttp();
  kpi.incSub();

  return next(req).pipe(
    finalize(() => kpi.decSub())
  );
};
