import { Injectable, TemplateRef } from '@angular/core';
import { Observable } from "rxjs";
import { baseurl } from "../../../environment";
import { DataServiceOptions } from "../../core/services/data-service-options";
import { DataService } from "../../core/services/data.service";
import { authapiurl } from "../../../environment";

import {
  Http,
  Response,
  RequestOptions,
  RequestMethod,
  URLSearchParams,
} from "@angular/http";

@Injectable()
export class TagdashboardService {

  httpOptions = new RequestOptions();
  public apiurl = baseurl;
  public secureapiurl = authapiurl;
  toasts: any[] = [];


  constructor(public http: Http, public dataservice: DataService) {
    this.httpOptions.headers = dataservice.getHttpHeaders();
  }

  setHttpOptions(method, url, params?, data?) {
    let options = new DataServiceOptions();
    options.method = method || RequestMethod.Get;
    options.url = url || "";
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



  // get results on tag dashboard
  getTagDashboardSearchResults(params): Observable<any> {
    let url =
        this.apiurl + "api/Candidate/TAGDashboardSearchAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, params, options).pipe();
  }
    //get results on mypool page
    getMypoolSearch(model): Observable<any> {
        let url =
            this.apiurl + "api/Candidate/MyPoolAsearchAsync";
        let options = this.setHttpOptions(RequestMethod.Post, url);
        return this.http.post(url, model, options).pipe();
      
    }

    //tagdashboard export
    exportTagDashboard(param): Observable<any> {
        let url = this.apiurl + "api/Candidate/ExportTAGDashboardSearchAsync";
        let options = this.setHttpOptions(RequestMethod.Post, url);
        return this.http.post(url, param, options);

       /*
        FromBody
        {
            "closurestartdate": "07/01/2010",
                "closureenddate": "07/03/2022",
                    "tagmember": [],
                        "pageindex": 0,
                            "pagesize": 0
        }
        Response:
        {
            "response": true,
                "responsecode": 200,
                    "message": "Successfully queued your request. A mail with the result set would be delivered shortly."
        } */

    } 


  // my pool export - poolstatus
  exportCandidates(apiparam): Observable<any> {
      let url = this.apiurl + "api/Candidate/ExportCandidatePoolSearchAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, apiparam, options);
  }
    // tag dashboard export
    pageTracker(apiparam): Observable<any> {
      let url = this.apiurl + "api/UserActivityLog/PageTrackerAsync";
      let options = this.setHttpOptions(RequestMethod.Post, url);
      return this.http.post(url, apiparam, options);
    }

    getStates() {
        let url = this.apiurl + "api/Master/GetStateAsync";
        let options = this.setHttpOptions(RequestMethod.Get, url);
        return this.http.get(url, options);
    }
    //ttp://baseurl/api/Master/GetStateAsync%22%7D

    getProactivemembers() {
        let url = this.apiurl + "api/Master/GetProActiveMembersAsync";
        let options = this.setHttpOptions(RequestMethod.Get, url);
        return this.http.get(url, options);
    }
   
}
