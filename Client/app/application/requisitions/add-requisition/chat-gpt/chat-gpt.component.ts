import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { AddrecService } from './../addrec.service';
import { AddRecSharedService } from '../addrec.shared.service';
import { NgbActiveModal, NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, Subject } from 'rxjs';
import { RequisitionsService } from '../../requisitions.service';
import { Router } from '@angular/router';
import { LocalStoreManager } from '../../../../core/authservice/local-store-manager.service';
import { DBkeys } from '../../../../core/authservice/db-Keys';
import { CancelAirecommendationComponent } from '../cancel-airecommendation/cancel-airecommendation.component';
import { AuthService } from '../../../../core/authservice/auth.service';

@Component({
  selector: 'app-chat-gpt',
  templateUrl: './chat-gpt.component.html',
    styleUrls: ['./chat-gpt.component.scss'],
    providers: [ RequisitionsService]
})
export class ChatGPTComponent implements OnInit, OnDestroy {
    showActionButtons: boolean;
    busy: Subscription;
    searchquery: string[] = [];
    @Input() public aiDescData;
    aiBooleanSearchQuery: any = null;
    concatenatedMultiDesc: string = null;

    constructor(public modal: NgbActiveModal, private recservice: RequisitionsService, private router: Router, private _authservice: AuthService, private localStorage: LocalStoreManager, private _modalService: NgbModal) { }

    public originalDesc: string = "";
    public dayToDay: string = "";
    public mustHave: string = "";
    public pluses: string = "";

    public aiSuggestedText: string = "";
    public aiSuggestedDescription: string = "";
    public aiSuggestedDayToDay: string = "";
    public aiSuggestedMustHave: string = "";
    public aiSuggestedPluses: string = "";    
    public aipreScreeningText: string = "";

    private ErrorMessage = "";
    private SuccessMessage=""
    public source = 'overview';
    public requisitionid = null;
    public ismultidescription = false;
    public isOverview = false;

    invalidOriginalDesc = "";
   
    public currentMenuId: MenuOption = MenuOption.reqdesc;
    public ActionTaken: number = 0;
    ngOnInit() {
        //  debugger;
        if (this.aiDescData && this.source == 'createreq') {
            this.originalDesc = this.aiDescData['textcontent'];
            this.dayToDay = this.aiDescData['daytodayactivity'];
            this.mustHave = this.aiDescData['musthave'];
            this.pluses = this.aiDescData['nicetohave'];
            this.ismultidescription = this.aiDescData['ismulti'];
            this.requisitionid = this.aiDescData['reqID'];

            if (this.originalDesc)
                this.rewriteJD();
            else if (this.dayToDay && this.mustHave && this.ismultidescription) {
                this.fetchChatGPTMultidescription();
            }
        }

        else if (this.source == 'overview' && this.requisitionid) {
            let reqBody =
            {
                "requisitionId": this.requisitionid,
                "isOverView": true
            };
            this.aiDescData = {}; // instantiate
            this.busy = this.recservice.getChatGPTDataByReqId(reqBody).subscribe(
                (res) => {
                    let resp_obj = JSON.parse(res._body);
                    let response = resp_obj.response;
                    if (response) {
                        if (response.prescreening) {
                            this.aipreScreeningText = response.prescreening.trim();
                        }
                        if (response.booleanquery) {
                            this.aiBooleanSearchQuery = response.booleanquery;
                        }
                        this.originalDesc = response.originaldescription;
                        this.aiSuggestedDescription = response.aidescription;

                        this.showActionButtons = true;

                        this.dayToDay = response.originaldaytoday;
                        this.mustHave = response.originalmusthaves;
                        this.pluses = response.originalpluses;
                        this.ismultidescription = (response.requisitiontypeid === 9);
                        
                        this.ActionTaken = response.action;
                        if (this.ismultidescription) {

                            this.concatenatedMultiDesc = this.concatenateForDirectReq(this.dayToDay, this.mustHave, this.pluses);
                            this.aiSuggestedDayToDay = response.aidaytoday;
                            this.aiSuggestedMustHave = response.aimusthaves;
                            this.aiSuggestedPluses = response.aipluses;
                            this.aiSuggestedText = this.concatenateForDirectReq(response.aidaytoday, response.aimusthaves, response.aipluses);

                        }
                        else {
                            this.aiSuggestedText = this.aiSuggestedDescription;
                        }

                        if (this.source == 'createreq') {

                            this.aiDescData['chatgptrecommendationid'] = response.chatgptrewrittenid;
                        }
                    } else {// if error
                        this.ErrorMessage = resp_obj.message;
                    }
                },
                (err) => {
                   // debugger;
                    console.log("Error Status" + err.status);
                    if(err.status == 401 || err.status == 403)
                       this._authservice.reLogin();
                }

            );

            this.recservice.trackChatGPTRequests(this.requisitionid, "AIRecommendation").subscribe();
        }

    }
    concatenateForDirectReq(dayToDay: string, mustHave: string, pluses: string): string {
        let concatenatedText = "";
        // concatenate and show on the right side
        if (dayToDay && mustHave) {
            concatenatedText = "Day to Day:" + dayToDay.concat("\n\nMust Haves:", mustHave);
        }
        if (pluses) {
          
            concatenatedText = concatenatedText.concat("\n\nPluses", pluses);
        }

        return concatenatedText;
    }
    

    ngOnDestroy(): void {
        this.busy.unsubscribe();
    }

    showInterviewQuestions() {
        this.currentMenuId = MenuOption.questions;
        this.preScreeningQuestions();
        this.recservice.trackChatGPTRequests(this.requisitionid, "PreScreening").subscribe();
    }
    rewriteJD() {
        this.currentMenuId = MenuOption.reqdesc;
       // this.getChatGPTSuggestion(this.currentMenuId);

        if (this.ismultidescription) {

            this.aiSuggestedText = "Day to Day:" + this.aiSuggestedDayToDay.concat("\n\nMust Haves:", this.aiSuggestedMustHave);

            if (this.aiSuggestedPluses) {

                this.aiSuggestedText = this.aiSuggestedText.concat("\n\nPluses", this.aiSuggestedPluses);
            }
        }
        else {
            this.aiSuggestedText = this.aiSuggestedDescription;
        }
        this.recservice.trackChatGPTRequests(this.requisitionid, "ReWrite").subscribe();
    }
    boolSearch() {
        this.currentMenuId = MenuOption.boolean;
        this.showBooleanSearchQuery();
        this.recservice.trackChatGPTRequests(this.requisitionid, "BooleanSearch").subscribe();
  }
  preScreeningQuestions() {
    let qstns = this.aipreScreeningText;
    if (qstns) {
      this.aiSuggestedText = qstns.trim();

      return;
    } else {

      this.ErrorMessage = "No Interview Questions Found. "
    }

    }

    showBooleanSearchQuery() {
        this.aiSuggestedText = this.aiBooleanSearchQuery;
    }

  

    searchWithBooleanQuery(actionno) {
        if (this.searchquery.length == 0) {
            let parentQuery = this.aiBooleanSearchQuery.trim();
            parentQuery = parentQuery.substring(parentQuery.indexOf('1:'), parentQuery.length);
            // - 11 is to get rid of the word variation
            let searchQuery1 = parentQuery.substring(parentQuery.indexOf('1:') + 3, parentQuery.indexOf('2:') - 11);
            let searchQuery2 = parentQuery.substring(parentQuery.indexOf('2:') + 3, parentQuery.length);

            this.searchquery = [searchQuery1.trim(), searchQuery2.trim()];
        //console.log("SearchQueries" + this.searchquery);

        }
       
        let url = "/apps/requisitionspage/overview?requisitionid=" + this.requisitionid;
        if (actionno == 1) {
            this.recservice.trackChatGPTRequests(this.requisitionid, "BooleanQuery1").subscribe();
            this.localStorage.savePermanentData(this.searchquery[0], DBkeys.SEARCH_QUERY);
            this.router.navigate([]).then(result => { window.open(url, '_blank'); });
        }

        else {
            this.recservice.trackChatGPTRequests(this.requisitionid, "BooleanQuery2").subscribe();
            this.localStorage.savePermanentData(this.searchquery[1], DBkeys.SEARCH_QUERY);
            this.router.navigate([]).then(result => { window.open(url, '_blank'); });
        }

    }

  
    
    OnDescAcceptClicked() {
        this.aiDescData['textcontent'] = this.aiSuggestedDescription;
        this.aiDescData['daytodayactivity'] = this.aiSuggestedDayToDay;
        this.aiDescData['musthave'] = this.aiSuggestedMustHave;
        this.aiDescData['nicetohave'] = this.aiSuggestedPluses;

       

        let body = {
            "requisitionId": this.requisitionid,
            "isOverView": this.source == 'overview',
            "action": 1,
            "cancelReasonId": null,
            "comments": null
        };
        this.processChatGPTData(body, 1);
       

    }
    processChatGPTData(requestbody, action) {
        this.busy = this.recservice.processChatGPTRecommendations(requestbody).subscribe(
            (res: any) => {
              
                let response = JSON.parse(res._body).response;
                if (response) {
                if (response.prescreening) {
                    this.aipreScreeningText = response.prescreening.trim();
                }
                if (response.booleanquery) {
                    this.aiBooleanSearchQuery = response.booleanquery;
                }
                  
                    this.SuccessMessage = action == 1 ? "Successfully accepted AI recommended description" : "Successfully accepted the Original description";
                setTimeout(() => {
                    this.ActionTaken = action;
                    this.SuccessMessage = null;
                    }, 2000);

                }
               

            },
            (err) => { this.ErrorMessage = err.message; }
        );

    }


 
    getConstructedPayload() {
        let payload = {
            "requisitionId": this.requisitionid,
            "originalDescription":this.originalDesc,
            "prompt": this.currentMenuId,
            "aiRecommendation": this.aiSuggestedText.trim(),
            "isOverview": (this.source == 'overview'),
            "originalDayToDay": this.dayToDay,
            "originalMustHave": this.mustHave,
            "originalPluses": this.pluses,
            "aiDayToDay": this.aiSuggestedDayToDay.trim(),
            "aiMustHave": this.aiSuggestedMustHave.trim(),
            "aiPluses": this.aiSuggestedPluses.trim()
         
        };
        return payload;
    }

    ShowCancellationReasonPopup() {
       let  ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false
        };
        debugger;
      
        let reasonModal = this._modalService.open(CancelAirecommendationComponent, ngbModalOptions);
        reasonModal.componentInstance.requisitionId = this.requisitionid;
      
        reasonModal.result.then((result) => {
              
            let requestBody = {
                "requisitionId": this.requisitionid,
                "isOverView": this.source == 'overview',
                "action": 2,
                "cancelReasonId": result.cancelReasonId,
                "comments": result.comments? result.comments : ""
            };
            this.processChatGPTData(requestBody, 2);
           
        });
        
       // this.modal.dismiss('user closed');
    }

    /******************************************************************************************************************
   *
   * Following MEthods are NOT IN USE for OVerview SCreen. WE can keep it for Add/EDit REQ or remove it
   * 
   */
    getChatGPTSuggestion(promptID) {
        let jsondata = {
            model: "",
            prompt: promptID,
            rolesummary: this.originalDesc,
            maxtokens: 0,
            requisitionid: this.requisitionid,
            isoverview: this.isOverview,
            originaldaytoday: "",
            originalmusthave: "",
            originalpluses: ""
        };
        this.showActionButtons = false;
        this.ErrorMessage = null;

        this.aiSuggestedText = "";
        this.busy = this.recservice.getChatGPTSuggestion(jsondata).subscribe(
            (res: any) => {

                let response = JSON.parse(res._body).response;
                if (!response) {
                    let message = JSON.parse(res._body).message ? JSON.parse(res._body).message : "Error Occurred";
                    this.showActionButtons = false;
                    this.ErrorMessage = "Error Occurred:  " + message;
                    setTimeout(() => {
                        this.modal.dismiss("cancel");
                    }, 2500);
                }
                else {
                    this.showActionButtons = true;
                    if (response.htmltext) {
                        this.aiSuggestedText = response.htmltext;
                        this.aiSuggestedDescription = response.htmltext;
                    }
                    if (response.aiprescreening) {
                        this.aipreScreeningText = response.aiprescreening;
                    }
                    if (response.aibooleanquery) {
                        this.aiBooleanSearchQuery = response.aibooleanquery;
                    }
                }
            },
            () => { }
        );
    }
    /**Following method is NOT IN USE for Req OVerview Screen */
    fetchChatGPTMultidescription() {
        this.currentMenuId = MenuOption.reqdesc;
        let jsondata = {
            model: "",
            prompt: this.currentMenuId,
            roleSummary: "",
            maxtokens: 0,
            requisitionid: this.requisitionid,
            isoverview: this.isOverview,
            originaldaytoday: this.dayToDay,
            originalmusthave: this.mustHave,
            originalpluses: this.pluses
        };
        this.showActionButtons = false;
        this.ErrorMessage = null;

        this.aiSuggestedDayToDay = "";
        this.aiSuggestedMustHave = "";
        this.aiSuggestedPluses = "";
        this.busy = this.recservice.getChatGPTSuggestion(jsondata).subscribe(
            (res: any) => {

                let response = JSON.parse(res._body).response;
                if (!response) {
                    let message = JSON.parse(res._body).message ? JSON.parse(res._body).message : "Error Occurred";
                    this.showActionButtons = false;
                    this.ErrorMessage = "Error Occurred:  " + message;
                    setTimeout(() => {
                        this.modal.dismiss("cancel");
                    }, 2500);
                }
                else {
                    this.showActionButtons = true;
                    if (response.aidaytoday) {
                        this.aiSuggestedDayToDay = response.aidaytoday;
                    }
                    if (response.aimusthave) {
                        this.aiSuggestedMustHave = response.aimusthave;
                    }
                    if (response.aiprescreening) {
                        this.aipreScreeningText = response.aiprescreening;
                    }
                    if (response.aibooleanquery) {
                        this.aiBooleanSearchQuery = response.aibooleanquery;
                    }
                    if (response.aidaytoday && response.aimusthave) {
                        this.aiSuggestedText = "Day to Day:" + this.aiSuggestedDayToDay.concat("\n\nMust Haves:", this.aiSuggestedMustHave);
                    }
                    if (response.aipluses) {
                        this.aiSuggestedPluses = response.aipluses;
                        this.aiSuggestedText = this.aiSuggestedText.concat("\n\nPluses", this.aiSuggestedPluses);
                    }
                }

            },
            () => { }
        );

        this.recservice.trackChatGPTRequests(this.requisitionid, "ReWrite").subscribe();
    }

    validateOriginalDescription() {
        if (this.ismultidescription) {
            if (!(this.dayToDay || this.mustHave)) {

                this.ErrorMessage = "Original Description is missing or invalid";
                return false;
            }
            if (!this.aiSuggestedDayToDay) {
                this.ErrorMessage = "AI Suggested Description is missing or invalid";
                return false;
            }
        }

        if (!this.ismultidescription) {
            if (!this.originalDesc) {
                this.ErrorMessage = "Original Description is missing or invalid";
                return false;
            }
            if (!this.aiSuggestedDescription) {
                this.ErrorMessage = "AI Suggested Description is missing or invalid";
                return false;
            }
        }

        return true;
    }


    copyToClipboard() {

        // text area method
        let textArea = document.createElement("textarea");
        textArea.value = this.aiSuggestedText;
        // make the textarea out of viewport
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        return new Promise<void>((res, rej) => {
            // here the magic happens
            document.execCommand('copy') ? res() : rej();
            textArea.remove();
        });


    }
/************************************************************************************************************************* */
}




export enum MenuOption {
    reqdesc = 1,
    questions,
    boolean
}


