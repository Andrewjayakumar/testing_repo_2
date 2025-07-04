
import { Component, Input, OnInit } from "@angular/core";

import { RequisitionsService } from "../requisitions.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { NgbModal, NgbDateStruct, NgbModalOptions, ModalDismissReasons, } from '@ng-bootstrap/ng-bootstrap';
import { NgForm, NgModelGroup } from "@angular/forms";
import { AddrecService } from '../add-requisition/addrec.service';

@Component({
  selector: 'app-update-duration',
  templateUrl: './update-duration.component.html',
  styleUrls: ['./update-duration.component.scss'],
  providers: [RequisitionsService, AddrecService],
})

export class UpdateDurationComponent implements OnInit {

  public StartDate: NgbDateStruct = <NgbDateStruct>{};
  public EndDate: NgbDateStruct = <NgbDateStruct>{};
  public revisedStartDate: NgbDateStruct = <NgbDateStruct>{};

  public requisitionid;
  displayMessage: string = "";
  errorMessage: string = "";
  showSetButton: boolean = true;
  isUploading: boolean = false;
  durationHistory: any;
  durationReasons: any;


  constructor(
    public activeModal: NgbActiveModal,
    private requisitionsService: RequisitionsService,
    private AddrecService: AddrecService
  ) {
   
  }

  public datamodel = {

    "RequisitionId": null,
    "startDate": null,
    "endDate": null,
    "Reason": '',
    "RevisedStartDate":null


  };
  ngOnInit() {
    this.getrequisitionDetails(this.requisitionid);
    this.getdurationHistory();
    this.getreasonsForDuration();

  }
  getrequisitionDetails(requisitionid) {
    this.AddrecService.getRequisitionDetailsById(requisitionid).subscribe((res) => {
      debugger;
      let body = JSON.parse(res._body);
      if (body.response || body.responsecode == 200) {
        this.setDateModelinUpdate(body.response[0])
       
      } else {
     
      }

    });
  }

  StartDateChanged() {

    console.log("Clicked");
    if (!this.StartDate)
       return;

    var tzoffset = (new Date()).getTimezoneOffset() * 60000;

    var date: any = new Date(`${this.StartDate.year}-${this.StartDate.month}-${this.StartDate.day}`);

    // latest changes for start date for previous date on selection
    let MM = ('0' + this.StartDate.month).slice(-2);
    let DD = ('0' + this.StartDate.day).slice(-2);
    this.datamodel.startDate = `${MM}/${DD}/${this.StartDate.year}`;
    this.datamodel.startDate = `${this.StartDate.year}-${MM}-${DD}`;


  }

  EndDateChanged() {
    if (!this.EndDate) {
     return;
    }

    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let MM = ('0' + this.EndDate.month).slice(-2);
    let DD = ('0' + this.EndDate.day).slice(-2);

    this.datamodel.endDate = `${MM}/${DD}/${this.EndDate.year}`;
    this.datamodel.endDate = `${this.EndDate.year}-${MM}-${DD}`;
  }

  revisedStartDateChanged() {
    if (!this.revisedStartDate) {
      return;
    }

    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    let MM = ('0' + this.revisedStartDate.month).slice(-2);
    let DD = ('0' + this.revisedStartDate.day).slice(-2);

    this.datamodel.RevisedStartDate = `${MM}/${DD}/${this.revisedStartDate.year}`;
    this.datamodel.RevisedStartDate = `${this.revisedStartDate.year}-${MM}-${DD}`;
    console.log("DAte", this.datamodel.RevisedStartDate);
  }

  onSubmit(form: NgForm) {
   
    if (this.datamodel.startDate && this.datamodel.endDate) {
      var apiParam = {
        requisitionid: this.requisitionid,
        startdate: this.datamodel.RevisedStartDate,
        enddate: this.datamodel.endDate,
        reason: this.datamodel.Reason


      }
    }
    else {
      let MM = ('0' + this.EndDate.month).slice(-2);
      let DD = ('0' + this.EndDate.day).slice(-2);

      this.datamodel.endDate = `${MM}/${DD}/${this.EndDate.year}`;
      this.datamodel.endDate = `${this.EndDate.year}-${MM}-${DD}`;
      let mm = ('0' + this.StartDate.month).slice(-2);
      let dd = ('0' + this.StartDate.day).slice(-2);
      this.datamodel.startDate = `${mm}/${dd}/${this.StartDate.year}`;
      this.datamodel.startDate = `${this.StartDate.year}-${mm}-${dd}`;
      let mmm = ('0' + this.revisedStartDate.month).slice(-2);
      let ddd = ('0' + this.revisedStartDate.day).slice(-2);
      this.datamodel.RevisedStartDate = `${mmm}/${dd}/${this.revisedStartDate.year}`;
      this.datamodel.RevisedStartDate = `${this.revisedStartDate.year}-${mmm}-${ddd}`;
      var apiParam = {
        requisitionid: this.requisitionid,
        startdate: this.datamodel.RevisedStartDate,
        enddate: this.datamodel.endDate,
        reason: this.datamodel.Reason


      }

    }

    this.isUploading = true;

    this.requisitionsService.updateDuration(apiParam).subscribe((res) => {
      debugger;
      let body = JSON.parse(res._body);
      if (body.response || body.responsecode == 200) {
        this.isUploading = false;
        this.displayMessage = "duration updated successfully";
        console.log("Update duration");
        this.getdurationHistory();
        setTimeout(() => {
          this.displayMessage = "";
          this.activeModal.close("success");
        }, 2000);
      } else {
        this.errorMessage = body.message ? body.message : "";
        this.isUploading = false;
        setTimeout(() => {
          this.errorMessage = "";
        }, 2000);
      }
   
    });
  }

  setDateModelinUpdate(updateModel) {

  

    if (updateModel.projectenddate) {
      let dd = new Date(updateModel.projectenddate);

      this.EndDate = { "year": dd.getFullYear(), "month": dd.getMonth() + 1, "day": dd.getDate() };


    }

    if (updateModel.startdate) {
      let dd = new Date(updateModel.startdate);

      this.revisedStartDate = { "year": dd.getFullYear(), "month": dd.getMonth() + 1, "day": dd.getDate() };


    }

  }

  getdurationHistory() {
    this.requisitionsService.getdurationHistory(this.requisitionid).subscribe((res) => {
      debugger;
      let body = JSON.parse(res._body);
      if (body.response || body.responsecode == 200) {
        this.durationHistory = body.response;
        const lowestIdObject = this.durationHistory.reduce((acc, cur) => {
          return cur.id < acc.id ? cur : acc;
        });

        if (lowestIdObject) {
         // this.setDateModelinUpdate(lowestIdObject);
          if (lowestIdObject.startdate) {
            let dd = new Date(lowestIdObject.startdate);

            this.StartDate = { "year": dd.getFullYear(), "month": dd.getMonth() + 1, "day": dd.getDate() };


          }
        }

      } else {

      }

    });
  }


  getreasonsForDuration() {
    this.requisitionsService.getDurationReasons().subscribe(
      (res) => {
        let body = JSON.parse(res._body);
        if (body.response || body.responsecode == 200) {
          this.durationReasons = body.response;
        } else {

        }
      }

    );
  }


}
