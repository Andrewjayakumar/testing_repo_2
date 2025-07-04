import { Component, OnInit, ViewChildren, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RequisitionAdvancedSearchService } from '../req-adb-search/requisition-advanced-search.service';
import { Subscription, Subject } from 'rxjs';
import { NgbModal, NgbModalOptions, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
declare var $: any;
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RequisitionsService } from '../requisitions.service';
import { filter, map, distinctUntilChanged, catchError, switchMap, concat, tap, debounceTime, takeUntil } from 'rxjs/operators';
import { ObservableInput } from 'rxjs/Observable';
import { ReqAssignmentComponent } from './../my-requisitions/req-assignment/req-assignment.component';
// import { ReqQualificationComponent } from './../my-requisitions/req-qualification/req-qualification.component';
import { ReqSummaryComponent } from './../my-requisitions/req-summary/req-summary.component';
import { of } from 'rxjs/observable/of';
import { AddCandidate } from '../../candidate/add-candidate/add-candidate.component';
import { User } from '../../../core/models/user.model';
import { JobboardsearchService } from '../../jobboardsearch/jobboardsearch.service';


@Component({
  selector: 'advanced-search',
  templateUrl: './requisition-advanced-search.component.html',
  styleUrls: ['./requisition-advanced-search.component.scss'],
  providers: [RequisitionAdvancedSearchService, JobboardsearchService],
  // encapsulation: ViewEncapsulation.None
})
export class RequisitionAdvancedSearchComponent implements OnInit, AfterViewInit {

  busy: Subscription;
  current_user_role: any;
  current_userid: string = "";
  region: any;
  requisitionStatus: any;
  requisitionType: any;
  jobtitledetails: any;
  skills: any;
  employmentTpeDetails: any;
  searching = false;
  searchFailed = false;
  priorityDetails: any;
  statesdetails: any;
  countrydetails: any;
  countryid: null;
  clientNameDetails: any;
  lobdetails: any;
  salesrep: any;
  VmoDetails: any;
  msProjectDetails: any;
  rForm: FormGroup;
  receivedfrmdate: any;
  dateholder: any;
  receivedtoDate: any;
  requisitionResults: any;
  @Input('requisition') requisition: any;
  pagesize: number = 20;
  pageindex: number = 1;
  totalrecords: number = 0;
  noRecordMsg: string = null;
  totalPositions: number = 0;
  submitted: number = 0;
  totalinterviewed: number = 0;
  totalhired: number = 0;
  errorMessage: any;
  itssprojectid: any;
  vmo: any;
  assignedto = [];
  salesrepID: any;
  vmoDetails: any;
  recruiterNgModelClear: any;
  itssProjNgModelClear: any;
  datengModelValClear: any;
  //requisitiontowerClear: any;
  isExport: any;
  activeRoleName: any;
  showLoader = false;
  successMessage: any;
  successMessageHide = false;
  MandatorySkillItems$: Observable<any>;
  DesiredSkillItems$: Observable<any>;
  mandatoryskills$ = new Subject<string | null>();
  desiredskills$ = new Subject<string | null>();
  public mandatoryskillsArray = new Array();
  // qualificationDetails: any;
  verticles: any;
  //towerDetails: any;
  //towerid: any;
  //subTowerDetails: any;
  //requisitionSubtowerClear: any;
  assignmentErrorMessage: any;
  deliveryModelList = [];

  DMItems$: Observable<any>;
  Dminput$ = new Subject<string | null>();
  DMLoading = false;
  actionDashboardMenu: boolean = false;
  deliverymodelArray = [];
  isAIdrivenUser: boolean = false;



  constructor(private router: Router, private RequisitionAdvancedSearchService: RequisitionAdvancedSearchService, public _modalService: NgbModal, private jobboardsearchService: JobboardsearchService,
    private localStorage: LocalStoreManager, private fb: FormBuilder, private parentrecservice: RequisitionsService) {
    let current_user: User = this.localStorage.getData('current_user');
    if (current_user.activerole) {
      this.current_user_role = current_user.activerole

    }
    if (current_user.activerolename) {
      this.activeRoleName = current_user.activerolename

    }
    this.isAIdrivenUser = current_user.aidrivenuser ? true : false;

    this.initializeTypeaheads();

  }

  public model = {
    "isremote": false,
    // "offshore": false
  }


  ngOnInit() {
    this.requisitionsearchForm();
    this.getregion();
    this.getrequisitionType();
    this.getrequisitionStatus();
    // this.gettheskills();
    this.getjobtitle();
    this.gettheEmploymentType();
    this.getthepriority();
    this.getAlltheClientNames();
    this.getlob();
    //this.getSalesRep();
    // this.gettheVMODetails();
    // this.getMSProjectDetails();
    this.getthecountry();
    // this.getAlltheQualification();
    //this.getAlltheTower();
    this.getDeliveryModel();
    this.getVerticals();
  }

  ngAfterViewInit(): void {
    this.parentrecservice.trackActivityPageOpened({ "pagename": "AdvancedReqSearch" }).subscribe(res => { },
      err => {
        console.log("tracking call failed:" + err);
      });
  }


  ngOnDestroy(): void {
    this.mandatoryskills$.unsubscribe();

  }
  initializeTypeaheads(param?) {

    this.MandatorySkillItems$ = this.mandatoryskills$.pipe(
      //filter(t => t && t.length > 1),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.searchSkills(term))
    );

    this.DMItems$ = this.Dminput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchDms(term))
    );
  }

  searchDms(term: string): ObservableInput<any> {
    if (!term)
      return of([]);

    this.DMLoading = true;
    return this.RequisitionAdvancedSearchService.getDeliveryMgr(term).pipe(
      map((res: any) => {
        //debugger;
        this.DMLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.deliverymanagers : []
      })
    );
  }

  searchSkills(term: string): ObservableInput<any> {
    this.mandatoryskillsArray = null;
    if (!term) {
      this.mandatoryskillsArray = [];
      return this.mandatoryskillsArray;
    }

    return this.RequisitionAdvancedSearchService.gettheskills(term).pipe(
      map((res: any) => {
        // debugger;
        this.mandatoryskillsArray = [];
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.relatedskills : [];

      })

    );
  }
  //apply clicked handler
  onApplyClicked() {
    $(".collapse.show").each(function () {
      $(this).removeClass('show');
      $("button").attr("aria-expanded", "false");


    });


    this.showLoader = true;

    $('#home').addClass('active');
    $('#home').addClass('show');
    $('#client').removeClass('active');
    $('#client').removeClass('show');

  }

  requisitionsearchForm() {

    this.rForm = this.fb.group({
      searchtext: [null, Validators.required],
      regionid: [[], [Validators.required]],
      requisitiontypeid: [[], [Validators.required]],
      statusid: [[], Validators.required],
      jobtitleid: [null, Validators.required],
      employmenttypeid: [null, Validators.required],
      // assignedto: [[], Validators.required],
      states: [[], Validators.required],
      zipcode: [null, Validators.required],
      city: [null, Validators.required],
      // remotelocationdetails: [[], Validators.required],
      // vmo: [null, Validators.required],
      requisitionpriorityid: [[], [Validators.required]],
      clientlobid: [null, Validators.required],
      hiringmanagername: [null, Validators.required],
      clientid: [[], Validators.required],
      // clientname: [null, Validators.required],
      // searchtype: 0,
      // categoryid: [null, Validators.required],
      countryid: [null],
      // itssprojectid: [null, Validators.required],
      name: [null, Validators.required],
      skills: [[], [Validators.required]],
      jump: [null, Validators.required],
      itss: [null, Validators.required],
      bulk: [null, Validators.required],

      receivedfrom: [null, Validators.required],
      receivedto: [null, Validators.required],
      unresponded: [null, Validators.required],
      partiallyresponded: [null, Validators.required],
      // qualification: [[], [Validators.required]],
      verticalName: [null, [Validators.required]],
      //requisitionsubtower: [[], [Validators.required]],
      deliverymanager: [[]],
      deliverymodelid: [null, Validators.required]
    });
  }
  receivedfromdate(value) {
    this.receivedfrmdate = '';

    if (value) {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      // this.submitteddrom = new Date(`${value.year}-${value.month}-${value.day}`).toISOString();
      this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
      this.receivedfrmdate = (new Date(this.dateholder - tzoffset)).toISOString();

    }
  }

  receivedTo(value) {
    this.receivedtoDate = '';
    this.dateholder = '';
    if (value) {
      /// this.submitteddate = new Date(`${value.year}-${value.month}-${value.day}`).toISOString();
      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
      this.receivedtoDate = (new Date(this.dateholder - tzoffset)).toISOString();

    }
  }
  // get Region
  getregion() {
    let apiparam: any = {};
    this.busy = this.RequisitionAdvancedSearchService.getregion(apiparam)
      .subscribe(
        (res: any) => {
          this.region = JSON.parse(res._body)['response'];
          //  console.log("Region is", this.region);

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // get verticals 
  getVerticals() {
    this.busy = this.RequisitionAdvancedSearchService.getVerticalsListAsync()
      .subscribe(
        (res: any) => {
          this.verticles = JSON.parse(res._body)['response'];
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

  // Get Requisition Type

  getrequisitionType() {
    let apiparam: any = {};
    this.busy = this.RequisitionAdvancedSearchService.getrequisitionType(apiparam)
      .subscribe(
        (res: any) => {
          this.requisitionType = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // Get Requisition Status

  getrequisitionStatus() {
    let apiparam: any = {};
    this.busy = this.RequisitionAdvancedSearchService.getrequisitionStatus(apiparam)
      .subscribe(
        (res: any) => {
          this.requisitionStatus = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // Get Job Title

  getjobtitle() {
    let apiparam: any = {};
    this.busy = this.RequisitionAdvancedSearchService.getjobtitle(apiparam)
      .subscribe(
        (res: any) => {
          this.jobtitledetails = JSON.parse(res._body)['response'];


        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }



  // get the skills


  gettheskills() {
    let apiparam: any = {};
    this.busy = this.RequisitionAdvancedSearchService.gettheskills(apiparam)
      .subscribe(
        (res: any) => {
          this.skills = JSON.parse(res._body)['response'];
          // console.log("skills is", this.skills);

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }


  // Get the employment Type
  gettheEmploymentType() {
    let apiparam: any = {};
    this.busy = this.RequisitionAdvancedSearchService.gettheEmploymentType()
      .subscribe(
        (res: any) => {
          this.employmentTpeDetails = JSON.parse(res._body)['response'];


        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // for Assigned to

  formatsubmitMatches = (value: any) => value.recruiter || '';

  assignedTo = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>

        this.RequisitionAdvancedSearchService.getassignedTo(term, { "clientid": "" }, { "name": "" })
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))
      .do(() => this.searching = false);


  // to get the Priority

  getthepriority() {

    this.busy = this.RequisitionAdvancedSearchService.getthepriority()
      .subscribe(
        (res: any) => {
          this.priorityDetails = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // Get the country
  getthecountry() {
    let apiparam: any = {};
    this.busy = this.RequisitionAdvancedSearchService.getthecountry(apiparam)
      .subscribe(
        (res: any) => {
          this.countrydetails = JSON.parse(res._body)['response'];


        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  getstatecode(value) {

    if (value) {
      this.getthestates(value.id);
    }
    else
      this.statesdetails = [];
  }
  // get the states
  getthestates(countryid) {

    this.busy = this.RequisitionAdvancedSearchService.getthestates(countryid)
      .subscribe(
        (res: any) => {
          this.statesdetails = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // get clientNames

  getAlltheClientNames() {

    this.busy = this.RequisitionAdvancedSearchService.getAlltheClientNames()
      .subscribe(
        (res: any) => {
          this.clientNameDetails = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // for LOB

  getlob() {
    let apiparam: any = {};
    this.busy = this.RequisitionAdvancedSearchService.getlob(apiparam)
      .subscribe(
        (res: any) => {
          this.lobdetails = JSON.parse(res._body)['response'];
          // console.log("Region is", this.region);

        },
        err => {
          //  console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // for Sales Rep

  /*
  getSalesRep() {
    let apiparam: any = {};
    this.busy = this.RequisitionAdvancedSearchService.getSalesRep()
      .subscribe(
        (res: any) => {
          this.salesrep = JSON.parse(res._body)['response'];

        },
        err => {
        },
        () => {
        }
      );
  }

*/
  formatsubmitMatchesSales = (value: any) => value.salesrep || '';

  sales = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>

        this.RequisitionAdvancedSearchService.getSalesRep(term, { "clientid": "" }, { "name": "" })
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))
      .do(() => this.searching = false);

  //get the VPO
  /*
  gettheVMODetails() {
    let apiparam: any = {};
    this.busy = this.RequisitionAdvancedSearchService.gettheVMODetails()
      .subscribe(
        (res: any) => {
          this.VmoDetails = JSON.parse(res._body)['response'];
          // console.log("Region is", this.region);

        },
        err => {
          //  console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

*/

  formatsubmitMatchesvmo = (value: any) => value.userid || '';

  vMo = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>

        this.RequisitionAdvancedSearchService.gettheVMODetails(term, { "clientid": "" }, { "name": "" })
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))
      .do(() => this.searching = false);

  //  MS project Details
  /*
  getMSProjectDetails() {
    let apiparam: any = {};
    this.busy = this.RequisitionAdvancedSearchService.getMSProjectDetails()
      .subscribe(
        (res: any) => {
          this.msProjectDetails = JSON.parse(res._body)['response'];

        },
        err => {
        },
        () => {
        }
      );
  }
  */
  formatsubmitMatchesitss = (value: any) => value.msprojectname || ''


  itss = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>

        this.RequisitionAdvancedSearchService.getMSProjectDetails(term, { "clientid": "" }, { "name": "" })
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))
      .do(() => this.searching = false);
  // Reset the form
  resetForm() {
    this.rForm.reset();
    this.receivedfrmdate = '';
    this.receivedtoDate = '';
    this.requisitionResults = [];
    this.totalPositions = 0;
    this.submitted = 0;
    this.totalinterviewed = 0;
    this.totalhired = 0;
    this.totalrecords = 0;
    this.itssprojectid = '';
    this.salesrepID = '';
    this.vmoDetails = '';
    this.assignedto = [];
    this.recruiterNgModelClear = '';
    this.itssProjNgModelClear = '';
    this.datengModelValClear = '';
    this.rForm.value['RequisitionSearchBasedOn'] = 0;
    //this.requisitiontowerClear = '';
    //this.towerid = '';
    this.model.isremote = false;
    // this.model.offshore = false;

  }
  // adpost method
  addPost(value, pageIndex?) {
    this.showLoader = true;
    if (value == 'apply') {
      this.rForm.value['type'] = 0;
      this.requisitionResults = [];
      this.totalPositions = 0;
      this.submitted = 0;
      this.totalinterviewed = 0;
      this.totalhired = 0;
      this.totalrecords = 0;
      this.rForm.value['RequisitionSearchBasedOn'] = 0;
      this.pageindex = 0;


    }
    else if (value == 'requisition') {
      this.rForm.value['type'] = 0;
      this.requisitionResults = [];
      this.totalPositions = 0;
      this.submitted = 0;
      this.totalinterviewed = 0;
      this.totalhired = 0;
      this.totalrecords = 0;
      this.rForm.value['RequisitionSearchBasedOn'] = 0;
      this.pageindex = pageIndex;

    }
    else if (value == 'client') {
      this.rForm.value['type'] = 0;
      this.requisitionResults = [];
      this.totalPositions = 0;
      this.submitted = 0;
      this.totalinterviewed = 0;
      this.totalhired = 0;
      this.totalrecords = 0;
      this.rForm.value['RequisitionSearchBasedOn'] = 1;
      this.pageindex = pageIndex;

      $('#client').addClass('active');
      $('#client').addClass('show');
      $('#home').removeClass('active');
      $('#home').removeClass('show');



    }

    this.rForm.value['receivedfrom'] = this.receivedfrmdate;
    this.rForm.value['receivedto'] = this.receivedtoDate;
    this.rForm.value['pageindex'] = this.pageindex;
    this.rForm.value['pagesize'] = 20;
    if (this.itssprojectid) {
      this.rForm.value['itssprojectid'] = this.itssprojectid;

    }

    if (this.salesrep) {
      this.rForm.value['salesrepid'] = this.salesrep;

    }
    if (this.vmo) {
      this.rForm.value['vmo'] = this.vmo;

    }

    if (this.activeRoleName) {
      this.rForm.value['rolename'] = this.activeRoleName;

    }

    if (this.assignedto) {
      this.rForm.value['assignedto'] = this.assignedto;

    }

    //if (this.towerid) {
    //this.rForm.value['requisitiontower'] = this.towerid;

    //}

    this.rForm.value['isremote'] = this.model.isremote;
    // this.rForm.value['offshore'] = this.model.offshore;



    this.busy = this.RequisitionAdvancedSearchService.getAllSearchResults(this.rForm.value)
      .subscribe(
        (res: any) => {
          if (JSON.parse(res._body)['response']) {
            this.requisitionResults = JSON.parse(res._body)['response'].result;
            this.isExport = JSON.parse(res._body)['response'].isexport;
            this.showLoader = false;


          }
          else {
            this.errorMessage = "No Results Found!";
            this.showLoader = false;

            setTimeout(() => {
              this.errorMessage = "";
            }, 5000);
          }
          if (JSON.parse(res._body)['responsecode'] == 500) {
            this.errorMessage = JSON.parse(res._body)['message'];
            this.showLoader = false;

            setTimeout(() => {
              this.errorMessage = "";
            }, 5000);
          }
          if (JSON.parse(res._body)['response']) {
            this.totalrecords = JSON.parse(res._body)['response'].totalrecord;
            if (JSON.parse(res._body)['response'].totalpositions) {
              this.totalPositions = JSON.parse(res._body)['response'].totalpositions;
            }
            if (JSON.parse(res._body)['response'].totalsubmitted) {
              this.submitted = JSON.parse(res._body)['response'].totalsubmitted;
            }
            if (JSON.parse(res._body)['response'].totalinterviewed) {
              this.totalinterviewed = JSON.parse(res._body)['response'].totalinterviewed;
            }
            if (JSON.parse(res._body)['response'].totalhired) {
              this.totalhired = JSON.parse(res._body)['response'].totalhired;
            }
          }

        },
        err => {
          //  console.log(err);
          this.showLoader = false;

        },
        () => {
          //console.log("done");
          this.showLoader = false;

        }
      );
  }

  // On page changed for pagination on results
  onPageChanged(event) {
    this.pageindex = event;

    if (this.pageindex) {
      this.showLoader = true;
      let currentview = 'requisition';
      if (this.rForm.value['RequisitionSearchBasedOn'] == 1)
        currentview = 'client';

      this.addPost(currentview, this.pageindex);
    }

  }


  onActionClicked(event) {
    //event.type= hyperlink, clone, reqsummary
    switch (event.actiontype) {
      case 'hyperlink': this.redirectToRecPage(event.id);
        break;
      case 'quickview': this.showSummaryPopup(event.id);
        break;
      case 'assign': this.showAssignpopup(event.id);
        break;
      // case 'qualification': this.showQualification(event.id);
      //   break;
      // case 'clone': this.goToCloneReq(event.id);
      default: break;
    }

  }


  showSummaryPopup(id: any) {
    //console.log("Getting ID", id);
    //TODO
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      //  scrollable: true,
      windowClass: 'overrides'
    };
    const modalRef = this._modalService.open(ReqSummaryComponent, ngbModalOptions);

    modalRef.componentInstance.id = id;
  }

  // showQualification(id: any) {
  //   // console.log("Getting ID", id);
  //   //TODO
  //   let ngbModalOptions: NgbModalOptions = {
  //     backdrop: 'static',
  //     keyboard: false,
  //     size: 'lg',
  //     //  scrollable: true,
  //     windowClass: 'overrides'
  //   };
  //   const modalRef = this._modalService.open(ReqQualificationComponent, ngbModalOptions);
  //   //  window.scrollTo(0,1000);

  //   //  modalRef.componentInstance.name = 'activitysearch';
  //   modalRef.componentInstance.id = id;
  // }
  showAssignpopup(requisitionObj: any) {
    //TODO
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      //  scrollable: true,
      windowClass: 'overrides'
    };
    const modalRef = this._modalService.open(ReqAssignmentComponent, ngbModalOptions);
    modalRef.result.then((result) => {
      if (result == 'ok') {
        this.successMessage = 'Requisition assigned successfully!';
        this.onApplyClicked();
        this.addPost('apply'); // to refresh the search results
        window.scroll(0, 0);

        this.successMessageHide = true;
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
      console.log('Dismissed action: ' + reason);
    });

    //  modalRef.componentInstance.name = 'activitysearch';
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

  selectItssProject(event) {
    if (event.item.msprojectid) {
      this.itssprojectid = event.item.msprojectid;

    }
  }

  selectSales(event) {
    if (event.item.salesrep) {
      this.salesrep = event.item.salesrep;

    }
  }

  selectVmo(event) {
    if (event.item.userid) {
      this.vmo = event.item.userid;

    }
  }
  selectAssignedTo(event) {
    if (event.item.recruiter) {
      this.assignedto.push(event.item.recruiter);

    }
  }

  exporttoExcel() {
    let apiparam: any = {};
    this.showLoader = true;

    if (this.isExport == 1) {
      this.rForm.value['export'] = true;

    }

    delete this.rForm.value.rolename;
    this.busy = this.RequisitionAdvancedSearchService.exportToExcel(this.rForm.value)
      .subscribe(
        (res: any) => {
          if (JSON.parse(res._body)['response']) {
            this.successMessage = JSON.parse(res._body)['message'];
            this.successMessageHide = true;
            this.showLoader = false;
            delete this.rForm.value.export;

          }
          setTimeout(() => {
            this.successMessageHide = false;
            this.successMessage = '';

          }, 5000);

        },
        err => {
          //  console.log(err);
          this.showLoader = false;

        },
        () => {
          //console.log("done");
          this.showLoader = false;

        }
      );
  }

  // get All the Qualification
  // getAlltheQualification() {
  //   this.busy = this.RequisitionAdvancedSearchService.getAlltheQualification()
  //     .subscribe(
  //       (res: any) => {
  //         this.qualificationDetails = JSON.parse(res._body)['response'];

  //       },
  //       err => {
  //       },
  //       () => {
  //       }
  //     );
  // }

  // get All the Tower Details

  //getAlltheTower() {
  //  this.busy = this.RequisitionAdvancedSearchService.getAlltheTower()
  //    .subscribe(
  //      (res: any) => {
  //        this.towerDetails = JSON.parse(res._body)['response'];
  //
  //      },
  //      err => {
  //      },
  //      () => {
  //      }
  //    );
  //}


  //getTowerCode(value) {
  //  this.towerid = '';
  //  this.requisitionSubtowerClear = ''
  //  if (value.towerid) {
  //    this.towerid = value.towerid;
  //    this.gettheSubTower();

  //   }
  // }
  // get the SubTower values
  //gettheSubTower() {

  //this.busy = this.RequisitionAdvancedSearchService.gettheSubTower(this.towerid)
  //  .subscribe(
  //    (res: any) => {
  //      this.subTowerDetails = JSON.parse(res._body)['response'];

  //    },
  //    err => {
  //      console.log(err);
  //    },
  //    () => {
  //console.log("done");
  //    }
  //  );
  // }

  getDeliveryModel() {
    this.RequisitionAdvancedSearchService.getDeliveryModel().subscribe(
      (res: any) => {
        this.deliveryModelList = JSON.parse(res._body)['response'];

      },
      err => {
        console.log(err);
      }
    );
  }

  onChangeDeliveryModel(event) {
    this.deliverymodelArray = [];
    if (event.deliverymodelid) {
      // this.deliverymodelArray.push(event.deliverymodelid);
      this.rForm.value['deliverymodelid'] = event.deliverymodelid;


    }

  }
  addCandidate() {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      size: 'lg',
      windowClass: 'activity-modal'
      //  scrollable: true
    };
    const modalRef = this._modalService.open(AddCandidate, ngbModalOptions);
    modalRef.componentInstance.name = 'addcandidate';
    this.actionDashboardMenu = false;
  }
}
