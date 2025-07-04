import { Injectable } from "@angular/core";
import { DataService } from "../../core/services/data.service";
import { Observable } from "rxjs";
import {
  Http,
  Response,
  RequestOptions,
  RequestMethod,
  URLSearchParams,
} from "@angular/http";
import { DataServiceOptions } from "../../core/services/data-service-options";
import { baseurl } from "../../../environment";
import { authapiurl } from "../../../environment";

import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/map";

@Injectable()
export class CampaignsService {
  httpOptions = new RequestOptions();
  public apiurl = baseurl;
  public secureapiurl = authapiurl;

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

  // c1
  // api to get recruiters name
  getRecruiter(clientid, name): Observable<any> {
    let url = this.apiurl + "api/Requisition/GetRecruitersByUserAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("clientid", clientid);
    searchParams.append("name", name);
    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

    // c2
    // get recruiters list
    getRecruitersList(recruiterId): Observable<any> {
      let url = this.apiurl + "api/Sense/GetDMAssignmentDetailsAsync";
      let searchParams = new URLSearchParams();
      searchParams.append("recruiterId", recruiterId);
      let options = new RequestOptions();
      options.headers = this.httpOptions.headers;
      options.params = searchParams;
      return this.http.get(url, options);
    }

  // get Active and Pending Candidates for recruiter selected
  // c3
    getActiveAndPendingCandidates(apiparam): Observable<any> {
      let url = this.apiurl + "api/Sense/FetchSenseCandidateAsync";
      let options = this.setHttpOptions(RequestMethod.Post, url);
      return this.http.post(url, apiparam, options);
    }

  // c4
  // assign or reassign or delete candidates
  assigneOrReassignOrDeleteCandidates(requestBody): Observable<any> {
    let url = this.apiurl + "api/Sense/SenseCandidateAssignmentAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, requestBody, options);
}

  // delete recruiter selected
  // c5
  deleteRecruiter(apiparam): Observable<any> {
    let url = this.apiurl + "api/Sense/RemoveAssignedRecruiterByIdAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, apiparam, options);
  }

}

