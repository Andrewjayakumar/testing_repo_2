import {
  Component, OnInit, Input,
  SimpleChanges, EventEmitter, Output, ViewChild, TemplateRef
} from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
import { AuthService } from "../../../core/authservice/auth.service";
import { UUID } from "angular2-uuid";
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
import { CardactionsService } from '../../services/card-actions.service';
import {
  NgbModal,
  NgbModalOptions,
} from "@ng-bootstrap/ng-bootstrap";
import { MetalCardResumeComponent } from "../../../shared/components/metal-card-resume/metal-card-resume.component";
import { MetalCardNotesComponent } from '../metal-card-notes/metal-card-notes.component';


@Component({
  selector: 'app-candidate-card',
  templateUrl: './candidate-card.component.html',
  styleUrls: ['./candidate-card.component.scss'],
  providers: [CardactionsService],

})

export class CandidateCardComponent implements OnInit {

  busy: Subscription;

  @Input('candidate') candidate: any;
  @Input('pagename') pagename: any;
  @Input('requisitionid') requisitionid = null;
  @Input('showCheckbox') showCheckbox: boolean = false;
  @Input('priorPinAction') priorPinAction = null;
  @Input('resumeid') resumeid = null;
  @Input() isCandidateDashboardSearch: boolean = false;
  @Input('highlightskillsarray') highlightskillsarray: any;
 // @Input('dashboardsearch') isDashboardSearch : boolean = false;
  @Input('aigenerated') aigenerated: boolean = null;
  @Output('actionchecked') actionchecked: EventEmitter<any> = new EventEmitter();
  @Output('matchScoreClicked') showMatchScorepopup: EventEmitter<any>;
 // @Input('categorycolor') categorycolor = 'limegreen';
  @Input('categoryhint') categoryhint = 'zipcodes';


  sovernSkillsforHighlighter: any;
    showAppliedData: boolean = false;
    trackcandidatePinning: any;
  trackQuickViewPinning: any;
  showloader = false;

  public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true, "negativebtnText": "Cancel", "positivebtnText": "OK" };
  confirmModal: any;
  @ViewChild('content') content: TemplateRef<any>;


  constructor(public _router: Router, private _authservice: AuthService, private cardactionsservice: CardactionsService,
    public _modalService: NgbModal) {

    this.showMatchScorepopup = new EventEmitter<any>();
  }


  ngOnInit() {
    if (this.pagename == 'appliedCandidates') {
      this.showAppliedData = true;
    } else {
      this.showAppliedData = false;
      }
  }

  ngOnChanges(changes: SimpleChanges): void {

  }


  pinclicked(current_record: any) {

    if (current_record && current_record.candidateid) {
    
      if (this.pagename == 'MetalMatching') {
    
      
        this.cardactionsservice.getResumeForOverViewPage(current_record.candidateid, true, 70).subscribe(
          (res: any) => {
            this.sovernSkillsforHighlighter = JSON.stringify(JSON.parse(res._body)["response"]["skills"]);
       
            var skillsHighlight = {
              "id": UUID.UUID(),
              "url": "apps/candidateprofile",
              "title": current_record.fullname,
              "subtitle": "",
              "icon": "user-o",
              "params": [
                { "name": "candidateid", "id": UUID.UUID(), "value": current_record.candidateid },
                { "name": 'pagesearchparam', "value": this.sovernSkillsforHighlighter ? this.sovernSkillsforHighlighter : '' }

              ],
              "openinpopup": true,
              "popupparams": { value: current_record.candidateid, key: "candidateid", formid: "d7a61781-95a4-49cd-ad15-824de4462233" }
            };
            this.pinClickedHandler(skillsHighlight);
      
          },
          (err) => {
            console.log("Error OCcurred" + err);
          }

        )

      }
      else {
   
     
        var candidates = {
          "id": UUID.UUID(),
          "url": "apps/candidateprofile",
          "title": current_record.fullname,
          "subtitle": "",
          "icon": "user-o",
          "params": [
            { "name": "candidateid", "id": UUID.UUID(), "value": current_record.candidateid },
            { "name": 'pagesearchparam', "value": this.highlightskillsarray ? JSON.stringify(this.highlightskillsarray) : '' }

          ],
          "openinpopup": true,
          "popupparams": { value: current_record.candidateid, key: "candidateid", formid: "d7a61781-95a4-49cd-ad15-824de4462233" }
        };
     
        this.pinClickedHandler(candidates);
    
     
      }
        //change the pin
        current_record["pinned"] = !current_record["pinned"];

    }
    else if (!current_record.candidateid && this.priorPinAction) {
      if (this.pagename == 'monster_power' || this.pagename == 'dice' || this.pagename == 'careerbuilder') {
        let ngbModalOptions: NgbModalOptions = {
          backdrop: 'static',
          keyboard: false
        };
        this.popupConfig.title = "Alert !";
        this.popupConfig.message = "Please Wait..Candidate Profile is Downloading..";
        this.popupConfig.type = "";
        this.popupConfig.isConfirm = true;
        this.popupConfig.negativebtnText = "No";
        this.popupConfig.positivebtnText = "Yes";

        this.confirmModal = this._modalService.open(this.content, ngbModalOptions);
      }

      let url = this.priorPinAction.url;
      let keys = Object.keys(this.priorPinAction.data);

      let data = {};
      keys.forEach(key => {
        data[key] = this.candidate[this.priorPinAction.data[key]] ? this.candidate[this.priorPinAction.data[key]] : null;
      });

      let method = this.priorPinAction.method

      this.busy = this.cardactionsservice.makepriorPinCall(url, data, method).subscribe(
        (res: any) => {
          let candidateDetails = JSON.parse(res._body)['response'];
              if (candidateDetails && candidateDetails.candidateid) {

                  this.candidate.candidateid = candidateDetails.candidateid;
                this.pinclicked(this.candidate);
                if (this.pagename == 'monster_power' || this.pagename == 'dice' || this.pagename == 'careerbuilder') {
                  setTimeout(() => {
                    this.confirmModal.close();
                  }, 2000);
                }
                  return;
              } else {
                  let ngbModalOptions: NgbModalOptions = {
                      backdrop: 'static',
                      keyboard: false
                  };
                  this.popupConfig.title = "Error Occurred !";
                  this.popupConfig.message = JSON.parse(res._body)['message'] ? JSON.parse(res._body)['message'] : "Error in downloading the candidate profile";
                  this.popupConfig.type = "error";
                  this.popupConfig.isConfirm = true;
                  this.popupConfig.positivebtnText = "Close";
                  this.confirmModal = this._modalService.open(this.content, ngbModalOptions);

                  setTimeout(() => {
                      this.confirmModal.close();
                  }, 5000);

              }
        },
        (err) => {
          console.log("Error OCcurred while downloading candidate in prior to pinning action" + err);
        }

      )
    }


  }

  public pinClickedHandler(pinObject: any) {

    if (pinObject && pinObject.params) {
      let primaryKey = pinObject.params[0].name;
      let primaryKeyValue = pinObject.params[0].value;
      if (!this.isbookmarked(pinObject, primaryKey, primaryKeyValue)) {
        this._authservice.AddtoBookmark(pinObject);
        //call track pinning method
        this.trackCandidatePinning(primaryKeyValue);
      }
    }
  }

  isbookmarked(item: any, primaryKey, primarykeyValue) {
    let itembookmarked = false;
    // debugger;
    if (this._authservice.bookmark) {
      this._authservice.bookmark.forEach(item => {
        const param = item.params.find(x => x.name === primaryKey && x.value === primarykeyValue);
        if (param) {
          itembookmarked = item;
        }
      })
    }
    if (itembookmarked) {
      this._authservice.RemoveBookmark(itembookmarked);
    }
    return itembookmarked;
  }

  // for viewing the candidate resume

  viewCandidateResume(candidateId) {

    if (this.candidate.demandplanid) {
      let apiparam: any = {
        'candidateid': candidateId,
        'objectreferenceid': this.requisitionid,
        'pagename': "Demand planning-QV"
      };
      if (this.candidate.demandplanid) {
        apiparam.objectreferenceid = this.candidate.demandplanid;
      } else if (this.candidate.hotbookid) {
        apiparam.objectreferenceid = this.candidate.hotbookid;
      }
      this.busy = this.cardactionsservice.trackCandidatePinning(apiparam)
        .subscribe(
          (res: any) => {
            this.trackQuickViewPinning = JSON.parse(res._body)['response'];
          },
          err => {
            console.log(err);
          },
          () => {
          }
        );
    }


    if (candidateId) {
      this.openResumePopup(candidateId);

    } else {
      let ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false
      };
      this.popupConfig.title = "Alert !";
      this.popupConfig.message = "Please Wait..Candidate Profile is Downloading..";
      this.popupConfig.type = "";
      this.popupConfig.isConfirm = true;
      this.popupConfig.negativebtnText = "No";
      this.popupConfig.positivebtnText = "Yes";

      this.confirmModal = this._modalService.open(this.content, ngbModalOptions);

     
      let url = this.priorPinAction.url;
      let keys = Object.keys(this.priorPinAction.data);

      let data = {};
      keys.forEach(key => {
        data[key] = this.candidate[this.priorPinAction.data[key]] ? this.candidate[this.priorPinAction.data[key]] : null;
      });

      let method = this.priorPinAction.method

      this.busy = this.cardactionsservice.makepriorPinCall(url, data, method).subscribe(
        (res: any) => {
              let candidateDetails = JSON.parse(res._body)['response'];
              if (candidateDetails && candidateDetails.candidateid) {

                  this.candidate.candidateid = candidateDetails.candidateid;
                  this.openResumePopup(this.candidate.candidateid);
                  this.trackQuickViewResume(this.candidate.candidateid);
                  this.confirmModal.close();
              } else {
                  this.popupConfig.title = "Error !";
                  this.popupConfig.message = JSON.parse(res._body)['message'] ? JSON.parse(res._body)['message'] : "Error Occurred in Downloading candidate from Jobboard. \nIf Error persists, then candidate resume is not found on the jobboard";
                  this.popupConfig.type = "error";
                  this.confirmModal = this._modalService.open(this.content, ngbModalOptions);
                  setTimeout(() => {
                      this.confirmModal.close();
                  }, 5000);

              }
                                          },
        (err) => {
          console.log("Error OCcurred while downloading candidate in prior to pinning action" + err);
        }

      )
    }
   
  }

  trackQuickViewResume(candidateId) {
    if (this.pagename == 'MetalMatching' || this.pagename == 'appliedCandidates' || this.pagename == 'MetalbooleanSearch'
      || this.pagename == 'cesSearch' || this.pagename == 'dice' || this.pagename == 'monster_classic' || this.pagename == 'monster_power' || this.pagename == 'careerbuilder') {

      let apiparam: any = {
        'candidateid': candidateId,
        'objectreferenceid': this.requisitionid,
        'pagename': this.pagename + '-QV'
        };
        if (this.aigenerated != null && !this.isCandidateDashboardSearch) {
          apiparam['aigenerated'] = this.aigenerated;

        }
      this.busy = this.cardactionsservice.trackCandidatePinning(apiparam)
        .subscribe(
          (res: any) => {
            this.trackQuickViewPinning = JSON.parse(res._body)['response'];
          },
          err => {
            console.log(err);
          },
          () => {
          }
        );
    }
  }
  openResumePopup(candidateId) {
    if (candidateId) {
      this.trackQuickViewResume(this.candidate.candidateid);

    }
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",
      windowClass: "candidateresumeview",
    };
    const modalRef = this._modalService.open(
      MetalCardResumeComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.id = candidateId;
    modalRef.componentInstance.requisitionid = this.requisitionid;


    if (this.pagename == 'MetalMatching') {
      modalRef.componentInstance.ismatch = true;
    }
  
    if (this.pagename == 'cesSearch') {
      modalRef.componentInstance.offshore = this.candidate.isoffshore;
      modalRef.componentInstance.gciid = this.candidate.gciid;
      modalRef.componentInstance.resumeid = this.candidate.personnumber;
      modalRef.componentInstance.pagename = this.pagename;
    }
    if (this.pagename == 'monster_classic' || this.pagename == 'monster_power' || this.pagename == 'careerbuilder' || this.pagename == 'dice' || this.pagename == 'MetalbooleanSearch') {
      modalRef.componentInstance.highlightskillsarray = this.highlightskillsarray;

    }
    modalRef.result.then((result) => { });
}

  onCandidateSelected(candidateid, isChecked) {
    let event = { "candidateid": candidateid, "isChecked": isChecked };
    this.actionchecked.emit(event);

  }

  trackCandidatePinning(candidateid) {
    let apiparam: any = {
      'candidateid': candidateid,
      'objectreferenceid': this.requisitionid,
      'pagename': this.pagename,
      };
      if (this.aigenerated != null && !this.isCandidateDashboardSearch) {
          apiparam['aigenerated'] = this.aigenerated;
      }
    if (this.candidate.demandplanid) {
      apiparam.objectreferenceid = this.candidate.demandplanid;
    }
    this.busy = this.cardactionsservice.trackCandidatePinning(apiparam)
      .subscribe(
        (res: any) => {
          this.trackcandidatePinning = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

  // for viewing the candidate Notes

  viewCandidateNotes(candidateId, fullname) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",
      windowClass: "candidateresumeview",
    };
    const modalRef = this._modalService.open(
      MetalCardNotesComponent,
      ngbModalOptions
    );
    modalRef.componentInstance.id = candidateId;
    modalRef.componentInstance.fullname = fullname;


    modalRef.result.then((result) => { });
  }

  onMatchScoreClicked(candidate) {
    this.showMatchScorepopup.emit({ "name": candidate.fullname, "id": candidate.candidateid });
  }
}
