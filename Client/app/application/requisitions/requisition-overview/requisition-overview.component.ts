import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject, Input,AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {  Subject, Subscription } from 'rxjs';
import { RequisitionsService } from './../requisitions.service';
import { DOCUMENT } from '@angular/platform-browser';
import { UUID } from "angular2-uuid";

import { AuthService } from '../../../core/authservice/auth.service';
import { FormControlService } from '../../../forms/form-control.service';
import { ACALT270DaysDialog, ACAGT270DaysDialog, GPGPMGrid } from '../../requisitions/requisition-modals.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import { UpdateClientComponent } from '../update-client/update-client.component';
//import { PostReqVendorComponent } from '../post-req-vendor/post-req-vendor.component';
import { ReqSummaryComponent } from '../my-requisitions/req-summary/req-summary.component';
import { PostReqCardComponent } from '../post-req-card/post-req-card.component';
import { BotResponseComponent } from '../bot-response/bot-response.component';
import { AcaDocumentsComponent } from '../add-requisition/recdetails/aca-documents/aca-documents.component';



@Component({
  selector: 'app-requisition-overview',
  templateUrl: './requisition-overview.component.html',
  styleUrls: ['./requisition-overview.component.scss'],
  providers: [RequisitionsService],
  encapsulation: ViewEncapsulation.None,


})
export class RequisitionOverviewComponent implements OnInit, OnDestroy {
    private unsubscribe: Subject<true> = new Subject<true>();
  public requisitionid;
  qualificationDetails: any;
  busy: any;
  requisitionDetails: any;
  percentagevalueDetails: any;
  edit = true;
  edit2 = true;
  edit3 = true;
  edit4 = true;
  salesrep: string = '';
  metalmatchdata: any;
  pageTrackResp: any;
  @Input() public control: any;
  @Input() public data: any;
  isbookmarked = false;
  page: any;
  Difference_In_Days: number;
  projecttype:any;
  reqDetail:any;
  showLoader=false;
  errorMessage:String;
  private reqdetailSubs:Subscription;

  

  @ViewChild('requisitiondetails') requisitiondetails: ElementRef;
  private options: NgbModalOptions = { size: 'sm', windowClass: 'model-cw', backdrop: true };




    constructor(private currentRoute: ActivatedRoute,
      private router: Router, public RequisitionsService: RequisitionsService, @Inject(DOCUMENT) private _document, private _authservice: AuthService, private _controlService: FormControlService, public modalService: NgbModal) {
        this.currentRoute.queryParams.subscribe(params => {
          this.requisitionid = parseInt(params['requisitionid']);
          // see also 
          let currentUrl = this.router.url;
          // alert(currentUrl);
          var menu = this._authservice.Menu;

          this.page = this.find(menu['Nav'], currentUrl.substring(1));
        });

    }

  ngOnInit() {
    this._document.body.style.background = '#ffffff';
      this.getallreqDetails();
    this.pageTrackReqs();
    $(document).ready(function () {
      $("a").removeClass("dropdown-toggle");

    });
    }

  ngAfterViewInit() {
    $(document).ready(function () {
      $("a").removeClass("dropdown-toggle");

    });
  }
  // Get all the qualification

  getQualification() {
    this.busy = this.RequisitionsService.getQualification(this.requisitionid)
      .subscribe(
        (res: any) => {
          this.qualificationDetails = JSON.parse(res._body)['response'];
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

  // Get all the Requisition Details
  getallreqDetails() {
    this.busy = this.RequisitionsService.getallreqDetails(this.requisitionid)
      .subscribe(
        (res: any) => {
          this.requisitionDetails = JSON.parse(res._body)['response'];
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

  pageTrackReqs() {
    let payload = {
      pagename: "RequisitionMatch",
      actionname: null,
      objecttype: null,
      objectid: this.requisitionid,
    };
    this.busy = this.RequisitionsService.pageTracker(
      payload
    ).subscribe(
      (res: any) => {
        this.pageTrackResp = JSON.parse(res._body)["response"];
      },
      (err) => {
        console.log(err);
      },
      () => {}
    );
  }

  //  Get percentage values for profile

  getthePercentagevalue() {
    this.busy = this.RequisitionsService.getthePercentagevalue(this.requisitionid)
      .subscribe(
        (res: any) => {
          this.percentagevalueDetails = JSON.parse(res._body)['response'];
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

  // Update the Requisition Fields
  updateRequisition() {
    if (this.salesrep) {

      var reqparam = {
        requisitionid: this.requisitionid,
        salesrep: this.salesrep
      }
    }
    this.busy = this.RequisitionsService.updateRequisition(reqparam)
      .subscribe(
        (res: any) => {
          this.percentagevalueDetails = JSON.parse(res._body)['response'];
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }


    ngOnDestroy() {
     
      this._document.body.style.background = '';
        this.unsubscribe.complete();
    }

  bookMark(reqname) {

    debugger;
    if (this.isbookmarked) {
     this.removebookmark();
      //return;
    }
    var item = {
      "id": UUID.UUID(),
      "url": 'apps/recoverview',
      "title": reqname,
      "subtitle": "",
      "icon": "fa fa-list-alt",
      "params":  [
        { "name": "requisitionid", "id": UUID.UUID(), "value": this.requisitionid},

      ],

    };
    this._authservice.AddtoBookmark(item);
    this.isbookmarked = true;
  }
  removebookmark() {
    var selectedBookmark;
  
    if (this._authservice.bookmark) {
      const page = this._controlService.find(this._authservice.Menu['Nav'], 'apps/recoverview');
      if (page) {
        selectedBookmark = this._authservice.bookmark.find(x => x.url === page.Url && JSON.stringify(x.params) == JSON.stringify(page.Params))
      }
    }
    if (selectedBookmark) {
      this._authservice.RemoveBookmark(selectedBookmark);
      this.isbookmarked = false;

    }
  }
  find(source, url) {
    for (var key in source) {
      var item = source[key];
      if (item.Url == url)
        return item;

      // Item not returned yet. Search its children by recursive call.
      if (item.children) {
        var subresult = this.find(item.children, url);

        // If the item was found in the subchildren, return it.
        if (subresult)
          return subresult;
      }
    }
    // Nothing found yet? return null.
    return null;
  }


  acaBtnClicked() {
    let templateRef: any = null;
    if (this.Difference_In_Days >= 270) {
      templateRef = ACAGT270DaysDialog;
    } else {
      templateRef = ACALT270DaysDialog
    }
    this.modalService.open(templateRef, { backdrop: 'static', size: 'lg', windowClass: 'candidateresumeview' });

  }
  updateClientClicked() {
    
    this.modalService.open(UpdateClientComponent, {
      backdrop: 'static', size: 'lg', windowClass: 'linkedinpopup'
    });

  }
  //postVendor() {
  //  this.modalService.open(PostReqVendorComponent, {
  //    backdrop: 'static', size: 'lg', windowClass: 'candidateresumeview'
  //  });

  //}

  printPreview() {
    let modalRef =  this.modalService.open(ReqSummaryComponent, {
      backdrop: 'static', size: 'lg', windowClass: 'candidateresumeview'
  });
    modalRef.componentInstance.id = this.requisitionid ? this.requisitionid : "";

  }

    getRateCardDetails() {
      let modalRef = this.modalService.open(PostReqCardComponent, {
      backdrop: 'static', size: 'lg', windowClass: 'candidateresumeview'
    });
    modalRef.componentInstance.id = this.requisitionid ? this.requisitionid : "";

  }

  getBotResponseDetails() {
   let modalRef = this.modalService.open(BotResponseComponent, {
     backdrop: 'static', size: 'lg', windowClass: 'candidateresumeview'
   });
    modalRef.componentInstance.id = this.requisitionid ? this.requisitionid : "";

  }

  publishJobPosting(publishurl) {
    window.open(publishurl , "_blank");
  }

  // For Requisition Details Popup
  reqDetails(){
    this.getreqDetails();
    
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: true,
      size: 'lg',
      windowClass: 'custom-modal-dialog'
      
    
    };
   
    const modalRef = this.modalService.open(this.requisitiondetails, ngbModalOptions);
      modalRef.result.then((result) => {
     
      this.unsubscribereqDetail();
    }, (reason) => {
      
      this.unsubscribereqDetail();
    });
  }


  getreqDetails(){
    this.showLoader=true;
    this.reqdetailSubs = this.RequisitionsService.getRequisitionDetailsReadOnly(this.requisitionid)
    .subscribe(
      (res: any) => {
        this.reqDetail= JSON.parse(res._body)['response'][0];
        this.showLoader=false;
        
      },
      err => {
        this.errorMessage="Unable to process your request, please try later"
        this.showLoader=false;
        console.log(err,  this.errorMessage);
        
      },
      () => {
      }
    );
  }

  unsubscribereqDetail(){
    if(this.reqdetailSubs){
      this.reqdetailSubs.unsubscribe();
     
    }
  }


}


