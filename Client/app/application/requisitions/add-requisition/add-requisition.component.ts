import { Component, OnInit, ViewChild, Output, EventEmitter, AfterViewInit, ChangeDetectorRef, TemplateRef, OnDestroy } from '@angular/core';
import { WizardComponent } from 'angular-archwizard';
import { AddrecService } from '../add-requisition/addrec.service';
import { AddRecSharedService } from '../add-requisition/addrec.shared.service';
import { RequisitionsService } from '../requisitions.service';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions, NgbTooltip, NgbActiveModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalConfirm, RecCreationConfirmation } from '../requisition-modals.component';
import { RecFormData } from '../model/RecFormData';
import { Subscription, Subject } from 'rxjs';
import { FakeMissingTranslationHandler } from '@ngx-translate/core';



@Component({
    selector: 'app-add-requisition',
    templateUrl: './add-requisition.component.html',
    styleUrls: ['./add-requisition.component.scss'],
    providers: [AddrecService, AddRecSharedService]
})
export class AddRequisitionComponent implements OnInit, AfterViewInit, OnDestroy {

    @ViewChild('content') content: TemplateRef<any>;

    @ViewChild(WizardComponent)
    public wizard: WizardComponent;

    enableAutomation:boolean = true;
    isRecDetailFormValid = false;
    isRecDetailRightFormValid = false;
    isClientDetailFormValid = false;
    private formData: RecFormData = new RecFormData();
    currentUserRole: number = 8;

    modalcloseResult: string;
    isNextClicked = false;
    isBackBtnClicked = false;
    isRecDetailFormReset: boolean = false;
    isClientDetailFormReset: boolean = false;
    isCreateReqClicked: boolean;
    modalRef: any;

    empType: number = 2;// contract by default - to pass to recdeail page

    //  nextbtnSubject$: Subject<void> = new Subject<void>();
    ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false
    };

    isDetailPageValid: boolean = false;

    //Variables needed for Update Rec and clone rec - mode can be add/ update or clone
    mode: string = 'add';
    requisitionid: any = null;
    msprojecturlparam: any = null;
    isAIDrivenUser: boolean = false;
    showSkipBillrate: boolean = false;
    /**
     * 
     * @param router
     * @param currentRoute
     * @param _modalService
     * @param recservice
     * @param parentReqService
     * @param localStore
     * @param cd
     * @param sharedService
     */
    constructor(private router: Router, private currentRoute: ActivatedRoute, public _modalService: NgbModal, private recservice: AddrecService, public parentReqService: RequisitionsService,
        private localStore: LocalStoreManager, private cd: ChangeDetectorRef, private sharedService: AddRecSharedService) { }


    busy: Subscription;
    isPageLoading = false;
  public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true };
  deliverymodelid: any;

    ngOnInit() {
       // debugger;
        let current_user_obj = this.localStore.getData('current_user');
        this.currentUserRole = current_user_obj.activerole;
        this.isAIDrivenUser = current_user_obj.aidrivenuser ? current_user_obj.aidrivenuser : false;

        this.currentRoute.queryParams.subscribe(params => {

            this.requisitionid = parseInt(params['requisitionid']);

            this.msprojecturlparam = parseInt(params['projectid']);

            this.enableAutomation = params['enableAutomation']?params['enableAutomation'].toLowerCase() === 'true':false;

        });

        if (this.requisitionid) {
            this.isPageLoading = true;
            this.busy =
                this.recservice.getRequisitionDetailsById(this.requisitionid).subscribe(
                    (res: any) => {
                       
                        this.mode = 'update';
                        let details = JSON.parse(res._body).response[0];
                        
                        this.empType = details.projecttypeid ? details.projecttypeid : 2;
                    this.showSkipBillrate = details.deliverymodelid && details.deliverymodelid != 1
                    if (details.deliverymodelid) {
                      this.deliverymodelid = details.deliverymodelid;
                      console.log("this Delivery Model ID REQ", this.deliverymodelid);

                    }
                    this.sharedService.setFormData(details);

                    },
                    () => {
                        this.isPageLoading = false;
                    }
                );
        }

    }

    ngAfterViewInit(): void {
        this.isPageLoading = false;
        let obj = null;
        if (this.mode == 'update') {
            obj = { "pagename": "UpdateRequisitionPage" }
        }
        else
            obj = { "pagename": "CreateRequisitionPage" };
        this.parentReqService.trackActivityPageOpened(obj)
            .subscribe(res => { },
                err => {
                    console.log("tracking call failed" + err);
                });
    }


    ngOnDestroy() {
        if (this.busy)
            this.busy.unsubscribe();

        this.sharedService.nextClicked.complete();
        this.sharedService.nextClicked.unsubscribe();
        this.sharedService.backClicked.complete();
        this.sharedService.backClicked.unsubscribe();

    }

    resetClicked(event) {
       
        this.enableAutomation=false;
        if (event == 'recdetail') {
            //clear recdetail Form
            this.isRecDetailFormReset = true;

            //   this.formData.clear('detail');
        }

        else if (event == 'clientdetail') {
            //clear client detail Form
            this.isClientDetailFormReset = true;
        }


    }

    cancelButtonClicked() {
        //goto my req page

        this._modalService.open(NgbdModalConfirm, this.ngbModalOptions).result.then((result) => {
            this.modalcloseResult = `Closed with: ${result}`;
            if (result === 'ok') {
             
                this.formData.clear();
                this.router.dispose();
                if (this.mode == 'update') {
                    if (!this.isAIDrivenUser) {
                        let url = '/apps/recoverview' + '?requisitionid=' + this.requisitionid;
                        this.router.navigateByUrl(url);
                    } else {
                        let url = 'apps/requisitionspage/aimatch?requisitionid=' + this.requisitionid;
                        this.router.navigateByUrl(url);
                    }
                }
                else if (this.msprojecturlparam && this.msprojecturlparam > 0) {
                    this.router.navigateByUrl('projects/summary?projectid=' + this.msprojecturlparam);
                }
                else {
                    this.router.navigateByUrl('apps/requisitionspage/myrequisitions');
                }
              
            }
            else {

            }
        });



    }
    /*  isRecDetailPageValid() {
          return (this.isRecDetailFormValid && this.isRecDetailRightFormValid);
      }*/

    onNextClicked() {
        this.isNextClicked = true;
        this.sharedService.createButtonClicked = false;
        this.isRecDetailFormValid = false;
        this.isRecDetailRightFormValid = false;
        this.sharedService.nextClicked.next();
        
    }



    onFormValid(event, src) {

        let source = event.origin ? event.origin : src;
        switch (source) {
            case 'recdetails': this.isRecDetailFormValid = event.isValid;
                if (event.isValid) {
                    this.setFormDataValues(event.datamodel);
                    this.isRecDetailFormReset = false;

                }

                break;
            case 'recdetailsright': this.isRecDetailRightFormValid = event.isValid;
                if (event.isValid) {
                    this.setFormDataValues(event.datamodel);
                    this.isRecDetailFormReset = false;

                }

                break;
            case 'clientdetails': this.isClientDetailFormValid = event.isValid;
                if (event.isValid) {
                    this.setFormDataValues(event.datamodel);
                    this.isClientDetailFormReset = false;

                }
                break;
            // this is if create req button from rec detail page is clicked
            case 'reqbuttonclick':
                this.isRecDetailFormValid = true;
                this.isRecDetailRightFormValid = true;
                break;
            
            default: break;
        }


        if (this.isAddRecFormValid() && this.sharedService.createButtonClicked) {

            let postObj = Object.assign(this.formData);

            switch (this.mode) {
                case 'add':
                case 'clone':
                case 'itss':
                default:
                    this.postRequisitionforCreate(postObj);
                    break;
                case 'update':
                    this.postRequisitionforUpdate(postObj);
            }

          //  this.isClientDetailFormReset = false;
           // this.isRecDetailFormReset = false;

        }

    }


    isAddRecFormValid() {
        // Return true if all forms had been validated successfully; otherwise, return false
        let allformsValid = this.isRecDetailFormValid &&
            this.isRecDetailRightFormValid && this.isClientDetailFormValid;

        if (this.isRecDetailFormValid && this.isRecDetailRightFormValid) {
            this.isDetailPageValid = true;
            this.wizard.navigation.goToNextStep();
            this.isBackBtnClicked = false;

            this.cd.detectChanges();
        }
        return allformsValid;
    }

    postRequisitionforCreate(dataobj: any) {

        this.isPageLoading = true;
        this.busy = this.recservice.postRequisition(dataobj).subscribe(
            (res: any) => {
                let resParsed = JSON.parse(res._body);
                let response = resParsed.response;
                this.isPageLoading = false;
               // debugger;
                if (!response) {
                    // window.alert("Error in creating Requisition" + resParsed.message);

                    this.popupConfig.title = "Oops !";
                    this.popupConfig.message = "Error Occurred: Failed to Create requisition -" + resParsed.message;
                    this.popupConfig.type = "error";
                    this.popupConfig.isConfirm = true;
                    this.openPopup();
                }
                else {
                    this.requisitionid = response.requisitionid;
                    this._modalService.open(RecCreationConfirmation, { backdrop: true }).result.then((result) => {
                        this.modalcloseResult = `Closed with: ${result}`;
                        if (result === 'ok') {
                            this.router.dispose();

                            if (this.msprojecturlparam && this.msprojecturlparam > 0) {
                                this.router.navigateByUrl('projects/summary?projectid=' + this.msprojecturlparam);
                            }
                            else if (this.isAIDrivenUser) {
                                this.router.navigateByUrl('apps/requisitionspage/aimatch?requisitionid=' + this.requisitionid);
                            }
                            else
                                this.router.navigateByUrl('apps/requisitionspage/myrequisitions');
                        }
                        else if (result === 'createnew') {
                            this.formData = new RecFormData();
                            this.isRecDetailFormReset = true;
                            this.isClientDetailFormReset = true;
                            this.resetProperties();
                            this.wizard.navigation.goToStep(0);


                        }

                    });



                }
            },
            err => {
                this.isPageLoading = false;
                console.log("error in creating requisition" + err.message);

                this.popupConfig.title = "Oops !";
                this.popupConfig.message = "Error Occurred: Failed to Create requisition - " + err.message;
                this.popupConfig.type = "error";
                this.popupConfig.isConfirm = true;

                this.openPopup();
            }
        );

    }

    postRequisitionforUpdate(dataobj: any) {
        this.isPageLoading = true;
        this.busy = this.recservice.updateRequisition(dataobj, this.requisitionid).subscribe(
            (res: any) => {
                let resParsed = JSON.parse(res._body);
                let response = resParsed.response;
                this.isPageLoading = false;

                if (!response) {
                    // window.alert("Error in creating Requisition" + resParsed.message);

                    this.popupConfig.title = "Oops !";
                    this.popupConfig.message = "Error Occurred: Failed  to update requisition -" + resParsed.message;
                    this.popupConfig.type = "error";
                    this.popupConfig.isConfirm = false;
                    this.openPopup();
                }

                else {
                    this.popupConfig.title = "Awesome !";
                    this.popupConfig.message = "Successfully Updated Requisition";
                    this.popupConfig.type = "success";
                    this.popupConfig.isConfirm = false;
                    this.openPopup();


                    setTimeout(() => {
                        this.popupConfig.message = null;

                        this.modalRef.close();
                        debugger;
                        if (this.isAIDrivenUser) {
                            let url = '/apps/requisitionspage/aimatch' + '?requisitionid=' + this.requisitionid;;
                            this.router.navigateByUrl(url);
                        }
                        else {
                            let url = '/apps/recoverview' + '?requisitionid=' + this.requisitionid;;
                            this.router.navigateByUrl(url);
                        } 
                      
                    }, 3000);


                }
            },
            err => {
                this.isPageLoading = false;

                this.popupConfig.title = "Oops !";
                this.popupConfig.message = "Error Occurred: Failed  to update requisition -" + err.message;
                this.popupConfig.type = "error";
                this.popupConfig.isConfirm = true;
                this.openPopup();
            }
        );
    }

    resetProperties() {
        this.isRecDetailFormValid = false;
        this.isRecDetailRightFormValid = false;
        this.isClientDetailFormValid = false;
        this.isNextClicked = false;
        this.isDetailPageValid = false;
        this.isBackBtnClicked = false;
    }

    setFormDataValues(datamodel: any) {

        let keys = Object.keys(datamodel);

        keys.forEach(item => {

           
            this.formData[item] = datamodel[item];
        });
    }

    BackButtonPressed() {

        this.isRecDetailFormValid = false;
        this.isRecDetailRightFormValid = false;
        this.isClientDetailFormValid = false;
        this.isNextClicked = false;
        this.isDetailPageValid = false;
        this.isBackBtnClicked = true;

    }

    empTypeChange(empTypeId) { 
        this.empType = empTypeId ? empTypeId: 2;

        if(this.empType==1|| this.empType==2)
            this.enableAutomation=true;
        else
            this.enableAutomation=false;
    }

  onDeliveryModelUpdated(value) {

      let modelid = value;
    this.deliverymodelid = value;
    console.log("On change", this.deliverymodelid);

    if((this.deliverymodelid==1 || this.deliverymodelid==5) && (this.empType==1|| this.empType==2))
        this.enableAutomation=true;
    else
        this.enableAutomation=false;

      if (modelid && modelid == 2) {
            this.showSkipBillrate = true;
        } else {
            this.showSkipBillrate = false;
        }

    }

    openPopup(closePopup?: boolean) {

        this.modalRef = this._modalService.open(this.content, this.ngbModalOptions);

        this.modalRef.result.then((result) => {

            if (result === 'Close click') {

            }
        }, (reason) => {
            if (reason === ModalDismissReasons.ESC ||
                reason === ModalDismissReasons.BACKDROP_CLICK) {

            }
        });


    }

}
