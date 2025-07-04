import { NgModule } from '@angular/core';
//import { SharedModule } from '../shared/shared.module';
//import { SocialLoginComponent } from './sociallogin/social-login.component';
import { LoginComponent } from './login.component';
import { routing } from './login.routes';
import { BusyModule } from 'angular2-busy';
// import { LoginresponseComponent } from './loginresponse/loginresponse.component';
@NgModule({
  imports: [routing,BusyModule],
    declarations: [LoginComponent]
})
export class LoginModule { }
