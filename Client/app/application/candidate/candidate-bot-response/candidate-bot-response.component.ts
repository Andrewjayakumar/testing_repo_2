import {
  Component, OnInit, Input, ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { of } from 'rxjs/observable/of';
import { Observable, ObservableInput } from 'rxjs/Observable';
import { filter, distinctUntilChanged, switchMap, debounceTime, map } from 'rxjs/operators';
import { Subscription, Subject } from 'rxjs';
import { CandidateBotResponseService } from "../candidate-bot-response/candidate-bot-response.service";
import { NgbModal, NgbModalOptions, NgbTooltip, NgbActiveModal, ModalDismissReasons, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-candidate-bot-response',
  templateUrl: './candidate-bot-response.component.html',
  styleUrls: ['./candidate-bot-response.component.scss'],
  providers: [CandidateBotResponseService]

})
export class CandidateBotResponseComponent implements OnInit {

  constructor(private fb: FormBuilder, private CandidateBotResponseService: CandidateBotResponseService, public modal: NgbActiveModal) {


  }

  public reqsearchdatainput$ = new Subject<string | null>();
  public reqsearchdata$: Observable<any>;
  isReqSearchLoading = false;
  busy: Subscription;
  jobtitle: any;
  public skillsdatainput$ = new Subject<string | null>();
  public skilldata$: Observable<any>;
  isskillLoading = false;
  @Input() public id;
  requisitionid: any;
  botresponse: any;
  showLoader = false;
  botresponseErrorMesg: any;
  botresponsesuccess: any;
  pagesize: number = 4;
  pageindex: number = 1;



  ngOnInit() {
    this.initializeTypeAheads();
  }
  public model = {
    "jobtitle": "",
    "skills": [],
    "requisitionName": '',
    "bothasreq": "",

  };

  initializeTypeAheads() {

    this.reqsearchdata$ = this.reqsearchdatainput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchClientName(term))
    );

    this.skilldata$ = this.skillsdatainput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchSkills(term))
    );

  }
  searchClientName(term: string): ObservableInput<any> {
    debugger;
    if (!term)
      return of([]);

    this.isReqSearchLoading = true;
    return this.CandidateBotResponseService.getRelatedreqsBysearch(term).pipe(
      map((res: any) => {
        this.isReqSearchLoading = false;
        let resP = JSON.parse(res._body);

        return resP.response ? resP.response : [];

      })

    );
  }
  searchSkills(term: string): ObservableInput<any> {
    debugger;
    if (!term)
      return of([]);

    this.isskillLoading = true;
    return this.CandidateBotResponseService.getskills(term).pipe(
      map((res: any) => {
        this.isskillLoading = false;
        let resP = JSON.parse(res._body);
        if (resP.response.relatedskills) {
          return resP.response.relatedskills ? resP.response.relatedskills : []

        }
      })

    );
  }
  onreqnameChanged(event) {
    if (event.requisitionid) {
      this.requisitionid = event.requisitionid;
      this.busy = this.CandidateBotResponseService.getJobtitleandSkillsbyReqID(event.requisitionid)
        .subscribe(
          (res: any) => {
            if (JSON.parse(res._body)['response'][0]['jobtitle']) {

              this.model.jobtitle = JSON.parse(res._body)['response'][0]['jobtitle'];
            }

          },
          err => {
            console.log(err);

          },
          () => {
          }
        );
    }

  }

  botResponseSubmit() {
    this.showLoader = true;
    this.model['candidateid'] = this.id;
    this.model['requisitionid'] = this.requisitionid;
    this.busy = this.CandidateBotResponseService.botResponseSubmit(this.model)
      .subscribe(
        (res: any) => {
          if (JSON.parse(res._body)['response']) {
            this.botresponsesuccess = JSON.parse(res._body)['message'] ? JSON.parse(res._body)['message'] : "BOT response successfully created.";
            this.showLoader = false;
            setTimeout(() => {
               this.modal.close(true);

            }, 5000);
          }
          else {
            this.botresponseErrorMesg = JSON.parse(res._body)['message'];
            this.showLoader = false;

          }


        },
        err => {
          console.log(err);

        },
        () => {
        }
      );


  }


  TabClicked(event) {

    this.CandidateBotResponseService.getBotresponseByCandID(this.id).subscribe(
      (res: any) => {
        this.botresponse = JSON.parse(res._body)['response'];

      },
      err => {
        console.log(err);

      }
    )

  }
  checkValidation() {
    if (this.model.skills.length == 0) {
      return true;
    } else if (!this.model.jobtitle) {
      return true;
    }
    else if (!this.model.requisitionName) {
      return true;
    } else {
      return false;
    }
  }

  onPageChanged(event) {
    this.pageindex = event;
  }
}
