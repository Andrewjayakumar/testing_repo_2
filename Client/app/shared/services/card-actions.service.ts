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
export class CardactionsService {


  constructor(public http: Http, public dataservice: DataService) {
    this.httpOptions.headers = dataservice.getHttpHeaders();

  }
  public apiurl = baseurl;
  public secureapiurl = authapiurl;
  httpOptions = new RequestOptions();

  getCandidateResume(candidateid, ismatch, requisitionid): Observable<any> {
    let url = this.apiurl + "api/Candidate/GetCandidateDetailsByIdAsync";

    let searchParams = new URLSearchParams();
    searchParams.append("requisitionid", requisitionid);

    searchParams.append("candidateid", candidateid);
    searchParams.append("origin", 'viewresume');
    searchParams.append("ismatch", ismatch);



    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }
  trackCandidatePinning(apiparam): Observable<any> {
    let url = this.apiurl + "api/Candidate/CreateCandidatePiningAuditLogsAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    // options.params = params;
    return this.http.post(url, apiparam, options);
  }
  trackquickviewResume(apiparam): Observable<any> {
    let url = this.apiurl + "api/UserActivityLog/PageTrackerAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    // options.params = params;
    return this.http.post(url, apiparam, options);
  }
  saveNotesData(apiparam): Observable<any> {
    let url = this.apiurl + "api/Candidate/CreateCandidateNotesAsync";


    let options = this.setHttpOptions(RequestMethod.Post, url);
    // options.params = params;

    return this.http.post(url, apiparam, options);
  }

  // for getting Candidate notes details

  getcandidateNotes(candidateid): Observable<any> {
    let url = this.apiurl + "api/Candidate/GetCandidateNotesByUserAsync";

    let searchParams = new URLSearchParams();
    searchParams.append("candidateid", candidateid);

    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

  getResumeForOverViewPage(candidateid, ismatch,sourceid): Observable<any> {
    let url = this.apiurl + "api/Candidate/GetCandidateResume";

    let searchParams = new URLSearchParams();
    searchParams.append("candidateid", candidateid);
    searchParams.append("sourceid", sourceid);
    searchParams.append("ismatch", ismatch);


    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }
  // delete the Notes

  deleteNotes(apiparam): Observable<any> {
    let url = this.apiurl + "api/Candidate/DeleteCandidateNotesAsync";


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


  makepriorPinCall(url: string, data: any, method: string) {
    if (method == 'get') {
      //TBI
    }
    else {

      let options = new RequestOptions();
      options.headers = this.httpOptions.headers;
      let searchParams = new URLSearchParams();
      let keys = Object.keys(data);

      keys.forEach(key => {
        searchParams.append(key, data[key]);
      });
      options.params = searchParams;
      return this.http.post(this.apiurl + url, {}, options);
    }
  }



}
