
// CREDIT:
//  The vast majority of this code came right from Ben Nadel's post:
//  http://www.bennadel.com/blog/3047-creating-specialized-http-clients-in-angular-2-beta-8.htm
// Typescript version written by Sam Storie
// https://blog.sstorie.com/adapting-ben-nadels-apigateway-to-pure-typescript/
// My updates are mostly adapting it for Typescript:
//  1. Importing required modules
//  2. Adding type notations
//  3. Using the 'fat-arrow' syntax to properly scope in-line functions

import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { LocalStoreManager } from './../authservice/local-store-manager.service';
import { UtilityService } from './utility.service';
import { DataServiceOptions } from './data-service-options';

// Observable class extensions
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/finally';
// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { publishReplay, map, tap, refCount } from 'rxjs/operators';
import { DBkeys } from '../authservice/db-Keys';

@Injectable()
export class DataService {

  // Define the internal Subject we'll use to push the command count
  public pendingCommandsSubject = new Subject<number>();
  public pendingCommandCount = 0;
  public Datajson: any[];
  // Provide the *public* Observable that clients can subscribe to
  public pendingCommands$: Observable<number>;

  constructor(public http: Http, public us: UtilityService, private localStorage: LocalStoreManager) {
    this.pendingCommands$ = this.pendingCommandsSubject.asObservable();
  }

  // I perform a GET request to the API, appending the given params
  // as URL search parameters. Returns a stream.
  public get(url: string, params?: any, enableCache: any = false): Observable<Response> {

    if (url.toLowerCase() == 'api/appdata/get' && params && Object.keys(params).length == 1 && params['id']) {
      if (enableCache == "none")
        enableCache = false;
      else
        enableCache = true;
    }

    if (url.indexOf('http') > -1) {
      return this.getExt(url, params, enableCache);
    } else {
      const options = new DataServiceOptions();
      //options.method = RequestMethod.Get;
      options.url = url;
      options.params = params;
      return this.request(options, enableCache);
    }
  }

  // I perform a POST request to the API. If both the params and data
  // are present, the params will be appended as URL search parameters
  // and the data will be serialized as a JSON payload. If only the
  // data is present, it will be serialized as a JSON payload. Returns
  // a stream.
  public post(url: string, data?: any, params?: any): Observable<Response> {
    if (url.indexOf('http') > -1) {
      return this.postExt(url, data, params);

    } else {
      if (!data) {
        data = params;
        params = {};
      }
      const options = new DataServiceOptions();
      options.method = RequestMethod.Post;
      options.url = url;
      options.params = params;
      options.data = data;
      return this.request(options);
    }
  }

  // I perform a GET request to the external API, appending the given params
  // as URL search parameters. Returns a stream.
  public getExt(url: string, params?: any, enableCache: boolean = false): Observable<Response> {
    params.url = url;
    var apiparam: any = {};
    apiparam.param = JSON.stringify(params);
    return this.get("api/service/get", apiparam, enableCache);
  }

  // I perform a external POST request to the API. If both the params and data
  // are present, the params will be appended as URL search parameters
  // and the data will be serialized as a JSON payload. If only the
  // data is present, it will be serialized as a JSON payload. Returns
  // a stream.
  public postExt(url: string, data?: any, params?: any): Observable<Response> {
    params.url = url;
    var apiparam: any = {};
    apiparam.param = JSON.stringify(params);
    return this.post("api/service/post", data, apiparam);
  }

  public put(url: string, data?: any, params?: any): Observable<Response> {
    if (!data) {
      data = params;
      params = {};
    }
    const options = new DataServiceOptions();
    options.method = RequestMethod.Put;
    options.url = url;
    options.params = params;
    options.data = data;
    return this.request(options);
  }

  public delete(url: string): Observable<Response> {
    const options = new DataServiceOptions();
    options.method = RequestMethod.Delete;
    options.url = url;
    return this.request(options);
  }
  stream: any = {};
  private request(options: DataServiceOptions, enableCache: boolean = false): Observable<any> {
    if (!options.method && enableCache) {
      options.method = (options.method || RequestMethod.Get);
      options.url = (options.url || '');
      options.headers = (options.headers || {});
      options.params = (options.params || {});
      options.data = (options.data || {});

      //this.interpolateUrl(options);
      this.addXsrfToken(options);
      this.addContentType(options);
      this.addAuthToken(options);
      this.addCors(options);
      const requestOptions = new RequestOptions();
      requestOptions.method = options.method;
      requestOptions.url = options.url;
      requestOptions.headers = options.headers;
      requestOptions.search = this.buildUrlSearchParams(options.params);
      requestOptions.body = JSON.stringify(options.data);

      this.pendingCommandsSubject.next(++this.pendingCommandCount);
      const esc = encodeURIComponent;
      var QueryStr = Object.keys(options.params)
        .map(k => esc(k) + '=' + esc(options.params[k]))
        .join('&');

      if (!this.stream[options.url + '?' + QueryStr]) {
        this.stream[options.url + '?' + QueryStr] = this.http.request(options.url, requestOptions).pipe(
          map(this.unwrapHttpValue),
         // tap(data => console.log('fetched data')),
          publishReplay(1),
          refCount(),
        )
          .catch((error: any) => {
            this.handleErrors(error);
            return Observable.throw(error);
          })
          .catch((error: any) => {
            return Observable.throw(this.unwrapHttpError(error));
          })
          .finally(() => {
            this.pendingCommandsSubject.next(--this.pendingCommandCount);
          });
      }
      return this.stream[options.url + '?' + QueryStr];
    } else {
      options.method = (options.method || RequestMethod.Get);
      options.url = (options.url || '');
      options.headers = (options.headers || {});
      options.params = (options.params || {});
      options.data = (options.data || {});

      //this.interpolateUrl(options);
      this.addXsrfToken(options);
      this.addContentType(options);
      this.addAuthToken(options);
      this.addCors(options);
      const requestOptions = new RequestOptions();
      requestOptions.method = options.method;
      requestOptions.url = options.url;
      requestOptions.headers = options.headers;
      requestOptions.search = this.buildUrlSearchParams(options.params);
      requestOptions.body = JSON.stringify(options.data);

      this.pendingCommandsSubject.next(++this.pendingCommandCount);

      const stream = this.http.request(options.url, requestOptions)
        .catch((error: any) => {
          this.handleErrors(error);
          return Observable.throw(error);
        })
        .map(this.unwrapHttpValue)
        .catch((error: any) => {
          return Observable.throw(this.unwrapHttpError(error));
        })
        .finally(() => {
          this.pendingCommandsSubject.next(--this.pendingCommandCount);
        });

      return stream;
    }
  }

  public addContentType(options: DataServiceOptions): DataServiceOptions {
    // if (options.method !== RequestMethod.Get) {
    options.headers['Content-Type'] = 'application/json; charset=UTF-8';
    // }
    return options;
  }

  public addAuthToken(options: DataServiceOptions): DataServiceOptions {

    const authTokens = this.localStorage.getData('access_token');
    if (authTokens) {
      // tslint:disable-next-line:whitespace
      options.headers.Authorization = 'Bearer ' + authTokens;
    }
    return options;
  }

  private extractValue(collection: any, key: string): any {
    const value = collection[key];
    delete (collection[key]);
    return value;
  }

  public addXsrfToken(options: DataServiceOptions): DataServiceOptions {
    const xsrfToken = this.getXsrfCookie();
    if (xsrfToken) {
      options.headers['X-XSRF-TOKEN'] = xsrfToken;
    }
    return options;
  }

  private getXsrfCookie(): string {
    const matches = document.cookie.match(/\bXSRF-TOKEN=([^\s;]+)/);
    try {
      return matches ? decodeURIComponent(matches[1]) : '';
    } catch (decodeError) {
      return '';
    }
  }

  public addCors(options: DataServiceOptions): DataServiceOptions {
    options.headers['Access-Control-Allow-Origin'] = '*.ascendion.com';
    return options;
  }

  public buildUrlSearchParams(params: any): URLSearchParams {
    const searchParams = new URLSearchParams();
    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        searchParams.append(key, params[key]);
      }
    }
    return searchParams;
  }

  //private interpolateUrl(options: DataServiceOptions): DataServiceOptions {
  //    options.url = options.url.replace(/:([a-zA-Z]+[\w-]*)/g, ($0, token) => {
  //        // Try to move matching token from the params collection.
  //        if (options.params.hasOwnProperty(token)) {
  //            return (this.extractValue(options.params, token));
  //        }
  //        // Try to move matching token from the data collection.
  //        if (options.data.hasOwnProperty(token)) {
  //            return (this.extractValue(options.data, token));
  //        }
  //        // If a matching value couldn't be found, just replace
  //        // the token with the empty string.
  //        return ('');
  //    });
  //    // Clean up any repeating slashes.
  //    options.url = options.url.replace(/\/{2,}/g, '/');
  //    // Clean up any trailing slashes.
  //    options.url = options.url.replace(/\/+$/g, '');

  //    return options;
  //}

  private unwrapHttpError(error: any): any {
    try {
      return (error.json());
    } catch (jsonError) {
      return ({
        code: -1,
        message: 'An unexpected error occurred.'
      });
    }
  }
  private unwrapHttpValue(value: Response): any {

    var _return = "";
    try {
      _return = value.json();
    }
    catch (Error) {
      _return = JSON.parse(JSON.stringify(value || null));
    }
    return _return;
  }
 private handleErrors(error: any) {
    if (error.status === 401) {
      // sessionStorage.clear();
      this.getnewtoken();
       //this.us.navigateToSignIn();
    } else if (error.status === 403) {
      // Forbidden
      //this.us.navigateToSignIn();
    }
  }
  get refreshToken(): string {

   
    return this.localStorage.getData(DBkeys.REFRESH_TOKEN);
  }
  Iscallnewtoken: boolean = false;
  getnewtoken() {

    var urltoken = "api/service/refreshaccesstoken";

    //let options = new RequestOptions();


    // options.headers.Authorization = 'Bearer ' + this.refreshToken;
    // headers.append('Authorization', 'Bearer' + this.refreshToken);
    if (!this.Iscallnewtoken) {

      this.Iscallnewtoken = true;
      var data = { "token": this.refreshToken }
      this.post(urltoken, JSON.stringify(data))
        .subscribe(
        rsp => {
          debugger;



          this.Iscallnewtoken = false;
          var responce = rsp;
          if (responce) {
            let accessToken = responce['accesstoken'];
            if (accessToken == null) {

              this.us.navigateToSignIn();
            } else {


              this.updatetoken(rsp);

            }
          } else {
            this.us.navigateToSignIn();
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

    public postPageTracker(url: string, data?: any, params?: any): Observable<Response> {
        let options = new DataServiceOptions();
        options.method = RequestMethod.Post;
        options.url = url || '';
        if (params) {
            options.params = params;
        }

     
        options = this.addXsrfToken(options);
        options = this.addContentType(options);
        options = this.addAuthToken(options);
        options = this.addCors(options);

       return this.http.post(url, data, options)
    }

    public getHttpHeaders(): any {
        let options = new DataServiceOptions();
        options = this.addXsrfToken(options);
        options = this.addContentType(options);
        options = this.addAuthToken(options);
        options = this.addCors(options);

        return options.headers;
    }

}
