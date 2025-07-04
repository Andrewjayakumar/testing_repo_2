import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DataService } from '../../core/services/data.service';
import { Http, RequestOptions, RequestMethod, URLSearchParams, Headers } from '@angular/http';
import { baseurl, authapiurl } from '../../../environment';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-submission-reject',
  templateUrl: './submission-reject.component.html',
  styleUrls: ['./submission-reject.component.scss']
})
export class SubmissionRejectComponent implements OnInit, AfterViewInit{
    

    public httpOptions: any = {};
    rejectionId = 0;

    private apiUrl = baseurl;
    private clientUrl = authapiurl;

    constructor(private http: Http, private dataservice: DataService, private currentRoute: ActivatedRoute) {
    }

    ngOnInit() {

        this.currentRoute.queryParams.subscribe(params => {

            this.rejectionId = params['Id'];

          
        });

       
    }

    ngAfterViewInit(): void {
        if (this.rejectionId) {
            // debugger;
            let url = this.apiUrl + "api/ApprovalProcess/InitiateRejectProcessAsync";
            let options = new RequestOptions();
            // let new_headers = Object.assign({}, this.httpOptions.headers);
            options.headers = new Headers();
            options.headers['Accept'] = "application/json, */*";
            options.headers['Access-Control-Allow-Origin'] = '*';
            let searchParams = new URLSearchParams();
            searchParams.append('id', this.rejectionId + "");
            options.params = searchParams;

            this.http.post(url, { "id": this.rejectionId }, options).subscribe(
                (res) => { }
            );
        }
    }

}
