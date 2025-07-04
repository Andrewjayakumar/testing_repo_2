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
export class CandidateAttestationService {


  constructor(public http: Http, public dataservice: DataService) { }
  public apiurl = baseurl;
  public secureapiurl = authapiurl;

  getCandidateReqDetails(candidateId, requisitionId): Observable<any> {
    let url = this.apiurl + "api/Candidate/GetCandidateRequisitionByIdAsync";
    let params = {
      "candidateid": candidateId,
      "requisitionid": requisitionId
    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options);
  }

  getPayRateUnitType(): Observable<any> {
    let url = this.apiurl + "api/Master/GetPayRateUnitTypeAsync";
    let params = {
    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options);
  }

  getZipCodes(text): Observable<any> {
    let url = this.apiurl + "api/Master/GetZipCodeByTextAsync";
    let params = {
      "text": text
    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options);
  }

  getCityListFromZipCode(zipcode): Observable<any> {
    let url = this.apiurl + "api/Master/GetCityListFromZipCodeAsync";
    let params = {
      "zipcode": zipcode
    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options);
  }
  

  postCandidateBypassRequest(reqBody): Observable<any> {
    let url = this.apiurl + "api/Candidate/CreateCandidateBypassRequestAsync";
    let params = {
      
    }

    let options = this.setHttpOptions(RequestMethod.Post, url);
    options.params = params;
    return this.http.post(url,reqBody, options);
  }

  postCreateCandidateAttestaton(candidateId, requisitionId, requestBody): Observable<any> {
    let url = this.apiurl + "api/Candidate/CreateCandidateAttestationAsync";
    let params = {
      "candidateid": candidateId,
      "requisitionid": requisitionId,
    }

    let options = this.setHttpOptions(RequestMethod.Post, url);
    options.params = params;
    return this.http.post(url, requestBody, options);
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
