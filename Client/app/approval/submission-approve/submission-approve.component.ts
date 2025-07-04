import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Http, RequestOptions, RequestMethod, URLSearchParams, Headers, Response } from '@angular/http';
import { baseurl, authapiurl } from '../../../environment';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-submission-approve',
  templateUrl: './submission-approve.component.html',
  styleUrls: ['./submission-approve.component.scss']
})
export class SubmissionApproveComponent implements OnInit, AfterViewInit {
   
    public httpOptions: any = {};
    approvalId = 0;

    private apiUrl = baseurl;
    private clientUrl = authapiurl;

    constructor(private http: Http, private dataservice: DataService, private currentRoute: ActivatedRoute) { }

    ngOnInit() {
        

        this.currentRoute.queryParams.subscribe(params => {

            this.approvalId = params['Id'];


        });

       
    }

    ngAfterViewInit(): void {
        if (this.approvalId) {
            debugger;
            let url = this.apiUrl + "api/ApprovalProcess/InitiateApprovalProcessAsync";
            let options = new RequestOptions();
            // let new_headers = Object.assign({}, this.httpOptions.headers);
            options.headers = new Headers();
            options.headers['Accept'] = "application/json, */*";
            options.headers['Access-Control-Allow-Origin'] = '*';
            let searchParams = new URLSearchParams();
            searchParams.append('id', this.approvalId + "");
            options.params = searchParams;

            this.http.post(url, { "id": this.approvalId }, options).subscribe(
                (res) => {}
            );
        }
    }


}
