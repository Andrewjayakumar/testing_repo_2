import { Component, OnInit, ViewChildren, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MyRequisitionsService } from '../../my-requisitions/my-requisitions.service';
import { Subscription, Subject } from 'rxjs';
//import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { of } from 'rxjs/observable/of';
import { filter, distinctUntilChanged, switchMap, tap, catchError, debounceTime, concat, map } from 'rxjs/operators';
import { Observable, ObservableInput } from 'rxjs/Observable';
import { AddrecService } from '../../add-requisition/addrec.service';
import { LocalStoreManager } from '../../../../core/authservice/local-store-manager.service';

@Component({
  selector: 'req-filter-search',
  templateUrl: './req-filter-search.component.html',
  styleUrls: ['./req-filter-search.component.scss'],
  providers: [MyRequisitionsService, AddrecService]

})
export class ReqFilterSearchComponent implements OnInit {

  usersFilter: boolean = false;
  betweenDates: boolean = false;
  filterform: FormGroup;
  busy: Subscription;
  reqFilterData: any;
  pageindex = 1;
  pagesize = 20;
  @Output() onFilterApplied = new EventEmitter<string>();
  @Output() clearfilter = new EventEmitter<string>();
  submittedfrom: any;
  submittedto: any;
  dateholder: any;
  public recruiterList$: Observable<any>;
  public recruiterinput$ = new Subject<string | null>();
  isRecruiterNameLoading = false;

  public salesRepList$: Observable<any>;
  public salesRepinput$ = new Subject<string | null>();
  isSalesRepLoading = false;
  public clientdatainput$ = new Subject<string | null>();
  public clientdata$: Observable<any>;
  isClientLoading = false;
  current_user_role: any;

  regionOptionsList: any;
    clientCode: any;
    @Input('unassignedfilter')
    showOnlyUnassignedReqs = false;

  constructor(private recaddservice: AddrecService, private router: Router, private recservice: MyRequisitionsService, private localStorage: LocalStoreManager, private fb: FormBuilder) {
    this.initializeTypeAheads();

    let current_user = this.localStorage.getData('current_user');

    this.current_user_role = current_user.activerole;
    let index = current_user.email.indexOf('@');

  }

  ngOnInit() {
   
    this.filterForm();
    this.getclientRegionDetails();

  }
  

  filterForm() {
    this.filterform = this.fb.group({
      searchtext: [null, [Validators.required]],
      requisitiontypeid: [null, [Validators.required]],
      datefilter: [null, [Validators.required]],
      receivedfrom: [null, [Validators.required]],
      receivedto: [null, [Validators.required]],
      recruitername: [null, [Validators.required]],
      salesrepid: [null, [Validators.required]],
      type: [0, [Validators.required]],
      regionid   : [null, [Validators.required]],
        clientid: [null, [Validators.required]],
        unassignedrequisitions : [null, [Validators.required]],




    });

  }

  initializeTypeAheads() {
    this.recruiterList$ = this.recruiterinput$.pipe(
      //filter(t => t && t.length > 2),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.searchRecruiters(term))

    );

    this.salesRepList$ = this.salesRepinput$.pipe(
      //filter(t => t && t.length > 2),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.searchSalesRep(term))

    );
    this.clientdata$ = this.clientdatainput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchClientName(term,""))

    );
  }

  searchClientName(term: string,userid): ObservableInput<any> {
    if (!term)
      return of([]);

    this.isClientLoading = true;
    return this.recaddservice.getClientName(term, userid).pipe(
      map((res: any) => {
        this.isClientLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.clients : []
      })

    );
  }
  searchRecruiters(term: string): ObservableInput<any> {

    if (!term)
      return of([]);

    this.isRecruiterNameLoading = true;
     const clientid = ''  ;
    return this.recaddservice.getRecruitersList(term, clientid).pipe(
      map((res: any) => {
        //debugger;
        this.isRecruiterNameLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response : [];
        //return res.response? res.response : []
      })

    );
  }

  searchSalesRep(term: string): ObservableInput<any> {
    if (!term)
      return of([]);

    this.isSalesRepLoading = true;
    return this.recaddservice.getSalesRepList(term).pipe(
      map((res: any) => {
        //debugger;
        this.isSalesRepLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response : [];
      })

    );
  }

  OnClientChanged(event) {
    if (event) {
      this.clientCode = event.clientcode;
    }
  }

  getclientRegionDetails() {
    this.recservice.getRegionByClient().subscribe(
      (res) => {
        let response = JSON.parse(res._body)['response']['regions'];
        // debugger;
        this.regionOptionsList = response ? response : [];
      
      },
      (err) => {
        console.log('error in retreiving Region');
      }
    );
  }

  Submittedfromdate(value) {
    this.submittedfrom = '';

    if (value) {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      // this.submitteddrom = new Date(`${value.year}-${value.month}-${value.day}`).toISOString();
      this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
      this.submittedfrom = (new Date(this.dateholder - tzoffset)).toISOString();

    }
  }


  Submittedtodate(value) {
    this.submittedto = '';

    if (value) {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      // this.submitteddrom = new Date(`${value.year}-${value.month}-${value.day}`).toISOString();
      this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
      this.submittedto = (new Date(this.dateholder - tzoffset)).toISOString();

    }
  }

  ngAfterViewInit() {
   
  }

  close() {

 
  }


  onReset() {
    this.filterform.reset();
      this.clearfilter.emit();
      this.usersFilter = false;
    this.betweenDates = false;

  }

  betweenDateSelect(evt) {
  
    if (evt === 'between') {
      this.betweenDates = true;
      this.filterform.value['datefilter'] = null;
      this.filterform.reset();


    }
    else {
      this.betweenDates = false;
      this.filterform.value['receivedfrom'] = null;
      this.filterform.value['receivedto'] = null;
      this.submittedfrom = '';
      this.submittedto = '';

    }
  }

  onApply() {
    debugger;
     // this.filterform.value['type'] = 0;
      this.filterform.value['unassignedrequisitions'] = this.showOnlyUnassignedReqs;

    if (this.submittedfrom) {
      this.filterform.value['receivedfrom'] = this.submittedfrom;
      this.betweenDates = true;
      this.filterform.value['datefilter'] = null;
      }
    if (this.submittedto) {
      this.filterform.value['receivedto'] = this.submittedto;
      this.betweenDates = true;
      this.filterform.value['datefilter'] = null;
    }
    if (this.filterform.value['requisitiontypeid']) {
      this.filterform.value['requisitiontypeid'] = parseInt(this.filterform.value['requisitiontypeid']);
    }

      this.onFilterApplied.emit(this.filterform.value);
      this.usersFilter = false;

  }
  
}
