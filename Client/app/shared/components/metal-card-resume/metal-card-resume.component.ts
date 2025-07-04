import { Component, OnInit, ViewChildren, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
declare var $: any;
import { NgbActiveModal, NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { CardactionsService } from './../../services/card-actions.service';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { AuthService } from "../../../core/authservice/auth.service";
import { UUID } from "angular2-uuid";
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';





@Component({
  selector: 'metal-card-resume',
  templateUrl: './metal-card-resume.component.html',
  styleUrls: ['./metal-card-resume.component.scss'],
  providers: [CardactionsService]

})
export class MetalCardResumeComponent implements OnInit {

  busy: Subscription;
  @Input() public id;
  @Input() public ismatch;
  candidateResmDetails: any;
  candidateresume: any;
  resumenotFound = false;
  loadingMessage: any;
  @Input('requisitionid') requisitionid; 
  @Input('pagename') pagename: any;
  trackcandidatePinning: any;
  highlightArray = [];
  @Input('offshore') offshore: any;
  @Input('gciid') gciid: any;
  @Input('resumeid') resumeid: any;
  @Input('highlightskillsarray') highlightskillsarray;
  errorMessage: any;
  isAIDrivenUser: any;


  constructor(private router: Router, public modal: NgbActiveModal, private cardactionsservice: CardactionsService, private sanitizer: DomSanitizer, private _authservice: AuthService, private localStore: LocalStoreManager) {

    let current_user_obj = this.localStore.getData('current_user');
    this.isAIDrivenUser = current_user_obj.aidrivenuser ? current_user_obj.aidrivenuser : false;
    console.log("AIII", this.isAIDrivenUser);
  }

  ngOnInit() {

 
    if (this.pagename == 'cesSearch') {
     // this.getCESCandidateResume();


    } else {
      this.getCandidateResume();

    }
   
  }
  //getCESCandidateResume() {
  //  this.loadingMessage = true;
  //  var reqObj = {
  //    'offshore': this.offshore,
  //    'gciid': this.gciid,
  //    'resumeid': this.resumeid
  //  }
  //  this.busy = this.cardactionsservice.getCESCandidateResume(reqObj)
  //    .subscribe(
  //      (res: any) => {
  //        this.candidateResmDetails = JSON.parse(res._body)['response'];
  //        if (this.candidateResmDetails.resume) {
  //          this.candidateresume = this.sanitizer.bypassSecurityTrustHtml(this.candidateResmDetails.resume);
  //          this.resumenotFound = false;
  //          this.loadingMessage = false;

  //        }
  //        else {
  //          this.resumenotFound = true;
  //          this.loadingMessage = false;
  //          this.errorMessage = JSON.parse(res._body)['message']

  //        }
  //      },
  //      err => {
  //        console.log(err);
  //        this.loadingMessage = false;

  //      },
  //      () => {
  //      }
  //    );
  //}
  getCandidateResume() {
    this.loadingMessage = true;
    this.busy = this.cardactionsservice.getCandidateResume(this.id, this.ismatch, this.requisitionid)
      .subscribe(
        (res: any) => {
          this.candidateResmDetails = JSON.parse(res._body)['response'];
          if (this.candidateResmDetails.resume) {
            this.candidateresume = this.sanitizer.bypassSecurityTrustHtml(this.candidateResmDetails.resume);
            this.resumenotFound = false;
            this.loadingMessage = false;

          }
          else {
            this.resumenotFound = true;
            this.loadingMessage = false;

          }
       },
        err => {
          console.log(err);
          this.loadingMessage = false;

        },
        () => {
        }
      );
  }

  // for candidate pinning that is view profile

  pinclicked(current_record: any) {
    if (current_record) {
      var candidate = {
        "id": UUID.UUID(),
        "url": "apps/candidateprofile",
        "title": current_record.fullname,
        "subtitle": "",
        "icon": "user-o",
        "params": [
          { "name": "candidateid", "id": UUID.UUID(), "value": current_record.CandidateId }
        ],
        "openinpopup": true,
        "popupparams": { value: current_record.CandidateId, key: "candidateid", formid: "d7a61781-95a4-49cd-ad15-824de4462233" }
      };
    }

    this.pinClickedHandler(candidate);

  }

  public pinClickedHandler(pinObject: any) {

    if (pinObject && pinObject.params) {
      let primaryKey = pinObject.params[0].name;
      let primaryKeyValue = pinObject.params[0].value;
      if (!this.isbookmarked(pinObject, primaryKey, primaryKeyValue)) {
        this._authservice.AddtoBookmark(pinObject);
        //call track pinning method
       // this.trackCandidatePinning(primaryKeyValue);
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
}
