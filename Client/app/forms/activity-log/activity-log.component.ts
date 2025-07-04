import { Component, OnInit, AfterViewInit, Output, EventEmitter, Renderer2, ViewChild } from '@angular/core';
import { ActivityService } from '../activity.service';
import { ActivitySearchComponent } from '../activity-search/activity-search.component';
import { NgbModal, NgbModalOptions, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from "angular2-uuid";

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit, AfterViewInit {

    public journal: any = [];
    public journalOriginalCopy: any ;
    public searchText: string = "";

    noActivityMessageToday:boolean = false;
    noActivityMessageYesterday: boolean = false;

    @Output()
    pinClicked = new EventEmitter();
    @Output()
    popupOpened = new EventEmitter();



    public isUploading: boolean;

    constructor(public _activityservice: ActivityService, public _modalService: NgbModal) { }

    ngOnInit() {
        
        this.isUploading = true;
        this._activityservice.getCandJournal()
            .subscribe(res => {
                this.isUploading = false;
                debugger;
                let body = JSON.parse(res._body);
                this.journal = body.response? body.response[0] : null;
                
                this.journalOriginalCopy = body.response ? JSON.parse(res._body).response[0] : null;

            
            },
                err => {
                    this.isUploading = false;
                    console.log("API call not working" + err);
                    

                });
        
  }

    ngAfterViewInit() {
        //call pagetracker
        this._activityservice.trackActivityPageOpened({ "pagename": "ActivityLog" })
            .subscribe(res => {},
                err => {
                    console.log("tracking call failed" + err);
                });
        
    }

    copytoClipboard(event, current_record, tooltip: NgbTooltip) {
        //debugger;

         var textArea = document.createElement("textarea");
         textArea.value = current_record.activityname ? current_record.activityname : '' ;
         document.body.appendChild(textArea);
         textArea.select();
         document.execCommand("Copy");
        textArea.remove();

        setTimeout(() => {
            tooltip.close();
        }, 1500);
    }

    pinclicked(event, current_record: any, pintype: string, tooltip: NgbTooltip) {
       // debugger;
        let candidatename = current_record.activityname ? current_record.activityname : "Name";
        let requisitionname = current_record.activityname ? current_record.activityname : "Name";
        if (current_record.activitytype.toLowerCase() === "candidate/requisition") {

            let splitarray = current_record.activityname.split("/");
            if (splitarray) {
                candidatename = splitarray[0].trim();
                requisitionname = splitarray[1].trim();
            }

        }
        // let parent handle bookmarking - refere to header component
         if (pintype === "candidate") {
             var candidate = {
                 "id": UUID.UUID(),
                 "url": "apps/candidateprofile",
                 "title": candidatename,
                 "icon": "fa fa-user-circle-o",
                // "subtitle": "candidate profile",
                 "params": [
                     { "name": "candidateid", "id": UUID.UUID(), "value": current_record.candidateid } //ae6778e4-f270-9eaa-2572-4b9e64862419
                 ],
                 "openinpopup": true,
                 "popupparams": { value: current_record.candidateid , key: "candidateid", formid: "d7a61781-95a4-49cd-ad15-824de4462233" }
             };
            this.pinClicked.emit(candidate);
        }
         else if (pintype === "requisition") {
             var requisition = {
                 "icon": "fa fa-list-alt",
                 "id": UUID.UUID(),
                 "title": requisitionname,
               //  "subtitle": "",
                  "params": [{ "name": "requisitionid", "id": "5c5c593a-e4aa-8ed9-437e-fa6947a15e38", "value": current_record.requisitionid  }],
                  "url": "apps/recoverview"
             };
            this.pinClicked.emit(requisition);
        }

        setTimeout(() => {
            tooltip.close();
        }, 1500);
    }

    onSubmit() {
       // debugger;
        this.doSearch(this.searchText);
    }

    doSearch(findText) {
        //always perform search within original Array - althogh complexity is more handles all user actions.
        if (findText) {
            let filteredListToday = this.journalOriginalCopy.Today.filter(obj => (obj.activityname.toLowerCase().search(findText.toLowerCase()) > -1));
            let filteredListYesterday = this.journalOriginalCopy.Yesterday.filter(obj => (obj.activityname.toLowerCase().search(findText.toLocaleLowerCase()) > -1));

            this.journal.Today = filteredListToday;
            this.journal.Yesterday = filteredListYesterday;
        }
        else {
            //reset when search is cleared
            this.journal = JSON.parse(JSON.stringify(this.journalOriginalCopy));
        }
    }
    // handler if cross ixon is clicked within search text
    clearActivitySearch() {
        if (this.searchText) {
            this.searchText = null;
            this.journal = JSON.parse(JSON.stringify(this.journalOriginalCopy));
        }
    }

    public openSearch() {
        let ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
           windowClass: 'activity-modal'
          //  scrollable: true
        };
        const modalRef = this._modalService.open(ActivitySearchComponent, ngbModalOptions);
        modalRef.componentInstance.name = 'activitysearch';

        this.popupOpened.emit(modalRef);
        
    }

    // update the seacrh result on every key pressed
    onKeyPressed($event, text) {
        this.doSearch(text);
       
    }
}


