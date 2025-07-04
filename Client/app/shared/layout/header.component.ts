// tslint:disable
//import { Component, OnInit, OnDestroy } from '@angular/core';
//import { Store } from '@ngrx/store';
//import { Observable } from 'rxjs/Observable';
//import { TranslateService } from '@ngx-translate/core';

//import { AppState } from './../../app-store';
//import { AccountService } from './../../core/account/account.service';
//import { AuthTokenService } from './../../core/auth-token/auth-token.service';
//import { AuthState } from '../../core/auth-store/auth.store';
//import { UtilityService } from '../../core/services/utility.service';
//import { DataService } from '../../core/services/data.service';
//import { LoggedInActions } from '../../core/auth-store/logged-in.actions';
//import { AuthReadyActions } from '../../core/auth-store/auth-ready.actions';

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UtilityService } from '../../core/services/utility.service';
import { DataService } from '../../core/services/data.service';
import { AuthService } from "../../core/authservice/auth.service";
import { AccountService } from './../../core/authservice/account.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'appc-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isCollapsed: boolean = true;
  public Menu: any = null;

  isUserLoggedIn: boolean;
  busy: Subscription;
  selectedrole: any;
  //constructor(
  //    public tokens: AuthTokenService,
  //    public store: Store<AppState>,
  //    public accountService: AccountService,
  //    public translation: TranslateService,
  //    public utilityService: UtilityService,
  //    public appservice: DataService,
  //    private loggedInAction: LoggedInActions,
  //    private authReadyActions: AuthReadyActions,
  //) { }
  constructor(
    public accountService: AccountService,
    public utilityService: UtilityService,
    public appservice: DataService,
    public locationStrategy: LocationStrategy,
    public auth: AuthService,
    private _Location:Location
  ) { }

  public ngOnInit(): void {
    debugger;
    //this.authState$ = this.store.select(state => state.auth);
    //this.CheckAuth();
    //Observable.interval(300000).subscribe(x => {
    //  this.CheckAuth();
    //});
    this.isUserLoggedIn = this.auth.isLoggedIn;
      var locationStrategy: any = this.locationStrategy;
      if (locationStrategy._platformLocation.pathname == "/auth-callback" || locationStrategy._platformLocation.pathname == "/login/Registered" || locationStrategy._platformLocation.pathname == "/login/reset" || locationStrategy._platformLocation.pathname == "/forgotpassword" || locationStrategy._platformLocation.pathname.indexOf("/resetpassword") >= 0) {
        return;
      }
    else {
      if (!this.auth.isLoggedIn) {
        // this.auth.ActiveDirlogin();
        this.utilityService.navigateToSignIn();
      }
    }
  }
  Selectrole() {
    var data = { "role": this.selectedrole }

    this.appservice.post("api/service/SwitchRole", JSON.stringify(data))
      .subscribe(
        datares => {
          this.auth.updateroles(null, this.selectedrole, "");

          this.utilityService.navigate('/apps/requisitions');
        },
        err => {
          console.log(err);
        },
        () => {

        }
      );
  }
  //public CheckAuth()
  //{
  //    this.authState$.loggedIn = false;

  //    this.appservice.get("api/account/checksession")
  //        .subscribe(
  //        data => {
  //            if (data == 0) {

  //                this.utilityService.navigateToSignIn();
  //            } else
  //            {
  //                this.store.dispatch(this.loggedInAction.loggedIn());
  //                this.store.dispatch(this.authReadyActions.ready());
  //            }
  //        },
  //        err => {
  //            console.log(err);
  //        },
  //        () => {
  //            console.log("done")
  //        }
  //        );

  //}
  public toggleNav() {
    this.isCollapsed = !this.isCollapsed;
  }
  public GetMenu() {

    if (this.auth.isLoggedIn && JSON.stringify(this.Menu) != JSON.stringify(this.auth.Menu) && this.auth.Menu.Nav.length > 0) {
      this.Menu = this.auth.Menu;
      return true;
    } else if (this.Menu && this.auth.isLoggedIn && JSON.stringify(this.Menu) == JSON.stringify(this.auth.Menu)) {
      return true;
    } else {
      return false;
    }


  }
  public setLang(lang: any) {
    //  this.currentLanguage = lang;
    // this.translation.use(lang.locale); // comment by Arun - for build
  }

  public ngOnDestroy(): void {
    // this.tokens.unsubscribeRefresh();  // comment by Arun - for build
  }
  get ActiveGroup(): string {
    return this.auth.currentUser ? this.auth.currentUser.ActiveGroup : "";
  }


  get GroupList(): any[] {
    var groups = [];

    if (this.auth.currentUser) {
      groups = this.auth.currentUser.groups.split(",");
      return groups;
    } else {
      return groups;
    }
  }
  get canAccessStory() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("story") > -1
    //return true;//this.auth.currentUser.roles.indexOf("Reviewer") > -1;
  }
  get canAccessCampaign() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("campaign") > -1
    //return true;;//this.auth.currentUser.roles.indexOf("Reviewer") > -1;
  }
  get canAccessBulletin() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("bulletin") > -1
    //return true;;//this.auth.currentUser.roles.indexOf("Reviewer") > -1;
  }
  get canAccessPost() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("post") > -1
    //return true;//this.auth.currentUser.roles.indexOf("Reviewer") > -1;
  }
  get canAccessEngage() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("engage") > -1
    //return this.auth.currentUser.roles.indexOf("Tenant Admin") > -1 || this.auth.currentUser.roles.indexOf("Marketing Admin") > -1;
  }
  get canAccessPeople() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("people") > -1
    //return this.auth.currentUser.roles.indexOf("Tenant Admin") > -1 || this.auth.currentUser.roles.indexOf("Marketing Admin") > -1;
  }
  get canAccessAnalytics() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("analytics") > -1
    //return this.auth.currentUser.roles.indexOf("Tenant Admin") > -1 || this.auth.currentUser.roles.indexOf("Marketing Admin") > -1;
  }
  get canAccessProfile() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("profile") > -1
    //return this.auth.currentUser.roles.indexOf("Tenant Admin") > -1 || this.auth.currentUser.roles.indexOf("Marketing Admin") > -1;
  }
  get canAccessPayment() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("payment") > -1
    //return this.auth.currentUser.roles.indexOf("Tenant Admin") > -1;
  }
  get canAccessUsers() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("users") > -1
    //return this.auth.currentUser.roles.indexOf("Tenant Admin") > -1;
  }
  get canAccessGroups() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("group") > -1

  }

  get canAccessSales() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));

    return userPermissions.indexOf("sales") > -1

  }
  get canAccessactivity() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("activity") > -1

  }
  get canAccessdeal() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("deal") > -1

  }
  get canAccesscontact() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("contact") > -1

  }
  get canAccessorganization() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("organization") > -1

  }
  get canAccessleads() {
    const userPermissions = JSON.parse(JSON.stringify(this.auth.userPermissions));
    return userPermissions.indexOf("leads") > -1

  }
  ChangeGroup(group) {

    var per = this.auth.userPermissions;
    this.busy = this.appservice.post("api/admin/changegroup", group)
      .subscribe(
        data => {
          // alert("call");

          this.auth.updateGroup(group);
          window.location.reload();
          //this.auth.currentUser.ActiveGroup = group;
        },
        err => {


        },
        () => {

        }
      );
  }
}
