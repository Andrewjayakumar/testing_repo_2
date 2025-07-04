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
export class ViewScAndTypeService {


  constructor(public http: Http, public dataservice: DataService) { }
  public apiurl = baseurl;
  public secureapiurl = authapiurl;

  getSCAndType(candidateId, requisitionId): Observable<any> {
    let url = this.apiurl + "api/Candidate/GetSubmissionCheckListAndTypeByIdAsync";
    let params = {
      "candidateid": candidateId,
      "requisitionid": requisitionId
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
