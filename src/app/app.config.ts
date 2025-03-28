import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ErrorHandlerInterceptor } from './shared/interceptors/error-handler.interceptor';
import { GoogleLoginProvider } from '@abacritt/angularx-social-login';
import { loaderInterceptor } from './shared/interceptors/loader.interceptor';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { SocialAuthServiceConfig } from '@abacritt/angularx-social-login';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withFetch(),
      withInterceptors([ErrorHandlerInterceptor, loaderInterceptor])
    ),
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        lang: 'es',
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.googleClientId),
          },
        ],
      } as SocialAuthServiceConfig,
    },
  ],
};
