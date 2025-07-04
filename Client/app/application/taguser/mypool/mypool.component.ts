import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import {  NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { TagdashboardService } from '../tagdashboard.service';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';

@Component({
  selector: 'app-mypool',
  templateUrl: './mypool.component.html',
  styleUrls: ['../tagdashboard/tagdashboard.component.scss']
})
export class MypoolComponent implements OnInit {
    loading: boolean = false;
    istagadmin: boolean = false;
    pagesize: number = 20;
    pageIndex: number = 1;
    formattedStartdate: string;
    formattedEnddate: string;
    searchClicked = false;
  

    constructor(private tagdashboardservice: TagdashboardService, private localStorage: LocalStoreManager) {
        let current_user = this.localStorage.getData('current_user');
       
        this.istagadmin = current_user.roles[0].tagadmin.toLowerCase() == 'yes';
    }


    public startDate: NgbDateStruct = <NgbDateStruct>{};
  
    public endDate: NgbDateStruct = <NgbDateStruct>{};
   
    dataset = [];
    errorMessage: string = null;
    exportMessage: string = '';
    stateslist = [];
    tagmembersList = [];
    poolList = [
        "Active Talent Pool",
        "Passive Talent Pool",
        "All"
    ];

    datamodel = {
        poolstatus: null,
        formattedEnddate: '',
        formattedStartdate: '',
        state: [],
        tagmember: [],
        pageindex: this.pageIndex,
        pagesize: this.pagesize,
        closurestartdate: '',
        closureenddate: ''
    };

    resetForm() {
        this.form.reset();
        this.startDate = null;
        this.endDate = null;
        this.searchClicked = false;
        this.loading = false;
        this.dataset = [];
        this.datamodel = {
          poolstatus: null,
          formattedEnddate: '',
          formattedStartdate: '',
          state: [],
          tagmember: [],
          pageindex: this.pageIndex,
          pagesize: this.pagesize,
          closurestartdate: '',
          closureenddate: ''
      }
    }

    @ViewChild('mypoolForm') form: any;
 

    ngOnInit() {
        if (this.istagadmin) {
            this.tagdashboardservice.getProactivemembers().subscribe(
                (res:any)=> {
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
      this.datamodel.closurestartdate = date.toISOString();

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
      this.datamodel.closureenddate = date.toISOString();
    }
    searchMyPool() {
        this.loading = true;
        this.searchClicked = true;
        this.tagdashboardservice.getMypoolSearch(this.datamodel).
            subscribe(
                (res) => {
                    let response = JSON.parse(res._body)['response'];
                    this.dataset = response ? response : [];
                   
                    this.loading = false;
                },
                () => { this.loading = false; }
            );
    }

    onLocationFocus() {
        this.populateStateList();
    }

    populateStateList() {
        this.tagdashboardservice.getStates().subscribe(
            (res:any) => {
                let response = JSON.parse(res._body)['response'];
                this.stateslist = response ? response.states : [];
            },
            () => { this.loading = false; }
        );
    }

    exportMyPool() {
        this.tagdashboardservice.exportCandidates(this.datamodel).subscribe(
            (res: any) => {
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
