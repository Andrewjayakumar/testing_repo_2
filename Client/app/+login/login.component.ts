import { Component, OnInit } from '@angular/core';
//import { Router, ActivatedRoute } from '@angular/router';
//import { LoginModel } from '../core/models/login-model';
//import { AccountService } from '../core/account/account.service';
import { AuthService } from "../core/authservice/auth.service";
//import { UtilityService } from '../core/services/utility.service';
import { Http} from '@angular/http';
import { Subscription } from 'rxjs';
import { LocalStoreManager } from '../core/authservice/local-store-manager.service';

@Component({
  selector: 'appc-login',
  styleUrls: ['./login.component.scss'],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  // public loginModel: LoginModel;
  public errors: string[] = [];
  public controls: any;
  public Showinvalidmsg: boolean = false;
  busy: Subscription;
  public SignUpMsg: string = "";
  public ResetMsg: string = "";
  public invalidlogin: string = "";

  constructor(
    //public accountService: AccountService,
    //public router: Router,
    //public utilityService: UtilityService,
    //public route: ActivatedRoute,
    public auth: AuthService,
    public http: Http, private localStorage: LocalStoreManager
  ) {
    //this.loginModel = {
    //  Email: "",
    //  Password: ""
    //};
    this.busy = this.http.get('').subscribe();
  }
  //public login(model: LoginModel): void {
  //  //this.errors = [];
  //  //var navigate = "";
  //  //var pageitem = null;
  //  //if (this.route.children.length > 0) {
  //  //  this.route.children[this.route.children.length - 1].params.subscribe(params => {
  //  //    navigate = params["id"];
  //  //    var urlarray = navigate.split('/');
  //  //    var param = urlarray[urlarray.length - 1]
  //  //    navigate = navigate.replace('/' + param, '');
  //  //    pageitem = {

  //  //      "url": navigate.substring(1),

  //  //      "params": [{ "name": "requisitionid", "value": param }]

  //  //    };
  //  //  });
  //  //}

  //  ////if (model.Email == "metal@collabera.com" && model.Password == "Password@15") {
  //  ////  this.auth.loginstatic(pageitem);
  //  ////} else {
  //  ////  this.invalidlogin = "Sorry! Your login attempt was unsuccessful. Please enter correct email and password.";
  //  ////}
  //  //debugger;
  //  //let header = new Headers();
  //  //header.append("Content-Type", "application/x-www-form-urlencoded");

  //  //let searchParams = new URLSearchParams();
  //  //searchParams.append('username', model.Email ? model.Email : model.Email.trim().toLowerCase());
  //  //searchParams.append('password', model.Password);
  //  //searchParams.append('grant_type', 'password');
  //  //searchParams.append('scope', 'offline_access openid email phone profile roles');
  //  //searchParams.append('resource', window.location.origin);

  //  //let requestBody = searchParams.toString();

  //  //this.busy = this.http.post("/connect/token", requestBody, { headers: header })
  //  //  .subscribe(
  //  //  res => {
  //  //    this.auth.loginstatic(pageitem);
  //  //  },
  //  //  error => {
  //  //    this.invalidlogin = "Sorry! Your login attempt was unsuccessful. Please enter correct email and password.";
  //  //    console.log(error);
  //  //  });
  //};
  public redirect(provider: string): void {
    const url = window.location.protocol + '//' + window.location.host + '/api/manage/ExternalLogin?provider=' + provider;
    var chrome = 100;
    var width = 600;
    var height = 400;
    var left = (screen.width - width) / 2;
    var top = (screen.height - height - chrome) / 2;
    var options = "status=0,toolbar=0,location=1,resizable=1,scrollbars=1,left=" + left + ",top=" + top + ",width=" + width + ",height=" + height;
    window.open(url, "login-popup", options);
  }
  public ngOnInit() {
    //var Menu = { "Type": "Top", "Isdefault": false, "Nav": [] };

    //this.auth.Refreshmenu(Menu);
    //if (this.auth.isLoggedIn) {
    //  //this.utilityService.navigate("apps/requisitions");
    //  this.auth.logout()

    //}
    //var id = null;

    //if (this.route.children.length > 0) {
    //  this.route.children[this.route.children.length - 1].params.subscribe(params => {
    //    id = params["id"];
    //  });
    //  if (id == "Registered") {
    //    this.SignUpMsg = "Congratulations! your sign up was successful. Please login with the credentials you created just now."
    //  }
    //}
    var _dynamicKeys = [];
    for (var item in localStorage) {
      if (item.indexOf("~") > -1) {
        _dynamicKeys.push(item);
      }
    }
    _dynamicKeys.forEach(item => {
      this.localStorage.deleteData(item);
    })
    this.openid();
  }

  public openid() {
    this.auth.ActiveDirlogin();
    //var url = "https://login.microsoftonline.com/d7758e8f-1df3-489f-86b5-a2254f55f9cc/oauth2/authorize?client_id=0bd0630c-47a2-4e82-8862-452852ae4fb2&response_type=id_token+code&redirect_uri=https://metaluat.ascendion.com/auth-callback&response_mode=fragment&scope=openid+profile+offline_access+Mail.Read+Mail.Send&state=12345&nonce=678910";

    //var url = "https://login.microsoftonline.com/9224d6b1-b2af-49d5-b1b2-0127b39e30c8/oauth2/authorize?client_id=17366dcc-9c67-4a7c-b79b-418020c61dd7&response_type=id_token+code&redirect_uri=http://localhost:4200/auth-callback&response_mode=fragment&scope=openid+profile+offline_access+Mail.Read+Mail.Send&state=12345&nonce=678910";
    //window.location.href = url;
    //var chrome = 100;
    //var width = 600;
    //var height = 400;
    //var left = (screen.width - width) / 2;
    //var top = (screen.height - height - chrome) / 2;
    //var options = "status=0,toolbar=0,location=1,resizable=1,scrollbars=1,left=" + left + ",top=" + top + ",width=" + width + ",height=" + height;
    //window.open(url, "login-popup", options);
  }
}
