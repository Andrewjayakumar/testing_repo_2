import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TagdashboardService } from '../tagdashboard.service';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';


@Component({
  selector: 'app-tagdashboard',
  templateUrl: './tagdashboard.component.html',
    styleUrls: ['./tagdashboard.component.scss']
})
export class TagdashboardComponent implements OnInit {
    loading: boolean = false;
    selectedTagList = [];
    istagadmin: boolean;
    tagmembersList: any = [];
    alertType = "success";
    searchClicked = false;


    constructor(private tagdashboardservice: TagdashboardService, private localStorage: LocalStoreManager) {
        let current_user = this.localStorage.getData('current_user');
        
        this.istagadmin = current_user.roles[0].tagadmin.toLowerCase() == 'yes';
    }


    public startDate: NgbDateStruct = <NgbDateStruct>{};
    formattedStartdate: string = '';
    public endDate: NgbDateStruct = <NgbDateStruct>{};
    formattedEnddate: string = '';
    dataset = [];
    errorMessage: string = null;
    exportMessage: string = '';

    @ViewChild('tagDBForm') form: any;
  

    ngOnInit() {
        if (this.istagadmin) {
            this.tagdashboardservice.getProactivemembers().subscribe(
                (res: any) => {
                    let response = JSON.parse(res._body)['response'];
                    this.tagmembersList = response ? response.proactivemembers : [];

                }
            );
        }
  }


    StartDateChanged() {

        if (!this.startDate)
            return;

        var tzoffset = (new Date()).getTimezoneOffset() * 60000;

        var date: any = new Date(`${this.startDate.year}-${this.startDate.month}-${this.startDate.day}`);

        // latest changes for start date for previous date on selection
        let MM = ('0' + this.startDate.month).slice(-2);
        let DD = ('0' + this.startDate.day).slice(-2);
        this.formattedStartdate = `${MM}/${DD}/${this.startDate.year}`;

        if (this.endDate) {
            this.endDate = null;
        }

    }

    EndDateChanged() {
        if (!this.endDate) {
            return;
        }

        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        let MM = ('0' + this.endDate.month).slice(-2);
        let DD = ('0' + this.endDate.day).slice(-2);

        var date: any = new Date(`${this.endDate.year}-${this.endDate.month}-${this.endDate.day}`);
        let endDateObj: Date = new Date(date);
        this.formattedEnddate = `${MM}/${DD}/${this.endDate.year}`;
    }

    searchTag() {
        this.loading = true;
        this.searchClicked = true;
        this.tagdashboardservice.getTagDashboardSearchResults({ "closurestartdate": this.formattedStartdate, "closureenddate": this.formattedEnddate, "tagmember": this.selectedTagList }).
            subscribe(
                (res) => {
                    let response = JSON.parse(res._body)['response'];
                    this.dataset = response ? response : [];
                    if (!this.dataset || this.dataset.length == 0) {
                        this.errorMessage = "No Records Found !!"
                    }
                    this.loading = false;
                },
                () => {
                    this.loading = false;
                    this.searchClicked = false;
                }
            );
    }

    resetForm() {
        this.form.reset();
        this.startDate = null;
        this.endDate = null;
        this.loading = false;
        this.searchClicked = false;
        this.dataset = [];
    }

    exportTagDB() {
        this.tagdashboardservice.exportTagDashboard({ "closurestartdate": this.formattedStartdate, "closureenddate": this.formattedEnddate, "tagmember": this.selectedTagList }).
            subscribe(
                (res) => {
                    let res_body = JSON.parse(res._body);
                   // debugger;
                    if (res_body.response) {
                        this.exportMessage = res_body.message;
                       
                    }
                    setTimeout(() => this.exportMessage = null, 4000);
                }
            );
    }
}
