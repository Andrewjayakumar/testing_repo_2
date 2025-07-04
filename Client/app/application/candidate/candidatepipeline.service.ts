import { Injectable } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { DataServiceOptions } from '../../core/services/data-service-options';
import { baseurl } from '../../../environment';
import { authapiurl } from '../../../environment';

import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { __param } from 'tslib';

@Injectable()
export class CandidatepipelineService {

  constructor(public http: Http, public dataservice: DataService) { }
  public apiurl = baseurl;
  public secureapiurl = authapiurl;

  getAllPipelineCandidates(requisitionid): Observable<any> {

    let url = this.apiurl + "api/Candidate/GetCandidateListByReqIdAsync";
    let options = this.setHttpOptions(RequestMethod.Get, url);

    if (requisitionid) {
      let searchParams = new URLSearchParams();
      searchParams.append('requisitionId', requisitionid);
      options.params = searchParams;
    }

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

   
    delete options.url;

    return options;
  }
}
