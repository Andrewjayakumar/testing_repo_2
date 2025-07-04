import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { InterviewService } from "../interview.service";
import { ActivatedRoute } from "@angular/router";


@Component({
    selector: "app-submit-to-client",
    templateUrl: "./submit-to-client.component.html",
    styleUrls: ["./submit-to-client.component.scss"],
    providers: [InterviewService],
})





export class SubmitToClientComponent implements OnInit {

 

    @Input() showSubmitToClientPopup: any;
    @Input() showSTCwarning :any;


    @Output() closeSubmitToClientPopup: EventEmitter<void> = new EventEmitter<void>();
    @Output() closeSTCwarningPopup: EventEmitter<void> = new EventEmitter<void>();
    @Output() submitToClientSuccess: EventEmitter<void> = new EventEmitter<void>();
    showButtons = true;
    message:any;
    
    sTcData={
        candidateid:null,
        requisitionid:null,
    }

    constructor(private interviewService: InterviewService,
                private actvatedRoute:ActivatedRoute) { }

    ngOnInit(): void {
        this.getCandAndReqId();
    
    }

    getCandAndReqId() {
        
        this.actvatedRoute.queryParams.subscribe(params => {
          this.sTcData.candidateid = parseInt(params['candidateid']);
          this.sTcData.requisitionid = parseInt(params['id']);
        });
    
      }





    submitToClient(){
        console.log("test")
        
        
        this.interviewService.postSubmitToClient(this.sTcData)
        .subscribe(
          (data: any) => {
            this.showButtons = false;
            this.message = "Candidate has been Submitted to Client!";
            
            setTimeout(() => {
              
              this.closeSubmitToClientPopup.emit();
              this.submitToClientSuccess.emit();
            }, 2000);
          },
          (error: any) => {
            this.showButtons = false;
           this.message = "Something went wrong, Please try later!"
            
          }
        );
      
    }

    closePopup() {
        this.closeSubmitToClientPopup.emit();
      }
      
      errorPopup() {
        this.closeSTCwarningPopup.emit();
      }

}
