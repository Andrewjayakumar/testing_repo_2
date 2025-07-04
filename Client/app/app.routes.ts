import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { AuthGuard } from "./core/authservice/auth-guard.service";
import { AuthCallbackComponent } from "./auth-callback/auth-callback.component";
import { RolesComponent } from "./roles/roles.component";
//import {ApplicationComponent } from "./application/application.component";
export const routes: Routes = [
  { path: '', canActivate: [AuthGuard], loadChildren: './home/home.module#HomeModule' },
  { path: 'apps', canActivate: [AuthGuard],loadChildren: './application/application.module#ApplicationModule' },
  // Lazy async modules
  {
    path: 'login', loadChildren: './+login/login.module#LoginModule'
  },
  //{
  //    path: 'register', loadChildren: './+register/register.module#RegisterModule'
  //},
  //{
  //    path: 'profile', canActivate: [AuthGuard], loadChildren: './+profile/profile.module#ProfileModule'
  //},
  {
    path: 'auth-callback',component: AuthCallbackComponent,
    children: [{ path: ':id', component: AuthCallbackComponent }]
  },
  {
    path: 'selectrole',
    component: RolesComponent
  },
 {
        path: 'submission', loadChildren: './approval/approval.module#ApprovalModule'

    },
    //{
    //    path: 'admin', loadChildren: './+admin/admin.module#AdminModule'
    //},
    //{
    //    path: 'examples', loadChildren: './+examples/examples.module#ExamplesModule'
    //},
    //{
    //  path: 'forgotpassword', loadChildren: './forgotpassword/forgotpassword.module#ForgotpasswordModule'
    //},
    //{
    //    path: 'onboard', canActivate: [AuthGuard], loadChildren: './onboard/onboard.module#OnboardModule'
    //},
  
   // {
     // path: 'forms', canActivate: [AuthGuard], loadChildren: './formbuilder/forms.module#FormsModule'
    //},
   //  { path: 'action', loadChildren: './+ThankYou/ThankYou.module#ThankyouModule' },
  { path: 'projects', canActivate: [AuthGuard], loadChildren: './itss-project/itss-project.module#ItssprojectModule' }

];

export const routing = RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules });
