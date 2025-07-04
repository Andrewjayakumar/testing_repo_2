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
export class InitiateWorkflowService {


  constructor(public http: Http, public dataservice: DataService) { }
  public apiurl = baseurl;
  public secureapiurl = authapiurl;

  postInitiateWorkflow(candidateId, requisitionId, requestBody, businessUnit): Observable<any> {
    let url;
    if (businessUnit == 'collabera') {
      url = this.apiurl + "api/Candidate/CreateCandidateInitiateWorkflowStatusAsync";
    }
    else {
      url = this.apiurl + "api/Candidate/CreateCandidateInitiateWorkflowCognixiaAsync";
    }
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
