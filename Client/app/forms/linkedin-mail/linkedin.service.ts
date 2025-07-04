import { Injectable } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Http, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { baseurl, authapiurl } from '../../../environment';
import { Observable } from 'rxjs';

@Injectable()
export class LinkedinService {

    httpOptions: any = {};

    constructor(private http: Http, private dataservice: DataService) {
        this.httpOptions.headers = this.dataservice.getHttpHeaders();
    }

    private apiUrl = baseurl;
    private clientUrl = authapiurl;


    //Linked in sync API on cose of pop up - GET

    syncUserProfilewithLinkedin(candidateid): Observable<any> {
        let url = this.apiUrl + "api/Candidate/UpdateCandidateLinkedinMemberIdAsync";
        let searchParams = new URLSearchParams();
        searchParams.append('candidateid', candidateid);
        let options = new RequestOptions();
        options.method = "GET";
        options.headers = this.httpOptions.headers;
        options.params = searchParams;

        return this.http.get(url, options);
    }

    getInmailHistory(candidateid): Observable<any> {
        let url = this.apiUrl+ "api/Candidate/GetLinkedinMailHistoryAsync";
        let searchParams = new URLSearchParams();
        searchParams.append('candidateid', candidateid);
        let options = new RequestOptions();
        options.method = "GET";
        options.headers = this.httpOptions.headers;
        options.params = searchParams;

        return this.http.get(url, options);
    }

    trackPageOpened(action, id) {
        return this.dataservice.postPageTracker(this.apiUrl + "api/UserActivityLog/PageTrackerAsync", { "pagename": "CandidateOverview", "actionname": action, "objecttype": "candidateid", "objectid": id });
    }


}
