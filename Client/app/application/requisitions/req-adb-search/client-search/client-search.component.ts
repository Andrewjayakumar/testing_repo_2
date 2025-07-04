import { Component, OnInit, ViewChildren, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RequisitionAdvancedSearchService } from '../../req-adb-search/requisition-advanced-search.service';
import { Subscription, Subject } from 'rxjs';
import { NgbModal, NgbModalOptions, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { LocalStoreManager } from '../../../../core/authservice/local-store-manager.service';
declare var $: any;
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { filter, map, distinctUntilChanged, catchError, switchMap, concat, tap, debounceTime, takeUntil } from 'rxjs/operators';
import { ObservableInput } from 'rxjs/Observable';






@Component({
  selector: 'advanced-requisition-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.scss'],
  providers: [RequisitionAdvancedSearchService],
  // encapsulation: ViewEncapsulation.None
})
export class ClientSearchComponent implements OnInit, AfterViewInit {

  busy: Subscription;
  current_user_role: any;
  @Input('requisition') requisition: any;
  clientcode: any;
  @Output('actionClicked') actionClicked: EventEmitter<any> = new EventEmitter();
  requisitionid: any;

  constructor(private router: Router, private RequisitionAdvancedSearchService: RequisitionAdvancedSearchService, public _modalService: NgbModal,
    private localStorage: LocalStoreManager, private fb: FormBuilder) {
  let current_user = this.localStorage.getData('current_user');
    if (current_user.activerole) {
      this.current_user_role = current_user.activerole

    }
  }

ngOnInit() {


  }

  ngAfterViewInit(): void {
    
  }


  ngOnDestroy(): void {

  }


  gotoReqPage(reqId) {
    let event = { "actiontype": 'hyperlink', "id": reqId };
    this.actionClicked.emit(event);
  }

  openQuickView(reqId) {
    let event = { "actiontype": 'quickview', "id": reqId };
    this.actionClicked.emit(event);
  }

  assignReq(reqlistObj) {
    let event = { "actiontype": 'assign', "id": reqlistObj };
    this.actionClicked.emit(event);
  }

  setQualification(reqId) {

    let event = { "actiontype": 'qualification', "id": reqId };
    this.actionClicked.emit(event);
  }

  cloneRequisition(reqId) {
    let event = { "actiontype": 'clone', "id": reqId };
    this.actionClicked.emit(event);
  }
  expandResults(clientcode, value) {
    this.clientcode = '';
    if (clientcode) {
      this.clientcode = clientcode;

      if (value.target.id == this.clientcode) {
        this.clientcode = '';
      }


    }
  }

toggleClass(id) {

    this.requisitionid = id;
    $('.common_arrow').not($('#' + id)).removeClass('open');
    $('#' + id).toggleClass('open');
  }
}
