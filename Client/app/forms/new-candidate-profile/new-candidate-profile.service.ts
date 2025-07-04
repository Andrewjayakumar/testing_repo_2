import { Injectable } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Http, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { baseurl, authapiurl } from '../../../environment';
import { Observable } from 'rxjs';

@Injectable()
export class NewCandidateProdileService {
  public httpOptions: any = {};

  constructor(private http: Http, private dataservice: DataService) {
    this.httpOptions.headers = this.dataservice.getHttpHeaders();
  }

  private apiUrl = baseurl;
  private clientUrl = authapiurl;

  getCandidateDetails(candidateid): Observable<any> {
    let url = this.apiUrl + "api/Candidate/GetCandidateDetailsByIdOverViewAsync";

    let searchParams = new URLSearchParams();

    searchParams.append("candidateid", candidateid);



    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

  getCandidateResumeDetails(candidateid, sourceid): Observable<any> {
    let url = this.apiUrl + "api/Candidate/GetCandidateResume";

    let searchParams = new URLSearchParams();

    searchParams.append("candidateid", candidateid);
    searchParams.append("sourceid", sourceid);




    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }


  trackFormatResume(data) {
    let url = this.apiUrl + 'api/UserActivityLog/PageTrackerAsync';

    let options = new RequestOptions();
    let new_headers = Object.assign({}, this.httpOptions.headers);

    options.headers = new_headers;
    options.headers['Access-Control-Allow-Origin'] = '*';
    delete options.headers["Content-Type"];
    return this.http.post(url, data, options);
  }
}
