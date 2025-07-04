import { Injectable } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { DataServiceOptions } from '../../core/services/data-service-options';
import { baseurl } from '../../../environment';
import { authapiurl } from '../../../environment';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';


@Injectable()
export class DashboardService {

  public httpOptions: any = {};

  constructor(public http: Http, public dataservice: DataService) {
    this.httpOptions.headers = this.dataservice.getHttpHeaders();
  }
  public apiurl = baseurl;
  public secureapiurl = authapiurl;

  gettopfiveForecast(): Observable<any> {
    let url = this.apiurl + "api/Dashboard/GetTopSkillAsync";
    let searchParams = new URLSearchParams();
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }
  gettopfivejobtitles(): Observable<any> {
    let url = this.apiurl + "api/Dashboard/GetTopTitleAsync";
    let searchParams = new URLSearchParams();
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }
  gettopfiveClientst(): Observable<any> {
    let url = this.apiurl + "api/Dashboard/GetTopClientAsync";
    let searchParams = new URLSearchParams();
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }
  gettopfiveLocations(): Observable<any> {
    let url = this.apiurl + "api/Dashboard/GetTopLocationAsync";
    let searchParams = new URLSearchParams();
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }
  getMyRequisitions(): Observable<any> {
    let url = this.apiurl + "api/Requisition/GetRequisitionListByRecruiterIdAsync";
    let searchParams = new URLSearchParams();
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }
  getmyLinkedInhats(): Observable<any> {
    let url = this.apiurl + "api/Dashboard/GetTopLinkedinInMailAsync";
    let searchParams = new URLSearchParams();
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }
  setHttpOptions(method, url, params?, data?) {
    let options = new DataServiceOptions();
    options.method = method || RequestMethod.Get;
    options.url = url || '';
    if (params) {
      options.params = params;
    }

    if (data) {
      options.data = data;
    }


    options = this.dataservice.addXsrfToken(options);
    options = this.dataservice.addContentType(options);
    options = this.dataservice.addAuthToken(options);
    options = this.dataservice.addCors(options);

    // call set baseurlparams if needed
    //remove options.url
    delete options.url;

    return options;
  }

 
}
