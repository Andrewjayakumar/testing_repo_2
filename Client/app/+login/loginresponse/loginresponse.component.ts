import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Headers, Http, RequestOptions } from '@angular/http';
@Component({
  selector: 'app-loginresponse',
  templateUrl: './loginresponse.component.html',
  styleUrls: ['./loginresponse.component.scss']
})
export class LoginresponseComponent implements OnInit {
  constructor(public route: ActivatedRoute, private _http: Http) { }
  id: string = "";
  token: any;
  tokendetail: any;
  ngOnInit() {
    var url = window.location.href;
    if (url.indexOf('code') > 0) {
      alert(url);
      var res = this.parseUrlFragment(url, '#');
      alert(JSON.stringify(res));
      this.tokendetail = this.getToken(res);

    }
    this.route.params.subscribe(params => {
      this.id = params['#'];
    });
    if (this.id) {
      // window.opener.location.href = "../onboard/socialchannels/" + this.id;
    }
    setTimeout(function () {

     // window.opener.location.reload();

    //  window.close();
    }, 2000);

  }
  getToken(code: any) {
    let _urlParams = new URLSearchParams();
    _urlParams.append('code', code.code);
    _urlParams.append('grant_type', 'authorization_code');
    _urlParams.append('redirect_uri', 'http://localhost:4200');
    _urlParams.append('client_id', '17366dcc-9c67-4a7c-b79b-418020c61dd7');
    _urlParams.append('client_secret', 'Kg3sN3gAQ1zDMuByKKP7/O4TpposzFwTOhBu9UHcuN8=');
    let _url = "https://login.microsoftonline.com/9224d6b1-b2af-49d5-b1b2-0127b39e30c8/oauth2/token";
    let _options = this.getTokenPostOptions();

    return this._http.post(_url, _urlParams, _options)
      .map(response => <OpenIdToken>response.json())
  }

  private getTokenPostOptions(): RequestOptions {

    let headers = new Headers({ 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' });
    let options = new RequestOptions({ headers: headers });

    return options;
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

    var params = {},
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
export interface OpenIdToken {
  token_type: string;
  expires_in: string;
  ext_expires_in: string;
  expires_on: string;
  access_token: string;
  refresh_token: string;
  id_token: string;
}
