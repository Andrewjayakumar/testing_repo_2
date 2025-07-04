import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RequisitionsService } from '../../requisitions.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-cancel-airecommendation',
    templateUrl: './cancel-airecommendation.component.html',
    styleUrls: ['./cancel-airecommendation.component.scss'],
    providers: [RequisitionsService]
})
export class CancelAirecommendationComponent implements OnInit {
    reasons: any = [];
    cancellationForm: FormGroup;
    requisitionId: number;
    cancelReason: any = {};
    comments = null;


    constructor(public modal: NgbActiveModal, private recservice: RequisitionsService, private formBuilder: FormBuilder) { }


    ngOnInit() {

        this.cancellationForm = this.formBuilder.group({
           
            comments : [''],
            cancelReasonId: [null]


        });

        this.getCancellationReasons();
        
    }
    getCancellationReasons() {
        this.recservice.getChatGPTCancellationReason().subscribe(
            (res: any) => {
                let response = JSON.parse(res._body).response;
                this.reasons = response;
            })
    }
      
  
    controlBacktoParentPopup() {
        if (document.getElementsByClassName("modal") && document.getElementsByClassName("modal").length > 0) {
            document.body.className = "modal-open";
        }
    }

    sendCancellationReasons() {
        const reqbody = {};
        
        reqbody['cancelReasonId']= this.cancellationForm.value.cancelReasonId;
        reqbody['requisitionId'] =  this.requisitionId;
        reqbody['comments'] = this.cancellationForm.value.comments;
        this.modal.close(reqbody);
        this.controlBacktoParentPopup();
       
    }

    OnSubmitClicked() {

        this.sendCancellationReasons();
           
    }
}
