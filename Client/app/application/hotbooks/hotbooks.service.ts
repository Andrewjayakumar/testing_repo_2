import { Injectable } from "@angular/core";
import { DataService } from "../../core/services/data.service";
import { Observable } from "rxjs";
import {
  Http,
  Response,
  RequestOptions,
  RequestMethod,
  URLSearchParams,
} from "@angular/http";
import { DataServiceOptions } from "../../core/services/data-service-options";
import { baseurl } from "../../../environment";
import { authapiurl } from "../../../environment";

import { Subject } from "rxjs/Subject";
import "rxjs/add/operator/map";

@Injectable()
export class HotBooksService {
  httpOptions = new RequestOptions();
  public apiurl = baseurl;
  public secureapiurl = authapiurl;

  constructor(public http: Http, public dataservice: DataService) {
    this.httpOptions.headers = dataservice.getHttpHeaders();
  }

  setHttpOptions(method, url, params?, data?) {
    let options = new DataServiceOptions();
    options.method = method || RequestMethod.Get;
    options.url = url || "";
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

  getSearchResults(apiparam): Observable<any> {
    let url = this.apiurl + "api/Candidate/GetCandidateByKeywordSearchAsync";

    let options = this.setHttpOptions(RequestMethod.Post, url);
    // options.params = params;

    return this.http.post(url, apiparam, options);
  }

  /**
   *
   * Hotbboks API list && search candidates by not contacted hotbook filter

   */

  getCandidatesByHotbookId(apiparam): Observable<any> {
    let url = this.apiurl + "api/HotBook/SearchHotBookCandidatesAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, apiparam, options);
  }

  // page tracker
  pageTracker(apiparam): Observable<any> {
    let url = this.apiurl + "api/UserActivityLog/PageTrackerAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, apiparam, options);
  }

  getMyHotbooksList(tagType): Observable<any> {
    let favouritestype = 1;
    let url = this.apiurl + "api/HotBook/SearchInHotBookFolderNameAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("tagType", tagType); //tagID
    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

  searchInHotbook(tagType, tagName): Observable<any> {
    let favouritestype = 1;
    let url = this.apiurl + "api/HotBook/SearchInHotBookFolderNameAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("tagType", tagType);
    searchParams.append("tagName", tagName);
    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

  getSharedwithMeHotbookList(): Observable<any> {
    let url = this.apiurl + "api/Favorite/GetSharedFavoriteAsync";
    return this.http.get(url, this.httpOptions);
  }

  trackActivityPageOpened(data) {
    // data should be in the format - { "pagename": "CandidateAdvancedSearch" }
    return this.dataservice.postPageTracker(
      this.apiurl + "api/UserActivityLog/PageTrackerAsync",
      data
    );
  }

  // api to get recruiters name
  getRecruiter(clientid, name): Observable<any> {
    let url = this.apiurl + "api/Requisition/GetRecruitersByUserAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("clientid", clientid);
    searchParams.append("name", name);
    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

  // for Hotbook Add folder button
  addFolder(params): Observable<any> {
    let url = this.apiurl + "api/HotBook/CreateOrUpDateHotBookFolderAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, params, options);
  }

  // to share data to recruiters
  shareHotbook(params): Observable<any> {
    let url = this.apiurl + "api/HotBook/CreateShareHotBookAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, params, options).pipe();
  }

  // to delete a hotbook
  deleteHotbook(tagId, isSharedHotbook?): Observable<any> {
    let url = this.apiurl + "api/HotBook/DeleteTagAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("tagId", tagId);
    searchParams.append("sharedHotbook", isSharedHotbook);
    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.delete(url, options);
  }

  // get hotbook data for a specific ID
  getMyHotbooksData(tagId): Observable<any> {
    let url = this.apiurl + "api/HotBook/GetHotBookFolderDetailsAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("tagId", tagId); //tagID
    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

  // for Hotbook Add Demand Plan
  addDemandPlan(params): Observable<any> {
    let url = this.apiurl + "api/HotBook/CreateOrUpdateDemandPlanAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, params, options);
  }

  // delete candidate profiles from HotBook
  deleteCandidateProfilesfromHotbook(params): Observable<any> {
    let url = this.apiurl + "api/HotBook/RemoveCandidateInHotBookFolderAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, params, options);
  }
  // get demand plans list for Delivery Manager
  getDemandPlansList(): Observable<any> {
    let url = this.apiurl + "api/HotBook/GetDMDemandPlanDetailsAsync";
    let searchParams = new URLSearchParams();
    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

  // get demand plans list for recruiters
  getRecruiterDemandPlansList(): Observable<any> {
    let url = this.apiurl + "api/HotBook/GetRecruiterDemandPlanDetailsAsync";
    let searchParams = new URLSearchParams();
    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

  // get Active Candidates for Demand plan selected

  getActiveCandidatesDemandPlan(apiparam): Observable<any> {
    let url = this.apiurl + "api/HotBook/SearchDPCandidatesByDMAsync";

    let options = this.setHttpOptions(RequestMethod.Post, url);

    return this.http.post(url, apiparam, options);
  }

  getDemandPlans(demandName): Observable<any> {
    let url = this.apiurl + "api/HotBook/GetDemandPlanNamesAsync";
    let searchParams = new URLSearchParams();
    searchParams.append('demandName', demandName);
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

  AddCandidatesInDemandPlan(params): Observable<any> {
    let url = this.apiurl + "api/HotBook/AddCandidatesInDemandPlanAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, params, options);
  }


  approveOrRejectCandidatesinDemandPlan(requestBody): Observable<any> {
    let url = this.apiurl + "api/HotBook/AddCandidatesInDemandPlanAsync";

    let options = this.setHttpOptions(RequestMethod.Post, url);

    return this.http.post(url, requestBody, options);
  }

  // Delete the Demand plan

  deleteDemandPlan(params): Observable<any> {
    let url = this.apiurl + "api/HotBook/CreateOrUpdateDemandPlanAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, params, options);
  }

  // get Demand plan By ID for editing the Demand Plan

  getallDMDetailsById(params): Observable<any> {
    let url = this.apiurl + "api/HotBook/GetDemandPlanByIdAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("demandplanid", params.demandplanid);
    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

  // remove candidate profiles from the DP

  removeCandidatesFromDP(params): Observable<any> {
    let url = this.apiurl + "api/HotBook/RemoveCandidateInDemandPlanAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, params, options);
  }
}

