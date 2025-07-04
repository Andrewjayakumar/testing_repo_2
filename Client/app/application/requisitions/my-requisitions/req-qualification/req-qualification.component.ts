import { Component, OnInit, ViewChildren, ElementRef, ViewChild, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MyRequisitionsService } from '../../my-requisitions/my-requisitions.service';
import { Subscription, Subject } from 'rxjs';
//import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import { NgbActiveModal, NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';



@Component({
  selector: 'req-qualification',
  templateUrl: './req-qualification.component.html',
  styleUrls: ['./req-qualification.component.scss'],
  providers: [MyRequisitionsService]

})
export class ReqQualificationComponent implements OnInit {

  @Input() public id;
  noRecordMsg: string = null;
  busy: Subscription;
  searching = false;
  searchFailed = false;
  Message: any;
  clickedItem: any;
  qualificationDetails: any;
  requisitionname: any;
  updatequalificationStatus: any;
  qualificationid: any;


  constructor(private router: Router, private recservice: MyRequisitionsService, public modal: NgbActiveModal) { }

  ngOnInit() {
    let id = this.id;
    this.getQualificationById();
    this.getQualificationDetails();
  }

 

 
  ngAfterViewInit(): void {

  }



  // submit the Assignment

  getQualificationById() {
  
    this.busy = this.recservice.getQualificationById(this.id)
      .subscribe(
        (res: any) => {
          this.Message = JSON.parse(res._body)['response'];
          if (this.Message && this.Message[0]) {
            this.requisitionname = this.Message[0].requisitionname;
            this.qualificationid = this.Message[0].qualificationid;


          }
         // console.log("done", this.Message);

        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

  // get Qualification Details for DropDown

  getQualificationDetails() {

    this.busy = this.recservice.getQualificationDetails()
      .subscribe(
        (res: any) => {
          this.qualificationDetails = JSON.parse(res._body)['response'];
         // console.log("done", this.qualificationDetails);

        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

  // for selecting Submitted Value
  selectedItem(item) {
    this.clickedItem = '';
    if (item) {
      this.clickedItem = item.id;

    }
  }


  // Update The Qualification POST Method

  updateQualification() {

    let apiparam = {
      "requisitionid": this.id,
      "qualificationid": this.clickedItem
    }
    this.busy = this.recservice.updateQualification(apiparam)
      .subscribe(
        (res: any) => {
          this.updatequalificationStatus = JSON.parse(res._body)['response'];
          this.modal.close(true);
        

        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

}
