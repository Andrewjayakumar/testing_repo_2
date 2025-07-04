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
export class RequisitionsService {
    
  public httpOptions: any = {};

  constructor(public http: Http, public dataservice: DataService) {
    this.httpOptions.headers = this.dataservice.getHttpHeaders();
   }
  public apiurl = baseurl;
  public secureapiurl = authapiurl;

  getQualification(apiparam): Observable<any> {
    let url = this.apiurl + "api/Master/GetRequisitionQualificationsAsync";
    let options = this.setHttpOptions(RequestMethod.Get, url);
    return this.http.get(url, options);
  }

 // Get all the Requisition Details

  getallreqDetails(apiparam): Observable<any> {
    let url = this.apiurl + "api/Requisition/GetRequisitionOverViewByIdAsync";
    let params = {
      "reqid": apiparam
    }
    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;

    return this.http.get(url, options);
  }

  // Get the percentage  value

  getthePercentagevalue(apiparam): Observable<any> {
    let url = this.apiurl + "api/Requisition/GetRequisitionProgress";
    let params = {
      "requisitionId": apiparam

    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;

    return this.http.get(url, options);
  }

  // Update the requisition fields

  updateRequisition(apiparam): Observable<any> {
    let url = this.apiurl + "api/Requisition/UpdateRequisitionOverviewAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
   // options.params = params;
    return this.http.post(url, apiparam, options);
  }

  pageTracker(apiparam): Observable<any> {
    let url = this.apiurl + "api/UserActivityLog/PageTrackerAsync";
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

  postFile(formData): Observable<any> {

    let url = this.apiurl + "api/Candidate/UploadVideoResumeAsync";
    let options = new RequestOptions();
    let new_headers = Object.assign({}, this.httpOptions.headers);
    options.headers = new_headers;

    delete options.headers["Content-Type"];
    options.headers['Accept'] = 'application/json';
    return this.http.post(url, formData, options).pipe(
    );
  }
  

  getClientName(text): Observable<any> {
    let url = this.secureapiurl + "api/MapsAccess/GetClients";
    let params = {
      clientName: text,
    };

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options);
  }

  getProjectName(text, clientCode): Observable<any> {
    let url = this.apiurl + "api/Master/GetAllMSProjectNamesAsync";
    let params = {
      msprojectname: text,
      clientcode: clientCode,
    };

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options);
  }

    // Update the Client name
    updateClient(apiparam): Observable<any> {
      let url = this.apiurl + "api/Requisition/CreateClientNameChangeAsync";
      let options = this.setHttpOptions(RequestMethod.Post, url);
     // options.params = params;
      return this.http.post(url, apiparam, options);
    }

  // get BOT Response
  getBotResonsesDetails(apiparam): Observable<any> {

    let url = this.apiurl + "api/Bot/GetBotInvitesForRequisitionAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("RequisitionId", apiparam);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
    }

    getRequisitionDetailsReadOnly(reqid): Observable<any> {
        let url = this.apiurl + "api/Requisition/GetRequisitionReadonlyDataAsync";
        let searchParams = new URLSearchParams();
        searchParams.append("requisitionid", reqid);
        let options = { headers: this.httpOptions.headers, params: searchParams };
        return this.http.get(url, options);
    }

    GetRequisitionJournalEntryById(reqid): Observable<any> {
      let url = this.apiurl + "api/Requisition/GetRequisitionJournalEntryByIdAsync";
      let searchParams = new URLSearchParams();
      searchParams.append("requisitionid", reqid);
      let options = { headers: this.httpOptions.headers, params: searchParams };
      return this.http.get(url, options);
  }

 //Chat GPT APIs
    //call to API which in turn calls OpenAI services
    getChatGPTSuggestion(olddescription) {
        let url = this.apiurl + "api/Requisition/GetChatGPTJsonAsync";
        let data = olddescription;
        let options = { headers: this.httpOptions.headers };

        return this.http.post(url, data, options);
    }

    //get original description and AI description to show as soon as the pop up is launched
    getChatGPTDataByReqId(reqbody): Observable<any> {
        let url = this.apiurl + "api/ChatGPT/GetChatGPTDataAsync";

        let options = { headers: this.httpOptions.headers };
        return this.http.post(url, reqbody, options);
    }


    //post call to update changed description, interview qstns etc

    processChatGPTRecommendations(body): Observable<any> {
        let url = this.apiurl + "api/ChatGPT/ProcessChatGPTDataAsync";
        let options = this.setHttpOptions(RequestMethod.Post, url);
        // options.params = params;
        return this.http.post(url, body, options);
    }

    getChatGPTCancellationReason() {
        let url = this.apiurl + "api/ChatGPT/GetChatGPTCancelReasonAsync";
      
        let options = { headers: this.httpOptions.headers};
        return this.http.get(url, options);
    }

  

    trackChatGPTRequests(reqId, actionname) {
        let body = {
            "requisitionId": reqId,
            "action": actionname
        }
        let url = this.apiurl + "api/ChatGPT/AddChatGPTActionTrackingAsync";
        let options = this.setHttpOptions(RequestMethod.Post, url);
       
        return this.http.post(url, body, options);
    }

    
    getDescriptionHistory( requisitionid): Observable<any> {
      let url = this.apiurl + "api/Requisition/GetRequisitionDescriptionHistoryAsync";
      let searchParams = new URLSearchParams();
      searchParams.append("requisitionid", requisitionid);
      let options = { headers: this.httpOptions.headers, params: searchParams };
      return this.http.get(url, options);
    }

    getReqStatus():Observable<any>{
      let url = this.apiurl + "api/Master/GetStatusAsync";
      return this.http.get(url, this.httpOptions);

    }
    
    createCloneReq(body): Observable<any> {
      let url = this.apiurl + "api/Clone/CreateCloneRequisitionRequestAsync";
      let options = this.setHttpOptions(RequestMethod.Post, url);
      return this.http.post(url, body, options);
    }

  // Update duration
  updateDuration(apiparam): Observable<any> {
    let url = this.apiurl + "api/Requisition/UpdateRequisitionDateAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, apiparam, options);
  }

  getdurationHistory(requisitionid): Observable<any> {
    let url = this.apiurl + "api/Requisition/GetRequisitionDateHistoryAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("requisitionId", requisitionid);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }

  getDurationReasons(): Observable<any> {
    let url = this.apiurl + "api/Requisition/GetRequisitionDateUpdateReasonAsync";
    let options = { headers: this.httpOptions.headers };
    return this.http.get(url, options);
  }

  enableEmailNtfication(apiparam): Observable<any> {
    let url = this.apiurl + "api/Requisition/UpdateEmailNotificationStatusAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, apiparam, options);
  }
  GetEmailNotificationHistoryAsync(requisitionid): Observable<any> {
    let url = this.apiurl + "api/Requisition/GetEmailNotificationHistoryAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("requisitionId", requisitionid);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }
}
