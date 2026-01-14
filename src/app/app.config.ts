import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { routes } from './app.routes';
import { kpiHttpInterceptor } from './core/metrics/kpi-http.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIonicAngular(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([kpiHttpInterceptor])),
  ],
};
