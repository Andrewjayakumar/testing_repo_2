import { Injectable } from '@angular/core';
import { DataService } from '../../../core/services/data.service';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { DataServiceOptions } from '../../../core/services/data-service-options';
import { baseurl } from '../../../../environment';
import { authapiurl } from '../../../../environment';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';


@Injectable()
export class RejectCandidateService {


  constructor(public http: Http, public dataservice: DataService) { }
  public apiurl = baseurl;
  public secureapiurl = authapiurl;

  getrejectCategory(apiparam): Observable<any> {
    let url = this.apiurl + "api/Master/GetRejectReasonMainCategoryAsync";
    let params = {
      //"response": "rejectcategory",
      "typeid": apiparam
    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options);
  }

  getrejectedReasons(category, type): Observable<any> {
    let url = this.apiurl + "api/Master/GetRejectReasonAsync";
    let params = {
      //"response": "rejectreason",
      "categoryid": category,
      "type": type
    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options);
  }

  getBadDeliveryReason(category): Observable<any> {
    let url = this.apiurl + "api/Master/GetBadDeliveryReasonAsync";
    let params = {
      //"response": "baddeliveryreason",
      "categoryid": category,
    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options);
  }

  postRejectCandidate(candidateId, requisitionId, requestBody): Observable<any> {
    let url = this.apiurl + "api/Candidate/CreateCandidateOfferStatusAsync";
    let params = {
      "candidateid": candidateId,
      "requisitionid": requisitionId,
    }

    let options = this.setHttpOptions(RequestMethod.Post, url);
    options.params = params;
    return this.http.post(url, requestBody, options);
  }

  getIncorrectWorkflowStatus(candidateId, requisitionId): Observable<any> {
    let url = this.apiurl + "api/Candidate/GetIncorrectWorkflowStatusAsync";
    let params = {
      "candidateid": candidateId,
      "requisitionid": requisitionId,
    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
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
