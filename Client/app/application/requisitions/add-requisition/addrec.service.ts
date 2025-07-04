import { Injectable } from "@angular/core";
//import {environment} from '../../environments/environment';
//import { HttpClient, HttpHeaders, URLSearchParams } from '@angular/common/http';
import {
  Http,
  Response,
  RequestOptions,
  RequestMethod,
  URLSearchParams
} from "@angular/http";
import { Observable } from "rxjs/Observable";
import { DataService } from "../../../core/services/data.service";
import { baseurl } from "../../../../environment";
import { authapiurl } from "../../../../environment";

@Injectable()
export class AddrecService {
  constructor(private http: Http, private dataservice: DataService) {
    this.httpOptions.headers = dataservice.getHttpHeaders();
  }

  private apiUrl = baseurl;
  private clientUrl = authapiurl;

  httpOptions = new RequestOptions();

  /**
   * GET METHODS
   */

  getRecType(): Observable<any> {
    let url = this.apiUrl + "api/Master/GetRequisitionTypeAsync";
    return this.http.get(url, this.httpOptions);
  }

  getDeliveryModels(): Observable<any> {
    let url = this.apiUrl + "api/Requisition/GetDeliveryModelsMasterAsync";
    return this.http.get(url, this.httpOptions);
  }


  getStatus(): Observable<any> {
    let url = this.apiUrl + "api/Master/GetStatusAsync";
    return this.http.get(url, this.httpOptions);
  }

  getReqPriority(typeid: any): Observable<any> {
    // let url = this.apiUrl + "api/Master/GetRequisitionPriorityByTypeIdAsync";
    let url = this.apiUrl + "api/Master/GetRequisitionPriorityAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("RequisitionTypeId", typeid);
    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;
    return this.http.get(url, options);
  }

  getQualification(): Observable<any> {
    let url = this.apiUrl + "api/Master/GetRequisitionQualificationsAsync";
    return this.http.get(url, this.httpOptions);
  }

  getCategory(): Observable<any> {
    let url = this.apiUrl + "api/Master/GetCategoryAsync";
    return this.http.get(url, this.httpOptions);
  }

  getTravelTypes(): Observable<any> {
    let url = this.apiUrl + "api/Master/GetTravelTypeAsync";
    return this.http.get(url, this.httpOptions);
  }

  getJobTitle(text: string): Observable<any> {
    let url = this.apiUrl + "api/Master/GetRelatedJobTitlesAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("text", text);
    let options = new RequestOptions();
    options.headers = this.httpOptions.headers;
    options.params = searchParams;

    return this.http.get(url, options);
  }

  getTCU(): Observable<any> {
    let url = this.apiUrl + "api/Master/GetTCUAsync";
    return this.http.get(url, this.httpOptions);
  }

  getZipCodeListByText(digits: string, deliverymodelid: any): Observable<any> {
    let url = this.apiUrl + "api/Master/GetZipCodeByTextAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("text", digits);
    searchParams.append("deliverymodelid", deliverymodelid);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }

  getSkillsByText(skill: string): Observable<any> {
    let url = this.apiUrl + "api/Master/GetSovrenSkillsAsync";
    let searchParams = new URLSearchParams();
    let encodedSkill = encodeURIComponent(skill);
    searchParams.append("text", encodedSkill);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }

  getCityListByZipcode(zipcode: string, deliverymodelid: any): Observable<any> {
    let url = this.apiUrl + "api/Master/GetCityListFromZipCodeAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("zipcode", zipcode);
    searchParams.append("deliverymodelid", deliverymodelid);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getStates(text: string, deliverymodelid: any): Observable<any> {
    let url = this.apiUrl + "api/Master/GetRelatedStateAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("text", text);
    searchParams.append("deliverymodelid", deliverymodelid);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getCityFromStates(stateid: string, deliverymodelid: any): Observable<any> {
    let url = this.apiUrl + "api/Master/GetCityByStateAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("stateid", stateid);
    searchParams.append("deliverymodelid", deliverymodelid);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getZipcodeFromCityState(stateid: string, cityid: string, deliverymodelid: any): Observable<any> {
    let url = this.apiUrl + "api/Master/GetZipCodeByCityAndStateAsync";
    let searchParams = new URLSearchParams();
    searchParams.set("stateid", stateid);
    searchParams.append("cityid", cityid);
    searchParams.append("deliverymodelid", deliverymodelid);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getProjectType(): Observable<any> {
    let url = this.apiUrl + "api/Master/GetProjectTypeAsync";
    return this.http.get(url, this.httpOptions);
  }

  getMSProjectDetailsById(msprojectid: any): Observable<any> {
    let url = this.apiUrl + "api/MSProject/GetMsProjectDetailsByIdAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("projectId", msprojectid);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }
  /**
   * Client Details Related Calls
   */
  getClientName(text: string, userid: string): Observable<any> {
    let url = this.clientUrl + "api/MapsAccess/GetClients";
    let searchParams = new URLSearchParams();
    searchParams.append("clientName", text);
    searchParams.append("page", 'Requisition');
    searchParams.append("userid", userid);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getAlltheClientNames(): Observable<any> {
    let url = this.clientUrl + "api/MapsAccess/GetClients";

    let options = { headers: this.httpOptions.headers };
    return this.http.get(url, options);
  }

  getRegionByClient(clientcode: string): Observable<any> {
    let url = this.apiUrl + "api/Master/GetRegionNameByClientAsync";

    let searchParams = new URLSearchParams();
    searchParams.append("clientcode", clientcode);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getDeliveryMangerByClient(client: string): Observable<any> {
    let url = this.apiUrl + "api/Requisition/GetDMByClientAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("clientid", client);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getDeliveryManagerByClientAndRegion(
    client: string,
    regionid: string
  ): Observable<any> {
    let url =
      this.apiUrl + "api/Requisition/GetDeliveryManagerByRegionOrClient";
    let searchParams = new URLSearchParams();
    searchParams.append("clientcode", client);
    searchParams.append("regionid", regionid);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getClientLOBOptions(clientid?): Observable<any> {
    let url = this.apiUrl + "api/Master/GetClientLOBAsync";
    let options = { headers: this.httpOptions.headers };
    if (clientid) {
      let searchParams = new URLSearchParams();
      searchParams.append("clientid", clientid);
      options["params"] = searchParams;
    }

    return this.http.get(url, options);
  }
  searchHiringManagerFrmSalesforce(clientname: string, managername: string,hiringmanagerid?:string): Observable<any> {
    let url = this.apiUrl + "api/SalesForce/GetSFContactsAsync";
    let searchParams = new URLSearchParams();
    searchParams.set("smclientcode", clientname);
    searchParams.append("managername", managername);
    searchParams.append("hiringmanagerid", hiringmanagerid);

    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }
  getHiringManager(clientname: string, managername: string): Observable<any> {
    let url = this.apiUrl + "api/Requisition/GetHiringManagerListAsync";
    let searchParams = new URLSearchParams();
    searchParams.set("clientcode", clientname);
    searchParams.append("managername", managername);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getHiringManagerDetails(managerid: any): Observable<any> {
    let url = this.apiUrl + "api/Requisition/GetHiringManagerAsync";
    let searchParams = new URLSearchParams();
    searchParams.set("Id", managerid);

    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getRecruitersList(name: string, clientid: string) {
    let url = this.apiUrl + "api/Requisition/GetRecruitersByUserAsync";
    let searchParams = new URLSearchParams();
    searchParams.set("clientid", clientid);
    searchParams.append("name", name);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getGCIDDetails(text) {
    let url = this.apiUrl + "api/Candidate/GetGCIIdListAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("search", text);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getSalesRepList(text: string): Observable<any> {
    let url = this.apiUrl + "api/Master/GetSalesRepAsync";
    let searchParams = new URLSearchParams();
    // searchParams =  searchParams.append('clientid', clientid);
    searchParams.append("text", text);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getInsideSalesorVMO(text: string): Observable<any> {
    let url = this.apiUrl + "api/Master/GetInsideSalesORVMOTMMasterAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("text", text);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getProjectName(text: string, clientcode?: string): Observable<any> {
    let url = this.apiUrl + "api/Master/GetAllMSProjectNamesAsync";

    let searchParams = new URLSearchParams();
    searchParams.append("msprojectname", text);
    if (clientcode) {
      searchParams.append("clientcode", clientcode);
    }

    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getInteviewType(): Observable<any> {
    let getInterviewType = `${this.apiUrl}api/Master/GetInterviewTypeAsync`;

    return this.http.get(getInterviewType, this.httpOptions);
  }

  getTimeZone(): Observable<any> {
    let timeZoneType = `${this.apiUrl}api/Master/GetDayLightSaveTimeAsync`;

    return this.http.get(timeZoneType, this.httpOptions);
  }

  getInterviewTypesManager(): Observable<any> {
    let interviewTypeMgr = `${this.apiUrl}api/Master/GetManagerInterviewTypeAsync`;

    return this.http.get(interviewTypeMgr, this.httpOptions);
  }

  getMSPStatusValues(): Observable<any> {
    let url = `${this.apiUrl}api/Master/GetMSPStatusAsync`;
    return this.http.get(url, this.httpOptions);
  }

  getPracticeTowerValues(): Array<string> {
    //   let url = this.apiUrl + "api/Requisition/GetPracticeTypesforMSProject ";

    //   let searchParams = new URLSearchParams();
    // searchParams.append('msprojectid', msprojectid);
    //   let options = { headers: this.httpOptions.headers, params: searchParams };
    if (!list) {
      var list = new Array();

      list.push(
        "AI & Data Engineering",
        "Generative AI",
        "Platform Operations",
        "Engineering Management",
        "Enterprise Solutions",
        "Platform Engineering",
        "Quality Engineering",
        "Web3 & Gaming",
        "Others"
      );
    }
    return list;
  }

  getPrimarySkills(text: string): Observable<any> {
    let url = this.apiUrl + "api/Master/GetRelatedSkillsAsync";
    let searchParams = new URLSearchParams();
    let encodedSkill = encodeURIComponent(text);
    searchParams.append("text", encodedSkill);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }

  getReasonsforStatusChange(statusid): Observable<any> {
    let url = `${this.apiUrl}api/Master/GetRequisitionStatusReasonListAsync`;
    let searchParams = new URLSearchParams();
    searchParams.append("Id", statusid);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }

  getGPGPMMargins(reqid, billrate, mingp, mingpm): Observable<any> {
    let endpointUrl = `${this.apiUrl}api/Requisition/GetMargin`;
    let searchParams = new URLSearchParams();
    searchParams.append("Requisitionid", reqid);
    searchParams.append("BillRate", billrate);
    searchParams.append("gp", mingp);
    searchParams.append("gpm", mingpm);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(endpointUrl, options);
  }
  
  getWiredStatus(): Observable<any> {
    let url = `${this.apiUrl}api/Master/GetRequisitionWiredStatusListAsync`;
    return this.http.get(url, this.httpOptions);
  }

  postTexttoGetSkills(editortext): Observable<any> {
    let url = `${this.apiUrl}api/Candidate/GetSkillsFromTextAsync`;
    let data = { text: editortext };

    let options = { headers: this.httpOptions.headers };
    // options.url = url;
    return this.http.post(url, data, options);
  }

  getRequisitionDetailsById(requisitionid: any): Observable<any> {
    let url = this.apiUrl + "api/Requisition/GetRequisitionByIdAsync";

    let searchParams = new URLSearchParams();
    searchParams.append("id", "" + requisitionid);
    searchParams.append("origin", "edit");
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  postRequisition(formData: any) {
    let url = `${this.apiUrl}api/Requisition/CreateRequisitionAsync`;
    let data = formData;
    let options = { headers: this.httpOptions.headers };

    return this.http.post(url, data, options);
  }

  updateRequisition(dataobj: any, requisitionid) {
    let url = `${this.apiUrl}api/Requisition/UpdateRequisitionAsync`;
    let data = dataobj;
    //id is extra parameter required for put needed for requisition update
    data["id"] = requisitionid;
    let options = { headers: this.httpOptions.headers };

    return this.http.put(url, data, options);
  }

  // for getting linked opportunity

  getlinkedOpportunities(managerid: any,delivermodel?:any): Observable<any> {
    let url = this.apiUrl + "api/SalesForce/GetSFOpportunityAsync";
    let searchParams = new URLSearchParams();
    searchParams.set("smclientcode", managerid);
    searchParams.set("deliverymodel", delivermodel);


    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getAutomationPriority(): Observable<any> {
    let url = `${this.apiUrl}api/Master/GetAutomationPriorityAsync`;
    return this.http.get(url, this.httpOptions);
  }


  getAcaDocumentList(requisitionId, startDate, endDate, deliverymodelid): Observable<any> {
    let url = this.apiUrl + "api/Requisition/GetACADocumentListAsync";
    let searchParams = new URLSearchParams();
    searchParams.set("requisitionid", requisitionId);
    searchParams.set("startdate", startDate);
    searchParams.set("enddate", endDate);
    searchParams.set("deliverymodelid", deliverymodelid);


    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getCircleList(): Observable<any> {
    let url = this.apiUrl + "api/Requisition/GetRequisitionCirclesByAsync";
    return this.http.get(url, this.httpOptions);
  }

  getCommunityList(circleid: any): Observable<any> {
    let url = this.apiUrl + "api/Requisition/GetRequisitionCommunityByAsync";
    let searchParams = new URLSearchParams();
    searchParams.set("circleid", circleid);

    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  getsubRoleFamily(rolefamilyid: any): Observable<any> {
    let url = this.apiUrl + "api/Master/GetSubRoleFamilyAsync";
    let searchParams = new URLSearchParams();
    searchParams.set("rolefamilyid", rolefamilyid);

    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }
  getRoleFamily(): Observable<any> {
    let url = this.apiUrl + "api/Master/GetRoleFamilyAsync";
    return this.http.get(url, this.httpOptions);
  }
  getBandlevelData(): Observable<any> {
    let url = this.apiUrl + "api/Master/GetBrandLevelTitleAsync";
    return this.http.get(url, this.httpOptions);
  }

  getStdJobTitle(): Observable<any> {
    let url = this.apiUrl + "api/Master/GetStandardJobTitlesAsync";
    return this.http.get(url, this.httpOptions);
  }

  getdurationHistory(requisitionid): Observable<any> {
    let url = this.apiUrl + "api/Requisition/GetRequisitionDateHistoryAsync";
    let searchParams = new URLSearchParams();
    searchParams.append("requisitionId", requisitionid);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }

  GetCirclesMsProjectById(msprojectid): Observable<any> {
    let url = this.apiUrl + "api/Requisition/GetCirclesMsProjectById";
    let searchParams = new URLSearchParams();
    searchParams.append("projectId", msprojectid);
    let options = { headers: this.httpOptions.headers, params: searchParams };
    return this.http.get(url, options);
  }

  GetStandardSkillsMappingsAsync(jobtitleid: any, skillmappingId: any): Observable<any> {
    let url = this.apiUrl + "api/Master/GetStandardSkillsMappingsAsync";
    let searchParams = new URLSearchParams();
    searchParams.set("jobtitleid", jobtitleid);
    searchParams.set("skillmappingId", skillmappingId);

    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  GetStandardRolesHorizonsAsync(jobtitleid: any,id:any): Observable<any> {
    let url = this.apiUrl + "api/Master/GetStandardRolesHorizonsAsync";
    let searchParams = new URLSearchParams();
    if(id)
    searchParams.set("skillmappingId", id);
    searchParams.set("jobTitleId", jobtitleid);


    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  onStandardjobTitleHorozonChange(standardJobTitleId: any,skillmappingId:any): Observable<any> {
    let url = this.apiUrl + "api/Requisition/GetCircleByStandardJobTitleAsync";

    let searchParams = new URLSearchParams();
    searchParams.set("standardJobTitleId", standardJobTitleId);
    searchParams.set("skillmappingId", skillmappingId);


    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }
  onCirclelistChange(circleId: any, standardJobTitleId:any): Observable<any> {
    let url = this.apiUrl + "api/Requisition/GetCommunityByCircleAsync";
    let searchParams = new URLSearchParams();
    searchParams.set("circleId", circleId);
    searchParams.set("standardJobTitleId", standardJobTitleId);
    let options = { headers: this.httpOptions.headers, params: searchParams };

    return this.http.get(url, options);
  }

  /*
  * RedepLedBy Details Related Calls
  */
 getRedepLedBy(): Observable<any> {

  let url = this.apiUrl + "api/Master/GetRedepLedByAsync";
  return this.http.get(url, this.httpOptions);


 }
   /*
  * req fulfillment reason changes!
  */
   getReqFulfillmentReason(): Observable<any> {

    let url = this.apiUrl + "api/Master/GetReqFulfillmentReasonAsync";
    return this.http.get(url, this.httpOptions);
  
  
   }

   getExperienceLevel(): Observable<any> {
    let url = this.apiUrl + "api/Master/GetExperienceLevelAsync";
    return this.http.get(url, this.httpOptions);

   }

  getProjectLOB(): Observable<any> {
    let url = this.apiUrl + "api/Master/GetProjectLOBAsync";
    return this.http.get(url, this.httpOptions);
  }
}
