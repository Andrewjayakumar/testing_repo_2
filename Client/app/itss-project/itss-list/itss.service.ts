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
export class ItssService {


  constructor(public http: Http, public dataservice: DataService) { }
  public apiurl = baseurl;
  public secureapiurl = authapiurl;

  getAlltheItssProjects(): Observable<any> {

    let url = this.apiurl + "api/MSProject/GetMsProjectsAsync";

    let options = this.setHttpOptions(RequestMethod.Get, url);


    return this.http.get(url, options);
  }

  getSearchResults(apiparam): Observable<any> {
    let url = this.apiurl + "api/MSProject/GetMsProjectsAsync";
    let params = {
      "projSearch": apiparam

    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;

    return this.http.get(url, options);
  }

  getProjectTypes(): Observable<any> {
    let url = this.apiurl + "api/Master/GetMSProjectTypesAsync";
    let options = this.setHttpOptions(RequestMethod.Get, url);
    return this.http.get(url, options);
  }
  // export to excel

  // for export to Excel Button click

  exporttoexcelResults(params): Observable<any> {

    let url = this.apiurl + "api/MSProject/ExportMSProjectSearchAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    //  return this.http.post(url, params, options);

    return this.http.post(url, params, options).pipe(

    );

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

  trackActivityPageOpened(data) {
    // data should be in the format - { "pagename": "CandidateAdvancedSearch" }
    return this.dataservice.postPageTracker(this.apiurl + "api/UserActivityLog/PageTrackerAsync", data);
  }
}
