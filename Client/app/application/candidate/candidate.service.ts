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
export class CandidateService {
    

  constructor(public http: Http, public dataservice: DataService) { }
  public apiurl = baseurl;
  public secureapiurl = authapiurl;

  httpOptions = new RequestOptions();

  getcandidateStatus(apiparam): Observable<any> {

    let url = this.apiurl + "api/Master/GetCandidateStatusAsync";

    let options = this.setHttpOptions(RequestMethod.Get, url);
    return this.http.get(url, options);
  }

  getsubmittedBy(apiparam, clientid?,name?): Observable<any> {
    let url = this.apiurl + 'api/Requisition/GetRecruitersByUserAsync';
    let params = {
      "clientid":clientid,
      "name": apiparam
    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  gettheskills(apiparam): Observable<any> {
    let url = this.apiurl + "api/Master/GetRelatedSkillsAsync";
    let params = {
      "clientid": apiparam
     
    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;

    return this.http.get(url, options);
  }

  // Assigned To

  getassignedTo(apiparam, clientid?, name?): Observable<any> {
    let url = this.apiurl + 'api/Requisition/GetRecruitersByUserAsync';
    let params = {
      "name": apiparam
    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  // Get Region

  getregion(apiparam): Observable<any> {

    let url = this.apiurl + "api/Master/GetRegionAsync";

    let options = this.setHttpOptions(RequestMethod.Get, url);
    return this.http.get(url, options);
  }


  // get LOB
  getlob(apiparam): Observable<any> {

    let url = this.apiurl + "api/Master/GetClientLOBAsync";

    let options = this.setHttpOptions(RequestMethod.Get, url);
    return this.http.get(url, options);
  }

  // get Requisition Type

  getrequisitionType(apiparam): Observable<any> {

    let url = this.apiurl + "api/Master/GetRequisitionTypeAsync";

    let options = this.setHttpOptions(RequestMethod.Get, url);
    return this.http.get(url, options);
  }

  //get Requisition Status

  getrequisitionStatus(apiparam): Observable<any> {

    let url = this.apiurl + "api/Master/GetStatusAsync";

    let options = this.setHttpOptions(RequestMethod.Get, url);
    return this.http.get(url, options);
  }

  // get the job title
  getjobtitle(apiparam): Observable<any> {

    let url = this.apiurl + "api/Master/GetJobTitleAsync";

    let options = this.setHttpOptions(RequestMethod.Get, url);
    return this.http.get(url, options);
  }

  // get the TCU details

  getthetcu(apiparam): Observable<any> {

    let url = this.apiurl + "api/Master/GetTCUAsync";

    let options = this.setHttpOptions(RequestMethod.Get, url);
    return this.http.get(url, options);
  }

  // get the country Details
  getthecountry(apiparam): Observable<any> {

    let url = this.apiurl + "api/Master/GetCountryAsync";

    let options = this.setHttpOptions(RequestMethod.Get, url);
    return this.http.get(url, options);
  }

  // get the state details

  getthestates(apiparam): Observable<any> {
    let url = this.apiurl + "api/Master/GetStateByCountryAsync";
    let params = {
      "countryid": apiparam

    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;

    return this.http.get(url, options);
  }

  // get the priority Details
  getthepriority(): Observable<any> {
    let url = this.apiurl + "api/Master/GetRequisitionPriorityAsync";
   let options = this.setHttpOptions(RequestMethod.Get, url);

    return this.http.get(url, options);
  }
  // get All the client Names
  getAlltheClientNames(): Observable<any> {
    let url = this.secureapiurl + "api/MapsAccess/GetClients";
  
    let options = this.setHttpOptions(RequestMethod.Get, url);
    return this.http.get(url, options);
  }

  // get all the employment Type
  gettheEmploymentType(): Observable<any> {
    let url = this.apiurl + "api/Master/GetProjectTypeAsync";

    let options = this.setHttpOptions(RequestMethod.Get, url);
    return this.http.get(url, options);
  }
  private extractData(res) {
    let body = JSON.parse(res._body).response
    return body || {};
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      // const err = body.error || JSON.stringify(body);
      // errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  getAllSearchResults(params): Observable<any> {

    let url = this.apiurl + "api/Requisition/CandidateAndRequisitionAdvancedSearchAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
  //  return this.http.post(url, params, options);

    return this.http.post(url, params, options).pipe(
     
    );

    }

    getCandidateBasicDetails(candidateid) {
        let url = this.apiurl + 'api/Candidate/GetCandidateBasicDetailsByIdAsync';
        let options = this.setHttpOptions(RequestMethod.Get, url);
        if (candidateid) {
            let searchParams = new URLSearchParams();
            searchParams.append('candidateid', candidateid);
            options.params = searchParams;
        }

        return this.http.get(url, options);
    }


    /**
     * 
     * Add cAndidate Related APIs
     */

    getCandidateSourceOptions(param?) {
        let url = this.apiurl + 'api/Master/GetCandidateSourceAsync';
        let options = this.setHttpOptions(RequestMethod.Get, url);
        if (param) {
            let searchParams = new URLSearchParams();
            searchParams.append('isaddcandidate', 'true');
            options.params = searchParams;
        }
        
        return this.http.get(url, options );
    }


  addcandidatePost(params) {
    let url = this.apiurl + "api/Candidate/CreateCandidateAndResumeAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    delete options.headers["Content-Type"];
    options.headers['Accept'] = 'application/json';
    return this.http.post(url, params, options).pipe();
    }

    //STS request
    sendSTSRequest(body) {
        let url = this.apiurl + "api/Candidate/CreateSTSRequestSendAsync";
        let options = this.setHttpOptions(RequestMethod.Post, url);
 
        return this.http.post(url, body, options).pipe();
    }
    getDeliveryModels(): Observable<any> {
      let url = this.apiurl + "api/Requisition/GetDeliveryModelsMasterAsync";
      let options = this.setHttpOptions(RequestMethod.Get, url);
      return this.http.get(url, options);
    }
  getlabels(): Observable<any> {
    let url = this.apiurl + "api/Master/GetLabelsAsync";
    let options = this.setHttpOptions(RequestMethod.Get, url);
    return this.http.get(url, options);
  }
  searchRecruiter(apiparam): Observable<any> {
    let url = this.apiurl + 'api/Requisition/GetRecruitersByUserAsync';
    let params = {
      "name": apiparam,
    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options)
      .map(this.extractData)
      .catch(this.handleError);
  }
  getrefereeDetails(text: string): Observable<any> {
    let url = this.apiurl + "api/Candidate/GetEmployeeRefereeDetailsAsync";
    let params = {
      "username": text

    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;

    return this.http.get(url, options);
  }
  getGCIDDetails(text) {
    let url = this.apiurl + "api/Candidate/GetGCIIdListAsync";
    let params = {
      "search": text
    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;

    return this.http.get(url, options);
  }
  searchTechAssessment(params) {
    let url = this.apiurl + "api/Candidate/GetCandidateTechAssessmentsListAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    delete options.headers["Content-Type"];
    options.headers['Accept'] = 'application/json';
    return this.http.post(url, params, options).pipe();
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

    trackActivityPageOpened() {
        return this.dataservice.postPageTracker(this.apiurl + "api/UserActivityLog/PageTrackerAsync", {"pagename":"CandidateAdvancedSearch"});
    }
}
