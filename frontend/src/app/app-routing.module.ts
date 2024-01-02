import {NgModule} from '@angular/core';
import {ExtraOptions, PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {ClientAppContainerComponent} from "./components/client-app-container/client-app-container.component";
import {AdminAppContainerComponent} from "./components/admin-app-container/admin-app-container.component";
import {ReflectionAuthGuard} from "./Guards/reflection-auth.guard";
import {PageNotFoundComponent} from "./components/page_not_found/page_not_found.component";
const routerConfig: ExtraOptions = {
  preloadingStrategy       : PreloadAllModules,
  scrollPositionRestoration: 'enabled'
};


const routes: Routes = [
  {
    path: '',
    component: ClientAppContainerComponent,
    children: [
      {
        path: '',
        loadChildren: (): any =>
          import('./ui/client/client.module').then(
            m => m.ClientModule
          ),
      },
    ],
  },
  // Admin routes
  {
    path: 'admin',
    component: AdminAppContainerComponent,
    canActivate: [ReflectionAuthGuard],
    children: [
      {
        path: '',
        loadChildren: (): any =>
          import('./ui/admin/admin.module').then(
            m => m.AdminModule
          ),
      },
    ],
  },
  // 404 page route
  {
    path: '**', // Catch-all route
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
