import { Injectable } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { DataServiceOptions } from '../../core/services/data-service-options';
import { baseurl } from '../../../environment';
import { authapiurl } from '../../../environment';
import 'rxjs/add/operator/map';


@Injectable()
export class RedeploymentService {
  public httpOptions: any = {};

  constructor(public http: Http, public dataservice: DataService) {
    this.httpOptions.headers = this.dataservice.getHttpHeaders();
  }
  public apiurl = baseurl;
  public secureapiurl = authapiurl;

  getrecommendedRequisitions(apiparam): Observable<any> {
    let url = this.apiurl + "api/Requisition/CandidateMatchingRequisitionBySovrenAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, apiparam, options);
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

  getCoherts(text: string): Observable<any> {
    let url = this.apiurl + "api/Redeployment/GetCohortMaster";
    let searchParams = new URLSearchParams();
    searchParams.append("text", text);
    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;

    return this.http.get(url, options);
  }

  getCandidates(formData: any) {
    let url = this.apiurl + "api/Redeployment/GetCohertCandidateListAsync";
    let data = formData;
    let options = { headers: this.httpOptions.headers };

    return this.http.post(url, data, options);
  }
  pageTrackers(formData: any) {
    let url = this.apiurl + "api/UserActivityLog/PageTrackerAsync";
    let data = formData;
    let options = { headers: this.httpOptions.headers };

    return this.http.post(url, data, options);
  }

  getRequisitionsFromFilter(formData: any) {
    let url = this.apiurl + "api/Redeployment/GetCohertCandidateListAsync";
    let data = formData;
    let options = { headers: this.httpOptions.headers };

    return this.http.post(url, data, options);
  }

}
