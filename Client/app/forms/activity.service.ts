import { Injectable } from '@angular/core';
import { DataService } from '../core/services/data.service';
import { Observable } from 'rxjs';
import { Http, Response, RequestOptions, RequestMethod, URLSearchParams } from '@angular/http';
import { DataServiceOptions } from '../core/services/data-service-options';
import { baseurl } from '../../environment';

@Injectable()
export class ActivityService {

    
    constructor(public http: Http, public dataservice: DataService) { }
    public apiurl = baseurl;
    
    getCandJournal(): Observable<any> {
       
        let url = this.apiurl + "api/UserActivityLog/GetActivityLogsByUserAsync";

        //let params = { "candidateId": "4302" };
        let options = this.setHttpOptions(RequestMethod.Get, url);
        return  this.http.get(url, options);
        //return results;
    }

    getActivityHistory(pageIndex, pageSize?, DataModel?): Observable<any> {

        let params = {
            "pageindex": 1 //default is 1
           
         } 
        if (pageIndex)
            params.pageindex = pageIndex;
        if (pageSize)
            params['pagesize'] = pageSize;
        if (DataModel) //&& DataModel.category
        { 
            params['category'] = DataModel.category;
            params['searchtext'] = DataModel.searchText;
            params['action'] = DataModel.action;
            params['datefilter'] = DataModel.datefilter;
            
        }
        

        let url = this.apiurl + "api/UserActivityLog/GetAllActivityLogsByUserAsync";
        let options = this.setHttpOptions(RequestMethod.Post, url);
        return this.http.post(url, params, options)

    }

    getSubCategoryOptions(): Observable<any> {
        let url = this.apiurl + "api/Master/GetJournalTypeByCategoryAsync";

        let options = this.setHttpOptions(RequestMethod.Get, url);
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
        return this.dataservice.postPageTracker(this.apiurl + "api/UserActivityLog/PageTrackerAsync", data);
    }
}
