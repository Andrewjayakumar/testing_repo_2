import { Component, OnInit, Input } from '@angular/core';
import { JobboardsearchService } from '../jobboardsearch.service';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-metal-ce',
  templateUrl: './metal-ce.component.html',
  styleUrls: ['./metal-ce.component.scss'],
  providers: [JobboardsearchService]
})
export class MetalCeComponent implements OnInit {
  @Input('requisitionid') requisitionid: any = null;
  @Input() isCandidateDashboard: boolean = false;
  busy: Subscription;
  cesSearchDetails: any;
  pageindex = 1;
  pagesize = 20;
  showloader = false;
  message: any;
  totalprofilefound: any;
 
  cesDownloadDetails = {
    "url": "api/Candidate/GetCrownResumeByIdAsync",
    "method": "post",
    "data": {
      "resumeid": "personnumber",
      "gciid": "gciid",
      "offshore":"offshore"
    }
  };

  constructor(private jobboardService: JobboardsearchService, private localstorage: LocalStoreManager) {

 
  }

  public model = {
    "firstname": "",
    "lastname": "",
    "gciid": "",
    "emailid":""
  }
  ngOnInit() {

  }

  Search() {
    this.showloader = true;
    this.message = null;
    this.model['pagesize'] = this.pagesize;
    this.model['pageindex'] = this.pageindex;
    this.busy = this.jobboardService.getCESCandidatesAsync(this.model).subscribe(
      (res: any) => {
        if (JSON.parse(res._body)['response']) {
          this.cesSearchDetails = JSON.parse(res._body)['response']['crownCandidates'];
          this.totalprofilefound = JSON.parse(res._body)['response']['totalprofilefound'];

          this.showloader = false;
        } else {
          this.message = JSON.parse(res._body)['message'];
          this.showloader = false;
          this.cesSearchDetails = '';
        }
       

      },
      err => {

      }
    )
  }


  onPageChanged(index) {
    this.pageindex = index;
    this.Search();
  }

  resetform() {
    this.cesSearchDetails = null;
    this.totalprofilefound = null;
    this.message = null;
  }
}
