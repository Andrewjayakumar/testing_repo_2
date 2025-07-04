import { Component, OnInit, ViewChildren, ElementRef, ViewChild, AfterViewInit, ViewEncapsulation  } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MyRequisitionsService } from '../my-requisitions/my-requisitions.service';
import { Subscription, Subject } from 'rxjs';
import { NgbModal, NgbModalOptions, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { ReqAssignmentComponent } from './req-assignment/req-assignment.component';
import { ReqQualificationComponent } from './req-qualification/req-qualification.component';
import { ReqSummaryComponent } from './req-summary/req-summary.component';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
import { RequisitionsService } from '../requisitions.service';



declare var $: any;



@Component({
  selector: 'app-my-requisitions',
  templateUrl: './my-requisitions.component.html',
    styleUrls: ['./my-requisitions.component.scss'],
  providers: [MyRequisitionsService],
 // encapsulation: ViewEncapsulation.None
})
export class MyRequisitionsComponent implements OnInit, AfterViewInit {
    
  busy: Subscription;
  @ViewChild('cardcontainer') cardscrollpane: ElementRef;
  current_user_role: any = 8;
  current_userid: string = "";
  actionDashboardMenu: boolean = false;
  isAIdrivenUser: boolean = false;


    constructor(private router: Router, private currentRoute: ActivatedRoute, private recservice: MyRequisitionsService, public _modalService: NgbModal, private localStorage: LocalStoreManager, public parentReqService: RequisitionsService) {


      let current_user = this.localStorage.getData('current_user');
        
        this.current_user_role = current_user.activerole;
        let index = current_user.email.indexOf('@');
        this.current_userid = current_user.email.substring(0, index);

        this.isAIdrivenUser = current_user.aidrivenuser ? true : false;
        
    }

    currentTab: string = 'card';

    myreqsList: any = [];
    pagesize: number = 20;
    pageindex: number = 1;
    totalrecords: number = 0;
    noRecordMsg: string = null;
    successMessage: any;
    successMessageHide = false;
    assignmentErrorMessage
    filterObject: any;
    filterObjectdd: any;
    unassignedFilterOption = null;


    ngOnInit() {

        
        this.currentRoute.queryParams.subscribe(params => {

            this.unassignedFilterOption = params['unassigned'] ? (params['unassigned'] == 'true') : false;
           

        });

        // For DM and DDs
        if (this.current_user_role == 3 || this.current_user_role == 4) {
           // debugger;
            this.unassignedFilterOption ? this.getMyTeamRequisitions(1, this.pagesize, {"unassignedrequisitions" : true}) :  this.getMyTeamRequisitions(1, this.pagesize, {});
        }
        else {
          this.getOnlyMyRequisitions(1, this.pagesize, {});
        }
       

    }
  
    ngAfterViewInit(): void {
        let obj = null;
        if (this.current_user_role == 3 || this.current_user_role == 4 ) {
            obj = { "pagename": "MyTeamRequisitionsPage" }
        }
        else
            obj = { "pagename": "MyRequisitionsPage" };
        this.parentReqService.trackActivityPageOpened(obj)
            .subscribe(res => { },
                err => {
                    console.log("tracking call failed:" + err);
                });
    }

  getMyTeamRequisitions(pageIndex?, size?, filterOptions?) {
        if (!size)
            size = this.pagesize;
    this.noRecordMsg = null;
      if (filterOptions) {
          this.filterObjectdd = filterOptions;

    }

    
    this.filterObjectdd['pageindex'] = pageIndex;
    this.filterObjectdd['pagesize'] = size;
    


      this.busy = this.recservice.getMyTeamRequisitions(this.filterObjectdd).subscribe(
           
            (res: any) => {
              //  debugger;
                let response = JSON.parse(res._body)['response'];
                //JSON.parse(res._body)['response'];
          if (response) {
            this.myreqsList = response.results;

          }
                if (response && response.totalrecord) {
                    this.totalrecords = response.totalrecord;
                } else {

                  this.noRecordMsg = "No Requisitions Found !! ";
                  this.totalrecords = 0;
                  this.myreqsList = [];
                }


            },
            err => {
               
                this.noRecordMsg = "No Requisitions Found !! ";
                this.totalrecords = 0;
                  
            }
        );
    
    }

    applyFilter(filterObject) {
    debugger;

        if (filterObject) {
      if (this.current_user_role == 3 || this.current_user_role == 4) {
          this.getMyTeamRequisitions(1, this.pagesize, filterObject)
      }
      else {
          this.getOnlyMyRequisitions(1, this.pagesize, filterObject);

      }

    }

  }

  resetFilters(pageIndex, size) {

    if (this.current_user_role == 3 || this.current_user_role == 4) {
      this.filterObjectdd['searchtext'] = null;
      this.filterObjectdd['requisitiontypeid'] = null;
      this.filterObjectdd['datefilter'] = null;
      this.filterObjectdd['receivedfrom'] = null;
      this.filterObjectdd['receivedto'] = null;
      this.filterObjectdd['type'] = 0;
      this.filterObjectdd['recruitername'] = null;
        this.filterObjectdd['salesrepid'] = null;
        this.filterObjectdd['unassignedrequisitions'] = null;
        this.filterObjectdd['clientid'] = null;
        this.filterObjectdd['regionid'] = null;

      this.getMyTeamRequisitions(pageIndex, size, this.filterObjectdd);
    }
    else {
      this.filterObject['searchtext'] = null;
      this.filterObject['requisitiontypeid'] = null;
      this.filterObject['datefilter'] = null;
      this.filterObject['receivedfrom'] = null;
      this.filterObject['receivedto'] = null;
        this.filterObject['type'] = 0;
        this.filterObject['clientid'] = null;
        this.filterObject['regionid'] = null;

      this.getOnlyMyRequisitions(pageIndex, size, this.filterObject);
    }
   

  }
  getOnlyMyRequisitions(pageIndex?, size?, filterOptions?) {
        if (!size)
            size = this.pagesize;

    this.noRecordMsg = null;
      if (filterOptions) {
          this.filterObject = filterOptions;

    }
 
      this.filterObject['pageindex'] = pageIndex;
      this.filterObject['pagesize'] = size;

      
    
      this.busy = this.recservice.getMyRequisitions(this.filterObject).subscribe(

            (res: any) => {
                 // debugger;
                let response = JSON.parse(res._body)['response'];
                //JSON.parse(res._body)['response'];
              if (response) {
                this.myreqsList = response.results;
              }
                if (response && response.totalrecord) {
                    this.totalrecords = response.totalrecord;
                } else {

                    this.noRecordMsg = "No Requisitions Found !! ";
                  this.totalrecords = 0;
                  this.myreqsList = [];
                }


            },
            err => {

                this.noRecordMsg = "No Requisitions Found !! ";
                this.totalrecords = 0;

            }
        );

    }



    onActionClicked(event) {
        //event.type= hyperlink, clone, reqsummary
        switch (event.actiontype) {
            case 'hyperlink' : this.redirectToRecPage(event.id);
                break;
            case 'quickview': this.showSummaryPopup(event.id);
                break;
            case 'assign': this.showAssignpopup(event.id);
                break;
            case 'qualification': this.showQualification(event.id);
                break;
            case 'clone': this.goToCloneReq(event.id);
            default: break;
        }

    }
  
    
    showSummaryPopup(id: any) {
     
      let ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: true,
        size: 'lg',
        //  scrollable: true,
        windowClass: 'overrides'
      };
      const modalRef = this._modalService.open(ReqSummaryComponent, ngbModalOptions);
     
      modalRef.componentInstance.id = id;
    }

    showQualification(id: any) {
    
      let ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: true,
        size: 'lg',
        //  scrollable: true,
        windowClass: 'overrides'
      };
      const modalRef = this._modalService.open(ReqQualificationComponent, ngbModalOptions);
      //  window.scrollTo(0,1000);

      modalRef.componentInstance.id = id;
    }
    showAssignpopup(requisitionObj: any) {
      let ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: true,
        size: 'lg',
        //  scrollable: true,
        windowClass: 'overrides'
      };
      const modalRef = this._modalService.open(ReqAssignmentComponent, ngbModalOptions);
     
      modalRef.result.then((result) => {
        if (result == 'ok') {
          this.successMessage = 'Requisition assigned successfully!';
          this.successMessageHide = true;
          this.getMyTeamRequisitions(1, this.pagesize, {});
           setTimeout(() => {
            this.successMessageHide = false;
            this.successMessage = '';

          }, 5000);

        }
        else {
          if (result && result != true) {
            this.assignmentErrorMessage = result;
            window.scroll(0, 0);

            setTimeout(() => {
              this.assignmentErrorMessage = '';

            }, 10000);

          }
        }
      }, (reason) => {
      
      });

    
      $("ngb-modal-backdrop").addClass("modal-background");
      if (requisitionObj) {
        modalRef.componentInstance.id = requisitionObj.requisitionid;
        modalRef.componentInstance.recruiter = requisitionObj.assignedto;


      }


}
    redirectToRecPage(id: any) {

        if (this.isAIdrivenUser) {
            let urlRoute = '/apps/requisitionspage/aimatch';
            let url = urlRoute + '?requisitionid=' + id;
            this.router.navigateByUrl(url);
            return;
        }
        else {
            let urlRoute = '/apps/recoverview';
            let url = urlRoute + '?requisitionid=' + id;
            this.router.navigateByUrl(url);
        }
       
    }

  onPageChanged(event) {
    debugger;

        this.pageindex = event;

        if (this.current_user_role == 3 || this.current_user_role == 4) {
            this.getMyTeamRequisitions(this.pageindex);
        }
        else {
            this.getOnlyMyRequisitions(this.pageindex);
        }

        this.scrollToTop();
    }
    scrollToTop() {
        let element = this.cardscrollpane.nativeElement;
        if (this.currentTab == 'card')
            element.scrollIntoView(true);
        /*else {
            element = this.listpane.nativeElement;
            element.scrollIntoView(true);
        }*/
    }

    goToCloneReq(id: any) {
       //TODO
    }


}
