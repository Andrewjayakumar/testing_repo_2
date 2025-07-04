import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SubmitcandidateService } from './../submitcandidate.service';

import {
  filter,
  distinctUntilChanged,
  switchMap,
  tap,
  catchError,
  debounceTime,
  concat,
  map,
} from "rxjs/operators";
import { Observable, ObservableInput } from "rxjs/Observable";
import { Subscription, Subject } from "rxjs";
import { of } from "rxjs/observable/of";


@Component({
  selector: 'app-add-to-hotbooks-popup',
  templateUrl: './add-to-hotbooks-popup.component.html',
  styleUrls: ['./add-to-hotbooks-popup.component.scss']
})

export class AddToHotbooksPopupComponent implements OnInit {


  hotbookSelected;
  demandPlanSelected;

  currentrole;
  public displaymesg;
  public errorMessage;

  demandPlansList;

  public hotbookInput$ = new Subject<string | null>();
  hotbookList: Observable<any>;

  isHotbookInputLoading = false;

  public candidateid;
  busy: Subscription;
  candidateDetails: any;
  public requisitionid;

  fileslist = [];
  // uploadForm: FormGroup;
  public inputdata;

  public resumeuploaded = false;
  sourcelist: any;
  isSubmitClicked: boolean;
  // uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  datafromDragndrop = false;
  public isFileDropped: boolean = false;
  fileName: any;
  public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true, "negativebtnText": "Cancel", "positivebtnText": "OK" };
  confirmModal: any;
  @ViewChild('content') content: TemplateRef<any>;
  attachments: any = [];
  public resumeWrongFormat = false;
  public action;
  constructor(public modal: NgbActiveModal, 
    private service: SubmitcandidateService, 
    private formBuilder: FormBuilder, 
    private _modalService: NgbModal) {
    // this.uploader = new FileUploader({
    //   url: '',
    //   disableMultipart: true,

    // });
    // this.hasBaseDropZoneOver = false;
    // this.hasAnotherDropZoneOver = false;

    this.initializeTypeAheads();
 }

  ngOnInit() {

    if (Array.isArray(this.inputdata)) {
      this.inputdata.forEach(x => {
        if (x.key == 'candidateid') {

          this.candidateid = x.value;
        }
        else if (x.key == 'id' || 'requisitionid') {

          this.requisitionid = x.value;
        }
      });
    }

    this.currentrole = sessionStorage.getItem("selectedrole");

  }
  

        // initialize type heads for search
  initializeTypeAheads() {
    this.hotbookList = this.hotbookInput$.pipe(
    filter((t) => t && t.length > 1),
    debounceTime(400),
    distinctUntilChanged(),
    switchMap((term) => this.searchHotbook(term))
    );
      
}

searchHotbook(term: string) {
  if (!term) return of([]);
  this.isHotbookInputLoading = true;
  return this.service.searchHotbook(term).pipe(
  map((res: any) => {
  this.isHotbookInputLoading = false;
  let resP = JSON.parse(res._body);
    return resP.response ? resP.response : [];
    })
  );
}


hotbookChanged() {
  if(this.hotbookSelected) {
  this.busy = this.service.getDemandPlans(this.hotbookSelected).subscribe(
        (res: any) => {
          this.demandPlansList = JSON.parse(res._body)["response"];
        },
        err => {
  
        }
      )
  }
}

  OnSubmitClicked() {
    let data = {
      "candidateid": null,
      "tagid": null,
      "demandplanid": null
    }
    data.candidateid = this.candidateid ? this.candidateid : null;
    data.tagid = this.hotbookSelected ? this.hotbookSelected : null;
    data.demandplanid = this.demandPlanSelected ? this.demandPlanSelected : null;

    this.service.addToHotbook(data).subscribe(
      (res) => {
        debugger;
        let body = JSON.parse(res["_body"]);
        if (body.response) {
          this.displaymesg = body.message ? body.message : "Success";
          setTimeout(() => {
            this.displaymesg = body.message ? body.message : "Success";
            this.modal.close("success");
          }, 5000);
        }
        else {
          this.errorMessage = body.message ? body.message : "Something went wrong";
          setTimeout(() => {
            this.errorMessage = body.message ? body.message : "Something went wrong";
          }, 5000);

        }



      }
    );

  }

}
