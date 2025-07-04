import { Component, OnInit, Input, AfterViewInit, TemplateRef, ViewChild, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { JobboardsearchService } from '../jobboardsearch.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject, Observable, Subscription } from 'rxjs';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

import { filter, map, distinctUntilChanged, catchError, switchMap, concat, tap, debounceTime, takeUntil } from 'rxjs/operators';
import { of } from 'rxjs/observable/of';
import { ObservableInput } from 'rxjs/Observable';


@Component({
  selector: 'app-metal-boolean',
  templateUrl: './metal-boolean.component.html',
  styleUrls: ['./metal-boolean.component.scss', '../jobboard-parent/jobboard-parent.component.scss']
})
export class MetalBooleanComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges{
   
    @Input('requisitionid') requisitionid: any;
    @Input() isCandidateDashboard: boolean = false;
    @Input('searchquery') searchquery: string = "";
    @Input('aidrivenuser') aidrivenuser: boolean = false; 

  metalboolForm: FormGroup;
  showAdvancedSearch = false;
  pageCodeMetalbool = "RCS01";
  pagesize: number;
  pageIndex: number;
  totalResults: number;
  candidateResults: Array<any>;
  message: string = "";
  selectedCandidates: Array<any> = [];
  selectedSearchType: any;
  busy: Subscription;
  popupConfig: any;
  @ViewChild('content') content: TemplateRef<any>;
  workAuthDetails: any;
  stateDetails: any;
  domainStateDetails: any;
  proactiveMembers: any;
  deliverymodelid: any;
  GliderTestItems$: Observable<any>;
  gildertest$ = new Subject<string | null>();
  public glidertestArray = new Array();
  contactedfrom: any;
  contactedto: any;
  updatedfrom: any;
  updatedto: any;
  dateholder: any;
  pageTrackerResp: any;
  disableOffshore: boolean = false;
  highlightskillsarray = [];
  selectedHotbooks: any = [];
  searchInputDisabled:boolean =false;
  showEditButton: boolean = false;
  aigenerated: boolean = false;
  lables: any;


  constructor(public jobboardservice: JobboardsearchService, private fb: FormBuilder, public _modalService: NgbModal) {
    //initialise
    this.pagesize = 20;
    this.pageIndex = 1;
    this.candidateResults = null;

    this.metalboolForm = this.fb.group({
      query: new FormControl('', Validators.required),
      type: new FormControl('')

    });

    this.selectedSearchType = 1;

    this.popupConfig = { "title": "", "message": "", "type": "", "isConfirm": false };
    this.initializeTypeaheads();
  }


  initializeTypeaheads(param?) {
    this.GliderTestItems$ = this.gildertest$.pipe(
      //filter(t => t && t.length > 1),
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => this.searchgliderTests(term))
    );


  }

  searchgliderTests(term: string): ObservableInput<any> {
    this.glidertestArray = null;
    if (!term) {
      this.glidertestArray = [];

      return this.glidertestArray;
    }

    return this.jobboardservice.gettheGliderTest(term).pipe(
      map((res: any) => {
        this.glidertestArray = [];
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response : [];

      })

    );
  }
  public searchtype = [
    { "key": "Exact", "value": 0 },
    { "key": "Boolean", "value": 1 },
    { "key": "All Words", "value": 2 },
    { "key": "Any Words", "value": 3 }
  ];

  public proactiveData = [
    { "key": "RDPL", "value": "RDPL" },
    { "key": "RFRL", "value": "RFRL" },
    { "key": "TAG", "value": "TAG" },
    { "key": "H1B", "value": "H1B" },
    { "key": "EngageX", "value": "EngageX" },
    { "key": "Rehire", "value": "Rehire" },
    { "key": "JUMP RDPL", "value": "JUMP RDPL" },
    { "key": "Spark RDPL", "value": "Spark RDPL" },
    { "key": "Exclusivity Spark", "value": "Exclusivity Spark" },
    { "key": "Exclusivity RDPL", "value": "Exclusivity RDPL" }
   
  ]

  public orderBy = [
    { "key": "Keyword Relevance", "value": 0 },
    { "key": "Creation Date", "value": 1 },
    { "key": "Modification Date", "value": 2 }

  ];

  public screenLevel = [
    { "key": "L1", "value": "L1" },
    { "key": "L2", "value": "L2" },
    { "key": "L3", "value": "L3" }

  ];

  public LastUpdatedDaysback = [
    { "key": "Today", "value": 0 },
    { "key": "1 Day", "value": 1 },
    { "key": "2 Days", "value": 2 },
    { "key": "3 Days", "value": 3 },
    { "key": "1 Week", "value": 7 },
    { "key": "2 Weeks", "value": 14 },
    { "key": "1 Month", "value": 30 },
    { "key": "3 Months", "value": 90 },
    { "key": "6 Months", "value": 180 },
    { "key": "9 Months", "value": 270 },
    { "key": "All Resume", "value": "" },

  ];

  public employmentStatus = [
    { "key": "Active", "value": "Active" },
    { "key": "Bench", "value": "Bench" },
    { "key": "Terminated", "value": "Terminated" },
    { "key": "WF Pending", "value": "WF Pending" },
    { "key": "Others", "value": "Others" }
  ];

  public hotbookfilter = [
    { "key": "Personal", "value": "Personal Hotbooks" },
    { "key": "Shared", "value": "Shared Hotbooks" }
  ];

  public model = {
    "workauthorizationid": null,
    "state": null,
    "employmentstatus": [],
    'isjump' : false,
    "zipcode": "",
    "mileswithin": null,
    "relocate": false,
    "industryid": [],
    "query": "",
    "type": null,
    "activetalentpool": false,
    "passivetalentpool": false,
    "assessmenttestname": [],
    "videoresume": false,
    "linkedin": false,
    "orderby": null,
    "lastupdateddaysback": null,
    "lastcontacteddaysback": null,
    "contactedfrom": null,
    "contactedto": null,
    "updatedfrom": null,
    "updatedto": null,
    "sector": null,
    "proactivemembers":[],
    "offshore": false,
    "redeployable": false,
    "interviewlevel": null,
    "hotbookfilter": null,
    "deliverymodelid": null,
    "isedited": false,
    "ismanual": false,
    "labelIds": null
  }

    ngOnInit() {
      this.checkForPreloadSearchQuery();
      this.disableSearchInput();
      this.model["pagecode"] = this.pageCodeMetalbool;
      this.model["requisitionid"] = this.requisitionid;
      this.getworkAuthorization();
      this.getAlltheStates();
      this.getDomainIndustry();
      this.getproActiveMembers();
      this.GetDeliveryModelsMasterAsync();
      this.geLabels();
      this.model['type'] = this.searchtype[1].value;
      
    }

    disableSearchInput(){
      if(this.aidrivenuser && this.searchquery){
        this.searchInputDisabled = true;
        this.showEditButton=true;
      }
    }

  checkForPreloadSearchQuery() {
    if (this.searchquery) {
      this.model.query = this.searchquery;
      this.onSearchClicked();
    }
  }
  GetDeliveryModelsMasterAsync() {
    this.jobboardservice.GetDeliveryModelsMasterAsync()
      .subscribe(
        (res: any) => {
          this.deliverymodelid = JSON.parse(res._body)['response'];
        },
        err => {
          console.log(err);

        },
        () => {
        }
      );
  }
  geLabels() {
    this.busy = this.jobboardservice.getlabels()
      .subscribe(
        (res: any) => {
          this.lables = JSON.parse(res._body)['response']['labels'];
        },
        err => {
          console.log(err);

        },
        () => {
        }
      );
  }

  contactedFrom(value) {

    if (value) {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
      let date = new Date(this.dateholder - tzoffset);
        let MM = ('0' + date.getMonth()+1).slice(-2);
        let DD = ('0' + date.getDate()).slice(-2);
        this.model.contactedfrom = `${MM}/${DD}/${date.getFullYear()}`;
    
    }
  }
  contactedTo(value) {

      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
      let date = new Date(this.dateholder - tzoffset);
      let MM = ('0' + date.getMonth() + 1).slice(-2);
      let DD = ('0' + date.getDate()).slice(-2);
      this.model.contactedto = `${MM}/${DD}/${date.getFullYear()}`;
  }
  updatedFrom(value) {

    if (value) {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
      this.model.updatedfrom = (new Date(this.dateholder - tzoffset)).toISOString();

    }
  }
  updatedTo(value) {

    if (value) {
      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
      this.model.updatedto = (new Date(this.dateholder - tzoffset)).toISOString();

    }
  }
  getworkAuthorization() {
    this.busy = this.jobboardservice.getworkAuthDetails()
      .subscribe(
        (res: any) => {
          this.workAuthDetails = JSON.parse(res._body)['response']['workauthorizations'];
        },
        err => {
          console.log(err);

        },
        () => {
        }
      );
  }

  getAlltheStates() {
    this.busy = this.jobboardservice.getAllthestates()
      .subscribe(
        (res: any) => {
          this.stateDetails = JSON.parse(res._body)['response']['states'];
        },
        err => {
          console.log(err);

        },
        () => {
        }
      );
  }


  getDomainIndustry() {
    this.busy = this.jobboardservice.getDomainIndustry()
      .subscribe(
        (res: any) => {
          this.domainStateDetails = JSON.parse(res._body)['response']['domainindustries'];
        },
        err => {
          console.log(err);

        },
        () => {
        }
      );
  }

  getproActiveMembers() {
    this.busy = this.jobboardservice.getproActiveMembers()
      .subscribe(
        (res: any) => {
          this.proactiveMembers = JSON.parse(res._body)['response']['proactivemembers'];
        },
        err => {
          console.log(err);

        },
        () => {
        }
      );
  }
    ngAfterViewInit(): void {
        if (this.isCandidateDashboard) {
            this.model.isedited = true;
        }

       
    
    }

    ngOnChanges(changes: SimpleChanges): void {
   
        this.checkForPreloadSearchQuery();
        this.disableSearchInput();
    }
  

    OnAdvancedSearchToggled(togglestate) {
        if (togglestate == false) {
            this.clearAdvancedSearchParams();
         
        }
        else {
          
            this.model.ismanual = true;
        }
    }

  clearAdvancedSearchParams() {
    this.model["workauthorizationid"] = [];
    this.model["state"] = [];
    this.model["employmentstatus"] = [];
    this.model["zipcode"] = "";
    this.model["mileswithin"] = null;
    this.model["relocate"] = false;
    this.model["industryid"] = [];
    this.model["labelIds"] = [];
    this.model["activetalentpool"] = false;
    this.model["passivetalentpool"] = false,
    this.model["assessmenttestname"] = [];
    this.model["videoresume"] = false;
    this.model["linkedin"] = false;
    this.model["orderby"] = null;
    this.model["lastupdateddaysback"] = null;
    this.model["lastcontacteddaysback"] = null;
    this.model["contactedfrom"] = null;
    this.model["contactedto"] = null;
    this.model["updatedfrom"] = null;
    this.model["updatedto"] = null;
    this.model["proactivemembers"] = [];
    this.model["offshore"] = false;
    this.model["sector"] = [];
    this.model["redeployable"] = false;
    this.model["hotbookfilter"] = null;
    this.selectedHotbooks = [];
    this.model["deliverymodelid"] = null;
    this.model["interviewlevel"] = null;
    this.model.ismanual = false;
  }

  resetModel() {
    this.model["query"] = "";
    this.model["selectedSearchType"] = "";
    this.model['isJump'] = false;
    this.clearAdvancedSearchParams();
    this.totalResults = null;
    this.candidateResults = null;
    this.model["interviewlevel"] = null;
    this.model["deliverymodelid"] = null;
  }


  onSearchClicked() {
    this.model["pagecode"] = this.pageCodeMetalbool;
    this.model["requisitionid"] = this.requisitionid;
    this.model["pageindex"] = this.pageIndex;
    this.model["pagesize"] = this.pagesize;
    //   this.metalboolForm.value["type"] = this.selectedSearchType;
    //  console.warn(this.metalboolForm.value);
    this.pageTrackMetalBoolean(this.requisitionid);
    this.setHotbookFilter();

        
      this.busy = this.jobboardservice.getCandidatesForMetalBooleanSearch(this.model).subscribe(
            (res:any)=> {
                
                let response = JSON.parse(res._body)["response"];
              if (response) {
                //  debugger;
                this.candidateResults = response.metalcandidates ? response.metalcandidates : [];
                this.totalResults = response.totalprofilesfound;
                this.aigenerated = response.aigenerated;
                this.highlightskillsarray = JSON.parse(res._body)['response']['highlightskills']
                  if (!this.totalResults) {
                      this.message = "No Candidates Found. Try modifying your search."
                  }
                }
                else {
                    this.candidateResults = null;
                  this.totalResults = 0;
                  if (response.message) {
                      this.message = response.message;
                  }
              }
             
            },
          err=> {
              console.log("Error fetching candidate results");
              this.candidateResults = null;
              this.totalResults = 0;
          }
        );
    }

  setHotbookFilter() {
    if (this.selectedHotbooks) {
      if (this.selectedHotbooks.length == 0) {
        this.model["hotbookfilter"] = null;
      }
      else if (this.selectedHotbooks.length == 1) {
        this.model["hotbookfilter"] = this.selectedHotbooks[0].split(" ")[0];
      }
      else if (this.selectedHotbooks.length == 2) {
        this.model["hotbookfilter"] = ["Both"][0];
      }
    }
 

  }

  pageTrackMetalBoolean(requisitionid) {
    let payload = {
      pagename: "CandidateSearch",
      actionname: null,
      objecttype: null,
      objectid: requisitionid,
    };
    this.busy = this.jobboardservice.pageTracker(payload).subscribe(
      (res: any) => {
        this.pageTrackerResp = JSON.parse(res._body)["response"];
      },
      (err) => {

      }
    );
  }

  onCandidateSelected(event) {

    let candidateid = event.candidateid;
    if (event.isChecked)
      this.selectedCandidates.push(candidateid);
    else {
      let index = this.selectedCandidates.indexOf(candidateid);
      if (index > -1) {
        this.selectedCandidates.splice(index, 1);
      }
    }
  }

  onPageChanged(event) {
    this.pageIndex = event;
    this.onSearchClicked();
  }

  onSourceBtnClicked(event) {

    let requestbody = {
      "requisitionid": this.requisitionid,
      "candidateid": this.selectedCandidates,
      "sourcefrom": "Metal"
    }

        this.busy = this.jobboardservice
            .sourceMatchingCandidates(requestbody).subscribe(
                (res: any) => {
                    debugger;
                    let sourceCandidatesResp = JSON.parse(res._body)["response"];
                    if (sourceCandidatesResp) {
                        // this.router.navigateByUrl('/apps/recoverview?requisitionid=' + this.data.requisitionid);
                        // window.location.reload();
                      
                        this.popupConfig.title = "Success!";
                        this.popupConfig.message = "Successfully Sourced Candidates " ;
                        this.popupConfig.type = "success";
                        //  this.popupConfig.isConfirm = true;
                        this.openPopup();
                      //  this.pageReset();
                    }
                    else {
                        
                        this.popupConfig.title = "Error Occurred !";
                        this.popupConfig.message = "Failed to Source Candidates -" + sourceCandidatesResp.message;
                        this.popupConfig.type = "error";
                        //  this.popupConfig.isConfirm = true;
                        this.openPopup();
                    }


        },
        (err) => {
          let sourceCandidatesResp = JSON.parse(err._body)["response"];
          this.popupConfig.title = "Error Occurred !";
          this.popupConfig.message = "Failed to Source Candidates -" + sourceCandidatesResp.message;
          this.popupConfig.type = "error";
          //  this.popupConfig.isConfirm = true;
          this.openPopup();
          console.log(err);
        }

      );
  }
  pageReset() {
    this.candidateResults = [];
    this.selectedCandidates = [];
    this.metalboolForm.reset();
    this.selectedSearchType = 1;
  }


  openPopup(closePopup?: boolean) {
    let ngbModalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false
    };

    let modalRef = this._modalService.open(this.content, ngbModalOptions);

  }

    ngOnDestroy(): void {
        if (this.busy)
            this.busy.unsubscribe();
    }


    onEditClick(){
        this.searchInputDisabled = false;
      
    }

    onKeywordSearchTyped() {
        if (this.model.query !== this.searchquery)
          this.model.isedited = true;
    }
}
