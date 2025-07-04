import { Component, OnInit, ViewChild, Renderer2, Output } from '@angular/core';
import { ActivityService } from '../activity.service';
import { NgbActiveModal, NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { UUID } from 'angular2-uuid';
import { AuthService } from '../../core/authservice/auth.service';
//import { CheckboxGroupComponent } from '../../shared/components/checkbox-group';

@Component({
  selector: 'app-activity-search',
  templateUrl: './activity-search.component.html',
  styleUrls: ['./activity-search.component.scss']
})
export class ActivitySearchComponent implements OnInit {

    constructor(public _activityservice: ActivityService, public modal: NgbActiveModal, public _authservice: AuthService) { }

    public journalEntries = [];
   // public journalOriginalCopy = [];
    isLoading = true;
    pageIndexCounter;
    pageSize = 20;
    public showExclusiveFlag = false;
 
  //  @ViewChild('t') tooltip: NgbTooltip;

    public datamodel = {
        "searchText": "",
        "category": "",
        "action": [],
        "datefilter" : 10
      }

    public subcategories = {
        "candidate" : [],
        "requisition" : [],
        "others" : []
    }

    public dateoptions = [
        { name: "1 Day", value: 1 },
        { name: "2 Days", value: 2 },
        { name: "3 Days", value: 3 },
        { name: "4 Days", value: 4 },
        { name: "5 Days", value: 5 },
        { name: "6 Days", value: 6 },
        { name: "7 Days", value: 7 },
        { name: "8 Days", value: 8 },
        { name: "9 Days", value: 9 },
        { name: "10 Days", value: 10 }
    ];

    daysback = 10;

    ngOnInit() {
        this.pageIndexCounter = 1;
        this.fetchActivityHistory("load", this.pageIndexCounter, this.pageSize, this.datamodel);

        this._activityservice.getSubCategoryOptions().subscribe(res => {
           // debugger;
            let body = JSON.parse(res._body);
            if (body.response[0]) {
                this.subcategories = body.response[0];

                // set an additional parameter checked for subcategories, so that value of checkbox will be binded to it.
                this.clearCheckboxes();
              }
            },
            err => {
                this.isLoading = false;
                console.log("SubCategory list fetch Failed" + err);
            }
            );
        
    }

    fetchActivityHistory(origin: string, pageIndex, size?, datamodel?): void {
        this.isLoading = true;
        this._activityservice.getActivityHistory(pageIndex, size, datamodel)
            .subscribe(res => {
                this.isLoading = false;
               // debugger;
                let body = JSON.parse(res._body);
                {

                    if (!origin || origin === "load") {
                        if (body.response && body.response.length > 0) { 
                          this.journalEntries = this.journalEntries.concat(body.response);
                        }
                    }
                    else if (origin === "filter") {
                        this.journalEntries = body.response ? body.response : [];
                        // if response is null, dont assign null to journal. make it empty array instead.
                    }
                }
                
            },
                err => {
                    this.isLoading = false;
                    console.log("Activity search fetch Failed" + err);
                });
    }

    onSubmit(form) {
        debugger;
        let searchkey = this.datamodel.searchText;

        this.datamodel.action = [];
        this.journalEntries = []; // clear data on everysearch, so that user can see loading and will notice the search result is ready
        this.datamodel.datefilter = this.daysback;

        // read if checkbxoes are checked and populate in Datamodel
        let keys = Object.keys(this.subcategories);
        for (let key in keys) {
            let param = keys[key];
            if (this.subcategories[param]) {
                let checkedBoxes = this.subcategories[param].filter(x => x.checked === true).map(x => x.journaltypeid);
                if (checkedBoxes && checkedBoxes.length >0) {

                    this.datamodel.action = this.datamodel.action.concat(checkedBoxes);
                }

            }
        }
        ///make Checkbox Action filter and search text exclusive
        if (this.datamodel.action.length > 0) {
            this.datamodel.category = "";
        }

        // Now Submit Search text and checkboxes filter - this combinationc an co exist
        if (searchkey) {
            this.pageIndexCounter = 1;
            this.datamodel.category = "";
            this.fetchActivityHistory("filter", this.pageIndexCounter, this.pageSize, this.datamodel);
        }
        else {
            this.pageIndexCounter = 1;
            this.fetchActivityHistory("filter", this.pageIndexCounter, this.pageSize, this.datamodel);
        }
        
    }

    pinclicked(event, current_record: any, pintype: string, tooltipObj: NgbTooltip) {
        //debugger;
        let candidatename = current_record.activityname ? current_record.activityname : "Name";
        let requisitionname = current_record.activityname ? current_record.activityname : "Name";
        if (current_record.activitytype.toLowerCase() === "candidate/requisition") {

            let splitarray = current_record.activityname.split("/");
            if (splitarray) {
                candidatename = splitarray[0].trim();
                requisitionname = splitarray[1].trim();
            }

        }
        // handle pinning here only, because the modal is attached to widnow and has no parent component.
        if (pintype === "candidate") {
            var candidate = {
                "id": UUID.UUID(),
                "url": "apps/candidateprofile",
                "title": candidatename,
                "icon": "fa fa-user-circle-o",
            //    "subtitle": "candidate profile",
                "params": [
                    { "name": "candidateid", "id": UUID.UUID(), "value": current_record.candidateid } //ae6778e4-f270-9eaa-2572-4b9e64862419
                ],
                "openinpopup": true,
                "popupparams": { value: current_record.candidateid, key: "candidateid", formid: "d7a61781-95a4-49cd-ad15-824de4462233" }
            };
            this.pinClickedHandler(candidate);
        }
        else if (pintype === "requisition") {
            var requisition = {
                "icon": "fa fa-list-alt",
                "id": UUID.UUID(),
                "title": requisitionname,
         //       "subtitle": "jobtitle",
                "params": [{ "name": "requisitionid", "id": "5c5c593a-e4aa-8ed9-437e-fa6947a15e38", "value": current_record.requisitionid }],
                "url": "apps/recoverview"
            };
            this.pinClickedHandler(requisition);
        }

        setTimeout(() => {
            tooltipObj.close();
        }, 1500);
    }

    public pinClickedHandler(pinObject: any) {

        if (pinObject && pinObject.params) {
            let primaryKey = pinObject.params[0].name;
            let primaryKeyValue = pinObject.params[0].value;
            if (!this.isbookmarked(pinObject, primaryKey, primaryKeyValue)) {
                this._authservice.AddtoBookmark(pinObject);
            }

        }
    }

    isbookmarked(item: any, primaryKey, primarykeyValue) {
        let itembookmarked = false;
        // debugger;
        if (this._authservice.bookmark) {
            this._authservice.bookmark.forEach(item => {
                const param = item.params.find(x => x.name === primaryKey && x.value === primarykeyValue);
                if (param) {
                    itembookmarked = item;
                }
            })
        }
        if (itembookmarked) {
            this._authservice.RemoveBookmark(itembookmarked);
        }
        return itembookmarked;
    }

    copytoClipboard(event, current_record, tooltipObj: NgbTooltip) {
        var textArea = document.createElement("textarea");
        textArea.value = current_record.activityname ? current_record.activityname : '';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("Copy");
        textArea.remove();

        setTimeout(() => {
            tooltipObj.close();
        }, 1500);
    }

    loadMore() {
        //debugger;
        this.pageIndexCounter++;
        this.fetchActivityHistory("load",this.pageIndexCounter, this.pageSize, this.datamodel);
    }

    filterClicked(event, categoryClicked) {
        //set datamodal filter category here.
        //search and category cannot co exist - they are mutually exclusive.
        if (!this.datamodel.searchText) {
            this.pageIndexCounter = 1;
            this.datamodel.category = categoryClicked;
            this.journalEntries = [];
            this.fetchActivityHistory("filter", this.pageIndexCounter, this.pageSize, this.datamodel);
        }
        else
            this.showExclusiveFlag = true;

       
    }

    clearFilter() {
        //reset and make it look same as load 
        this.datamodel.category = "";
        this.datamodel.searchText = "";
        this.pageIndexCounter = 1;
        this.journalEntries = [];
        this.datamodel.action = [];
        this.clearCheckboxes();
        this.showExclusiveFlag = false;
        this.datamodel.datefilter = 10;
        this.daysback = 10;

        this.fetchActivityHistory("load", this.pageIndexCounter, this.pageSize, this.datamodel);
    }


    clearCheckboxes() {
        
        this.subcategories.candidate.forEach(item => {
            item["checked"] = false;
        });
        this.subcategories.requisition.forEach(item => {
            item["checked"] = false;
        });
        this.subcategories.others.forEach(item => {
            item["checked"] = false;
        });
    }
}
