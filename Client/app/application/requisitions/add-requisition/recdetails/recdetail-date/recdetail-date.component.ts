import { Component, OnInit, Output, EventEmitter, SimpleChanges, Input, ViewChild, AfterViewInit } from '@angular/core';
import { AddrecService } from '../../addrec.service';
import { AddRecSharedService } from '../../addrec.shared.service';
import { NgbModal, NgbDateStruct, NgbModalOptions, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { RecFormData } from '../../../model/RecFormData';
import { AcaDocumentsComponent } from '../aca-documents/aca-documents.component';

import { Router, ActivatedRoute } from '@angular/router';
import { LocalStoreManager } from '../../../../../core/authservice/local-store-manager.service';

@Component({
  selector: 'app-recdetail-date',
  templateUrl: './recdetail-date.component.html',
  styleUrls: ['../recdetails.component.scss']
})
export class RecdetailDateComponent implements OnInit {

  public projectTypeList: any;

  // public  = false;

  public currentDate: NgbDateStruct = <NgbDateStruct>{};
  public dueDate: NgbDateStruct = <NgbDateStruct>{};
  public startDate: NgbDateStruct = <NgbDateStruct>{};
  public endDate: NgbDateStruct = <NgbDateStruct>{};

  public durationDiffWeeks = null;
  public durationDiffDays = null;
  public gpgpmMarginsForEditReq = [];

  public requisitionid: number = null;

  public datamodel = {

    "projecttypeid": 2,
    "billrate": null,
    "currencyid": 1,
    "billratetype": "hourly",
    "duedate": null,
    "startdate": null,
    "projectenddate": null,
    "dateDiffinDays": 0,
    "projectdurationweeks": 0,
    "isbillrateskip": false

  };

  @Output('onReset')
  resetClicked: EventEmitter<any> = new EventEmitter();

  @Output('onCancel')
  cancelClicked: EventEmitter<string> = new EventEmitter();

  @Output('onValidCheck')
  onValidCheck: EventEmitter<any> = new EventEmitter(true);

  @Output('empTypeChanged')
  empTypeChanged: EventEmitter<any> = new EventEmitter();


  isClientFormValid: boolean = false;

  @Input('resetCreateNew')
  resetCreateNew: boolean = false;

  @Input('showSkipBillrate')
  showSkipBillrate: boolean = false;
  //mode can be add, update or clone
  @Input('currentmode')
  mode: string = 'add';

  @ViewChild('recRightForm') form: any;
  Difference_In_Days: number;


  nextClicked = false;
  nextClickSub$: Subscription;
  backClickSub$: Subscription;
  showLoadingAPI: boolean = false;
  activePageName: any;
  billrateInvalidMsg: string = null;
  @Input('deliverymodelid')
  deliverymodelid: any;

  constructor(private recservice: AddrecService, public modalService: NgbModal, private sharedService: AddRecSharedService, private router: Router, private localStorage: LocalStoreManager, private currentRoute: ActivatedRoute) {
    console.log("this Delivery Model ID cons", this.deliverymodelid);


    this.nextClickSub$ = this.sharedService.nextClick$.subscribe(
      () => {
        this.nextClicked = true;
        let isbillratevalid = this.validateBillRateDecimal(); // this step is necessary for old reqs with Hourly type and billrate greater than 999
        if (this.mode == 'add' || this.datamodel.isbillrateskip) {
          isbillratevalid = true;
          this.datamodel["billrate"] = this.datamodel.isbillrateskip ? null : this.datamodel.billrate;
        }

        let valid = this.form.valid && isbillratevalid;
        if (!this.form.valid)
          this.onValidCheck.emit({ "isValid": valid });
        else if (this.form.valid) {
          this.onValidCheck.emit({ "isValid": valid, "datamodel": this.datamodel });
        }

        this.isClientFormValid = false;
      }
    );


    this.backClickSub$ = this.sharedService.backBtnClick$.subscribe(
      (validity: any) => {
        //debugger;
        if (validity != undefined || validity != null)
          this.isClientFormValid = validity;

      },
      (error: any) => {
        console.log("Error in Observable" + error);
      }
    );
  }


  ngOnInit() {
    this.currentRoute.queryParams.subscribe(params => {

      this.activePageName = params['pagename'];

    });

    this.loadInitAPICalls();

    // 
    let today = new Date();
    //  debugger;
    this.currentDate.year = today.getFullYear();
    this.currentDate.month = today.getMonth() + 1;
    this.currentDate.day = today.getDate();

    let dd = new Date(today.setDate(today.getDate() + 15));

    this.dueDate.year = dd.getFullYear();
    this.dueDate.month = dd.getMonth() + 1;
    this.dueDate.day = dd.getDate();

    this.datamodel.duedate = `${this.dueDate.month}/${this.dueDate.day}/${this.dueDate.year}`;

    let dueDataObj: Date = new Date(dd.getTime() - dd.getTimezoneOffset() * 6000);
    this.datamodel.duedate = dueDataObj.toISOString();
    console.log("this Delivery Model ID", this.deliverymodelid);

  }

  validateBillRateDecimal() {
    if (this.datamodel.billratetype != 'hourly') {
      //TODO validation for yearly and monthly here
      return true;
    }

    var regex: RegExp = new RegExp(/^[1-9]\d{0,2}(\.\d{0,2})?$/);
    let input = this.datamodel.billrate;

    if (input && regex.test(input)) {

      this.billrateInvalidMsg = null;
      return true;
    }
    else {
      this.billrateInvalidMsg = "Hourly Bill Rate should not be more than 999.99";
      return false;
    }
  }

  loadInitAPICalls() {
    //ProjectType
    this.recservice.getProjectType()
      .subscribe(res => {
        // debugger;
        let response = JSON.parse(res._body)['response'];
        this.projectTypeList = response.projecttypes;

      },
        err => {
          console.log("Couldnt fetch ProjectTypes List" + err);
        });

  }

  DueDateChanged() {

    if (!this.dueDate)
      return;

    var tzoffset = (new Date()).getTimezoneOffset() * 60000;

    var date: any = new Date(`${this.dueDate.year}-${this.dueDate.month}-${this.dueDate.day}`);
    // let dueDataObj:Date = new Date(date);
    // this.datamodel.duedate = dueDataObj.toISOString();
    // this.datamodel.duedate = (new Date(date)).toISOString();
    // latest changes for start date for previous date on selection
    let MM = ('0' + this.dueDate.month).slice(-2);
    let DD = ('0' + this.dueDate.day).slice(-2);
    this.datamodel.duedate = `${MM}/${DD}/${this.dueDate.year}`;
    // ends

  }

  StartDateChanged() {

    if (!this.startDate)
      return;

    var tzoffset = (new Date()).getTimezoneOffset() * 60000;

    var date: any = new Date(`${this.startDate.year}-${this.startDate.month}-${this.startDate.day}`);

    // latest changes for start date for previous date on selection
    let MM = ('0' + this.startDate.month).slice(-2);
    let DD = ('0' + this.startDate.day).slice(-2);
    this.datamodel.startdate = `${MM}/${DD}/${this.startDate.year}`;
    // ends 


    // this.datamodel.startdate = (new Date(date)).toISOString();

    if (this.endDate) {
      this.endDate = null;
      this.durationDiffWeeks = null;
    }

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
    this.datamodel.projectenddate = `${MM}/${DD}/${this.endDate.year}`;

    let startDateObj = new Date(this.datamodel.startdate);

    let Difference_In_Time = endDateObj.getTime() - startDateObj.getTime();
    if (Difference_In_Time < 0) {
      this.endDate = null;
      return;
    }

    this.Difference_In_Days = parseInt('' + (Difference_In_Time / (1000 * 3600 * 24)));

    this.durationDiffWeeks = parseInt('' + this.Difference_In_Days / 7);
    this.durationDiffDays = this.Difference_In_Days % 7;

    this.datamodel.projectdurationweeks = this.durationDiffWeeks;
    this.datamodel.dateDiffinDays = this.durationDiffDays;

  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.resetCreateNew && changes.resetCreateNew.currentValue) {
      this.form.reset();
      this.datamodel.projectdurationweeks = 0;
      this.dueDate = <NgbDateStruct>{};
      this.startDate = <NgbDateStruct>{};
      this.endDate = <NgbDateStruct>{};
      this.datamodel.currencyid = 1;
      this.datamodel.projecttypeid = 2;
      this.datamodel.billratetype = 'hourly';
      this.nextClicked = false;
      this.resetCreateNew = false;
    }

    if (changes.mode) {
      // debugger;

      if (changes.mode.currentValue === 'update' && changes.mode.previousValue === 'add') {
        let keys = Object.keys(this.datamodel);
        let updateModel = this.sharedService.getFormData();
        keys.forEach(key => {
          if (updateModel[key] != null)
            this.datamodel[key] = updateModel[key];
        });
        this.requisitionid = updateModel['id'];

        this.setDateModelinUpdate(updateModel);
      }

    }

    if ('showSkipBillrate' in changes && changes.showSkipBillrate) {

      if (!changes.showSkipBillrate.currentValue) {
        this.datamodel.isbillrateskip = false;
      }
      else {
        //default the value to true for create req and hence hide billrate fields
        if (this.mode != "update") {
          this.datamodel.isbillrateskip = true;
        }
      }

    }
  }


  acaBtnClicked() {
    let startDateStr = this.startDate['year'] + '-' + this.startDate['month'] + '-' + this.startDate['day'];
    let endDateStr = this.endDate['year'] + '-' + this.endDate['month'] + '-' + this.endDate['day'];



    let ngbModalOptions: NgbModalOptions = {
      backdrop: "static",
      keyboard: true,
      size: "lg",



    };

    const modalRef = this.modalService.open(

      AcaDocumentsComponent,
      ngbModalOptions
    );

    modalRef.componentInstance.requisitionid = this.requisitionid;
    modalRef.componentInstance.startDate = startDateStr;
    modalRef.componentInstance.endDate = endDateStr;
    modalRef.componentInstance.differenceInDays = this.Difference_In_Days;
    modalRef.componentInstance.deliverymodelid = this.deliverymodelid;

    console.log("this Delivery Model ID here", this.deliverymodelid);


  }

  addRemoveDaysfromBindingDate(date, action, offset): Date {
    if (action === "add") {
      let endDate = date.setDate(date.getDate() + offset);
      return new Date(endDate);
    }
    else if (action === "remove") {
      let endDate = new Date();
      endDate = date.setDate(date.getDate() - offset);
      return endDate;
    }
  }

  clearRecFormDetails(currentForm, name) {
    //reset this form
    currentForm.form.reset();

    this.datamodel.projectdurationweeks = 0;
    this.dueDate = <NgbDateStruct>{};
    this.startDate = <NgbDateStruct>{};
    this.endDate = <NgbDateStruct>{};

    this.datamodel.currencyid = 1;

    this.resetClicked.emit(name);
  }

  onCancelClicked() {
    this.cancelClicked.emit('recdetails');
  }

  onAdvancedSearchClicked() {
    sessionStorage.setItem("reqverificationClkd", JSON.stringify('set'));
    this.router.navigateByUrl('apps/redeployment/advancedsearch');
    this.activePageName = null;



  }

  ngOnDestroy() {
    this.backClickSub$.unsubscribe();
    this.nextClickSub$.unsubscribe();
  }

  createRequisition() {
    this.sharedService.createButtonClicked = true;
    // make parent skip model copying and prceed directly to req creation step
    this.onValidCheck.emit({ "isValid": true, "origin": 'reqbuttonclick' });
  }

  setDateModelinUpdate(updateModel: RecFormData) {

    if (updateModel.duedate) {
      let dd = new Date(updateModel.duedate);

      this.dueDate = { "year": dd.getFullYear(), "month": dd.getMonth() + 1, "day": dd.getDate() };

      // Assign current date to created Date of REquisition
      let created = new Date(updateModel['receiveddate']);
      this.currentDate = { "year": created.getFullYear(), "month": created.getMonth() + 1, "day": created.getDate() };

      this.datamodel.duedate = `${this.dueDate.month}/${this.dueDate.day}/${this.dueDate.year}`;
    }

    if (updateModel.startdate) {
      let dd = new Date(updateModel.startdate);

      this.startDate = { "year": dd.getFullYear(), "month": dd.getMonth() + 1, "day": dd.getDate() };


      this.datamodel.startdate = `${this.startDate.month}/${this.startDate.day}/${this.startDate.year}`;
    }

    if (updateModel.projectenddate) {
      let dd = new Date(updateModel.projectenddate);

      this.endDate = { "year": dd.getFullYear(), "month": dd.getMonth() + 1, "day": dd.getDate() };

      this.datamodel.projectenddate = `${this.endDate.month}/${this.endDate.day}/${this.endDate.year}`;

      this.durationDiffWeeks = updateModel.projectdurationweeks;
      this.Difference_In_Days = this.durationDiffWeeks * 7;
    }


  }


  onEmpTypeChanged(event, option) {
    if (event.target.checked) {

      let changedEvent = option.id ? option.id : "";
      this.datamodel.billrate = '';
      this.empTypeChanged.emit(changedEvent);
    }

  }

}
