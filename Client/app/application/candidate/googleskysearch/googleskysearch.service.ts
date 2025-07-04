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
export class GoogleskysearchService {


  constructor(public http: Http, public dataservice: DataService) { }
  public apiurl = baseurl;
  public secureapiurl = authapiurl;
  googleSkySearch(apiparam): Observable<any> {
    let url = this.apiurl + "api/GoogleXraySearch/GoogleXraySearchEngine";


    let options = this.setHttpOptions(RequestMethod.Post, url);
    // options.params = params;

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

  trackActivityPageOpened(data) {
    // data should be in the format - { "pagename": "CandidateAdvancedSearch" }
    return this.dataservice.postPageTracker(this.apiurl + "api/UserActivityLog/PageTrackerAsync", data);
  }
}
