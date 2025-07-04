import { Component, OnInit,ViewEncapsulation } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { AppState } from './app-store';
import { AuthState } from './core/auth-store/auth.store';
//import { AuthTokenService } from './core/auth-token/auth-token.service';
import { AuthService } from "../app/core/authservice/auth.service";
import { Router, NavigationExtras } from "@angular/router";
import { LocalStoreManager } from './core/authservice/local-store-manager.service';




@Component({
  selector: 'appc-root',
  templateUrl: './app.component.html',
  styleUrls: ['../../wwwroot/assets/bootstrap-4/scss/bootstrap.scss'],
   encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {

  private authState$: Observable<AuthState>;
  sessionExpired: boolean = false;
  showreqmenuItem: any;


  constructor( 
    public translate: TranslateService,
    public titleService: Title,
    public auth: AuthService,
    private router: Router,
  //  private tokens: AuthTokenService,
    private store: Store<AppState>, private localStorage: LocalStoreManager) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }

  public ngOnInit() {


    this.translate.onLangChange.subscribe((lan: string) => {
      //this.translate.get('TITLE')
      //  .subscribe(title => this.setTitle(title));
    });

    this.authState$ = this.store.select(state => state.auth);

    // This starts up the token refresh preocess for the app
   // this.tokens.startupTokenRefresh()
     // .subscribe(
      // tslint:disable-next-line:no-console
    //  () => console.info('Startup success'),
    //  error => console.warn(error)
    //  );

    this.auth.sessionExpired$.subscribe(isExpired => {
      console.log("from login sesion expird");
      if (isExpired) {
        this.sessionExpired = true;
        // Redirect to login page or show a message

        // this.router.navigate(['/login']);
        this.auth.logout();
      }
    });
  }

  public setTitle(newTitle: string) {
    this.titleService.setTitle(newTitle);
  }
}
