import { Injectable, TemplateRef } from '@angular/core';
import { Observable } from "rxjs";
import { baseurl } from "../../../environment";
import { DataServiceOptions } from "../../core/services/data-service-options";
import { DataService } from "../../core/services/data.service";
import { authapiurl } from "../../../environment";

import {
  Http,
  Response,
  RequestOptions,
  RequestMethod,
  URLSearchParams,
} from "@angular/http";

@Injectable()
export class JobboardsearchService {

  httpOptions = new RequestOptions();
  public apiurl = baseurl;
  public secureapiurl = authapiurl;
  toasts: any[] = [];


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
  getlabels(): Observable<any> {
    let url = this.apiurl + "api/Master/GetLabelsAsync";
    let options = this.setHttpOptions(RequestMethod.Get, url);
    return this.http.get(url, options);
  }

  // get matching candidates
  getMatchingCandidates(params): Observable<any> {
    let url =
      this.apiurl + "api/Requisition/RequisitionMatchingCandidateBySovrenAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, params, options).pipe();
  }

  // source the matching candidates
  sourceMatchingCandidates(apiparam): Observable<any> {
    let url = this.apiurl + "api/Candidate/PiningCandidateRequisitionAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, apiparam, options);
  }

     /**
     *  this method fetches the data required for pie chart pop up to show
     *  how fit the requisition is to the candidate
     *  this is invoked from the requisition card on candidate matching screen
     * @param candidateId
     * @param requisitionId
     */
    getSovrenScoreDetailsForCandidate(candidateId: any, requisitionId: any) {
        let url = this.apiurl + "api/Requisition/GetSovrenMatchRequisitionDetailsAsync";
        let searchParams = new URLSearchParams();
        searchParams.append("candidateid", candidateId);
        searchParams.append("requisitionid", requisitionId);
        let options = { headers: this.httpOptions.headers, params: searchParams };

        return this.http.get(url, options);
    }

    // page tracker
    pageTracker(apiparam): Observable<any> {
      let url = this.apiurl + "api/UserActivityLog/PageTrackerAsync";
      let options = this.setHttpOptions(RequestMethod.Post, url);
      return this.http.post(url, apiparam, options);
    }

  // search candidates through Monster Portal
  monsterSearchCandidates(apiparam): Observable<any> {
    let url = this.apiurl + "api/Candidate/GetMonsterSearchCandidateListAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, apiparam, options);
  }

  // Monster Power search API's
  getPrimarySkills(text: string): Observable<any> {
    let url = this.apiurl + "api/Master/GetRelatedSkillsAsync";

    let searchParams = new URLSearchParams();
    searchParams.append("text", text);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getDefaultSkills(id): Observable<any> {
    let url = this.apiurl + "api/Requisition/GetRequisitionByIdAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("id", id);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }

  // get the related locations
  getlocations(text: string): Observable<any> {
    let url = this.apiurl + "api/Master/GetRelatedCityLocationAsync";

    let searchParams = new URLSearchParams();
    searchParams.append("text", text);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getAllReqTypes(): Observable<any> {
    let url = this.apiurl + "api/Master/GetRequisitionTypeAsync";
    let searchParams = new URLSearchParams();
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }

  getQualificationList(): Observable<any> {
    let url = this.apiurl + "api/Master/GetRequisitionQualificationsAsync";
    let searchParams = new URLSearchParams();
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }

  // monster power search candidates

  monsterPowerSearch(apiparam): Observable<any> {
    let url = this.apiurl + "api/Candidate/GetMonsterSearchCandidateListAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, apiparam, options);
  }
  /**
   *
   *  metalboolean search Methods
   */
  getCandidatesForMetalBooleanSearch(formdata) {
    let url = this.apiurl + "api/Candidate/GetCandidateByKeywordSearchAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, formdata, options);
  }

  GetDeliveryModelsMasterAsync() {
    let url = this.apiurl + "api/Requisition/GetDeliveryModelsMasterAsync";
    let searchParams = new URLSearchParams();
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }

  // source the matching candidates
  searchCareerBuilder(apiparam): Observable<any> {
    let url =
      this.apiurl + "api/Candidate/GetCBCandidateListBySearchKeywordsAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, apiparam, options);
  }

  // get skills list for filters
  getSkills(text): Observable<any> {
    let url = this.apiurl + "api/Master/GetRelatedSkillsAsync";
    let params = {
      text: text,
    };

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options);
  }

  // get job titles list for filters
  getJobTitles(text): Observable<any> {
    let url = this.apiurl + "api/Master/GetRelatedJobTitlesAsync";
    let params = {
      text: text,
    };

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options);
  }

    // get job titles list for filters
    getZipcodes(text): Observable<any> {
      let url = this.apiurl + "api/Master/GetZipCodeByTextAsync";
      let params = {
        text: text,
      };
  
      let options = this.setHttpOptions(RequestMethod.Get, url);
      options.params = params;
      return this.http.get(url, options);
    }

  // get cities list for filters
  getCities(country: string, city: string): Observable<any> {
    let url = this.apiurl + "api/Master/GetCityByCountryAsync";
    let params = {
      country: country,
      city: city,
    };

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options);
  }

  // get the state Details on Country selection
  getStateDetails(country: string): Observable<any> {
    let url = this.apiurl + "api/Master/GetStateByCountryAsync";

    let searchParams = new URLSearchParams();
    searchParams.append('countryid', country);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  // monster power search candidates

  diceSearch(apiparam): Observable<any> {
    let url = this.apiurl + "api/Candidate/GetDiceCandidateListBySearchKeywordsAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, apiparam, options);
  }


  getSovrenMatchDetailsByCandidate(candidateId: any, requisitionId: any) {
    let url = this.apiurl + "api/Requisition/GetSovrenMatchCandidateDetailsAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("candidateid", candidateId);
    searchParams.append("requisitionId", requisitionId);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

    // for monster power search
    getStatesbyCountry(apiparam): Observable<any> {
        let url = this.apiurl + "api/Master/GetStateByCountryAsync";
        let params = {
            countryid: apiparam,
        };

        let options = this.setHttpOptions(RequestMethod.Get, url);
        options.params = params;

        return this.http.get(url, options);
    }

  // API's for Metal Boolean search Advanced

  getworkAuthDetails(): Observable<any> {
    let url = this.apiurl + "api/Master/GetWorkAuthorizationAsync";

    let searchParams = new URLSearchParams();
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getAllthestates(): Observable<any> {
    let url = this.apiurl + "api/Master/GetStateAsync";

    let searchParams = new URLSearchParams();
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getDomainIndustry(): Observable<any> {
    let url = this.apiurl + "api/Master/GetDomainIndustryAsync";

    let searchParams = new URLSearchParams();
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }


  getproActiveMembers(): Observable<any> {
    let url = this.apiurl + "api/Master/GetProActiveMembersAsync";

    let searchParams = new URLSearchParams();
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  //  get the Glider Test

  gettheGliderTest(SearchText: string): Observable<any> {
    let url = this.apiurl + "api/Candidate/GetTechAssessmentNames";

    let searchParams = new URLSearchParams();
    searchParams.append('SearchText', SearchText);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  // Monster classic advanced search API



  getlanguages(): Observable<any> {
    let url = this.apiurl + "api/Master/GetMonsterClassicSearchLanguageListAsync";

    let searchParams = new URLSearchParams();
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

    GetMonsterClassicSearchStateList(countryCode): Observable<any> {
        let url = this.apiurl + "api/Master/GetMonsterClassicSearchStateListAsync";

        let searchParams = new URLSearchParams();
        searchParams.append('countryCode', countryCode);
        let options = { headers: this.httpOptions.headers, params: searchParams };

        return this.http.get(url, options);
    }

    GetMonsterClassicIndustryList(): Observable<any> {
        let url = this.apiurl + "api/Master/GetMonsterClassicSearchIndustryListAsync";

        let searchParams = new URLSearchParams();
        let options = { headers: this.httpOptions.headers, params: searchParams };

        return this.http.get(url, options);
    }

    GetMonsterClassicCategoryList(): Observable<any> {
        let url = this.apiurl + "api/Master/GetMonsterClassicSearchCategoryListAsync";

        let searchParams = new URLSearchParams();
        let options = { headers: this.httpOptions.headers, params: searchParams };

        return this.http.get(url, options);
    }
  // for Monster Classic search Both normal and Advanced search

  monsterClassicSearchAdvancedandNormal(apiparam): Observable<any> {
    let url = this.apiurl + "api/Candidate/GetMonsterClassicSearchCandidateListAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, apiparam, options);
  }


  // API's for career Builder advanced Search

  getlanguageDetails(): Observable<any> {
    let url = this.apiurl + "api/Master/GetCareerBuilderLanguagesAsync";

    let searchParams = new URLSearchParams();
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  /* CES search Begins API's CES Search */

  getCESCandidatesAsync(apiparam): Observable<any> {
    let url = this.apiurl + "api/Candidate/SearchCrownCandidateAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    return this.http.post(url, apiparam, options);
  }

  getCandidateResume(candidateid,ismatch): Observable<any> {
    let url = this.apiurl + "api/Candidate/GetCandidateDetailsByIdAsync";

    let searchParams = new URLSearchParams();
    searchParams.append("candidateid", candidateid);
    searchParams.append("origin", 'viewresume');
    searchParams.append("ismatch", ismatch);


    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

  getAppliedCandidates(requisitionid, pageindex, pagesize): Observable<any> {
    let url = this.apiurl + "api/Candidate/GetAppliedCandidatesAsync"
    let searchParams = new URLSearchParams();
    searchParams.append("RequisitionId", requisitionid);
    searchParams.append("PageIndex", pageindex);
    searchParams.append("PageSize", pagesize);

    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

/* CES Search Ends */

  /* Get states in Metal Match Filter */

  getStates(text): Observable<any> {
    let url = this.apiurl + "api/Master/GetRelatedStateAsync";
    let params = {
      text: text,
    };

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options);
  }
  getBooleanQuery(requisitionid): Observable<any> {
    let url = this.apiurl + "api/AIDrive/GetBooleanQueryByReqIdAsync";
    let searchParams = new URLSearchParams();
    searchParams.append('requisitionid', requisitionid);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }
  getcityFromStates(text: string): Observable<any> {
    let url = this.apiurl + "api/Master/GetRelatedCityWithStateCodeAsync";

    let searchParams = new URLSearchParams();
    searchParams.append("searchtext", text);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }


}
