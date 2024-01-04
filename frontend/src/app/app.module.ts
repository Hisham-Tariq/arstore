import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModalsModule } from './ui/modals/modals.module';
import { MatDialogRef } from '@angular/material/dialog';
import {
  MAT_FORM_FIELD_DEFAULT_OPTIONS,
  MatFormFieldDefaultOptions,
} from '@angular/material/form-field';
import { IconsModule } from './icons/icons.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { MAT_MENU_SCROLL_STRATEGY } from '@angular/material/menu';
import { MAT_SELECT_SCROLL_STRATEGY } from '@angular/material/select';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import { ReflectionSplashScreenModule } from 'src/app/services/splash-screen/splash-screen.module';
import { ReflectionNavigationModule } from './services/ReflectionNavigation';
import { PlatformModule } from '@angular/cdk/platform';
import { NgSelectModule } from '@ng-select/ng-select';
import { environment } from '../environments/environment';
import { ReflectionAuthenticationModule } from './services/Authentication';
import { TFJSModule } from 'ngx-tfjs';
import {
  LazyLoadImageModule,
  LAZYLOAD_IMAGE_HOOKS,
  ScrollHooks,
} from 'ng-lazyload-image';
import { CSRFInterceptor } from './interceptors/csrf.interceptor';

export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

const appearance: MatFormFieldDefaultOptions = {
  appearance: 'outline',
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ModalsModule,
    IconsModule,
    HttpClientModule,
    ReflectionSplashScreenModule,
    ReflectionNavigationModule,
    ReflectionAuthenticationModule,
    PlatformModule,
    NgSelectModule,
    TFJSModule,
    LazyLoadImageModule,
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {},
    },
    {
      provide: MAT_MENU_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
    {
      provide: MAT_SELECT_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: appearance,
    },
    {
      provide: LAZYLOAD_IMAGE_HOOKS,
      useClass: ScrollHooks,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
