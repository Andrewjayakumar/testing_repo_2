import { Injectable } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { DataService } from "../../../core/services/data.service";
import { baseurl } from "../../../../environment";
import { authapiurl } from "../../../../environment";
import { Http, RequestOptions, URLSearchParams } from "@angular/http";

@Injectable()
export class MyRequisitionsService {
  constructor(private http: Http, private dataservice: DataService) {
    this.httpOptions.headers = dataservice.getHttpHeaders();
  }

  private apiUrl = baseurl;
  private clientUrl = authapiurl;

  httpOptions = new RequestOptions();
  pagesize: number;
  pageindex: number = 1;

  getMyTeamRequisitions(apiparam): Observable<any> {
    let url = this.apiUrl + "api/Requisition/GetMyTeamRequisitionAsync";
    // let searchParams = new URLSearchParams();
    // searchParams.append('PageIndex', pageindex);
    //  searchParams.append('PageSize', pagesize);

    //let options = { headers: this.httpOptions.headers, params: searchParams };

    // return this.http.get(url, options);

    let options = { headers: this.httpOptions.headers };
    return this.http.post(url, apiparam, options);
  }

  getMyRequisitions(apiparam) {
    let url = this.apiUrl + "api/Requisition/GetRequisitionByUserAsync";
    // let searchParams = new URLSearchParams();
    // searchParams.append('assignedto', recruiter );
    //  searchParams.append('pageindex', pageindex);
    //  searchParams.append('pagesize', pagesize );
    let options = { headers: this.httpOptions.headers };
    return this.http.post(url, apiparam, options);
  }

  getMyRequisitiosnWithFilter(filterData) {
    let url = this.apiUrl + "api/Requisition/GetRequisitionByUserAsync";
    let searchParams = new URLSearchParams();
    // searchParams.append('assignedto', recruiter );
    //  searchParams.append('type', filterData.matchTyp
    // searchParams.append('searchtext', filterData.searchtext);
    //  searchParams.append('datefilter', filterData.datefilter);

    //  searchParams.append('receivedfrom', filterData.receivedfrom);
    //  searchParams.append('receivedto', filterData.receivedto);
    //  searchParams.append('requisitiontypeid', filterData.requisitiontypeid);
    // searchParams.append('pageindex', pageindex);
    //  searchParams.append('pagesize', pagesize);

    let options = { headers: this.httpOptions.headers };
    // options.url = url;
    return this.http.post(url, filterData, options);
  }

  getAllAssignments(id, pageindex, pagesize?) {
    let url =
      this.apiUrl + "api/Requisition/GetAssignmentHistoryByRequisitionIdAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("requisitionid", id);
    searchParams.append("pageindex", pageindex);
    searchParams.append("pagesize", pagesize);

    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  // get the recruiter through Type ahead search

  getRecruiter(id) {
    let url = this.apiUrl + "api/Requisition/GetRecruitersByUserAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("name", id);

    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http
      .get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res) {
    let body = JSON.parse(res._body).response;
    return body || {};
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || "";
      // const err = body.error || JSON.stringify(body);
      // errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  // Submit recruiter Assignment

  recruiterAssignment(apiparam) {
    let url =
      this.apiUrl + "api/Requisition/CreateOrUpdateRequisitionAssignmentAsync";

    // let url = `${this.apiUrl}api/Candidate/GetSkillsFromTextAsync`;

    let options = { headers: this.httpOptions.headers };
    // options.url = url;
    return this.http.post(url, apiparam, options);
  }

  // Get the Qualification Objects By Requisition ID

  getQualificationById(id) {
    let url =
      this.apiUrl + "api/Requisition/GetQaulificationRequisitionDataByIdAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("requisitionid", id);

    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getQualificationDetails() {
    let url = this.apiUrl + "api/Master/GetRequisitionQualificationsAsync";
    let searchParams = new URLSearchParams();

    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  // Update The Qualification Post Method

  updateQualification(apiparam) {
    let url =
      this.apiUrl + "api/Requisition/UpdateRequisitionQualificationAsync";

    let options = { headers: this.httpOptions.headers };
    // options.url = url;
    return this.http.post(url, apiparam, options);
  }

  // get the requisition Summary Details

  getreqSummaryById(id) {
    let url = this.apiUrl + "api/Requisition/GetRequisitionReadonlyDataAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("requisitionid", id);

    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  // get matching Reqs for a candidate
  getMatchingReqs(apiparam): Observable<any> {
    let url =
      this.apiUrl + "api/Requisition/CandidateMatchingRequisitionBySovrenAsync";
    let options = { headers: this.httpOptions.headers };
    return this.http.post(url, apiparam, options);
  }

  // page tracker
  pageTracker(apiparam): Observable<any> {
    let url = this.apiUrl + "api/UserActivityLog/PageTrackerAsync";
    let options = { headers: this.httpOptions.headers };
    return this.http.post(url, apiparam, options);
  }

  // source marked Requisitions
  sourceRequisitions(apiparam): Observable<any> {
    let url = this.apiUrl + "api/Candidate/PiningRequisitionByCandiateAsync";
    let options = { headers: this.httpOptions.headers };
    return this.http.post(url, apiparam, options);
  }

  getCandidateTitle(apiparam) {
    let url = this.apiUrl + "api/Candidate/GetCandidateBasicDetailsByIdAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("candidateid", apiparam);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }

  // Track requisition when rec is openend

  trackActivityrecIsOpened(apiparam): Observable<any> {
    let url = this.apiUrl + "api/Audit/CreateRequisitionPiningAuditLogsAsync";
    let options = { headers: this.httpOptions.headers };
    return this.http.post(url, apiparam, options);
  }

  // get the rate card Details

  getRateCardDetails(apiparam) {
    let url = this.apiUrl + "api/Candidate/GetSubmissionRateCardDetailsAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("RequisitionId", apiparam);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }
  getRegionByClient(): Observable<any> {
    let url = this.apiUrl + "api/Master/GetRegionAsync";
    let options = { headers: this.httpOptions.headers };
    return this.http.get(url, options);
  }
}
