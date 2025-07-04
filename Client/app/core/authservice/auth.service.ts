// ======================================
// Author: Ebenezer Monney
// Email:  info@ebenmonney.com
// Copyright (c) 2017 www.ebenmonney.com
// 
// ==> Gun4Hire: contact@ebenmonney.com
// ======================================

import { Injectable } from '@angular/core';
import { Router, NavigationExtras } from "@angular/router";
import { Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

import { LocalStoreManager } from './local-store-manager.service';
import { EndpointFactory } from './endpoint-factory.service';
import { ConfigurationService } from './configuration.service';
import { DataService } from '../services/data.service';
import { UtilityService } from '../services/utility.service';
import { DBkeys } from './db-Keys';
import { JwtHelper } from './jwt-helper';
import { Utilities } from './utilities';
import { User } from '../models/user.model';
import { Permission, PermissionNames, PermissionValues } from '../models/permission.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {

  public get loginUrl() { return this.configurations.loginUrl; }
  public get homeUrl() { return this.configurations.homeUrl; }

  public loginRedirectUrl: string;
  public logoutRedirectUrl: string;

  public reLoginDelegate: () => void;

  private previousIsLoggedInCheck = false;
  private _loginStatus = new Subject<boolean>();
  private timeoutId: any;
  private readonly warningDuration = 5 * 60 * 1000; 
 private idleTime = 0;

 public onSessionTimeout: Subject<void> = new Subject<void>();

  /**********************************/

  private inactivityTimer: any;
  private timeoutDuration: number = 10 * 60 * 1000;  // 15 minutes of inactivity
  private lastActivity: number = Date.now();
  private sessionExpiredSource = new BehaviorSubject<boolean>(false);
  public sessionExpired$ = this.sessionExpiredSource.asObservable();


  constructor(private router: Router, private Utility: UtilityService, private configurations: ConfigurationService, private endpointFactory: EndpointFactory, private localStorage: LocalStoreManager, private _appService: DataService) {

    this.initializeLoginStatus();
    this.startSessionTimer();
    this.resetIdleTimer();
    this.listenForUserActivity();
    this.listenChangesacrossAllTabs();



    this.addEventListeners();

    // Sync session across tabs
    this.syncSessionAcrossTabs();

    // Start the inactivity timer
    this.startInactivityTimer();
   
  }


  private initializeLoginStatus() {
    this.localStorage.getInitEvent().subscribe(() => {
      this.reevaluateLoginStatus();
    });
  }


  gotoPage(page: string, preserveParams = true) {

    let navigationExtras: NavigationExtras = {
      queryParamsHandling: preserveParams ? "merge" : "", preserveFragment: preserveParams
    };


    this.router.navigate([page], navigationExtras);
  }


  redirectLoginUser() {
    let redirect = this.loginRedirectUrl && this.loginRedirectUrl != '/' && this.loginRedirectUrl != ConfigurationService.defaultHomeUrl ? this.loginRedirectUrl : this.homeUrl;
    this.loginRedirectUrl = null;


    let urlParamsAndFragment = Utilities.splitInTwo(redirect, '#');
    let urlAndParams = Utilities.splitInTwo(urlParamsAndFragment.firstPart, '?');

    let navigationExtras: NavigationExtras = {
      fragment: urlParamsAndFragment.secondPart,
      queryParams: Utilities.getQueryParamsFromString(urlAndParams.secondPart),
      queryParamsHandling: "merge"
    };

    this.router.navigate([urlAndParams.firstPart], navigationExtras);
  }


  redirectLogoutUser() {

    let redirect = this.logoutRedirectUrl ? this.logoutRedirectUrl : this.loginUrl;
    this.logoutRedirectUrl = "";
    // this.isLoggedIn = false;  // commented by Arun-ng-packagar

    this.router.navigate([redirect]);
  }


  redirectForLogin() {

    this.loginRedirectUrl = this.router.url;
    this.router.navigate([this.loginUrl]);
  }


  reLogin() {

    this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);

    if (this.reLoginDelegate) {
      this.reLoginDelegate();
    }
    else {
      this.redirectForLogin();
    }
  }


  refreshLogin() {
    return this.endpointFactory.getRefreshLoginEndpoint()
      .map((response: Response) =>

        this.processLoginResponse(response, false)
      );
  }
  loginstatic(redirecturl?: any) {



    let idToken: string = "";
    let refreshToken: string = "";
    let expiresIn: number = 3600;

    let tokenExpiryDate = new Date();
    tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);

    let accessTokenExpiry = tokenExpiryDate;


    //this.configurations.import(decodedIdToken.configuration);

    let user = new User(
      "0ca5b67e-821e-4266-96a7-49bf563b7624",
      "Metal",
      "Ascendion",
      "metal@ascendion.com",
      "Ascendion",
      null,
      ["Tenant Admin"], null);
    user.isEnabled = true;

    this.saveUserDetails(user, [], "", idToken, refreshToken, accessTokenExpiry, false);

    //this.reevaluateLoginStatus(user);
    this.Selectrole();

  }

  login(userName: string, password: string, rememberMe?: boolean, redirecturl?: any) {

    // if (this.isLoggedIn)
    //this.logout();
    return this.endpointFactory.getLoginEndpoint(userName, password)
      .map((response: Response) =>

        this.processLoginResponse(response, rememberMe, redirecturl)
      );
  }

  private tenantid: string = "d7758e8f-1df3-489f-86b5-a2254f55f9cc";
  private client_id: string = "0bd0630c-47a2-4e82-8862-452852ae4fb2";
  private redirect_uri: string = "https://metaluat.ascendion.com/auth-callback";
  private logout_uri: string = "https://metaluat.ascendion.com/login";
  ActiveDirlogin() {
    var url = window.location.href;
    var arr = url.split("/");
    var result = arr[0] + "//" + arr[2];
    this.tenantid = "d7758e8f-1df3-489f-86b5-a2254f55f9cc";
    this.client_id = "0bd0630c-47a2-4e82-8862-452852ae4fb2";
    this.redirect_uri = result + "/auth-callback";
    this.logout_uri = result + "/login";
    // var url = "https://fs.collabera.com/adfs/ls/authorize?client_id=" + this.client_id + "&response_type=id_token+token&redirect_uri=" + this.redirect_uri + "&response_mode=fragment&scope=openid+profile+offline_access+Mail.Read+Mail.Send&state=12345&nonce=678910";
    var url = "https://login.microsoftonline.com/common" + "/oauth2/authorize?client_id=" + this.client_id + "&response_type=id_token+code&redirect_uri=" + this.redirect_uri + "&response_mode=fragment&scope=openid+profile+offline_access+Mail.Read+Mail.Send&state=12345&nonce=678910";
    //var url = "https://login.windows.net/" + this.tenantid + "/oauth2/authorize?client_id=" + this.client_id + "&metadataaddress=https://fs.collabera.com/adfs/ls/auth/integrated/&response_type=id_token+code&redirect_uri=" + this.redirect_uri + "&response_mode=fragment&scope=openid+profile+offline_access+Mail.Read+Mail.Send&state=12345&nonce=678910";


    window.location.href = url;
    //var chrome = 100;
    //var width = 600;
    //var height = 400;
    //var left = (screen.width - width) / 2;
    //var top = (screen.height - height - chrome) / 2;
    //var options = "status=0,toolbar=0,location=1,resizable=1,scrollbars=1,left=" + left + ",top=" + top + ",width=" + width + ",height=" + height;
    //window.open(url, "login-popup", options);
  }
  private processLoginResponse(response: Response, rememberMe: boolean, redirecturl?: any) {
    let response_token = response.json();
     alert(JSON.stringify(response_token));
    let accessToken = response_token.access_token;

    if (accessToken == null)
      throw new Error("Received accessToken was empty");

    let idToken: string = response_token.id_token;
    let refreshToken: string = response_token.refresh_token;
    let expiresIn: number = response_token.expires_in;
    console.log("expires in", expiresIn);

    let tokenExpiryDate = new Date();
    tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);

    let accessTokenExpiry = tokenExpiryDate;

    let jwtHelper = new JwtHelper();
    let decodedIdToken = jwtHelper.decodeToken(response_token.id_token);

    let permissions: PermissionValues[] = Array.isArray(decodedIdToken.permission) ? decodedIdToken.permission : [decodedIdToken.permission];
    if (!this.isLoggedIn)
      this.configurations.import(decodedIdToken.configuration);

    let user = new User(
      decodedIdToken.sub,
      "Metal",
      decodedIdToken.ActiveGroup,
      decodedIdToken.email,
      decodedIdToken.groups,
      decodedIdToken.phone,
      Array.isArray(decodedIdToken.role) ? decodedIdToken.role : [decodedIdToken.role], "", decodedIdToken.Plan);
    user.isEnabled = true;

    this.saveUserDetails(user, permissions, accessToken, idToken, refreshToken, accessTokenExpiry, rememberMe);

    this.reevaluateLoginStatus(user);
    this.Selectrole();
    this.Savemenu(redirecturl);
   // this.startSessionTimer();
    return user;
  }
  Selectrole() {
    var data = { "userid": "metal", "granttype": "password", "role": "99999" }

    this._appService.post("api/service/getaccesstoken", JSON.stringify(data))
      .subscribe(
        datares => {
          this.updatetoken(datares);
          let apiparam: any = {};
          apiparam.response = "roles";
          //apiparam.accesstoken = data.accesstoken;
          this._appService.get("http://clienturl/api/Auth/GetRolesAfterAuthenticationAsync", apiparam)
            .subscribe(
              datarole => {

                this.updateroles(datarole, "99999", "Admin");
                this.Savemenu();
                // this.utilityService.navigate('/apps/requisitions');
                console.log("select login", datares);
              });
        },
        err => {
          console.log(err);
        },
        () => {

        }
      );
  }
  public processAADLoginResponse(response: any, rememberMe: boolean) {
    let response_token = response;

    let accessToken = response_token.access_token;

    if (accessToken == null)
      throw new Error("Received accessToken was empty");

    let idToken: string = response_token.id_token;
    let refreshToken: string = response_token.refresh_token;
    let expiresIn: number = response_token.expires_in;

    let tokenExpiryDate = new Date();
    tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);

    let accessTokenExpiry = tokenExpiryDate;

    let jwtHelper = new JwtHelper();
    let decodedIdToken = jwtHelper.decodeToken(response_token.id_token);
    let permissions: PermissionValues[] = Array.isArray(decodedIdToken.permission) ? decodedIdToken.permission : [decodedIdToken.permission];

    if (!this.isLoggedIn)
      this.configurations.import(decodedIdToken.configuration);

    let user = new User(
      decodedIdToken.sub,
      decodedIdToken.given_name,
      "Metal",
      decodedIdToken.email ? decodedIdToken.email : decodedIdToken.unique_name,
      "Metal",
      "",
      response_token.roles, this.currentUser ? this.currentUser.activerole : "", "", this.currentUser ? this.currentUser.activerolename : "", decodedIdToken.family_name, decodedIdToken.name);
    user.isEnabled = true;
    // response_token.roles
    this.saveUserDetails(user, permissions, accessToken, idToken, refreshToken, accessTokenExpiry, rememberMe);
    //this.Savemenu();
    this.reevaluateLoginStatus(user);
    return user;
  }

  refreshMetaltoken() {
    return this.endpointFactory.getRefreshLoginEndpoint()
      .map((response: Response) =>

        this.processLoginResponse(response, false)
      );
  }
  Iscallnewtoken: boolean = false;
  getnewtoken() {

    var urltoken = "api/service/refreshaccesstoken";

    //let options = new RequestOptions();


    // options.headers.Authorization = 'Bearer ' + this.refreshToken;
    // headers.append('Authorization', 'Bearer' + this.refreshToken);
    if (!this.Iscallnewtoken) {

      this.Iscallnewtoken = true;
      var data: any = { "token": this.refreshToken }
      this._appService.post(urltoken, JSON.stringify(data))
        .subscribe(
          (rsp: any) => {
            this.Iscallnewtoken = false;
            if (rsp) {
              let accessToken = rsp.accesstoken;
              if (accessToken == null) {

                this.Utility.navigateToSignIn();
              } else {


                this.updatetoken(rsp);

              }
            } else {
              this.Utility.navigateToSignIn();
            }





          },
          err => {
            this.Iscallnewtoken = false;
            console.log(err);
          },
          () => {
            //console.log("done")
          });
    }
  }
  public updatetoken(token: any) {
    this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
    this.localStorage.saveSyncedSessionData(token.accesstoken, DBkeys.ACCESS_TOKEN);

    let expiresIn: number = token.expiresin;

    let tokenExpiryDate = new Date();
    tokenExpiryDate.setSeconds(tokenExpiryDate.getSeconds() + expiresIn);


    this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
    this.localStorage.saveSyncedSessionData(tokenExpiryDate, DBkeys.TOKEN_EXPIRES_IN);

    this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
    this.localStorage.saveSyncedSessionData(token.refreshtoken, DBkeys.REFRESH_TOKEN);


    return true;
  }
  public updateroles(roles: any, activerole: string, rolename: string) {
    let user = this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
    if (roles) {
      user.roles = roles;
      user.devicename = roles[0].devicename ? roles[0].devicename : "";
      user.linenumber = roles[0].linenumber ? roles[0].linenumber : "";
      user.c2curl = roles[0].c2cwebdialerurl ? roles[0].c2cwebdialerurl : "";
      user.w3access = roles[0].w3access ? roles[0].w3access : "No";
      user.descriptionverify = roles[0].descriptionverify == "true" ? true : false;
      user.aidrivenuser = roles[0].aidrivenadmin == "true" ? true : false;
      user.allowrequisitioncreation = roles[0].allowrequisitioncreation == "true" ? true : false;


    }
    user.activerolename = rolename;
    user.activerole = activerole;
    this.localStorage.deleteData(DBkeys.CURRENT_USER);
    // this.localStorage.saveSyncedSessionData(user, DBkeys.CURRENT_USER);
    this.localStorage.savePermanentData(user, DBkeys.CURRENT_USER);
    // the below line is added for walkme to read from. the above active user role is stringified
    this.localStorage.saveSessionData(activerole, DBkeys.SELECTED_ROLE);

    let showdice = roles[0].allowdice ? roles[0].allowdice : "false";
    this.localStorage.savePermanentData(showdice, "showdice");

    // let showsovren = roles[0].allowsovren ? roles[0].allowsovren : "false";
    let showsovren = "true";
      this.localStorage.savePermanentData(showsovren, "showsovren");
      this.localStorage.savePermanentData(user.aidrivenuser, "aidrivenuser");

    let showsovrenrequisition = roles[0].allowsovrenrequisition ? roles[0].allowsovrenrequisition : "false";
    // let showsovrenrequisition = "true";
    this.localStorage.savePermanentData(showsovrenrequisition, "showsovrenrequisition");
    //vishnu added //
    this.localStorage.savePermanentData(user.allowrequisitioncreation, "allowrequisitioncreation");
    localStorage.setItem('allowrequisitioncreation', JSON.stringify(user.allowrequisitioncreation));


  }
  public Savemenu(redirecturl: any = null) {
    try {
      let url = "api/application/get";

      let apiparam: any = {};
      apiparam.Id = "menu";
      apiparam.type = "menu";

      this._appService.get(url, apiparam).subscribe((data: any) => {
        if (data) {
          //let Permission = this.localStorage.getDataObject<PermissionValues[]>(DBkeys.USER_PERMISSIONS) || [];
          // let user = this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
          let menu: any = { "Type": data.Type, "Isdefault": data.Isdefault, "Logourl": data.Logourl, "timezone": data.timezone, "dateformat": data.dateformat, "Nav": [] };
          // let menu: any = JSON.parse(JSON.stringify(data));
        
          data['Nav'].forEach(nav => {
        
            if (Array.isArray(nav.roles) && nav.roles.length > 0) {
              if (nav.roles.find(x => x == this.currentUser.activerole)) {
                menu.Nav.push(nav);

              }
            
            }
            else {



              if (nav.Title == "Campaigns") {
                menu.Nav.push(nav);

                for (let i = 0; i < menu.Nav.length; i++) {
                  if (menu.Nav[i].Title == "Campaigns") {
                 
                  if (this.currentUser.roles.find(x => x.allowsense == 'false')) {
                    menu.Nav[i]['showinmenu'] = false;
                  } else {
                    menu.Nav[i]['showinmenu'] = true;
                  }
                  }
                }
              }
              else {
                menu.Nav.push(nav);

              }
            }
          });
          this.localStorage.saveSyncedSessionData(menu, DBkeys.Menu);
          var navigate = ""
          if (!redirecturl) {
            navigate = menu['Nav'][0].Url;
          } else {
            var Page = this.find(menu['Nav'], redirecturl.url);
            if (Page) {
              Page.Params.forEach(_item => {
                ///if (_item.name == 'requisitionid') {
                redirecturl.params.forEach(reparam => {
                  //if (reparam.name == 'requisitionid') {
                  //  _item.value = reparam.value
                  //} else if (reparam.name == 'candidateid') {
                  //  _item.value = reparam.value
                  //}
                  if (reparam.name == _item.name) {
                    _item.value = reparam.value
                  }
                });
                //}
              });

              navigate = Page.Url;
            }
            this.localStorage.saveSyncedSessionData(menu, DBkeys.Menu);

            // add condition for redirect to custom Angualr pages outside cameo along with their query params
              if (Page && redirecturl) {
                  debugger;
                  navigate = redirecturl.url;
                  if (redirecturl.params) {
                    navigate = redirecturl.url;
                      redirecturl.params.forEach(param => {
                       //  navigate = navigate + param.name + "=" + param.value + "&";
                      
                        if (param.name == 'requisitionid') {
                          navigate = navigate + '?requisitionid=' + param.value
                        }

                      });
                  }
            }
            // navigation from external sources like mail link click, Rec Overview Page 
          }
          if (redirecturl && redirecturl.url === 'apps/recoverview') {
            this.router.navigateByUrl(navigate);

          } else {
            this.Utility.navigate(navigate);

          }



        } else {
          let menu: any = { "Type": "Top", "Isdefault": false, "timezone": "", "dateformat": "MM/dd/yyyy hh:mm a", "Nav": [] };
          this.localStorage.saveSyncedSessionData(menu, DBkeys.Menu);
        }

      });
    } catch (e) {

    }


  }
  find(source, url) {
    for (var key in source) {
      var item = source[key];
      if (item.Url == url)
        return item;

      // Item not returned yet. Search its children by recursive call.
      if (item.children) {
        var subresult = this.find(item.children, url);

        // If the item was found in the subchildren, return it.
        if (subresult)
          return subresult;
      }
    }
    // Nothing found yet? return null.
    return null;
  }
  public AddtoBookmark(item: any) {
    var bookmark = this.localStorage.getDataObject<any>(DBkeys.BookMarklist);
    if (bookmark) {
      bookmark.push(item);
    } else {
      var itemlist = [];
      itemlist.push(item);
      bookmark = itemlist;
    }
    this.localStorage.deleteData(DBkeys.BookMarklist);
    this.localStorage.saveSyncedSessionData(bookmark, DBkeys.BookMarklist);
    this.bookmarklist();
  }
  public Addreturnurl(item: any) {

    this.localStorage.saveSyncedSessionData(item, DBkeys.RETURNURL);

  }
  get getReturnurl(): string {

    return this.localStorage.getData(DBkeys.RETURNURL);
  }
  public RemoveBookmark(item: any) {
    //var bookmark = this.localStorage.getDataObject<any>(DBkeys.BookMarklist);
    const idx: number = this.bookmark.indexOf(item);
    // var finditem = this.bookmark.filter(x => x.id == item.id);
    //var index = this.bookmark.indexOf(finditem);
    if (idx !== -1) {
      this.bookmark.splice(idx, 1);
    }
    this.localStorage.deleteData(DBkeys.BookMarklist);
    this.localStorage.saveSyncedSessionData(this.bookmark, DBkeys.BookMarklist);
    this.bookmarklist();
  }
  bookmark: any = [];
  bookmarklist() {

    this.bookmark = this.localStorage.getDataObject<any>(DBkeys.BookMarklist);

    //return bookmarklist;
  }
  public Refreshmenu(Menu: any) {
    this.localStorage.deleteData(DBkeys.Menu);
    this.localStorage.saveSyncedSessionData(Menu, DBkeys.Menu);
  }

  private saveUserDetails(user: User, permissions: PermissionValues[], accessToken: string, idToken: string, refreshToken: string, expiresIn: Date, rememberMe: boolean) {

    if (rememberMe) {
      this.localStorage.savePermanentData(accessToken, DBkeys.ACCESS_TOKEN);
      this.localStorage.savePermanentData(idToken, DBkeys.ID_TOKEN);
      this.localStorage.savePermanentData(refreshToken, DBkeys.REFRESH_TOKEN);
      this.localStorage.savePermanentData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
      this.localStorage.savePermanentData(permissions, DBkeys.USER_PERMISSIONS);
      this.localStorage.savePermanentData(user, DBkeys.CURRENT_USER);
    }
    else {
      this.localStorage.saveSyncedSessionData(accessToken, DBkeys.ACCESS_TOKEN);
      this.localStorage.saveSyncedSessionData(idToken, DBkeys.ID_TOKEN);
      this.localStorage.saveSyncedSessionData(refreshToken, DBkeys.REFRESH_TOKEN);
      this.localStorage.saveSyncedSessionData(expiresIn, DBkeys.TOKEN_EXPIRES_IN);
      this.localStorage.saveSyncedSessionData(permissions, DBkeys.USER_PERMISSIONS);
      this.localStorage.saveSyncedSessionData(user, DBkeys.CURRENT_USER);
      // this.localStorage.savePermanentData(user, DBkeys.CURRENT_USER);
    }

    this.localStorage.savePermanentData(rememberMe, DBkeys.REMEMBER_ME);
  }


  deepcopy<T>(o: T): T {
    return JSON.parse(JSON.stringify(o));
  }
  logout(): void {
    console.log("logout called fro auth");
    this._appService.get('api/account/logout')
      .subscribe(rsp => {
        var role = this.deepcopy(this.currentUser.activerole);
        var user = this.deepcopy(this.currentUser);
        this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
        this.localStorage.deleteData(DBkeys.ID_TOKEN);
        this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
        this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
        this.localStorage.deleteData(DBkeys.USER_PERMISSIONS);
        this.localStorage.deleteData(DBkeys.CURRENT_USER);
        this.localStorage.deleteData(DBkeys.SEARCH_QUERY);
        this.localStorage.deleteData(DBkeys.BookMarklist);
        this.localStorage.deleteData(DBkeys.RETURNURL);
        this.configurations.clearLocalChanges();
        // this.localStorage.clearLocalStorage();
        localStorage.removeItem('allowrequisitioncreation');

        var _dynamicKeys = [];
        for (var item in localStorage) {
          if (item.indexOf("~") > -1) {
            _dynamicKeys.push(item);
          }
        }
        _dynamicKeys.forEach(item => {
          this.localStorage.deleteData(item);
        })
       // this.reevaluateLoginStatus();
        //this.redirectLogoutUser();
        //this.Utility.navigate('/login');
        //Vishnu Added *******************
       // this.onSessionTimeout.next();
       // clearInterval(this.timeoutId);
        //Vishnu Added ********************
        if (role && user.id != "0ca5b67e-821e-4266-96a7-49bf563b7624") {
          var url = window.location.href;
          var arr = url.split("/");
          var result = arr[0] + "//" + arr[2];
          var url = "https://login.microsoftonline.com/common" + "/oauth2/logout?post_logout_redirect_uri=" + result + "/login";
          window.location.href = url;
        } else {
          this.Utility.navigate('/login');
        }
      }
      );

    //this.localStorage.deleteData(DBkeys.Menu);
    //var Menu = { "Type": "Top", "Isdefault": false, "Nav": [] };
    //this.localStorage.saveSyncedSessionData(Menu, DBkeys.Menu);
    //this.localStorage.deleteData(DBkeys.Menu);

  }


  private reevaluateLoginStatus(currentUser?: User) {

    let user = currentUser || this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
    let isLoggedIn = user != null;

    if (this.previousIsLoggedInCheck != isLoggedIn) {
      setTimeout(() => {
        this._loginStatus.next(isLoggedIn);
      });
    }

    this.previousIsLoggedInCheck = isLoggedIn;
  }


  getLoginStatusEvent(): Observable<boolean> {
    return this._loginStatus.asObservable();
  }

  updateGroup(group) {
    let user = this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
    user.ActiveGroup = group;
    this.localStorage.saveSyncedSessionData(user, DBkeys.CURRENT_USER);
  }
  get Menu(): any {
    let Menudetail = this.localStorage.getDataObject(DBkeys.Menu);
    return Menudetail;
  }
  get currentUser(): User {

    let user = this.localStorage.getDataObject<User>(DBkeys.CURRENT_USER);
   // this.reevaluateLoginStatus(user);

    return user;
  }

  get userPermissions(): PermissionValues[] {

    return this.localStorage.getDataObject<PermissionValues[]>(DBkeys.USER_PERMISSIONS) || [];
  }

  get accessToken(): string {

   // this.reevaluateLoginStatus();
    return this.localStorage.getData(DBkeys.ACCESS_TOKEN);
  }

  get accessTokenExpiryDate(): Date {

    // this.reevaluateLoginStatus();
    return this.localStorage.getDataObject<Date>(DBkeys.TOKEN_EXPIRES_IN, true);
  }

  get isSessionExpired(): boolean {

    if (this.accessTokenExpiryDate == null) {
      return true;
    }
    var t = new Date();
    t.setSeconds(t.getSeconds() + 500);
    if ((this.accessTokenExpiryDate.valueOf() <= new Date(t).valueOf())) {
      //var tn = new Date();
      //tn.setSeconds(tn.getSeconds() + 5);
      //if ((this.accessTokenExpiryDate.valueOf() <= new Date(tn).valueOf())) {
      //  this.Utility.navigateToSignIn();
      //  this.getnewtoken();
      //  return false;
      //} else
      //{
      //  this.getnewtoken();

      //  return false;
      //}
      this.getnewtoken();

    } else {


      return !(this.accessTokenExpiryDate.valueOf() > new Date(t).valueOf());
    }
  }


  get idToken(): string {

    this.reevaluateLoginStatus();
    return this.localStorage.getData(DBkeys.ID_TOKEN);
  }

  get refreshToken(): string {

    this.reevaluateLoginStatus();
    return this.localStorage.getData(DBkeys.REFRESH_TOKEN);
  }

  get isLoggedIn(): boolean {
    return this.currentUser != null;
  }

  get rememberMe(): boolean {
    return this.localStorage.getDataObject<boolean>(DBkeys.REMEMBER_ME) == true;
  }

  private startSessionTimer(): void {
    localStorage.setItem('sessionTimestamp', Date.now().toString());
   // alert("session started");

    this.timeoutId = setInterval(() => {
      this.idleTime += 1000;
      if (this.idleTime >= this.timeoutDuration) {
        this.sessionLogout();
        console.log("session logout activity");

      }
    }, 1000);
  }

  private resetIdleTimer(): void {
    this.idleTime = 0;
  }

  private listenForUserActivity(): void {
    // Reset the idle timer on mouse move, keypress, or mouse click
    window.addEventListener('mousemove', () => this.resetIdleTimer());
    window.addEventListener('keypress', () => this.resetIdleTimer());
    window.addEventListener('click', () => this.resetIdleTimer());
  }

  sessionLogout(): void {

    this._appService.get('api/account/logout')
      .subscribe(rsp => {
        var role = this.deepcopy(this.currentUser.activerole);
        var user = this.deepcopy(this.currentUser);
        this.localStorage.deleteData(DBkeys.ACCESS_TOKEN);
        this.localStorage.deleteData(DBkeys.ID_TOKEN);
        this.localStorage.deleteData(DBkeys.REFRESH_TOKEN);
        this.localStorage.deleteData(DBkeys.TOKEN_EXPIRES_IN);
        this.localStorage.deleteData(DBkeys.USER_PERMISSIONS);
        this.localStorage.deleteData(DBkeys.CURRENT_USER);
        this.localStorage.deleteData(DBkeys.BookMarklist);
        this.localStorage.deleteData(DBkeys.RETURNURL);
        this.configurations.clearLocalChanges();
        // this.localStorage.clearLocalStorage();
        var _dynamicKeys = [];
        for (var item in localStorage) {
          if (item.indexOf("~") > -1) {
            _dynamicKeys.push(item);
          }
        }
        _dynamicKeys.forEach(item => {
          this.localStorage.deleteData(item);
        })
        //this.reevaluateLoginStatus();
        //this.redirectLogoutUser();
        //this.Utility.navigate('/login');
        //Vishnu Added *******************
        this.onSessionTimeout.next();
        clearInterval(this.timeoutId);
        localStorage.removeItem('sessionTimestamp');

        //Vishnu Added ********************
        this.Utility.navigate('/login');

    
      }
      );

  

  }

  listenChangesacrossAllTabs() {
    // Listen for changes in localStorage across tabs
    console.log("all Tab called");
    window.addEventListener('storage', (event) => {
      if (event.key === 'sessionTimestamp') {
        // Check if the session is expired or still valid

        if (!this.checkSession()) {
          // If expired, force logout

        }
      }
    });
  }

  checkSession(): boolean {
    const timestamp = localStorage.getItem('sessionTimestamp');
    if (timestamp) {
      const currentTime = Date.now();
      const sessionStart = parseInt(timestamp, 10);
      if (currentTime - sessionStart > this.timeoutDuration) {

        this.sessionLogout();  // If session is expired
        return false;
      }
    }
    return true;
  }

  private addEventListeners() {
    window.addEventListener('mousemove', this.resetInactivityTimer.bind(this));
    window.addEventListener('keydown', this.resetInactivityTimer.bind(this));
  }

  private resetInactivityTimer() {
    this.lastActivity = Date.now();
    this.syncActivityAcrossTabs();
  }

  private startInactivityTimer() {
    this.inactivityTimer = setInterval(() => {
      if (Date.now() - this.lastActivity >= this.timeoutDuration) {
        this.expireSession();
      }
    }, 1000); // Check every second
  }

  private expireSession() {
    // Set session expired flag
    this.sessionExpiredSource.next(true);
    // Optionally, you can clear session storage or perform other actions
    sessionStorage.removeItem('userSession');
  }

  private syncActivityAcrossTabs() {
    localStorage.setItem('lastActivity', Date.now().toString());
  }

  private syncSessionAcrossTabs() {
    window.addEventListener('storage', (event) => {
      if (event.key === 'lastActivity') {
        const activityTime = Number(localStorage.getItem('lastActivity'));
        if (activityTime && Date.now() - activityTime >= this.timeoutDuration) {
          this.expireSession();
        }
      }
    });
  }

}
