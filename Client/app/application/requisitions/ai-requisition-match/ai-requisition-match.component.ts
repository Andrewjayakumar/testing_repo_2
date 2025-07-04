import { Component, OnInit, OnDestroy, ViewEncapsulation, Inject, Input, AfterViewInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject, Subscription } from 'rxjs';
import { RequisitionsService } from './../requisitions.service';
import { UUID } from "angular2-uuid";

import { AuthService } from '../../../core/authservice/auth.service';
import { FormControlService } from '../../../forms/form-control.service';
import { ACALT270DaysDialog, ACAGT270DaysDialog, GPGPMGrid } from '../../requisitions/requisition-modals.component';
import { ModalDismissReasons, NgbActiveModal, NgbModal, NgbModalOptions, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import { UpdateClientComponent } from '../update-client/update-client.component';
//import { PostReqVendorComponent } from '../post-req-vendor/post-req-vendor.component';
import { ReqSummaryComponent } from '../my-requisitions/req-summary/req-summary.component';
import { PostReqCardComponent } from '../post-req-card/post-req-card.component';
import { BotResponseComponent } from '../bot-response/bot-response.component';
import { AcaDocumentsComponent } from '../add-requisition/recdetails/aca-documents/aca-documents.component';

import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ObservableInput } from 'rxjs/Observable';
import { UpdateDurationComponent } from '../update-duration/update-duration.component';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
import { AddrecService } from '../../requisitions/add-requisition/addrec.service';
import { User } from '../../../core/models/user.model';
import { RecFormData } from '../../requisitions/model/RecFormData';




@Component({
  selector: 'app-ai-requisition-match',
  templateUrl: './ai-requisition-match.component.html',
  styleUrls: ['./ai-requisition-match.component.scss'],
  providers: [RequisitionsService, NgbActiveModal, AddrecService],
  encapsulation: ViewEncapsulation.None,

})
export class AiRequisitionMatchComponent implements OnInit {

    public requisitionid;
    qualificationDetails: any;
    busy: any;
    journal: any;
    journalDetails: any;
    totalrecords: any;
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
  @Input('currentmode') mode = 'add';  // default mode to "add"
    isbookmarked = false;
    page: any;
    Difference_In_Days: number;
    projecttype: any;
    JournalType: any;
    reqDetail: any;
    showLoader = false;
    errorMessage: String;
    isAccordionOpen=false;
    openAccordionIndex: number = -1;
    totalItems: number=10;
    currentPage: number = 1;
    pageSize: number = 7;
    maxSize: number = 10;
    descriptionHistory:any;
    currentPageData:any;
    private reqdetailSubs: Subscription;
    requisitionStatusList:any;
    isCloneLoading:boolean = false;
    cloneErrorMessage:boolean = false;
    cloneSuccessMessage:boolean = false;
    modalRef: any
  fulfillmentReasons: any[] = [];
  allowredeploymenthire: boolean = false;    

    public clientNameinput$ = new Subject<string | null>();
    public clientNamedata$: Observable<any>;
    ClientNameLoading = false;
  sidebarVisible: boolean = false;
  public durationDiffWeeks = null;
  public durationDiffDays = null;
  public cloneModel = {
    "requisitionid": null,
    "requisitionname": null,
    "statusid": null,
    "status": "",
    "clientid": "",
    "clientname": null,
    "clonecount": 1,
    "startDate": null,
    "reqfulfillmentreasonid": null,
    "reqfulfillmentreason": null,
    "projectenddate": null,
    "enddate":null,
    "dateDiffinDays": 0,
    "projectdurationweeks": 0,

  }

    private options: NgbModalOptions = { size: 'sm', windowClass: 'model-cw', backdrop: true };

    @ViewChild('requisitiondetails') requisitiondetails: ElementRef;
    @ViewChild('requisitionHistory') requisitionHistory: ElementRef;
    @ViewChild('accordionHeading') accordionHeading: ElementRef;
    currentTab = 'jobboard'
    
    
  @ViewChild('cloneRequisition') cloneRequisition: ElementRef;
  current_user_obj: any;
  showupdateduration: boolean = false;
  public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true, "negativebtnText": "Cancel", "positivebtnText": "OK" };
  confirmModal: any;
  @ViewChild('content') content: TemplateRef<any>;
  enabledisablenotification: boolean = true;
  isdisable = false;
  public StartDate: NgbDateStruct = <NgbDateStruct>{};
  public endDate: NgbDateStruct = <NgbDateStruct>{};
  serverErrResp: any;
  deliverymodelid: any;
  showuallowreqfulfillreason: any;
    



    


    constructor(private currentRoute: ActivatedRoute, private router: Router, public RequisitionsService: RequisitionsService, public activeModal: NgbActiveModal, private _authservice: AuthService,
      private _controlService: FormControlService, public modalService: NgbModal, private localStorage: LocalStoreManager, public AddrecService: AddrecService) {
      this.initializeTypeAhead();

      let current_user: User = this.localStorage.getData('current_user');

      current_user.roles.forEach((element) => {
        if (current_user.activerolename == element.rolename) {
          if (element.allowredeploymenthire == "true") {
            this.allowredeploymenthire = true;
          } else {
            this.allowredeploymenthire = false;

          }
        }
      })

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
    this.current_user_obj = this.localStorage.getData('current_user');

    this.current_user_obj.roles.forEach((element) => {
      if (this.current_user_obj.activerolename == element.rolename) {
        if (element.allowrequisitiondateupdate == "true") {

          this.showupdateduration = true;
        } else {
          this.showupdateduration = false;

        }
        if (element.allowclonerequisition == "true") {
          this.showuallowreqfulfillreason = true;
        } else {
          this.showuallowreqfulfillreason = false;

        }
      }
    });
 

    this.getAlltheReqDetails();
        this.getallreqDetails();
        
        this.pageTrackReqs();
    this.getreqDetails();
    this.GetRequisitionJournalEntryById();
    this.getemailNotificationHistory();
       
       
       
  }

  

 openNav() {

    console.log(this.reqDetail)
    this.sidebarVisible = true;
    const bodyElement = document.querySelector('html');
    const sidenav = document.querySelector('.sidenav-right') as HTMLElement;
    if (sidenav) {
      sidenav.style.width = '50%';
      bodyElement.style.overflowY = "hidden";
    }
  }

  closeNav() {
    this.sidebarVisible = false;
    const bodyElement = document.querySelector('html');
    const sidenav = document.querySelector('.sidenav-right') as HTMLElement;
    if (sidenav) {
      sidenav.style.width = '0';
      bodyElement.style.overflowY = "scroll";
    }
  }
 
   
    initializeTypeAhead(){
        this.clientNamedata$ = this.clientNameinput$.pipe(
            filter(t => t && t.length > 1),
            debounceTime(400),
            distinctUntilChanged(),
            switchMap((term) => this.getClientName(term))
      
          );
    }

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

    //Get all the Requisition Details
    getallreqDetails() {
        this.busy = this.RequisitionsService.getallreqDetails(this.requisitionid)
            .subscribe(
                (res: any) => {
                this.requisitionDetails = JSON.parse(res._body)['response'];
                this.projecttype = this.requisitionDetails.projecttypeid;
                this.requisitionDetails.enddate = this.requisitionDetails.projectenddate;
                           },
                err => {
                    console.log(err);
                },
                () => {
                }
            );
    }

  getSelectedFulfillmentReason(): string {
    const selected = this.fulfillmentReasons.find(reason => reason.reqfulfillmentreasonid === this.cloneModel.reqfulfillmentreasonid);
    return selected ? selected.fulfillmentreason : '';
  }

  getReqFulfillmentReason() {
    this.AddrecService.getReqFulfillmentReason()
      .subscribe(res => {
        let response = JSON.parse(res._body)['response'];
        this.fulfillmentReasons = response ? response.reqfulfillmentreason : [];
      },
        err => {
          console.error("Couldnt fetch travel Type List" + err);
        });
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
            () => { }
        );
    }

    // Get Journal details
    GetRequisitionJournalEntryById(){
        this.journal = this.RequisitionsService.GetRequisitionJournalEntryById(this.requisitionid)
        .subscribe(
            (res: any) => {
                this.journalDetails = JSON.parse(res._body)['response'];
            this.JournalType = this.journalDetails.JournalTypeid;
            if (this.journalDetails && this.journalDetails.length > 0) {
                this.totalrecords = this.journalDetails.length;
    
              }
              else {
                this.errorMessage = "No Results Found!";}
            // console.log(this.journalDetails);
                       },
            err => {
                console.log(err);
            },
            () => {
            }
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

    ngOnDestroy() {    }

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
            "params": [
                { "name": "requisitionid", "id": UUID.UUID(), "value": this.requisitionid },

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
        let ngbModalOptions: NgbModalOptions = {
            backdrop: "static",
            keyboard: true,
            size: "lg",



        };

        const modalRef = this.modalService.open(
            AcaDocumentsComponent,
            ngbModalOptions
        );

        modalRef.componentInstance.deliverymodelid = this.deliverymodelid;

        modalRef.componentInstance.requisitionid = this.requisitionid;

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
        let modalRef = this.modalService.open(ReqSummaryComponent, {
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
        window.open(publishurl, "_blank");
    }

    // For Requisition Details Popup
    reqDetails() {
       // this.getreqDetails();

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


    getreqDetails() {
        this.showLoader = true;
        this.reqdetailSubs = this.RequisitionsService.getRequisitionDetailsReadOnly(this.requisitionid)
            .subscribe(
                (res: any) => {
                    this.reqDetail = JSON.parse(res._body)['response'][0];
                    this.showLoader = false;

                },
                err => {
                    this.errorMessage = "Unable to process your request, please try later"
                    this.showLoader = false;
                    console.log(err, this.errorMessage);

                },
                () => {
                }
            );
    }

    unsubscribereqDetail() {
        if (this.reqdetailSubs) {
            this.reqdetailSubs.unsubscribe();

        }
    }

 


    openHistory() {
        this.currentPage = 1;
        this.getReqDescHistory();
     
        
        let ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: true,
            size: 'lg',
            windowClass: 'custom-modal-dialog-history'


        };

        const modalRef = this.modalService.open(this.requisitionHistory, ngbModalOptions);

    }



    toggleAccordion(index: number): void {
        if (this.openAccordionIndex === index) {
            this.openAccordionIndex = -1; 
        } else {
            this.openAccordionIndex = index; 
        }
    }


    onPageChange(page: number) {
        this.currentPage = page;
        const startIndex = (page - 1) * this.pageSize;
        const endIndex = startIndex + this.pageSize;
        this.currentPageData = this.descriptionHistory.slice(startIndex, endIndex);

    }


    getReqDescHistory() {
        this.showLoader = true;
        this.busy = this.RequisitionsService.getDescriptionHistory(this.requisitionid)
            .subscribe(
                (res: any) => {
                    this.descriptionHistory = JSON.parse(res._body)['response'];
                    this.totalItems = this.descriptionHistory.length;
                    this.onPageChange(this.currentPage);
                    this.showLoader = false;
                    
                   


                },
                err => {
                    console.log(err);
                    this.showLoader = false;
                },
            );
    }

    removeFirstWhiteSpace(description: string): string {
        if (!description) {
            return '';
        }

        const modifiedDescription = description.replace(/<[^>]+>/g, '').replace(/style="[^"]*"/g, '');
        const cleanedDescription = modifiedDescription.replace(/&(?:[a-zA-Z]+|#\d+);/g, ' ');
        const trimmedDescription = cleanedDescription.replace(/^\s+/, '');
        return trimmedDescription.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();

    }

    convertUtcToLocalDate(val: Date): Date {
        if(val){
        const date = new Date(val);
        const localOffset = date.getTimezoneOffset() * 60000;
        const localTime = date.getTime() - localOffset;

        date.setTime(localTime);
        return date;
    }
    }

//Clone Requisition Starts //
    openCloneReq(){
        this.cloneModel = {
            ...this.cloneModel,
            requisitionname: this.requisitionDetails.name + "(1)",
            requisitionid: this.requisitionDetails.id,
            statusid: this.requisitionDetails.statusid,
            status: this.requisitionDetails.status,
            clientid: this.requisitionDetails.clientid,
            clientname: this.requisitionDetails.clientname,
            reqfulfillmentreason: this.requisitionDetails.reqfulfillmentreason,
            reqfulfillmentreasonid: this.requisitionDetails.reqfulfillmentreasonid
        };
    
        this.getRequistionStatus();
        this.setDateModelinUpdate(this.requisitionDetails.startdate, this.requisitionDetails.projectenddate);
        this.getReqFulfillmentReason(); 
    
        let ngbModalOptions :NgbModalOptions = {
            backdrop:'static',
            keyboard:true,
            size:'lg',
            windowClass:"linkedinpopup"
        
         };
        this.modalRef = this.modalService.open(this.cloneRequisition, ngbModalOptions);

    }

  
    getRequistionStatus(){
        this.busy = this.RequisitionsService.getReqStatus().subscribe(data =>{
            let resP = JSON.parse(data._body)['response'];
            this.requisitionStatusList = resP.status;
        },
        err => {
            console.log("Couldn't fetch the data " + err);
        }
        );
    }
    
    
    getClientName(term: string): ObservableInput<any> {
        if(!term){
            return of([])
        }else{

            this.ClientNameLoading = true;
            return this.RequisitionsService.getClientName(term).pipe(
                catchError(()=>of([])),
                map((data:any)=>{
                    this.ClientNameLoading = false;
                    let resP = JSON.parse(data._body);
                    return resP.response ? resP.response.clients:[];

                })

            )
        }   
    }

    onClientChange(data:any){

        if (data) {
            this.cloneModel.clientid = data.clientcode;

        } else {
            this.cloneModel.clientid = null;

        }
    }

  onReqFulfillmentReasonChange(data: any) {

    if (data) {
      this.cloneModel.reqfulfillmentreasonid = data.clientcode;

    } else {
      this.cloneModel.reqfulfillmentreasonid = null;

    }
  }

    onStatusChange(data:any){
        if(data){
            this.cloneModel.status = data.status;
        }else{
            this.cloneModel.status = null;
        }
    }



    onCloneSubmit(){
        let reqname = this.cloneModel.requisitionname.replace(/\(1\)/g, '')
        

       if( reqname === this.requisitionDetails.name){
        this.cloneModel.requisitionname =this.requisitionDetails.name;
        
       }

 
        this.isCloneLoading = true;
        this.RequisitionsService.createCloneReq(this.cloneModel).subscribe(
            (res) => {
                let data = JSON.parse(res._body);
                if (data.response) {
                    setTimeout(() => { 
                        this.isCloneLoading = false;
                        this.cloneSuccessMessage = true;
                    }, 2000);
                    setTimeout(() => {
                        this.modalRef.close();
                        this.resetCloneModel();
                        this.getallreqDetails();
                    }, 4000);
                }else{
                    setTimeout(() => {
                        this.isCloneLoading = false;
                      this.cloneErrorMessage = true;
                      if (data.message) {
                        this.serverErrResp = data.message;

                      }
                    }, 2000);
                    setTimeout(() => {
                        this.modalRef.close();
                        this.resetCloneModel();
                    }, 4000);
                   
                }
            }
        );
    }


    resetCloneModel() {
    this.cloneModel["requisitionid"] = null;
    this.cloneModel["requisitionname"] = null;
    this.cloneModel["statusid"] = null;
    this.cloneModel["status"] = "";
    this.cloneModel["clientid"] = "";
    this.cloneModel["clientname"] = null;
    this.cloneModel["clonecount"] = 1;
    this.cloneErrorMessage = false;
    this.cloneSuccessMessage = false;

     }

  updateDurationClicked() {

    let modalRef =  this.modalService.open(UpdateDurationComponent, {
      backdrop: 'static', size: 'lg', windowClass: 'linkedinpopup'
    });
    modalRef.componentInstance.requisitionid = this.requisitionid ? this.requisitionid : "";

  }

  enableDisableNotification() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };
    if (this.isdisable) {
      this.popupConfig.title = "Alert !";
      this.popupConfig.message = "Are you sure you want to enable all the automation processes?";
      this.popupConfig.type = "";
      this.popupConfig.isConfirm = true;
      this.popupConfig.negativebtnText = "No";
      this.popupConfig.positivebtnText = "Yes";
    } else {
      this.popupConfig.title = "Alert !";
      this.popupConfig.message = "Are you sure you want to disable all the automation processes?";
      this.popupConfig.type = "";
      this.popupConfig.isConfirm = true;
      this.popupConfig.negativebtnText = "No";
      this.popupConfig.positivebtnText = "Yes";
    }


    this.confirmModal = this.modalService.open(this.content, ngbModalOptions);
  }
    //End of CLone Code

  enableEmailNtfication() {

    let reqobj = {};

    if (this.isdisable) {
   
      reqobj = {
        'requisitionId': this.requisitionid,
        'disabled':false
      }
      
    } else {
      reqobj = {
        'requisitionId': this.requisitionid,
        'disabled': true
      }
    }



    this.busy = this.RequisitionsService.enableEmailNtfication(reqobj)
      .subscribe(
        (res: any) => {
          this.enabledisablenotification = JSON.parse(res._body)['response'];
          this.getemailNotificationHistory();
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }
  getemailNotificationHistory() {

    this.busy = this.RequisitionsService.GetEmailNotificationHistoryAsync(this.requisitionid).subscribe(
      (res: any) => {
        this.isdisable = JSON.parse(res._body)['response']['isDisabled'];
        if (JSON.parse(res._body)['response']['isDisabled']) {
          this.enabledisablenotification = false;
        }
       // this.enabledisablenotification = false;
      },
      err => {
        console.log(err);
      }
    );
  }

  StartDateChanged() {

    if (!this.StartDate)
      return;

    var tzoffset = (new Date()).getTimezoneOffset() * 60000;

    var date: any = new Date(`${this.StartDate.year}-${this.StartDate.month}-${this.StartDate.day}`);

    // latest changes for start date for previous date on selection
    let MM = ('0' + this.StartDate.month).slice(-2);
    let DD = ('0' + this.StartDate.day).slice(-2);
    this.cloneModel.startDate = `${MM}/${DD}/${this.StartDate.year}`;
    this.cloneModel.startDate = `${this.StartDate.year}-${MM}-${DD}`;


  }
  EndDateChanged() {
    if (!this.endDate) {
      return;
    }

    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let MM = ('0' + this.endDate.month).slice(-2);
    let DD = ('0' + this.endDate.day).slice(-2);

    var date: any = new Date(`${this.endDate.year}-${this.endDate.month}-${this.endDate.day}`);
    let endDateObj: Date = new Date(date);
    this.cloneModel.enddate = `${MM}/${DD}/${this.endDate.year}`;

    let startDateObj = new Date(this.cloneModel.startDate);

    let Difference_In_Time = endDateObj.getTime() - startDateObj.getTime();
    if (Difference_In_Time < 0) {
      this.endDate = null;
      return;
    }

    this.Difference_In_Days = parseInt('' + (Difference_In_Time / (1000 * 3600 * 24)));

    this.durationDiffWeeks = parseInt('' + this.Difference_In_Days / 7);
    this.durationDiffDays = this.Difference_In_Days % 7;

    this.cloneModel.projectdurationweeks = this.durationDiffWeeks;
    this.cloneModel.dateDiffinDays = this.durationDiffDays;

  }

  setDateModelinUpdate(updateModel, updateModel1) {
    if (updateModel) {

      let dd = new Date(updateModel);

      this.StartDate = { "year": dd.getFullYear(), "month": dd.getMonth() + 1, "day": dd.getDate() };
      let MM = ('0' + this.StartDate.month).slice(-2);
      let DD = ('0' + this.StartDate.day).slice(-2);
      this.cloneModel.startDate = `${MM}/${DD}/${this.StartDate.year}`;
      this.cloneModel.startDate = `${this.StartDate.year}-${MM}-${DD}`;


    }

    if (updateModel1) {
      let dd = new Date(updateModel1);

      this.endDate = { "year": dd.getFullYear(), "month": dd.getMonth() + 1, "day": dd.getDate() };
      let MM = ('0' + this.endDate.month).slice(-2);
      let DD = ('0' + this.endDate.day).slice(-2);
      this.cloneModel.enddate = `${MM}/${DD}/${this.endDate.year}`;
      this.cloneModel.enddate = `${this.endDate.year}-${MM}-${DD}`;


    }
  }

  getAlltheReqDetails() {
    this.busy = this.AddrecService.getRequisitionDetailsById(this.requisitionid)
      .subscribe(
        (res: any) => {
          if (JSON.parse(res._body)['response'][0]) {
            this.deliverymodelid = JSON.parse(res._body)['response'][0].deliverymodelid;

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


