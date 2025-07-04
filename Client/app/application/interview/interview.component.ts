import { Component, OnInit, Input, ViewChild, EventEmitter, Output, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { InterviewHistoryComponent } from './interview-history/interview-history.component';
import { InterviewService } from './interview.service';
import { ScheduleInterviewComponent } from './schedule-interview/schedule-interview.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-interview',
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss'],
  providers: [InterviewService, NgbActiveModal]
})
export class InterviewComponent implements OnInit {


  requisitionid: any;
  candidateid: any;
  candidateandReqDetails: any;
  busy: Subscription

  @ViewChild(ScheduleInterviewComponent) scheduletab;
  @ViewChild(InterviewHistoryComponent) historytab;


  loadSchedule: boolean = false;
  loadHistory: boolean = false;

  @Output('tabchanged') tabchanged: EventEmitter<any>;
  @Output('actionchecked') actionchecked: EventEmitter<any> = new EventEmitter();
  currentTab = 'schduleinterview';
  candidateOtherReqDetails: any;
  nextInterviewRound: number;
  iscanidateRejected:boolean =false;


  constructor(private router: Router, private currentRoute: ActivatedRoute, public zone: NgZone, private interviewService: InterviewService) { }

  ngOnInit() {
    
   
    this.currentRoute.fragment.subscribe(fragment => {
      if (fragment) {
        this.currentTab = 'interview';
      }
    });
    this.currentRoute.queryParams.subscribe(params => {
      this.requisitionid = parseInt(params['id']);
      this.candidateid = parseInt(params['candidateid']);
    });
    this.getCandidateHiringStatus();

    this.getInterviewRoundDetails();



  }


  openSchedule() {
    this.scheduletab.getIntRound();

  }

  backToReqPage(data: any) {
    let reqID;
    let requisitionId;
    this.currentRoute.queryParams.subscribe(params => {
      requisitionId = parseInt(params['reqid']);
      reqID = parseInt(params['id']);
    });
    if (requisitionId) {
      this.router.navigateByUrl('/apps/requisitionspage/aimatch?requisitionid=' + requisitionId);
    }
    else {
      this.router.navigateByUrl('/apps/recoverview?requisitionid=' + reqID);
    }
  }
  openHistory() {
    this.historytab.getInterviewRoundDetails(this.candidateid, this.requisitionid);
  }

  switchTab(tab: string) {
    this.currentTab = tab;
  }


  getInterviewRoundDetails() {
    this.busy = this.interviewService.getInterviewHistoryDetails(this.candidateid, this.requisitionid)
      .subscribe(
        (res: any) => {
          this.candidateandReqDetails = JSON.parse(res._body)['response'][0];

        },
        (err) => {
          console.log('Error in Fetching Data', err);

        });

  }

  getCandidateHiringStatus() {
    this.busy = this.interviewService.getCandidateHiringStatusByReqId(this.candidateid, this.requisitionid)
      .subscribe(
        (res: any) => {
          let candidateHiringStatus = JSON.parse(res._body)['response'][0];
          this.iscanidateRejected = candidateHiringStatus.candidatehiredstatus=="Rejected"?true:false;
          if(this.iscanidateRejected===true)
            this.currentTab = 'interview';
        },
        (err) => {
          console.log('Error in Fetching Data', err);

        });

  }
  onCandidateOtherReqDetails(data: any) {
    this.candidateOtherReqDetails = data;
  }

  getInterviewRound(data: any) {
    this.nextInterviewRound = data;

  }


}
