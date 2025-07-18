import { Injectable } from '@angular/core';
import { RegisterModel } from '../models/register-model';
import { Response, Http } from '@angular/http';

import { LoginModel } from '../models/login-model';
import { AuthTokenService } from '../auth-token/auth-token.service';
import { Store } from '@ngrx/store';
//import { AppState } from '../../app-store';
import { LoggedInActions } from '../auth-store/logged-in.actions';
import { AuthTokenActions } from '../auth-token/auth-token.actions';
import { AuthReadyActions } from '../auth-store/auth-ready.actions';
import { ProfileActions } from '../profile/profile.actions';
import { UtilityService } from '../../core/services/utility.service';
import { Observable } from 'rxjs/Observable';
import { DataService } from '../../core/services/data.service';
@Injectable()
export class AccountService {

    constructor(
        private http: Http,
        private authTokens: AuthTokenService,
        private store: Store<any>,
        private loggedInAction: LoggedInActions,
        private authTokenActions: AuthTokenActions,
        private authReadyActions: AuthReadyActions,
        private profileActions: ProfileActions,
        private utilityService: UtilityService,
        public _appService: DataService
        
    ) { }

    public register(data: RegisterModel): Observable<Response> {
        return this.http.post('api/account/register', data)
            .catch(res => Observable.throw(res.json()));
    }

    //public login(user: LoginModel) {
    //    return this.authTokens.getTokens(user, 'password')
    //        .catch(res => Observable.throw(res.json()))
    //        .do(res => this.authTokens.scheduleRefresh());
    //}
    public login(data: LoginModel): Observable<Response> {
     
        return this.http.post('api/account/login', data)
               .map(() => {
                   this.store.dispatch(this.loggedInAction.loggedIn());
               
                this.store.dispatch(this.authReadyActions.ready());
            })
            .catch(res => Observable.throw(res.json()));
    }
    public logout() {
       
        this._appService.post('api/account/logout')
            .subscribe(res => {
                this.store.dispatch(this.loggedInAction.loggedIn());

                this.store.dispatch(this.authReadyActions.ready());
            });
      
        this.authTokens.deleteTokens();
        this.authTokens.unsubscribeRefresh();

        this.store.dispatch(this.loggedInAction.notLoggedIn());
        this.store.dispatch(this.authTokenActions.delete());
        this.store.dispatch(this.profileActions.delete());

        this.utilityService.navigateToSignIn();
    }
    //public logout() {
    //    this.authTokens.deleteTokens();
    //    this.authTokens.unsubscribeRefresh();

    //    this.store.dispatch(this.loggedInAction.notLoggedIn());
    //    this.store.dispatch(this.authTokenActions.delete());
    //    this.store.dispatch(this.profileActions.delete());
    //    this.http.post('api/account/login', null)
    //        .map(() => {
    //            this.store.dispatch(this.loggedInAction.loggedIn());

    //            this.store.dispatch(this.authReadyActions.ready());
    //        })
    //        .catch(res => Observable.throw(res.json()));
    //    this.utilityService.navigateToSignIn();
    //}

}
