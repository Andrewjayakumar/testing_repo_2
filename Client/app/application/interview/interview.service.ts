import { Injectable } from '@angular/core';
import { baseurl } from '../../../environment';
import { authapiurl } from '../../../environment';
import { DataService } from '../../core/services/data.service';
import {
  Http,
  Response,
  RequestOptions,
  RequestMethod,
  URLSearchParams
} from '@angular/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { DataServiceOptions } from '../../core/services/data-service-options';

@Injectable()
export class InterviewService {
  httpOptions: any = {};

  constructor(private http: Http, private dataservice: DataService) {
    this.httpOptions.headers = this.dataservice.getHttpHeaders();
  }



  private apiUrl = baseurl;
  private clientUrl = authapiurl;

 

  cancelInterview(data: any): Observable<any>  {
    let url = this.apiUrl + "api/Candidate/CancelCandidateInterviewAsync";
    let options = { headers: this.httpOptions.headers};
    return this.http.post(url,data, options);
  }
  markCompleteOrEditFeedbackInterview(data: any): Observable<any>  {
    let url = this.apiUrl + "api/Candidate/MarkCompleteCandidateInterviewAsync";
   // let options = { headers: this.httpOptions.headers };
   // return this.http.post(url, data, options);
    
      let options = this.setHttpOptions(RequestMethod.Post, url);
      delete options.headers["Content-Type"];
      options.headers['Accept'] = 'application/json';
      return this.http.post(url, data, options).pipe();
    

  }
  getInterviewHistoryDetails(candidateid, requisitionid): Observable<any> {
    let url = this.apiUrl + "api/Candidate/GetCandidateInterviewStatusAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("candidateid", candidateid);
    searchParams.append("requisitionid", requisitionid);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }

  getInterviewNumber(requisitionId, candidateId): Observable<any> {
    let url = this.apiUrl + "api/Candidate/GetNextInterviewRoundNumberAsync";
    let searchParams = new URLSearchParams();
    searchParams.set("requisitionId", requisitionId);
    searchParams.set("candidateId", candidateId);


    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }
  getInterviewDetails(candidateinterviewid): Observable<any> {
    let url = this.apiUrl + "api/Candidate/GetCandidateInterviewDetailsByIdAsync";
    let searchParams = new URLSearchParams();
    searchParams.set("candidateinterviewid", candidateinterviewid);



    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  addInterview(formData: any) : Observable<any> {
    let url = this.apiUrl + "api/Candidate/CreateCandidateInterviewAsync";
    let data = formData;
    let options = { headers: this.httpOptions.headers };

    return this.http.post(url, data, options);
  }

  UpdateCandidateInterviewDeBriefing(data: any): Observable<any> {
    let url = this.apiUrl + "api/Candidate/UpdateCandidateInterviewDeBriefingAsync";
    let options = { headers: this.httpOptions.headers };
    return this.http.post(url, data, options);

  }
  rescheduleInterview(data: any): Observable<any> {
    let url = this.apiUrl + "api/Candidate/RescheduledCandidateInterviewAsync";
    let options = { headers: this.httpOptions.headers };
    return this.http.post(url, data, options);
  }
  getInterviewMode(): Observable<any> {
    let url = this.apiUrl + "api/Master/GetInterviewTypeAsync ";
    return this.http.get(url, this.httpOptions);
  }
  getTimeZone(): Observable<any> {
    let url = this.apiUrl + "api/Master/GetDayLightSaveTimeAsync";

    return this.http.get(url, this.httpOptions);
  }
  getRecruitersList(name: string, clientid: string) {
    let url = this.apiUrl + "api/Requisition/GetRecruitersByUserAsync";
    let searchParams = new URLSearchParams();
    searchParams.set("clientid", clientid);
    searchParams.append("name", name);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }
  getDebriefDetails(reqobj): Observable<any> {
    let url = this.apiUrl + "api/Candidate/GetInterviewFeedbackAndDeBriefingAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("candidateid", reqobj.candidateid);
    searchParams.append("requisitionid", reqobj.requisitionid);

    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }


  postSubmitToClient(data: any): Observable<any>  {
    let url = this.apiUrl + "api/Candidate/CreateClientSubmission";
    let options = { headers: this.httpOptions.headers };
    return this.http.post(url, data, options);

  }


  getInterviewExecutedByDetails(): Observable<any> {
    let url = this.apiUrl + "api/Candidate/GetInterviewExecutedByAsync";
    return this.http.get(url, this.httpOptions);
  }

  getCandidateOtherReqStatus(candidateid): Observable<any> {
    let url = this.apiUrl + "api/Candidate/GetCandidateL1InterviewStatusAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("CandidateId", candidateid);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    
    return this.http.get(url, options);
  }
   getCandidateHiringStatusByReqId(candidateid,requisitionid): Observable<any> {
    let url = this.apiUrl + "api/Candidate/GetCandidateHiringStatusByReqId";
    let searchParams = new URLSearchParams();
    searchParams.append("CandidateId", candidateid);
    searchParams.append("RequisitionId", requisitionid);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    
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
