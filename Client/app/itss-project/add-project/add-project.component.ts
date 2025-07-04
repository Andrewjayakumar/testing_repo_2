import { Component, OnInit, Output, EventEmitter, SimpleChanges, Input, ViewChild, AfterViewInit, ChangeDetectorRef, TemplateRef } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
//import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import { Observable } from 'rxjs';
import { ItssService } from '../itss-list/itss.service';
import { WizardComponent } from 'angular-archwizard';
import { AddProjSharedService } from '../add-project/addProj.shared.service';
import { AddprojFormData } from '../add-project/model/AddprojFormData';
import { NgbModal, NgbModalOptions, NgbTooltip, NgbActiveModal, ModalDismissReasons, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { AddprojectService } from './add-project.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { LocalStoreManager } from '../../core/authservice/local-store-manager.service';





@Component({
  selector: 'add-project',
  templateUrl: './add-project.component.html',
  styleUrls: ['./add-project.component.scss'],
  providers: [ItssService, AddProjSharedService, AddprojectService],


})
export class AddprojectComponent implements OnInit, AfterViewInit {

  busy: Subscription;
  isNextClicked = false;
  isBackBtnClicked = false;

  @ViewChild(WizardComponent)
  public wizard: WizardComponent;
  itssprojectDetails: any;
  totalrecords: any;
  search: any;
  itssprojSearchDetails: any;
  errorMessage: any;
  receiveddate: any;
  dateholder: any;
  // startdate: any;
  enddate: any;
  private formData: AddprojFormData = new AddprojFormData();
  isProjDetailFormValid = false;
  isClientDetailFormValid = false;
  // currentUserRole: number = 8;

  modalcloseResult: string;
  isCreateReqClicked: boolean;
  isPageLoading = false;
  public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true };
  modalRef: any;
  dateForm: FormGroup;
  projectid: any;
  projectDetailRightFormValid = false;
  isDetailPageValid: boolean = false;
  public currentDate: NgbDateStruct = <NgbDateStruct>{};
  public receiveDate: NgbDateStruct = <NgbDateStruct>{};
  public startdDate: NgbDateStruct = <NgbDateStruct>{};
  public enddDate: NgbDateStruct = <NgbDateStruct>{};
  strtdate: any;
  isResetClicked :boolean = false;
  sowfileformData = new FormData();
  sowfile:any;
  activeRole:any;
  deliverymodel:any;

  @ViewChild('projRightForm') form: any;
  @ViewChild('content') content: TemplateRef<any>;
  @Input('currentmode')
  mode: string = 'add';
  ngbModalOptions: NgbModalOptions = { backdrop: 'static', keyboard: false };
  

  public datamodel = {


    "receiveddate": null,
    "startdate": null,
    "enddate": null,
    "projectdurationweeks": null,
    "projectdurationmonths": 0

  };
  durationofProject: number ;


  constructor(private router: Router,  private changeDetect: ChangeDetectorRef, private currentRoute: ActivatedRoute, private ItssService: ItssService, private AddProjSharedService: AddProjSharedService, public _modalService: NgbModal, private AddprojectService: AddprojectService, private fb: FormBuilder, private localStore: LocalStoreManager) { }

  ngOnInit() {
    let current_user_data = this.localStore.getData('current_user');
    this.activeRole = current_user_data.activerole;
 
    this.currentDateValidation();



    this.currentRoute.queryParams.subscribe(params => {


      this.projectid = parseInt(params['projectid']);
    });

    if (this.projectid) {
      this.isPageLoading = true;
      this.busy =
        this.AddprojectService.getProjectDetailsById(this.projectid).subscribe(
          (res: any) => {
            debugger;

            this.mode = 'update';
            let details = JSON.parse(res._body).response;
            debugger;
            this.setDateModelinUpdate(details);

            if (details) {
              this.AddProjSharedService.setFormData(details);

            }
           
          },
          () => {
            this.isPageLoading = false;
          }
        );
    }
  }

  public resetModel()  {

    this.datamodel.receiveddate = null;
    this.datamodel.startdate = null;
    this.datamodel.enddate = null;
    this.datamodel.projectdurationweeks = null;
    this.datamodel.projectdurationmonths = null;

  }

  currentDateValidation(){
    if(this.mode = 'add'){

      let today = new Date();
      this.currentDate.year = today.getFullYear();
      this.currentDate.month = today.getMonth() + 1;
      this.currentDate.day = today.getDate();
    }else{

      return null;
    }
   
  }

  ngAfterViewInit(): void {


  }

  onFormValid(event, src) {

    debugger;
    let source = event.origin ? event.origin : src;
    switch (source) {
      case 'projdetails': 
        if (event.isValid) {
          this.setFormDataValues(event.datamodel);
          this.isProjDetailFormValid = true;
     
        }

        break;

      case 'clientdetails':
        if (event.isValid) {
          this.setFormDataValues(event.datamodel);
          this.sowfile = event.sowfile;
          this.isClientDetailFormValid = true;

        }

      default: break;
    }

    if(this.form.valid){
      this.projectDetailRightFormValid = true;
    }

    if(this.isProjDetailFormValid && this.form.valid){
      this.isBackBtnClicked = false;
      this.wizard.navigation.goToNextStep();
      this.changeDetect.detectChanges();

    }

    if (this.isProjDetailFormValid && this.isClientDetailFormValid) {
      this.formData['projectdurationmonths'] = this.datamodel.projectdurationmonths;
      this.formData['projectdurationweeks'] = this.durationofProject;
      this.isDetailPageValid = true;
      this.wizard.navigation.goToNextStep();
      this.isBackBtnClicked = false;

      if (this.datamodel.receiveddate) {
        this.formData['receiveddate'] = this.datamodel.receiveddate;

      }

      if (this.datamodel.startdate) {
        this.formData['startdate'] = this.datamodel.startdate;

      }

      if (this.datamodel.enddate) {
        this.formData['enddate'] = this.datamodel.enddate

      }

      let postObj = Object.assign(this.formData);

      switch (this.mode) {
        default:
          this.postrequestForCreateProj(postObj);
          break;
        case 'update':
          this.postrequestForUpdateProj(postObj);
      }
    }


  }



  postrequestForCreateProj(dataobj: any) {

    this.isPageLoading = true;
    this.busy = this.AddprojectService.postCreateProject(dataobj).subscribe(
      (res: any) => {
       
        let resParsed = JSON.parse(res._body);
        let response = resParsed.response;
        this.isPageLoading = false;
        debugger;
        if (response) {
          this.isProjDetailFormValid = false;
          this.isClientDetailFormValid = false;
          this.projectDetailRightFormValid = false;
          this.popupConfig.title = "Awesome !";
          this.popupConfig.message = "Successfully Created Project";
          this.popupConfig.type = "success";
          this.popupConfig.isConfirm = false;
          this.openPopup();
          if (response.projectid && dataobj.sowfilename) {
            this.projectid = response.projectid;
            this.uploadFile();

          }
          this.router.navigateByUrl('projects/search');
          
         

        }
        else if(!response){
          this.isPageLoading = false;
          this.popupConfig.title = "Oops !";
          this.popupConfig.message = "Error Occurred: Failed to Create Project - " + resParsed.message;
          this.popupConfig.type = "error";
          this.popupConfig.isConfirm = true;

          this.openPopup();

        }

      },
      err => {
        this.isPageLoading = false;

        this.isProjDetailFormValid = false;
        this.isClientDetailFormValid = false;
        this.projectDetailRightFormValid = false;
      }
    );

  }

  postrequestForUpdateProj(dataobj: any) {
    this.isPageLoading = true;
    this.busy = this.AddprojectService.postUpdateProject(dataobj).subscribe(
      (res: any) => {
        let resParsed = JSON.parse(res._body);
        let response = resParsed.response;
        this.isPageLoading = false;
        debugger;
        if (response) {
          this.isProjDetailFormValid = false;
          this.isClientDetailFormValid = false;
          this.projectDetailRightFormValid = false;
          this.popupConfig.title = "Awesome !";
          this.popupConfig.message = "Successfully Updated Project";
          this.popupConfig.type = "success";
          this.popupConfig.isConfirm = false;
          this.openPopup();
          if (this.projectid && dataobj.sowfilename) {
            this.uploadFile();
        
          }
          this.router.navigateByUrl('projects/search');

         
        

        }

        else if (!response) {
          this.isPageLoading = false;
          this.popupConfig.title = "Oops !";
          this.popupConfig.message = "Error Occurred: Failed to Update Project - " + resParsed.message;
          this.popupConfig.type = "error";
          this.popupConfig.isConfirm = true;

          this.openPopup();

        }

      },
      err => {
        this.isPageLoading = false;

        this.isProjDetailFormValid = false;
        this.isClientDetailFormValid = false;
        this.projectDetailRightFormValid = false;
      }
    );

  }

  uploadFile(){
  
    this.sowfileformData.append('file', this.sowfile);
    this.sowfileformData.append("projectid", this.projectid);
    this.busy = this.AddprojectService.postPdfFile(this.sowfileformData)
    .subscribe(
      (res: any) => {


      },
      err => {
        console.log(err);
      },
      () => {
      }
    );
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
  onNextClicked() {
    debugger;
    this.isNextClicked = true;
    this.AddProjSharedService.createButtonClicked = false;
    this.AddProjSharedService.nextClicked.next();
  }

  backClick() {
    this.isProjDetailFormValid = false;
    this.projectDetailRightFormValid = false;
    this.isClientDetailFormValid = false;
    this.isNextClicked = false;
    this.isDetailPageValid = false;
    this.isBackBtnClicked = true;


  }
  setFormDataValues(datamodel: any) {

    let keys = Object.keys(datamodel);
    debugger;

    keys.forEach(item => {


      this.formData[item] = datamodel[item];
    });

  }
  receivedDate(value) {
 

    if (value) {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      // this.submitteddrom = new Date(`${value.year}-${value.month}-${value.day}`).toISOString();
      this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
      this.datamodel.receiveddate = (new Date(this.dateholder - tzoffset)).toISOString();
     

    }
  }


  startDate(value) {


    if (value) {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      // this.submitteddrom = new Date(`${value.year}-${value.month}-${value.day}`).toISOString();
      this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
      this.datamodel.startdate = (new Date(this.dateholder - tzoffset)).toISOString();
      
      this.calculateProjectDuration();
    }
  }

  endDate(value) {
  

    if (value) {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      // this.submitteddrom = new Date(`${value.year}-${value.month}-${value.day}`).toISOString();
      this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
      this.datamodel.enddate = (new Date(this.dateholder - tzoffset)).toISOString();
      
      this.calculateProjectDuration();
    }
  }

  calculateProjectDuration() {

    
    if (this.datamodel.enddate && this.datamodel.startdate) {
      let timediff = new Date(this.datamodel.enddate).getTime() - new Date(this.datamodel.startdate).getTime();

      if (timediff < 0) {
        this.datamodel.enddate = null;
       
        return;
      }

      let differenceinDays = parseInt('' + (timediff / (1000 * 3600 * 24)));

      this.durationofProject = parseInt('' + differenceinDays / 7);
      let durationDiffDays = differenceinDays % 7;

      this.datamodel.projectdurationweeks = this.durationofProject + " Weeks " + (durationDiffDays ? durationDiffDays + " Days" : '');
      this.datamodel.projectdurationmonths = Math.floor(differenceinDays / 30);
    
    }


  }




  setDateModelinUpdate(updateModel: any) {

    if (updateModel.receiveddate) {
      let dd = new Date(updateModel.receiveddate);
      this.formData['receiveddate'] = updateModel.receiveddate;
      this.datamodel.receiveddate= updateModel.receiveddate;

      this.receiveDate = { "year": dd.getFullYear(), "month": dd.getMonth() + 1, "day": dd.getDate() };
      
      this.currentDate = this.receiveDate;

    }


    if (updateModel.startdate) {
      let aa = new Date(updateModel.startdate);
      this.formData['startdate'] = updateModel.startdate;
      this.datamodel.startdate= updateModel.startdate;

      this.startdDate = { "year": aa.getFullYear(), "month": aa.getMonth() + 1, "day": aa.getDate() };
     
     
    }
    if (updateModel.enddate) {
      let bb = new Date(updateModel.enddate);
      this.formData['enddate'] = updateModel.enddate;
      this.datamodel.enddate= updateModel.enddate;

      this.enddDate = { "year": bb.getFullYear(), "month": bb.getMonth() + 1, "day": bb.getDate() };
      
      
    }
    
    if (updateModel.projectdurationmonths) {
    
      this.datamodel.projectdurationmonths= updateModel.projectdurationmonths;
    
    }
    if (updateModel.projectdurationweeks) {
      this.durationofProject = updateModel.projectdurationweeks;
      
      this.datamodel.projectdurationweeks= updateModel.projectdurationweeks;
      

    }


  }

  onReset(){
    this.isResetClicked= true;
    this.form.reset();
    this.resetModel();
  }

  onDeliveryModelUpdated(value:any) {

  this.deliverymodel = value;
  }



}
