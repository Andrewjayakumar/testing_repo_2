import { Component, OnInit } from '@angular/core';
import { DataService } from '../core/services/data.service';
import { AuthService } from "../core/authservice/auth.service";
import { UtilityService } from '../core/services/utility.service';
import { Subscription } from "rxjs/Subscription";
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {
  Roles: any;
  selectedrole: any = "0";
  busy: Subscription;
  constructor(private _appService: DataService, private auth: AuthService, private utilityService: UtilityService) {
    var data = { "token": this.auth.idToken }

      if (!data.token) {
          this.utilityService.navigate('/login');
          return;
      }
    this.busy= this._appService.post("api/service/getrolesbeforeauth", JSON.stringify(data))
      .subscribe(
      (data:any) => {
        this.auth.updateroles(data, "0", "");
             if (data && data.length == 1) {
                  console.log("first role : " + data[0])
                  this.Selectedrole(data[0].roleid, data[0].rolename)
              }
              else {
                  this.Roles = data;
              } 
       // this.Roles = data;
      },
      err => {
        console.log(err);
      },
      () => {

      }
      );
   
  }

  ngOnInit() {
  }
  Selectrole()
  {
    var data:any = { "token": this.auth.idToken, "granttype": "exchange", "role": this.selectedrole }
    this.busy=  this._appService.post("api/service/getaccesstoken", JSON.stringify(data))
      .subscribe(
         datares => {
             // debugger;
              if (JSON.stringify(datares) === "{}") {
                  window.alert("You are not authorised User. Re-login and try again")
                  return;
              }
        this.auth.updatetoken(data.accesstoken);
        let apiparam:any = {};
        apiparam.response = "roles";
        //apiparam.accesstoken = data.accesstoken;
        this.busy =  this._appService.get("http://clienturl/api/Auth/GetRolesAfterAuthenticationAsync", apiparam)
          .subscribe(
          (datarole:any) => {
            this.auth.updateroles(datarole, this.selectedrole, "");
            
            this.auth.Savemenu(this.auth.getReturnurl);
           // this.utilityService.navigate('/apps/requisitions');
          });
      },
      err => {
        console.log(err);
      },
      () => {

      }
      );
  }

  Selectedrole(srole, rolename) {
        let agent = navigator.userAgent;
        let otherInfo = this.getDeviceInfo(agent);
        var data = { "token": this.auth.idToken, "granttype": "exchange", "role": srole, "rolename": rolename, "user-agent": agent, 'browser': otherInfo.browser, 'device': otherInfo.device };


    this.busy = this._appService.post("api/service/getaccesstoken", JSON.stringify(data))
      .subscribe(
          (datares: any) => {
            //  debugger;
              if (JSON.stringify(datares) === "{}") {
                  window.alert("You are not authorised User. Re-login and try again")
                  return;
              }
        this.auth.updatetoken(datares);
        let apiparam:any = {};
        apiparam.response = "roles";
        //apiparam.accesstoken = data.accesstoken;
        this.busy = this._appService.get("http://clienturl/api/Auth/GetRolesAfterAuthenticationAsync", apiparam)
          .subscribe(
          (datarole:any) => {
            this.auth.updateroles(datarole, srole, rolename);
            this.auth.Savemenu(this.auth.getReturnurl);
            // this.utilityService.navigate('/apps/requisitions');
          });
      },
      err => {
        console.log(err);
      },
      () => {

      }
      );
  }
    getDeviceInfo(agent: string) {
        let ua = navigator.userAgent;
        let platform = navigator.platform;

        let dataos = [
            { name: 'Windows Phone', value: 'Windows Phone', version: 'OS' },
            { name: 'Windows', value: 'Win', version: 'NT' },
            { name: 'iPhone', value: 'iPhone', version: 'OS' },
            { name: 'iPad', value: 'iPad', version: 'OS' },
            { name: 'Android', value: 'Android', version: 'Android' },
            { name: 'PlayBook', value: 'PlayBook', version: 'OS' },
            { name: 'Macintosh', value: 'Mac', version: 'OS X' },
            { name: 'Linux', value: 'Linux', version: 'rv' },
            { name: 'Palm', value: 'Palm', version: 'PalmOS' }
        ];

        let browserdata = [
            { name: 'Firefox', value: 'Firefox', version: 'Firefox' },
            { name: 'Internet Explorer', value: 'MSIE', version: 'MSIE' },
            { name: "Microsoft Edge", value: "Edg", version: 'Microsoft Edge' },
            { name: 'Chrome', value: 'Chrome', version: 'Chrome' },
            { name: 'Safari', value: 'Safari', version: 'Version' },
            { name: 'Opera', value: 'Opera', version: 'Opera' }

        ];

        let device = this.matchItem(platform + " " + ua, dataos);
        let browser = this.matchItem(platform + " " + ua, browserdata)

        return { 'device': device, 'browser': browser };
    }
    matchItem(string, data) {
        var i = 0,
            j = 0,
            regex,
            match;


        for (i = 0; i < data.length; i += 1) {
            regex = new RegExp(data[i].value, 'i');
            match = regex.test(string);
            if (match) {
                return data[i].name;
            }
        }
        if (!match) {
            return "unknown";
        }
    }
}
