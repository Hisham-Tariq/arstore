import {NgModule} from '@angular/core';
import {ExtraOptions, PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {ClientAppContainerComponent} from "./components/client-app-container/client-app-container.component";
import {AdminAppContainerComponent} from "./components/admin-app-container/admin-app-container.component";
import {ReflectionAuthGuard} from "./Guards/reflection-auth.guard";

const routerConfig: ExtraOptions = {
  preloadingStrategy       : PreloadAllModules,
  scrollPositionRestoration: 'enabled'
};


const routes: Routes = [

  // Redirect empty path to '/example'
  // {path: '', pathMatch: 'full', redirectTo: 'home'},
  // {path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'home'},

  // Auth routes for guests
  // {
  //     path: '',
  //     canActivate: [NoAuthGuard],
  //     canActivateChild: [NoAuthGuard],
  //     component: LayoutComponent,
  //     data: {
  //         layout: 'modern'
  //     },
  //     children: [
  // eslint-disable-next-line max-len
  //         {path: 'confirmation-req./uired', loadChildren: () => import('app/modules/auth/confirmation-req./uired/confirmation-req./uired.module').then(m => m.AuthConfirmationReq./uiredModule)},
  //         {path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.module').then(m => m.AuthForgotPasswordModule)},
  //         {path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.module').then(m => m.AuthResetPasswordModule)},
  //         {path: 'sign-in', loadChildren: () => import('app/modules/pages/sign-in/sign-in.module').then(m => m.AuthSignInModule)},
  //         {path: 'sign-up', loadChildren: () => import('app/modules/pages/sign-up/sign-up.module').then(m => m.AuthSignUpModule)}
  //     ]
  // },

  // Auth routes for authenticated users
  // {
  //     path: '',
  //     canActivate: [AuthGuard],
  //     canActivateChild: [AuthGuard],
  //     component: LayoutComponent,
  //     data: {
  //         layout: 'empty'
  //     },
  //     children: [
  //         {path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.module').then(m => m.AuthSignOutModule)},
  //         {path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.module').then(m => m.AuthUnlockSessionModule)}
  //     ]
  // },

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
  // Landing routes
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
  // Admin routes
  // {
  //     path       : '',
  //     canActivate: [AuthGuard],
  //     canActivateChild: [AuthGuard],
  //     component  : LayoutComponent,
  //     data:{
  //         layout: 'modern'
  //     },
  //     resolve    : {
  //         initialData: InitialDataResolver,
  //     },
  //     children   : [
  //         {path: 'example', loadChildren: () => import('app/modules/admin/example/example.module').then(m => m.ExampleModule)},
  //     ]
  // }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, routerConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
