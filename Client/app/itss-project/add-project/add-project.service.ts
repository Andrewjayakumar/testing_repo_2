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
export class AddprojectService {


  constructor(public http: Http, public dataservice: DataService) { }
  public apiurl = baseurl;
  public secureapiurl = authapiurl;

  getAlltheClients(term): Observable<any> {

    let url = this.secureapiurl + "api/MapsAccess/GetClients";

    let options = this.setHttpOptions(RequestMethod.Get, url);


    return this.http.get(url, options);
  }

  gettheClientLoc(): Observable<any> {
    let url = this.apiurl + "api/Master/GetStateAsync";


    let options = this.setHttpOptions(RequestMethod.Get, url);

    return this.http.get(url, options);
  }

  gettheLOBDetails(): Observable<any> {
    let url = this.apiurl + "api/Master/GetClientLOBAsync";


    let options = this.setHttpOptions(RequestMethod.Get, url);

    return this.http.get(url, options);
  }

  gettheRegionDetails(): Observable<any> {
    let url = this.apiurl + "api/Master/GetRegionAsync";


    let options = this.setHttpOptions(RequestMethod.Get, url);

    return this.http.get(url, options);
  }

  searchClientName(apiparam, userid): Observable<any> {
    let url = this.secureapiurl + "api/MapsAccess/GetClients";
    let params = {
      "clientName": apiparam,
      "page": "Requisition",
      "userid":userid
    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;

    return this.http.get(url, options);
  }

  gettheHiringManager(apiparam, obj): Observable<any> {
    let url = this.apiurl + "api/Requisition/GetHiringManagerListAsync";
    let params = {
      "managername": apiparam,
      "clientname": obj.clientCode
    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;

    return this.http.get(url, options);
  }

  getAlltheEmployeeDetails(): Observable<any> {
    let url = this.apiurl + "api/MSProject/GetEmployeesAsync";
    let options = this.setHttpOptions(RequestMethod.Get, url);

    return this.http.get(url, options);
  }

  getAllProjectStatus(): Observable<any> {
    let url = this.apiurl + "api/Master/GetProjectStatusAsync";
    let options = this.setHttpOptions(RequestMethod.Get, url);

    return this.http.get(url, options);
  }

  postPdfFile(params ): Observable<any> {
    let url = this.apiurl + "api/MSProject/UploadMsProjectSOWFileAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    //  return this.http.post(url, params, options);
    url += `?projectid=${params.get("projectid")}`;
    delete options.headers["Content-Type"];
    options.headers['Accept'] = 'application/json';
    params.delete("projectid");
    

    return this.http.post(url,params,   options).pipe(

    );

  }
  
  // export to excel

  // for export to Excel Button click

  exporttoexcelResults(params): Observable<any> {

    let url = this.apiurl + "api/MSProject/ExportMSProjectSearchAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    //  return this.http.post(url, params, options);

    return this.http.post(url, params, options).pipe(

    );

  }

  getDeliveryModel(): Observable<any> {
    let url = this.apiurl + "api/Requisition/GetDeliveryModelsMasterAsync";
    let options = this.setHttpOptions(RequestMethod.Get, url);
    return this.http.get(url, options);
  }

  // for create Project Post Request

  postCreateProject(params): Observable<any> {

    let url = this.apiurl + "api/MSProject/CreateMsProjectAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);
    //  return this.http.post(url, params, options);

    return this.http.post(url, params, options).pipe(

    );

  }
  // for update post Request

  postUpdateProject(params): Observable<any> {

    let url = this.apiurl + "api/MSProject/UpdateMsProjectAsync";
    let options = this.setHttpOptions(RequestMethod.Post, url);

    return this.http.post(url, params, options).pipe(

    );

  }
  // Get the project Details By Id

  getProjectDetailsById(apiparam): Observable<any> {
    let url = this.apiurl + "api/MSProject/GetMsProjectByIdAsync";
    let params = {
      "projectId": apiparam

    }

    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;

    return this.http.get(url, options);
  }
  getReqListById(apiparam): Observable<any> {
    let url = this.apiurl + "api/MSProject/GetRequisitionsByProjectIdAsync";
    let params = { "projectId": apiparam }
    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;

    return this.http.get(url, options);
  }

  getlinkedOpportunities(smclientcode,deliverymodel): Observable<any> {
    let url = this.apiurl + "api/SalesForce/GetSFOpportunityAsync";
    let params = {"smclientcode": smclientcode ,"deliverymodel":deliverymodel }
    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
    return this.http.get(url, options);
  }

  searchHiringManagerFrmSalesforce(managername: string, smclientcode: string,hiringmanagerid?:string): Observable<any> {
    let url = this.apiurl + "api/SalesForce/GetSFContactsAsync";
    let params = {
       "managername":managername,
        "smclientcode": smclientcode, 
        "hiringmanagerid":hiringmanagerid }    
    let options = this.setHttpOptions(RequestMethod.Get, url);
    options.params = params;
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

    // call set baseurlparams if needed
    //remove options.url
    delete options.url;

    return options;
  }

  trackActivityPageOpened(data) {
    // data should be in the format - { "pagename": "CandidateAdvancedSearch" }
    return this.dataservice.postPageTracker(this.apiurl + "api/UserActivityLog/PageTrackerAsync", data);
  }
}
