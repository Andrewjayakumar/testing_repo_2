import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { SubmitcandidateService } from './submitcandidate.service';
import { CandidateoutlineComponent } from './candidateoutline/candidateoutline.component';
import { ChecklistComponent } from './checklist/checklist.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-candidatesubmission',
  templateUrl: './candidatesubmission.component.html',
    styleUrls: ['./candidatesubmission.component.scss'],
    providers: [SubmitcandidateService]
})
export class CandidatesubmissionComponent implements OnInit {

    @Input() candId;
    public reqId;
    public inputdata;
    public requisitionid;
    public candidateid;
    public countryid = 'US';
    parentForm: FormGroup;

    public ErrorMessage = "";

    currentCOFilledPercentage = 0;
    public shadowValue: any;
    public officeEmpValue: boolean;

    @ViewChild('coref') coRef: any;
    @ViewChild('checklistref') checklistRef: any;

    @ViewChild('content') content: TemplateRef<any>;
    ngbModalOptions: NgbModalOptions = {
        backdrop: 'static',
        keyboard: false
    };

    showSubmitToClientPopup:boolean;
    showButtons=true;
    message:any;
    clientSubmission:boolean=true;

    sTcData={
        candidateid:null,
        requisitionid:null
    }


    public popupConfig = { "title": "", "message": "", "type": "", "isConfirm": true };

  constructor(
    public modal: NgbActiveModal,
    private service: SubmitcandidateService,
    private fb: FormBuilder,
    public _modalService: NgbModal,
    private route: ActivatedRoute,
) {
       
      this.reqId = this.route.snapshot.queryParams['requisitionid'];
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
            });
        }

      if (this.candId) {
        this.candidateid = this.candId;
      }
      if (this.reqId) {
        this.requisitionid = this.reqId;
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
        coValues.isascendiondeckpresented = coValues.isascendiondeckpresented ? 'Yes' : 'No';
        let checklistdata = this.checklistRef.datamodel;
        this.checklistRef.setSubmitClicked(true);
        let checklistForm = this.checklistRef.ChecklistForm;
        debugger;




        let isSCSTValid = checklistForm.valid && !(this.checklistRef.billrateinvalidMsg || this.checklistRef.payrateinvalidMsg);
        if(this.officeEmpValue) {
            isSCSTValid = true;
        }


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
          coForm.controls['primaryskill'].setErrors({ 'invalid': false });

          coForm.setErrors({ 'invalid': true });

        }



        let isFormValid = coForm.valid && isSCSTValid;

        if (isFormValid) {
            // then only usbmit
            this.showSubmitToClientPopup = true;
            const finalSubmission = { ...coValues, ...checklistdata };
            this.ErrorMessage = null;
            this.service.SubmitCandidate(finalSubmission).subscribe(
            (res: any) => {
                let response = JSON.parse(res._body).response;

    if (!response) {
      let message = JSON.parse(res._body).message ? JSON.parse(res._body).message : "Error Unknown";
      this.ErrorMessage = "Error Occurred: Failed to Submit Candidate - " + message;
    } else {
      // Open Submit To Client popup and perform actions based on user selection
      // this.openSubmitToClientPopup().then((userSelection) => {
        
      //   if (userSelection === "yes") {
            //console.log("Success")
            // Yes actions
      //       this.submitToClient().then(() => {

      //       this.popupConfig.title = "Success!";
      //       this.popupConfig.message = "Candidate Submission Successful";
      //       this.popupConfig.type = "success";
      //       this.popupConfig.isConfirm = false;
      //       this.modal.close("success");
      //       this.openConfimrationDialog();
      //     });
      //   } else if  (userSelection === "no") {
      //       //console.log("No Test")
      //     // No actions
         
      //     this.closePopup();
      //     this.popupConfig.title = "Success!";
      //     this.popupConfig.message = "Candidate Submission Successful";
      //     this.popupConfig.type = "success";
      //     this.popupConfig.isConfirm = false;
      //     this.modal.close("success");
      //     this.openConfimrationDialog();
      //   }
      // });

      //this.closePopup();
      this.popupConfig.title = "Success!";
      this.popupConfig.message = "Candidate Submission Successful";
      this.popupConfig.type = "success";
      this.popupConfig.isConfirm = false;
      this.modal.close("success");
     // this.openConfimrationDialog();
    }
  }
);
        }
        else {

            
            if (!coForm.valid) {
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
                            case "primaryskill": this.ErrorMessage = this.ErrorMessage + "<li>Minimum 3 Primary Skills is required</li>";
                                break;
                            case "standardJobTitleId": this.ErrorMessage = this.ErrorMessage + "<li>Standard Job Title</li>";
                                break;
                            default: this.ErrorMessage = this.ErrorMessage + "<li>" + name + "</li>";
                                break;
                        }
                      
                    }
                }
                debugger;
                this.ErrorMessage = this.ErrorMessage + "</ul>"
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



    closePopup(){
        this.showSubmitToClientPopup = false;
      
    }


      openSubmitToClientPopup(): Promise<string> {
        return new Promise((resolve) => {
   
          this.showSubmitToClientPopup = true;
      
        
          const yesButton = document.getElementById("submitToClientYesButton");
          const noButton = document.getElementById("submitToClientNoButton");
          const closeButton = document.getElementById("submitToClientCloseButton");
        
          const handleKeyDown = (event) => {
            if (event.key === "Escape") {
              resolve("no");
            }
          };
      
          yesButton.addEventListener("click", () => {
            resolve("yes");
          });
      
          noButton.addEventListener("click", () => {
            resolve("no");
          });
          closeButton.addEventListener("click", () => {
            resolve("no");
          });

          document.addEventListener("keydown", handleKeyDown);

        });
      }

      submitToClient(): Promise<void> {
        return new Promise((resolve, reject) => {
          this.sTcData.candidateid = this.candidateid;
          this.sTcData.requisitionid = this.requisitionid;
          console.log(this.sTcData);
          this.service.postSubmitToClient(this.sTcData).subscribe(
            (data: any) => {
              this.showButtons = false;
              this.message = "Candidate has been Submitted to Client!";
      
              setTimeout(() => {
                this.closePopup();
                resolve();
              }, 2000);
            },
            (error: any) => {
              this.showButtons = false;
              this.message = "Something went wrong, Please try later!";
              this.closePopup();
              reject(error);
            }
          );
        });
      }
      
}
