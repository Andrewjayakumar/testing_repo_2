import { Injectable } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Http, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { baseurl, authapiurl } from '../../../environment';
import { Observable } from 'rxjs';

@Injectable()
export class ShareMultipleUserService {

  httpOptions: any = {};

  constructor(private http: Http, private dataservice: DataService) {
    this.httpOptions.headers = this.dataservice.getHttpHeaders();
  }

  private apiUrl = baseurl;
  private clientUrl = authapiurl;
  getRecruitersList(name: string) {
    let url = this.apiUrl + "api/Requisition/GetRecruitersByUserAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("name", name);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  sendAllProfiles(data): Observable<any> {
    let url = `${this.apiUrl}api/Candidate/ShareCandidateProfileAsync`;
    let options = { headers: this.httpOptions.headers };
    return this.http.post(url, data, options);
  }

  getcopylinkUrl(candidateid): Observable<any> {
    let url = this.apiUrl + "api/Candidate/GetCandidateProfileURLAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("candidateid", candidateid);
    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }
  trackPageOpened(action, id) {
    return this.dataservice.postPageTracker(this.apiUrl + "api/UserActivityLog/PageTrackerAsync", { "pagename": "CandidateOverview", "actionname": action, "objecttype": "candidateid", "objectid": id });
  }


}
