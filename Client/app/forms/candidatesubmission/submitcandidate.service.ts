import { Injectable } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Http, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { baseurl, authapiurl } from '../../../environment';
import { Observable } from 'rxjs';

@Injectable()
export class SubmitcandidateService {
  public httpOptions: any = {};

  constructor(private http: Http, private dataservice: DataService) {
    this.httpOptions.headers = this.dataservice.getHttpHeaders();
  }

  private apiUrl = baseurl;
  private clientUrl = authapiurl;

  /**
   * CAndidate outline APIS
   * 
   **/
  getCandidateOutline(candidateid) {
    let url = this.apiUrl + "api/Candidate/GetCandidateOutlineByIdAsync";
    let searchParams = new URLSearchParams();
    searchParams.append('candidateid', candidateid);
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;
    options.params = searchParams;

    return this.http.get(url, options);
  }


  getJobCategory(candidateid) {
    let url = this.apiUrl + "api/Master/GetJobCategoryAsync";
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;

    return this.http.get(url, options);
  }

  getContactTypes(iscall) {
    let url = this.apiUrl + "api/Master/GetCandidateManualJournalTypeAsync";
    let searchParams = new URLSearchParams();
    searchParams.append('iscall', iscall);
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;
    options.params = searchParams;

    return this.http.get(url, options);
  }

  getRegions() {
    let url = this.apiUrl + "api/Master/GetRegionAsync";
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;

    return this.http.get(url, options);
  }

  getTowers() {
    let url = this.apiUrl + "api/Master/GetRequisitionTowerAsync";
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;

    return this.http.get(url, options);
  }

  getSubTowers(towerid) {
    let url = this.apiUrl + "api/Master/GetRequisitionSubTowerAsync";
    let searchParams = new URLSearchParams();
    searchParams.append('towerid', towerid);
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;
    options.params = searchParams;

    return this.http.get(url, options);
  }

  getTagMembers() {
    let url = this.apiUrl + "api/Master/GetProActiveMembersAsync";
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;

    return this.http.get(url, options);
  }
  getlabels(): Observable<any> {
    let url = this.apiUrl + "api/Master/GetLabelsAsync";
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;
    return this.http.get(url, options);
  }

  getDemandPlans(demandName) {
    let url = this.apiUrl + "api/HotBook/GetDemandPlanNamesAsync";
    let searchParams = new URLSearchParams();
    searchParams.append('demandName', demandName);
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;
    options.params = searchParams;

    return this.http.get(url, options);
  }

  getAllCurrency(currency) {
    let url = this.apiUrl + "api/Master/GetCurrencyAsync";
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;

    return this.http.get(url, options);
  }

  getPositionType(position) {
    let url = this.apiUrl + "api/Master/GetPositionTypeAsync";
    let options = new RequestOptions();
    options.method = "GET";
    let searchParams = new URLSearchParams();
    searchParams.append('portalcode', 'col');
    options.headers = this.httpOptions.headers;
    options.params = searchParams;


    return this.http.get(url, options);
  }

  getWebSiteTypes(websitetypes) {
    let url = this.apiUrl + "api/Master/GetWebSiteTypeAsync";
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;

    return this.http.get(url, options);
  }

  getPrimarySkills(searchtext: string): Observable<any> {
    let url = this.apiUrl + "api/Master/GetSkillAsync";

    let searchParams = new URLSearchParams();
    searchParams.append('searchtext', searchtext);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
    //  /api/Master/GetRelatedSkillsAsync skill, skill , text
  }

  getCityByZipCode(zipcode: string): Observable<any> {
    let url = this.apiUrl + "api/Master/GetCityListFromZipCodeAsync";

    let searchParams = new URLSearchParams();
    searchParams.append('zipcode', zipcode);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
    //  /api/Master/GetRelatedSkillsAsync skill, skill , text
  }

  getWorkAuthorization() {
    let url = this.apiUrl + "api/Master/GetWorkAuthorizationAsync";
    let options = new RequestOptions();
    options.method = "GET";
   // let searchParams = new URLSearchParams();
   // searchParams.append('countryCode', countryid);
    options.headers = this.httpOptions.headers;
    //options.params = searchParams;

    return this.http.get(url, options);
  }

  getMyReqs(term): Observable<any> {
    let url = this.apiUrl + "api/Bot/GetRelatedRequsitionsByDMAsync";
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;
    let searchParams = new URLSearchParams();
    searchParams.append('text', term);
    options.params = searchParams;
    return this.http.get(url, options);
  }

  getAllReqs(term): Observable<any> {
    let url = this.apiUrl + "api/Bot/GetRelatedRequsitionsByRecruitersAsync";
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;
    let searchParams = new URLSearchParams();
    searchParams.append('text', term);
    options.params = searchParams;
    return this.http.get(url, options);
  }

  getHotBooks(term): Observable<any> {
    let url = this.apiUrl + "api/HotBook/GetHotBookFolderNameByUserAsync";
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;
    let searchParams = new URLSearchParams();
    searchParams.append('tagName', term);
    options.params = searchParams;
    return this.http.get(url, options);
  }
  /**
   ***************** Submission related APIs *******************
   * **/


  getCandidateSourceOptions() {
    let url = this.apiUrl + 'api/Master/GetCandidateSourceAsync';
    return this.http.get(url, this.httpOptions);
  }

  getEmployeeType() {

    let url = this.apiUrl + 'api/Master/GetEmployeeJobTypeAsync';
    return this.http.get(url, this.httpOptions);

    //employeejobtypes
  }

  getSubmissionChecklistandType(candidateId, requisitionid) {
    let url = this.apiUrl + 'api/Candidate/GetSubmissionCheckListAndTypeByIdAsync';
    let searchParams = new URLSearchParams();
    searchParams.append('candidateId', candidateId);
    searchParams.append('requisitionid', requisitionid);
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }


  getCategoryandPayRatebyEmployeeType(empTypeid, country, reqID) {
    let url = this.apiUrl + 'api/Candidate/GetEmployeeCategoryAndPayTypeAsync';
    let searchParams = new URLSearchParams();
    searchParams.append('employeetypeid', empTypeid);
    searchParams.append('country', country);
    searchParams.append('requisitionid', reqID);
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);

  }

  getSubtierVendorNames(paramName) {
    let url = this.apiUrl + 'api/Master/GetVendorListBySearchTextAsync';
    let searchParams = new URLSearchParams();
    searchParams.append('vendorName', paramName);
    // searchParams.append('country', country);
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);

  }

  getVendorInfobyId(vendorid) {
    let url = this.apiUrl + 'api/Master/GetVendorInfoByIdAsync';
    let searchParams = new URLSearchParams();
    searchParams.append('vendorId', vendorid);
    // searchParams.append('country', country);
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

  getGPGPMandMarkup(reqid, billrate, payrate, unit, employeetype, categoryid, shadowCandidate, perdiem?, subtierref?, freebillinghr?, discount?) {
    let url = this.apiUrl + 'api/Candidate/CalculateGPGPMAsync';
    let searchParams = new URLSearchParams();
debugger;
    searchParams.append("RequisitionId", reqid);
    searchParams.append("BillRate", billrate);
    searchParams.append("PayRate", payrate);
    searchParams.append("PayRateUnit", unit);
    searchParams.append("EmployeeJobTypeId", employeetype);
    searchParams.append("EmployeeCategoryId", categoryid);
    searchParams.append("PerDiem", perdiem);
    searchParams.append("SubtierReferral", subtierref);
    searchParams.append("FreeBillingHours", freebillinghr);
    searchParams.append('OtherDiscounts', discount);
    searchParams.append('IsShadowCandidate', shadowCandidate);
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

  /*** Submission Post Call *****/

  SubmitCandidate(data) {
    //debugger;
    let url = this.apiUrl + 'api/Candidate/CreateCandidateOutlineAndSubmissionAsync';

    //  let options = { headers: this.httpOptions.headers };
    //    options.headers['Access-Control-Allow-Origin'] = '*';
    let options = new RequestOptions();
    let new_headers = Object.assign({}, this.httpOptions.headers);

    options.headers = new_headers;
    options.headers['Access-Control-Allow-Origin'] = '*';
    delete options.headers["Content-Type"];


    return this.http.post(url, data, options);
  }

  SubmitCOandJournals(data) {
    //debugger;
    let url = this.apiUrl + 'api/Candidate/CreateCandidateJournalAndCOAsync';

    //  let options = { headers: this.httpOptions.headers };
    //    options.headers['Access-Control-Allow-Origin'] = '*';
    let options = new RequestOptions();
    let new_headers = Object.assign({}, this.httpOptions.headers);

    options.headers = new_headers;
    options.headers['Access-Control-Allow-Origin'] = '*';
    delete options.headers["Content-Type"];


    return this.http.post(url, data, options);
  }

  /**FIle upload **/

  uploadSubmissionResume(formData): Observable<any> {
    // debugger;
    let url = this.apiUrl + "api/Candidate/UploadSubmissionResumeAsync";

    let options = new RequestOptions();
    let new_headers = Object.assign({}, this.httpOptions.headers);
    options.headers = new_headers;
    //   let searchParams = new URLSearchParams();
    // searchParams.append("requisitionId", reqId);
    //searchParams.append("candidateId", candidateId);



    // options.params = obj;

    //   searchParams.append("file", filename);

    delete options.headers["Content-Type"];
    options.headers['Accept'] = 'application/json';
    return this.http.post(url, formData, options).pipe(

    );

  }

  /** Candidate resume upload **/

  getCandidateDetailsById(candidateid) {
    let url = this.apiUrl + "api/Candidate/GetCandidateBasicDetailsByIdAsync";
    let options = new RequestOptions();
    options.method = "GET";
    let searchParams = new URLSearchParams();
    searchParams.append('candidateId', candidateid);
    options.headers = this.httpOptions.headers;
    options.params = searchParams;

    return this.http.get(url, options);
  }

  getOnlyReq(text) {
    let url = this.apiUrl + "api/Bot/GetRelatedRequsitionsByRecruitersAsync";
    let options = new RequestOptions();
    options.method = "GET";
    let searchParams = new URLSearchParams();
    searchParams.append('text', text);
    options.headers = this.httpOptions.headers;
    options.params = searchParams;

    return this.http.get(url, options);
  }

  getjobTitleAndSkills(reqID) {
    let url = this.apiUrl + "api/Bot/GetJobTitleAndSkillsByRequisitionIdAsync";
    let options = new RequestOptions();
    options.method = "GET";
    let searchParams = new URLSearchParams();
    searchParams.append('requisitionId', reqID);
    options.headers = this.httpOptions.headers;
    options.params = searchParams;

    return this.http.get(url, options);
  }

  sourceToReq(data) {
    //debugger;
    let url = this.apiUrl + 'api/Candidate/PinCandidateRequisitionAsync';

    let options = new RequestOptions();
    let new_headers = Object.assign({}, this.httpOptions.headers);

    options.headers = new_headers;
    options.headers['Access-Control-Allow-Origin'] = '*';
    delete options.headers["Content-Type"];
    return this.http.post(url, data, options);
  }

  searchHotbook(text) {
    let url = this.apiUrl + "api/HotBook/GetHotBookFolderNameByUserAsync";
    let options = new RequestOptions();
    options.method = "GET";
    let searchParams = new URLSearchParams();
    searchParams.append('tagName', text);
    options.headers = this.httpOptions.headers;
    options.params = searchParams;

    return this.http.get(url, options);
  }

  addToHotbook(data) {
    let url = this.apiUrl + 'api/HotBook/AddCandidateInHotBookFolderAsync';

    let options = new RequestOptions();
    let new_headers = Object.assign({}, this.httpOptions.headers);

    options.headers = new_headers;
    options.headers['Access-Control-Allow-Origin'] = '*';
    delete options.headers["Content-Type"];
    return this.http.post(url, data, options);
  }

  
  updateDNC(data) {
    let url = this.apiUrl + 'api/Candidate/UpdateCandidateDNCStatusAsync';

    let options = new RequestOptions();
    let new_headers = Object.assign({}, this.httpOptions.headers);

    options.headers = new_headers;
    options.headers['Access-Control-Allow-Origin'] = '*';
    delete options.headers["Content-Type"];
    return this.http.post(url, data, options);
  }

  sendSMS(data) {
    let url = this.apiUrl + 'api/Candidate/SendSms';

    let options = new RequestOptions();
    let new_headers = Object.assign({}, this.httpOptions.headers);

    options.headers = new_headers;
    options.headers['Access-Control-Allow-Origin'] = '*';
    delete options.headers["Content-Type"];
    return this.http.post(url, data, options);
  }

  getSMS(candidateID) {
    let url = this.apiUrl + "api/Candidate/GetSMSHistoryAsync";
    let options = new RequestOptions();
    options.method = "GET";
    let searchParams = new URLSearchParams();
    searchParams.append('candidateID', candidateID);
    options.headers = this.httpOptions.headers;
    options.params = searchParams;

    return this.http.get(url, options);
  }

  getResume(candidateid,sourceid,ismatch): Observable<any> {
    let url = this.apiUrl + "api/Candidate/GetCandidateResume";

    let searchParams = new URLSearchParams();
    searchParams.append("candidateid", candidateid);
    searchParams.append("sourceid", sourceid);
    searchParams.append("ismatch", ismatch);


    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

  getJournals(data) {
    let url = this.apiUrl + 'api/Candidate/GetCandidateJournalEntryByIdAsync';

    let options = new RequestOptions();
    let new_headers = Object.assign({}, this.httpOptions.headers);

    options.headers = new_headers;
    options.headers['Access-Control-Allow-Origin'] = '*';
    delete options.headers["Content-Type"];
    return this.http.post(url, data, options);
  }

  getMainJournals() {
    let url = this.apiUrl + "api/Master/GetMainJournalTypesAsync";
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;

    return this.http.get(url, options);
  }

  getSubJournals(GroupId) {
    let url = this.apiUrl + "api/Master/GetSubJournalTypeAsync";
    let options = new RequestOptions();
    options.method = "GET";
    let searchParams = new URLSearchParams();
    searchParams.append('GroupId', GroupId);
    options.headers = this.httpOptions.headers;
    options.params = searchParams;

    return this.http.get(url, options);
  }

  getStatus() {
    let url = this.apiUrl + "api/Master/GetStatusAsync";
    let options = new RequestOptions();
    options.method = "GET";
    options.headers = this.httpOptions.headers;
    return this.http.get(url, options);
  } 

  getReqs(candidateid, filterId) {
    let url = this.apiUrl + "api/Candidate/GetSourcedReqListByCandidateIdAsync";
    let options = new RequestOptions();
    options.method = "GET";
    let searchParams = new URLSearchParams();
    searchParams.append('candidateid', candidateid);
    searchParams.append('filterId', filterId);
    options.headers = this.httpOptions.headers;
    options.params = searchParams;

    return this.http.get(url, options);
  }

  postSubmitToClient(data: any): Observable<any>  {
    let url = this.apiUrl + "api/Candidate/CreateClientSubmission";
    let options = { headers: this.httpOptions.headers };
    return this.http.post(url, data, options);

  }


}
