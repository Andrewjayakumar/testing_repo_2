import { Component, OnInit, ViewChildren, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, Input} from '@angular/core';
import { Router } from '@angular/router';
import { MyRequisitionsService } from '../../my-requisitions/my-requisitions.service';
import { Subscription, Subject } from 'rxjs';
//import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;

@Component({
  selector: 'metal-requisition-list',
  templateUrl: './requisition-list.component.html',
  styleUrls: ['./requisition-list.component.scss'],
  providers: [MyRequisitionsService]

})
export class RequisitionListComponent implements OnInit {

 @Input('requisition') requisition: any;
 @Input('userrole') current_user_role: number = 8;


  @Output('actionClicked') actionClicked: EventEmitter<any> = new EventEmitter();
  requisitionid: any;



  constructor(private router: Router, private recservice: MyRequisitionsService) { }

  ngOnInit() {
   // console.log("Current Roure", this.router.url); 

  }
  ngAfterViewInit(): void {

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
  expandResults(id, value) {
    this.requisitionid = '';
    if (id) {
      let sum = id; 
      this.requisitionid = sum;

     

    }
  }


  toggleClass(id) {
    
    this.requisitionid = id;
    $('.common_arrow').not($('#' + id)).removeClass('open');
    $('#' + id).toggleClass('open');
  }
}
