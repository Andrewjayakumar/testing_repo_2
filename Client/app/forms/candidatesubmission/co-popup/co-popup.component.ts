import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SubmitcandidateService } from '../submitcandidate.service';


@Component({
  selector: 'app-co-popup',
  templateUrl: './co-popup.component.html',
  styleUrls: ['./co-popup.component.scss'],
  providers: [SubmitcandidateService]
})
export class CoPopupComponent implements OnInit {

    @Input() public isCoPopup: any;
   
    public inputdata;
    public requisitionid;
    public candidateid;
    public kanbanStatus = "InProcess";
    public countryid = 'US';
    parentForm: FormGroup;

    public ErrorMessage = "";

    currentCOFilledPercentage = 0;
    public shadowValue: any;
    public officeEmpValue: boolean;
    isSendout: boolean = false;

    @ViewChild('coref') coRef: any;

    @ViewChild('content') content: TemplateRef<any>;
    ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false,
        size: 'sm', 
        windowClass: 'coPopup'
    };

    public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true };
   

    constructor(public modal: NgbActiveModal, private service: SubmitcandidateService, private fb: FormBuilder, public _modalService: NgbModal) {
       

        this.parentForm = this.fb.group({});
    }

    ngOnInit() {
        if (Array.isArray(this.inputdata)) {
            this.inputdata.forEach(x => {
                if (x.key == 'candidateid') {
                   
                    this.candidateid = x.value;
                }
                else if (x.key == 'id' || 'requisitionid') {
                   
                    this.requisitionid = x.value;
                }

                if (x.key == 'issendout') {
                    this.isSendout = x.value;

                    if (this.isSendout)
                        this.kanbanStatus = 'Screening';
                    else
                        this.kanbanStatus = 'InProcess';
                } 
            });
        }
    }

    shadowValueChange(event) {
        debugger;
        // this.shadowValue = event;
            this.shadowValue = event.target ? event.target.checked : null;

    }

    officeEmpValChange(event) {
        debugger;
            this.officeEmpValue = event;
    }

    updatePercentage(event) {
        this.currentCOFilledPercentage = event;
    }


    UpdateCountry(event) {
        this.countryid = event;
    }

    OnSubmitClicked(event) {
        let coForm = this.coRef.getCOFilledValues();
        let coValues = {...coForm.value, ...this.coRef.datamodel};

        let coRefData = this.coRef.datamodel;

        // let isSCSTValid = checklistForm.valid && checklistdata.resumeurl !="" && !(this.checklistRef.billrateinvalidMsg || this.checklistRef.payrateinvalidMsg);
        // if(this.officeEmpValue) {
        //     isSCSTValid = true;
        // }


    
            if (coForm.controls['primaryskill'].value)
                {
                    if(coForm.controls['primaryskill'].value.length < 3) {
                        coForm.controls['primaryskill'].setErrors({ 'invalid': true });
                        coForm.setErrors({ 'invalid': true });
                      }
                      else
                      {
                        coForm.controls['primaryskill'].setErrors(null);

                      }
                }
              else
              {
                coForm.controls['primaryskill'].setErrors({ 'invalid': true });

                coForm.setErrors({ 'invalid': true });
    
              }
    
    
        
        let isFormValid = coForm.valid;
        if (isFormValid) {
            // then only submit
            const finalSubmission = { ...coValues };
            this.ErrorMessage = null;
            this.service.SubmitCOandJournals(finalSubmission).subscribe(
                (res: any) => {
                    let response = JSON.parse(res._body).response;

                    if (!response) {
                        let message = JSON.parse(res._body).message ? JSON.parse(res._body).message : "Error Unknown"
                      
                        this.ErrorMessage = "Error Occurred: Failed to Submit Candidate - " + message;
                     
                    }
                    else {

                        //TODO if sendout is true launch approval popup and cimply close submission popup.
                        this.popupConfig.title = "Success!";
                        this.popupConfig.message = "Journal / Candidate outline saved successfully.";
                        this.popupConfig.type = "success";
                        this.popupConfig.isConfirm = false;
                        this.modal.close("success");
                        this.openConfimrationDialog();
                        
                    }

                }
            );
        }
        else {
            if (!coForm.valid) {
                if((!coRefData.fillCandidateOutline) || (coRefData.fillCandidateOutline == false)) {
                    const finalSubmission = { ...coValues };
                    this.ErrorMessage = null;
                    this.service.SubmitCOandJournals(finalSubmission).subscribe(
                        (res: any) => {
                            let response = JSON.parse(res._body).response;
        
                            if (!response) {
                                let message = JSON.parse(res._body).message ? JSON.parse(res._body).message : "Error Unknown"
                              
                                this.ErrorMessage = "Error Occurred: Failed to Submit Candidate - " + message;
                             
                            }
                            else {
        
                                //TODO if sendout is true launch approval popup and cimply close submission popup.
                                this.popupConfig.title = "Success!";
                                this.popupConfig.message = "Journal / Candidate outline saved successfully.";
                                this.popupConfig.type = "success";
                                this.popupConfig.isConfirm = false;
                                this.modal.close("success");
                                this.openConfimrationDialog();
                                
                            }
        
                        }
                    );

                } else {
                    this.ErrorMessage = "Invalid fields on CO are: <ul>";
                    //  const invalid = [];
                      const controls = coForm.controls;
                      for (const name in controls) {
                          if (controls[name].invalid) {
                              switch (name) {
                                  case "firstname": this.ErrorMessage = this.ErrorMessage +"<li>First Name</li>";
                                      break;
                                  case "lastname": this.ErrorMessage = this.ErrorMessage + "<li>Last Name</li>";
                                      break;
                                  case "emailid": this.ErrorMessage = this.ErrorMessage + "<li>Email</li>";
                                      break;
                                  case "zipcode": this.ErrorMessage = this.ErrorMessage + "<li>Zip</li>";
                                      break;
                                  case "currency": this.ErrorMessage = this.ErrorMessage + "<li>Currency</li>";
                                      break;
                                  case "availabilitydate": this.ErrorMessage = this.ErrorMessage + "<li>Availability Date</li>";
                                      break;
                                  case "jobtitle": this.ErrorMessage = this.ErrorMessage + "<li>Job Title</li>";
                                      break;
                                  case "relocatereason": this.ErrorMessage = this.ErrorMessage + "<li>Reason for Change</li>";
                                      break;
                                  case "currentemployername": this.ErrorMessage = this.ErrorMessage + "<li>Most Recent End Client and Employer</li>";
                                      break;
                                  case "projectresponsibilities": this.ErrorMessage = this.ErrorMessage + "<li>Project Detials and their own responsibility</li>";
                                      break;
                                  case "journaltypeid": this.ErrorMessage = this.ErrorMessage + "<li>Contact Type</li>";
                                      break;
                                case "regionid": this.ErrorMessage = this.ErrorMessage + "<li>Regional Area</li>";
                                      break;
                                case "desiredjobtitle": this.ErrorMessage = this.ErrorMessage + "<li>Desired Job Title</li>";
                                      break;
                                case "towerid": this.ErrorMessage = this.ErrorMessage + "<li>Tower</li>";
                                      break;
                                case "subtowerid": this.ErrorMessage = this.ErrorMessage + "<li>Sub tower</li>";
                                      break;
                                case "areaofexpertise": this.ErrorMessage = this.ErrorMessage + "<li>Area Of Expertise</li>";
                                      break;
                                case "proactivemembers": this.ErrorMessage = this.ErrorMessage + "<li>Tag Member</li>";
                                      break;
                                case "sector": this.ErrorMessage = this.ErrorMessage + "<li>Sector</li>";
                                      break;
                                case "cojobtitle": this.ErrorMessage = this.ErrorMessage + "<li>Job Title</li>";
                                      break;
                                case "copayrate": this.ErrorMessage = this.ErrorMessage + "<li>Pay Rate</li>";
                                      break;     
                                case "cocity": this.ErrorMessage = this.ErrorMessage + "<li>City</li>";
                                      break;
                                case "costate": this.ErrorMessage = this.ErrorMessage + "<li>State</li>";
                                      break;
                                case "copreferredlocation": this.ErrorMessage = this.ErrorMessage + "<li>Preferrable Location</li>";
                                      break;
                                case "coyearsexperience": this.ErrorMessage = this.ErrorMessage + "<li>Number Of Years of Experience</li>";
                                      break;
                                case "coverticalsid": this.ErrorMessage = this.ErrorMessage + "<li>Verticals</li>";
                                      break;
                                case "copracticesid": this.ErrorMessage = this.ErrorMessage + "<li>Practices</li>";
                                      break;
                                case "coemployeetype": this.ErrorMessage = this.ErrorMessage + "<li>Employee Type</li>";
                                      break;
                                case "isascendiondeckpresented": this.ErrorMessage = this.ErrorMessage + "<li>Ascendion Deck Presented</li>";
                                      break;
                                  case "primaryskill": this.ErrorMessage = this.ErrorMessage + "<li>Minimum 3 Primary Skills is required</li>";
                                      break;
                                  case "standardjobtitleid": this.ErrorMessage = this.ErrorMessage + "<li>Standard Job Title</li>";
                                      break;
                                  default: this.ErrorMessage = this.ErrorMessage + "<li>" + name + "</li>";
                                      break;
                              }
                            
                          }
                      }
                      debugger;
                      this.ErrorMessage = this.ErrorMessage + "</ul>"
                }

            }
            else
                this.ErrorMessage = "There are invalid fields on this form. Please resolve them to proceed with Submission <br>";
  
        }
       
    }

    openConfimrationDialog(closePopup?: boolean) {

        let modalRef = this._modalService.open(this.content, this.ngbModalOptions);

        setTimeout(() => {

            modalRef.close();
           
        }, 3000);
    }
}
