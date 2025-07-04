import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';
import { DataService } from '../core/services/data.service';
import { AuthService } from '../core/authservice/auth.service';
import { UtilityService } from '../core/services/utility.service';
import { Subscription } from 'rxjs/Subscription';
import { LocalStoreManager } from '../core/authservice/local-store-manager.service';

@Component({
  selector: 'app-auth-callback',
  templateUrl: './auth-callback.component.html',
  styleUrls: ['./auth-callback.component.scss']
})
export class AuthCallbackComponent implements OnInit {

  constructor(public route: ActivatedRoute, private auth: AuthService, private data: DataService, public utilityService: UtilityService, private _http: Http, private localStorage: LocalStoreManager) { }
  id: string = "";
  token: any;
  tokendetail: any;
  message: string = "";
  busy: Subscription;
  ngOnInit() {
    var navigate = "";

    //if (this.route.children.length > 0) {
    //  this.route.children[this.route.children.length - 1].params.subscribe(params => {
    //    navigate = params["id"];
    //  });
    //  alert(navigate);
    //}
    var url = window.location.href;
    //if (url.indexOf('returnurl') > 0) {
    //  var returnurl = this.getParameterByName('returnurl', url);
    //  var urlarray = returnurl.split('/');
    //  var param = urlarray[urlarray.length - 1]
    //  alert(param);
    //  returnurl = returnurl.replace('/' + param, '');
    //  alert(returnurl);
    //}
    if (url.indexOf('code') > 0) {

      this.token = this.parseUrlFragment(url, '#');

      this.getToken(this.token);

    } else {

      this.message = "Authentication failed try again";
    }

    if (this.id) {
      // window.opener.location.href = "../onboard/socialchannels/" + this.id;
    }
    setTimeout(function () {

      // window.opener.location.reload();

      //  window.close();
    }, 2000);

    var _dynamicKeys = [];
    for (var item in localStorage) {
      if (item.indexOf("~") > -1) {
        _dynamicKeys.push(item);
      }
    }
    _dynamicKeys.forEach(item => {
      this.localStorage.deleteData(item);
    })
  }
  getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
      results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  }
  getToken(code: any) {
    var _othis = this;
    var _navUrl = this.getNavigateurl();
    var currentUser = this.auth.currentUser;
    var url = window.location.href;
    var arr = url.split("/");
    var result = arr[0] + "//" + arr[2];
    let _urlParams: any = {};
    _urlParams.code = code.code
    _urlParams.url = result + "/auth-callback";
    var urltoken = "api/service/gettoken?code=" + code.code + "&url=" + result + (_navUrl ? "/auth-callback/" + _navUrl : "/auth-callback");
    if (_navUrl)
      _navUrl = _navUrl.split('|').join('/');
    // this._http.get(u)
    //this.data.get("api/service/gettoken", _urlParams)
    //this.busy = this._http.get(u) //this.data.get("api/service/gettoken", _urlParams)
    this.busy = this._http.get(urltoken)
      .map((res: any) => res.json())
      .subscribe(
      rsp => {
        _othis.tokendetail = rsp;
        debugger;
        if (_othis.tokendetail.azuretoken) {
          var token = _othis.tokendetail.azuretoken;
          token['roles'] = [];
          let accessToken = token.access_token;
          if (accessToken == null) {
            this.message = "Authentication failed try again";
            setTimeout(function () {
              _othis.utilityService.navigateToSignIn();
            }, 2000);
          } else {
            var url = window.location.href;
            if (_navUrl) {
              //var returnurl = this.getParameterByName('returnurl', url);
              var urlarray = _navUrl.split('/');
              if (urlarray[urlarray.length - 1] === 'ATS') {
                this.fetchCandidateId(urlarray[urlarray.length - 2]).subscribe((data: any) => {
                  var param = data && data.candidateid ? data.candidateid : urlarray[urlarray.length - 2]

                  _navUrl = _navUrl.replace('/' + urlarray[urlarray.length - 2] + '/ATS', '');
                  var pageitem: any = {}
                  pageitem.url = _navUrl;
                  if (_navUrl.indexOf("recoverview") > -1) {
                    pageitem.params = [{ "name": "requisitionid", "value": param }];
                  } else if (_navUrl.indexOf("candidateprofile") > -1) {
                    pageitem.params = [{ "name": "candidateid", "value": param }];
                  } else if (_navUrl.indexOf("projectoverview") > -1) {
                    pageitem.params = [{ "name": "projectid", "value": param }];
                  }
                  _othis.auth.Addreturnurl(pageitem);

                  _othis.auth.processAADLoginResponse(token, false);
                  //if (currentUser && currentUser.activerole && currentUser.activerolename) {
                  //  this.Selectedrole(this.auth.currentUser.activerole, currentUser.activerolename);
                  //} else {
                  //  _othis.utilityService.navigate('/selectrole');
                  //}
                  _othis.utilityService.navigate('/selectrole');
                })
              } else {
                var param = urlarray[urlarray.length - 1]

                _navUrl = _navUrl.replace('/' + param, '');
                var pageitem: any = {}
                pageitem.url = _navUrl;
                if (_navUrl.indexOf("recoverview") > -1) {
                  pageitem.params = [{ "name": "requisitionid", "value": param }];
                } else if (_navUrl.indexOf("candidateprofile") > -1) {
                  pageitem.params = [{ "name": "candidateid", "value": param }];
                } else if (_navUrl.indexOf("projectoverview") > -1) {
                  pageitem.params = [{ "name": "projectid", "value": param }];
                }
                _othis.auth.Addreturnurl(pageitem);

                _othis.auth.processAADLoginResponse(token, false);
                //if (currentUser && currentUser.activerole && currentUser.activerolename) {
                //  this.Selectedrole(currentUser.activerole, currentUser.activerolename);
                //} else {
                //  _othis.utilityService.navigate('/selectrole');
                //}
                _othis.utilityService.navigate('/selectrole');

              }
            } else {
              _othis.auth.Addreturnurl(null);
              _othis.auth.processAADLoginResponse(token, false);
              //if (currentUser && currentUser.activerole && currentUser.activerolename) {
              //  this.Selectedrole(currentUser.activerole, currentUser.activerolename);
              //} else {
              //  _othis.utilityService.navigate('/selectrole');
              //}
              _othis.utilityService.navigate('/selectrole');
            }
          }
        } else {
          _othis.message = "Authentication failed try again";
          setTimeout(function () {

            _othis.utilityService.navigateToSignIn();
          }, 2000);

        }


        //window.location.href = "../home";
        //window.opener.location.href = "../home";
        //setTimeout(function () {

        //  window.opener.location.reload();

        //   window.close();
        //}, 2000);
      });
    //return this.data.get("api/service/gettoken", _urlParams)
    //  .map(response => <OpenIdToken>response.json())
  }
  Selectedrole(srole, rolename) {
    var data = { "token": this.auth.idToken, "granttype": "exchange", "role": srole }

    this.busy = this.data.post("api/service/getaccesstoken", JSON.stringify(data))
      .subscribe(
      (datares: any) => {
        this.auth.updatetoken(datares);
        let apiparam: any = {};
        apiparam.response = "roles";
        //apiparam.accesstoken = data.accesstoken;
        this.busy = this.data.get("http://clienturl/api/Auth/GetRolesAfterAuthenticationAsync", apiparam)
          .subscribe(
          (datarole: any) => {

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
  fetchCandidateId(candidateid) {
    let apiparam: any = {};
    apiparam.mappingid = candidateid;
    return this.data.get("http://baseurl/api/Candidate/GetCandidateIdByMappingIdAsync", apiparam)
  }
  getNavigateurl() {
    var value = null;
    if (this.route && this.route.firstChild && this.route.firstChild.params) {
      this.route.firstChild.params.subscribe(params => {
        value = params['id'];
      });
    }
    if (value)
      return value;
    else
      return null;
  }

  static addQueryParam(url, name, value) {
    if (url.indexOf('?') < 0) {
      url += "?";
    }

    if (url[url.length - 1] !== "?") {
      url += "&";
    }

    url += encodeURIComponent(name);
    url += "=";
    url += encodeURIComponent(value);

    return url;
  }

  parseUrlFragment(value, delimiter = "#") {
    if (typeof value !== 'string') {
      //value = global.location.href;
    }

    var idx = value.lastIndexOf(delimiter);
    if (idx >= 0) {
      value = value.substr(idx + 1);
    }

    var params: any = {},
      regex = /([^&=]+)=([^&]*)/g,
      m;

    var counter = 0;
    while (m = regex.exec(value)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
      if (counter++ > 50) {

        return {
          error: "Response exceeded expected number of parameters"
        };
      }
    }

    for (var prop in params) {
      return params;
    }

    return {};
  }

}
