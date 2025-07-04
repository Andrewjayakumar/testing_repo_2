import { Component, OnInit, Input } from '@angular/core';
import { JobboardsearchService } from '../jobboardsearch.service';
import { Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-metal-applied',
  templateUrl: './metal-applied.component.html',
  styleUrls: ['./metal-applied.component.scss'],
  providers: [JobboardsearchService]
})
export class MetalAppliedComponent implements OnInit {

  @Input('requisitionid') requisitionid: any = null;
  @Input() isCandidateDashboard: boolean = false;
  busy: Subscription;
  appliedCandidateDetails: any = [];
  pageindex = 1;
  pagesize = 20;
  showloader = false;
  message: any;
  totalprofilesfound: any;
  candidateidArray = [];
  sourceCandidatesResp: any;

  constructor(private jobboardService: JobboardsearchService,) { }

  ngOnInit() {
    this.getAppliedCandidates();
  }

  getAppliedCandidates() {
    this.showloader = true;
    this.message = null;

    this.busy = this.jobboardService.getAppliedCandidates(this.requisitionid, this.pageindex, this.pagesize).subscribe(
      (res: any) => {
        this.appliedCandidateDetails = JSON.parse(res._body)['response']['appliedcandidates'];
        this.message = JSON.parse(res._body)["message"];
        this.totalprofilesfound =  JSON.parse(res._body)['response']['totalprofilesfound'];
        this.showloader = false;

      },
      err => {

      }
    )
  }

  onPageChanged(event) {
    this.pageindex = event;
    this.getAppliedCandidates();
  }

  actionchecked(event) {
    if (event.isChecked) {
      this.candidateidArray.push(event.candidateid);
    } else {
      const index = this.candidateidArray.indexOf(event.candidateid);
      if (index > -1) {
        this.candidateidArray.splice(index, 1);
      }
    }
  }

    // source the candidates

    sourceCandidates() {
      let apiparam: any = {
        requisitionid: parseInt(this.requisitionid),
        candidateid: this.candidateidArray,
        sourcefrom: "Applicants",
      };
      this.busy = this.jobboardService
        .sourceMatchingCandidates(apiparam)
        .subscribe(
          (res: any) => {
            debugger;
  
            if (JSON.parse(res._body)["response"]) {
              this.candidateidArray = [];
              this.getAppliedCandidates();
            } else {
              window.scrollTo(0, 0);
              this.sourceCandidatesResp = JSON.parse(res._body)["message"];
              this.candidateidArray = [];
             setTimeout(() => {
                this.sourceCandidatesResp = '';
                this.candidateidArray = [];
                this.getAppliedCandidates();
              }, 5000);
            }
          },
          (err) => {
            console.log(err);
          },
          () => {
          }
        );
    }


}
