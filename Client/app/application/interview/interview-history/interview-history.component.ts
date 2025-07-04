import { Component, OnInit, Input, AfterViewInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { InterviewService } from "../interview.service";
import { InterviewRoundCardComponent } from '../interview-history/interview-round-card/interview-round-card.component';


@Component({
  selector: 'app-interview-history',
  templateUrl: './interview-history.component.html',
  styleUrls: ['./interview-history.component.scss'],
  providers: [NgbActiveModal]
})
export class InterviewHistoryComponent implements OnInit, AfterViewInit {
  visible = false;
  interviewHistoryDetails: any;
  candidateId: any;// = 52848171;
  requisitionid: any;// = 50256692;
  showHistory: boolean = false;
  showNoRecordMessage: boolean = false;
  clientName: any;
  clientLocation: any;
  candidateName: any;
  candidateMail: any;
  reqName: any;
  @Input('pagename') pagename: any;
  @ViewChild(InterviewRoundCardComponent) interviewround;



  constructor(private interviewService: InterviewService, private currentRoute: ActivatedRoute) {

  }



  ngOnInit(): void {
    this.currentRoute.queryParams.subscribe(params => {

      this.requisitionid = parseInt(params['id']);

      this.candidateId = parseInt(params['candidateid']);
    });
    this.getInterviewRoundDetails(this.candidateId, this.requisitionid);
  }

  ngAfterViewInit() {

  }
  getInterviewRoundDetails(candidateId: any, requisitionId: any) {
    debugger;
    this.interviewHistoryDetails = this.interviewService.getInterviewHistoryDetails(this.candidateId, this.requisitionid)
      .subscribe(
        (res: any) => {
          if (JSON.parse(res._body)['responsecode'] == 200 && JSON.parse(res._body)['response'].length > 0) {
            this.interviewHistoryDetails = JSON.parse(res._body)['response'];
           
            this.showHistory = true;
            this.showNoRecordMessage = false;
            if (this.interviewround) {
              this.interviewround.getInterviewRoundDetails(this.candidateId, this.requisitionid);

            }

          }
          else {
            this.showNoRecordMessage = true;
            this.showHistory = false;
          }
        },
        err => {
          this.showNoRecordMessage = true;
          this.showHistory = false;
        },
        () => {
        }
      );
  }

}
