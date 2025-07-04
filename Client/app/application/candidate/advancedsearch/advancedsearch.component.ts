import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild, ElementRef, Renderer2, transition, trigger, style, animate } from '@angular/core';
declare var $: any;
import { CandidateService } from './../candidate.service';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
import value from '*.json';
import { Router } from '@angular/router';


@Component({
  selector: 'app-advancedsearch',
  templateUrl: './advancedsearch.component.html',
  styleUrls: ['./advancedsearch.component.scss'],
    providers: [CandidateService],
    animations: [
        trigger(
            'inOutAnimation',
            [
                transition(
                    ':enter',
                    [
                        style({ height: 0, opacity: 0 }),
                        animate('500ms ease-out',
                            style({ height: 220, opacity: 1 })) //14rem
                    ]
                ),
                transition(
                    ':leave',
                    [
                        style({ height: 220, opacity: 1 }),
                        animate('500ms ease-in',
                            style({ height: 0, opacity: 0 }))
                    ]
                )
            ]
        )
    ]
})


export class AdvancedsearchComponent implements OnInit, AfterViewInit, OnDestroy {
  Message: string = "";
  busy: Subscription;
  item = [];
  searching = false;
  searchFailed = false;
  clickedItem: string;
  skills: any;
  peopleInput$ = new Subject<string>();
  region: any;
  lobdetails: any;
  requisitionType: any;
  requisitionStatus: any;
  jobtitledetails: any;
  tcudetails: any;
  countrydetails: any;
  statesdetails: any;
  statecode: any;
  rForm: FormGroup;
  candidatename: string = '';
  submitteddrom: any;
  submitteddate: any;
  interviewfromdate: any;
  interviewtodate: any;
  candidatestatusArray = [];
  skillsArray = [];
  jobtitleId: any;
  RecStatusArray = [];
  tcuidarray = [];
  statesArray = [];
  regionIdArray = [];
  finalresultObject: any
  clientlobid: any;
  candidateid: any;
  expand: any;
  finalresultData=[];
  errorMessage: any;
  requisitionTypeIdArray = [];
  finalresultobjectClient: any;
  finalresultDataClient: any;
  finalresultcount: any;
  clientId: any;
  totalresultCount: any;
  currentuser_id: '';
  showLoader = false;
  priorityDetails: any;
  exporttoXL = false;
  assignedToSelected: any;
  clientNameDetails: any;
  errorMessagefromServer: any;
  current_user_obj: any;
  page = 1;
  dateholder: any;
  showLoaderforloadmore = false;
  loadmore = true;
  pageIndexClient = 1;
  finalresultDataClientValues = [];
  employmentTpeDetails: any;
  hiredtodate: any;
    hiredfromdate: any;
  isExport = 0;
  actionDashboardMenu: boolean = false;



  constructor(public _appService: CandidateService, private fb: FormBuilder, private localStorage: LocalStoreManager, private router: Router) { }

  ngOnInit() {
      debugger;
      this.current_user_obj = this.localStorage.getData('current_user');
      //  this.currentuser_role = this.current_user_obj.activerole;
      let index = this.current_user_obj.email.indexOf('@');
      this.currentuser_id = this.current_user_obj.email.substring(0, index);
        /**Important
        This is a quick fix to provide access to submittedby and export instead of having checks at different places.change the roleid based on name But dont write back to localstorage
        **/
      if (this.current_user_obj.activerolename && this.current_user_obj.activerolename.indexOf('Analyst') != -1) {
          this.current_user_obj.activerole = 4;
      }

    this.candidatesearchForm();
    this.getcandidateStatus();
    this.gettheskills();
    this.getregion();
    this.getlob();
    this.getrequisitionType();
    this.getrequisitionStatus();
    this.getjobtitle();
    this.getthetcu();
    this.getthecountry();
    this.getthepriority();
    this.getAlltheClientNames();
    this.gettheEmploymentType();
 }
  

  candidatesearchForm() {

    this.rForm = this.fb.group({
      candidatename: [null, Validators.required],
      candidatestatusid: [[], [Validators.required]],
      submittedto: [null, Validators.required],
      interviewfrom: [null, Validators.required],
      interviewto: [null, Validators.required],
      hiredfrom: [null, Validators.required],
      hiredto: [null, Validators.required],
      submittedfrom: [null, Validators.required],
      requisitionname: [null, Validators.required],
      employmenttypeid: [null, [Validators.required]],
      //assignedto: [null, Validators.required],
      jobtitleid: [null, Validators.required],
      statusid: [[], Validators.required],
      tcuid: [[], Validators.required],
      states: [[], Validators.required],
      zipcode: [null, Validators.required],
      requisitionpriorityid: [[], [Validators.required]],
     // clientlobid: [null, Validators.required],
      regionid: [[], Validators.required],
    //  hiringmanagername: [null, Validators.required],
      name: [null, Validators.required],
     clientid: [[], Validators.required],
      requisitiontypeid: [[], [Validators.required]],
      submittedby: [null, Validators.required],
      searchtype: 0,
      categoryid: [null, Validators.required],
        city: [null, Validators.required],
        rolename: [this.current_user_obj.activerolename]

    });
  }

  ngOnDestroy() {
    this.busy.unsubscribe();
  }
  ngAfterViewInit() {

      $(document).ready(function () {
      // Add minus icon for collapse element which is open by default
      $(".collapse.show").each(function () {
        $(this).prev(".card-header").find(".fa").addClass("fa-minus").removeClass("fa-plus");
      });

      // Toggle plus minus icon on show hide of collapse element
      $(".collapse").on('show.bs.collapse', function () {
        $(this).prev(".card-header").find(".fa").removeClass("fa-plus").addClass("fa-minus");
      }).on('hide.bs.collapse', function () {
        $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
      });
    });

    $(document).ready(function () {
      $("#card1").css("center-block")
    });

    // track opening of the page
      this._appService.trackActivityPageOpened()
          .subscribe(res => { },
              err => {
                  console.log("Advanced Search tracking call failed" + err);
            });

   
  }


    //apply clicked handler
    onApplyClicked() {      
        $(".collapse.show").each(function () {
            $(this).removeClass('show');
            $(this).addClass('hide');
            $(this).prev(".card-header").find(".fa").removeClass("fa-minus").addClass("fa-plus");
        });
      this.showLoader = true;
      $('#home').addClass('active');
      $('#home').addClass('show');
      $('#client').removeClass('active');
      $('#client').removeClass('show');

   
    }

  Submittedfromdate(value) {
    this.submitteddrom = '';

    if (value) {
     // var tzoffset = (new Date()).getTimezoneOffset() * 60000; 
     // this.submitteddrom = new Date(`${value.year}-${value.month}-${value.day}`).toISOString();
      this.dateholder = (`${value.year}-${value.month}-${value.day}`);
      this.submitteddrom = (new Date(this.dateholder)).toISOString();

    }
}

  submittedTo(value) {
    this.submitteddate = '';
    this.dateholder = '';
    if (value) {
     /// this.submitteddate = new Date(`${value.year}-${value.month}-${value.day}`).toISOString();
     // var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      this.dateholder = (`${value.year}-${value.month}-${value.day}`);
      this.submitteddate = (new Date(this.dateholder)).toISOString();

    }
  }
  interviewFrom(value) {
    this.interviewfromdate = '';
    this.dateholder = '';


    if (value) {
    //  this.interviewfromdate = new Date(`${value.year}-${value.month}-${value.day}`).toISOString();
      var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
      this.interviewfromdate = (new Date(this.dateholder - tzoffset)).toISOString();


    }
  }
  interviewTo(value) {
    debugger;
    this.interviewtodate = '';
    this.dateholder = '';
    if (value) {
     // this.interviewtodate = new Date(`${value.year}-${value.month}-${value.day}`).toISOString();
     // var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      this.dateholder = (`${value.year}-${value.month}-${value.day}`);
      this.interviewtodate = (new Date(this.dateholder)).toISOString();


    }
  }

  hiredFrom(value) {
    this.hiredfromdate = '';
    this.dateholder = '';
    if (value) {
      // this.interviewtodate = new Date(`${value.year}-${value.month}-${value.day}`).toISOString();
    //  var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      this.dateholder = (`${value.year}-${value.month}-${value.day}`);
      this.hiredfromdate = (new Date(this.dateholder)).toISOString();
      

    }
  }

  hiredTo(value) {
    this.hiredtodate = '';
    this.dateholder = '';
    if (value) {
      // this.interviewtodate = new Date(`${value.year}-${value.month}-${value.day}`).toISOString();
     // var tzoffset = (new Date()).getTimezoneOffset() * 60000;
      this.dateholder = new Date(`${value.year}-${value.month}-${value.day}`);
      this.hiredtodate = (new Date(this.dateholder)).toISOString();


    }
  }
  addclassandRemove() {
    $(document).ready(function () {
      $('#apply').click(function () {
        $(this).addClass('active');
        $(this).addClass('show');
      });
    });
  }

  addPost(value) {
    this.errorMessage = false;
      this.errorMessagefromServer = '';
      if (value == 'apply') {
          this.rForm.value['searchtype'] = 0;
          this.finalresultDataClientValues = [];
        this.finalresultData = [];
       this.addclassandRemove();
       
  
      }
   if (value == 'candidate') {
     this.rForm.value['searchtype'] = 0;
     this.finalresultDataClientValues = [];
   }
  
   if (value == 'client') {
     this.rForm.value['searchtype'] = 2;

     this.showLoader = true;
     this.finalresultData = [];
     $('#client').addClass('active');
     $('#client').addClass('show');
     $('#home').removeClass('active');
     $('#home').removeClass('show');

    } 
     

  this.rForm.value['submittedfrom'] = this.submitteddrom;
  this.rForm.value['submittedto'] = this.submitteddate;
  this.rForm.value['interviewfrom'] = this.interviewfromdate;
  this.rForm.value['interviewto'] = this.interviewtodate;
    if(this.hiredfromdate) {
      this.rForm.value['hiredfrom'] = this.hiredfromdate;

    }

    if(this.hiredtodate) {
      this.rForm.value['hiredto'] = this.hiredtodate;

    }

    if (this.rForm.value.candidatestatusid) {
      this.rForm.value.candidatestatusid.forEach(element => {
        if (element.StatusId) {
          this.candidatestatusArray.indexOf(element.StatusId) === -1 && this.candidatestatusArray.push(element.StatusId);

        }
      });
    }
    /*
    if (this.rForm.value.skills) {
      this.rForm.value.skills.forEach(element => {
       // this.skillsArray.push(element.skill);
        if (element.skill) {
          this.skillsArray.indexOf(element.skill) === -1 && this.skillsArray.push(element.skill);

        }
      });
    }
    */
    if (this.rForm.value.statusid) {
      this.rForm.value.statusid.forEach(element => {
       // this.RecStatusArray.push(element.id);
        if (element.id) {
          this.RecStatusArray.indexOf(element.id) === -1 && this.RecStatusArray.push(element.id);

        }
      });
    }
    if (this.rForm.value.tcuid) {
      this.rForm.value.tcuid.forEach(element => {
       // this.tcuidarray.push(element.id);
        if (element.id) {
          this.tcuidarray.indexOf(element.id) === -1 && this.tcuidarray.push(element.id);

        }
      });
    }
    if (this.rForm.value.states) {
      this.rForm.value.states.forEach(element => {
        //this.statesArray.push(element);
        if (element) {
          this.statesArray.indexOf(element) === -1 && this.statesArray.push(element);

        }
      });
    }
    if (this.rForm.value.regionid) {
      this.rForm.value.regionid.forEach(element => {
       // this.regionIdArray.push(element.id);
        if (element.id) {
          this.regionIdArray.indexOf(element.id) === -1 && this.regionIdArray.push(element.id);

        }
      });
    }
    if (this.rForm.value.requisitiontypeid) {
      this.rForm.value.requisitiontypeid.forEach(element => {
       // this.requisitionTypeIdArray.push(element.id);
        if (element.id) {
          this.requisitionTypeIdArray.indexOf(element.id) === -1 && this.requisitionTypeIdArray.push(element.id);

        }

      });
    }
    this.rForm.value['candidatestatusid'] = this.candidatestatusArray;
   // this.rForm.value['skills'] = this.skillsArray;
    this.rForm.value['jobtitleid'] = this.jobtitleId;
    this.rForm.value['statusid'] = this.RecStatusArray;
    this.rForm.value['tcuid'] = this.tcuidarray;
    this.rForm.value['states'] = this.statesArray;
    this.rForm.value['regionid'] = this.regionIdArray;
   // this.rForm.value['clientlobid'] = this.clientlobid;
      this.rForm.value['requisitiontypeid'] = this.requisitionTypeIdArray;
        
      if (this.clickedItem) {
          this.rForm.value['submittedby'] = this.clickedItem;
      }
      else if (this.current_user_obj.activerole === 8 && !this.isExport) {
        this.rForm.value['submittedby'] = this.currentuser_id;
    }
  /*
    if (this.assignedToSelected) {
      this.rForm.value['assignedto'] = this.assignedToSelected;

    }
    */
    this.rForm.value['unresponded'] = null;
    this.rForm.value['partiallyresponded'] = null;
    this.rForm.value['remotelocationdetails'] = [];
    this.rForm.value['isw3submission'] = null;
    this.rForm.value['requisitionsearchbasedon'] = 0;
    this.rForm.value['w3submissionstatus'] = "";
    if (value === 'client') {
      this.rForm.value['pageindex'] = this.pageIndexClient;

    }
    else {
      this.rForm.value['pageindex'] = this.page;

    }

    
    this.rForm.value['pagesize'] = 20;
   // this.rForm.value['clientid'] = null;
    if (value == 'excel') {
      this.rForm.value['export'] = true;
     }

  this.busy =  this._appService.getAllSearchResults(this.rForm.value)
      .subscribe(
        res => {
          if (value === 'client') {
            if (JSON.parse(res._body)['response']) {
              this.finalresultobjectClient = JSON.parse(res._body)['response'];

            }
            if (this.finalresultobjectClient && this.finalresultobjectClient[0]) {
                this.loadmore = true;
                this.isExport = this.finalresultobjectClient[0].isexport;
               this.finalresultobjectClient.forEach(item => {
                this.finalresultDataClientValues.push(item);
              });
              if (this.finalresultobjectClient[0]) {
                this.finalresultcount = this.finalresultobjectClient[0].totalrecord;

              }
            }
         
       
            
            if (JSON.parse(res._body)['responsecode'] == 500 || JSON.parse(res._body)['response'].length == 0) {
              
              if (JSON.parse(res._body)['response'].length == 0 && this.pageIndexClient >= 2) {
                this.errorMessage = true;
                this.loadmore = false;
                this.pageIndexClient = 1;
              }
              else {
                this.errorMessage = true;
                this.finalresultDataClientValues = [];
                this.finalresultcount = '';
              }
              if (JSON.parse(res._body)['message']) {
                this.errorMessagefromServer = JSON.parse(res._body)['message'];
                this.errorMessage = false;
              }

            }
          }
          else if (value == 'excel') {
            alert(JSON.parse(res._body)['message']);
          }
          else {
            if (JSON.parse(res._body)['response']) {
              this.finalresultObject = JSON.parse(res._body)['response'];

            }
            if (this.finalresultObject && this.finalresultObject[0]) {
              this.loadmore = true;
              this.finalresultObject[0].results.forEach(item => {
                this.finalresultData.push(item);
              });
             // this.finalresultObject[0].results = this.finalresultObject[0].results;
                this.finalresultcount = this.finalresultObject[0].totalrecord;
                this.isExport = this.finalresultObject[0].isexport;
            }
            if (JSON.parse(res._body)['responsecode'] == 500 || JSON.parse(res._body)['response'].length == 0) {
             
              if (JSON.parse(res._body)['response'].length == 0 && this.page >= 2) {
                this.errorMessage = true;
                this.loadmore = false;
                this.page = 1;
              }
              else {
                this.errorMessage = true;
                this.finalresultData = [];
                this.finalresultcount = '';
              }
              if (JSON.parse(res._body)['message']) {
                this.errorMessagefromServer = JSON.parse(res._body)['message'];
                this.errorMessage = false;
              }
            }

          }
   
              
        },
        err => {
          console.log(err);
        },
          () => {
            this.showLoader = false;
            this.showLoaderforloadmore = false;
        }
      );

  }

  // load more items
  loadMoreItems(value, val) {
    if (val == 'client') {
      this.pageIndexClient = this.pageIndexClient + 1;
    }
    else {
      this.page = this.page + 1;

    }
    if(val && value) {
      this.addPost(val);
      this.showLoaderforloadmore = true;
      this.loadmore = true;
    }
  }

  removeItemfromArray(val) {
    this.candidatestatusArray = this.candidatestatusArray.filter(item => item !== val.value.StatusId);
  }

  statesremove(value) {
    this.statesArray = this.statesArray.filter(item => item !== value.value.stateid);
  }

  removeDuplicateTcuId(value) {
    this.tcuidarray = this.tcuidarray.filter(item => item !== value.value.id);

  }
  removedupicateskills(value) {
    this.skillsArray = this.skillsArray.filter(item => item !== value.value.skill);

  }

  reqstatusremove(value) {
    this.RecStatusArray = this.RecStatusArray.filter(item => item !== value.value.id);

  }

  reqTyperemove(value) {
    this.requisitionTypeIdArray = this.requisitionTypeIdArray.filter(item => item !== value.value.id);

  }
  regionReove(value) {
    this.regionIdArray = this.regionIdArray.filter(item => item !== value.value.id);

  }
  getthejobtitleId(value) {
    this.jobtitleId = '';
    if (value) {
      this.jobtitleId = value.id;
    }

  }

  gettheclientlobId(value) {
    this.clientlobid = '';
    if (value) {
      this.clientlobid = value.id;
    }
  }

  // Reset the Form
  resetForm() {
    this.rForm.reset();
    this.skillsArray = [];
    this.RecStatusArray = [];
    this.tcuidarray = [];
    this.statesArray = [];
    this.regionIdArray = [];
    this.candidatestatusArray = [];
    this.finalresultDataClient = [];
    this.finalresultData = [];
    this.clickedItem = '';
    this.assignedToSelected = '';
    this.countrydetails = [];
    this.finalresultobjectClient = [];
    this.finalresultcount = [];
    this.page = 1;
    this.finalresultDataClientValues = [];
    this.requisitionTypeIdArray = [];
  
    if (this.current_user_obj && this.current_user_obj.activerole === 8) {
      
      this.rForm.patchValue({
        submittedby: this.currentuser_id

      });

    }

   
   
}
  expandResults(id,candidateID,value) {
    this.candidateid = '';
    if (id) {
    //  this.candidateid = `${id}${candidateID}`;
      let sum = id + candidateID
      this.candidateid = +sum;

      if (value.target.id == this.candidateid) {
        this.candidateid = '';
      }
    
    
    }
  }

  expandresultsClient(id,value) {
    this.clientId = '';
    if (id) {
      this.clientId = id;
     // this.expand = !this.expand;
      if (value.target.id == this.clientId) {
        this.clientId = '';
      }

    }

  }
  // for candidate status

    getcandidateStatus() {
    let apiparam: any = {};
      this.busy = this._appService.getcandidateStatus(apiparam)
      .subscribe(
        (res: any) => {
          this.Message = JSON.parse(res._body)['response'];
                    console.log("done");

         
         
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
    }

  // get the skills


  gettheskills() {
    let apiparam: any = {};
    this.busy = this._appService.gettheskills(apiparam)
      .subscribe(
        (res: any) => {
          this.skills = JSON.parse(res._body)['response'];
         // console.log("skills is", this.skills);

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }
  formatMatches = (value: any) => value.recruiter || '';
 
 search = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>
      
        this._appService.getsubmittedBy(term, { "clientid": "" }, {"name":""})
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))
     .do(() => this.searching = false);

  // for Assigned to

  formatsubmitMatches = (value: any) => value.recruiter || '';

  assignedto = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .do(() => this.searching = true)
      .switchMap(term =>

        this._appService.getassignedTo(term, { "clientid": "" }, { "name": "" })
          .do(() => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))
      .do(() => this.searching = false);

  // for Region

  getregion() {
    let apiparam: any = {};
    this.busy = this._appService.getregion(apiparam)
      .subscribe(
        (res: any) => {
          this.region = JSON.parse(res._body)['response'];
        //  console.log("Region is", this.region);

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // for LOB

  getlob() {
    let apiparam: any = {};
    this.busy = this._appService.getlob(apiparam)
      .subscribe(
        (res: any) => {
          this.lobdetails = JSON.parse(res._body)['response'];
         // console.log("Region is", this.region);

        },
        err => {
        //  console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // Get Requisition Type

  getrequisitionType() {
    let apiparam: any = {};
    this.busy = this._appService.getrequisitionType(apiparam)
      .subscribe(
        (res: any) => {
          this.requisitionType = JSON.parse(res._body)['response'];
        
        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // Get Requisition Status

  getrequisitionStatus() {
    let apiparam: any = {};
    this.busy = this._appService.getrequisitionStatus(apiparam)
      .subscribe(
        (res: any) => {
          this.requisitionStatus = JSON.parse(res._body)['response'];
      
        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // Get Job Title

  getjobtitle() {
    let apiparam: any = {};
    this.busy = this._appService.getjobtitle(apiparam)
      .subscribe(
        (res: any) => {
          this.jobtitledetails = JSON.parse(res._body)['response'];
         

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // Get the TCU

  getthetcu() {
    let apiparam: any = {};
    this.busy = this._appService.getthetcu(apiparam)
      .subscribe(
        (res: any) => {
          this.tcudetails = JSON.parse(res._body)['response'];
        

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // Get the country
  getthecountry() {
    let apiparam: any = {};
    this.busy = this._appService.getthecountry(apiparam)
      .subscribe(
        (res: any) => {
          this.countrydetails = JSON.parse(res._body)['response'];
         

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // Get the employment Type
  gettheEmploymentType() {
    let apiparam: any = {};
    this.busy = this._appService.gettheEmploymentType()
      .subscribe(
        (res: any) => {
          this.employmentTpeDetails = JSON.parse(res._body)['response'];


        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }


  getstatecode(value) {
    this.statecode = '';
    if (value) {
      this.statecode = value.id;
      this.getthestates();
      
    }
  }
  // get the states
  getthestates() {
 
    this.busy = this._appService.getthestates(this.statecode)
      .subscribe(
        (res: any) => {
          this.statesdetails = JSON.parse(res._body)['response'];
         
        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // to get the Priority

  getthepriority() {

    this.busy = this._appService.getthepriority()
      .subscribe(
        (res: any) => {
          this.priorityDetails = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }

  // get clientNames

  getAlltheClientNames() {

    this.busy = this._appService.getAlltheClientNames()
      .subscribe(
        (res: any) => {
          this.clientNameDetails = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
          //console.log("done");
        }
      );
  }
  resultFormatBandListValue(value: any) {
    return value.name;
  }

  inputFormatBandListValue(value: any) {

    if (value.name)
      return value.name
    return value;
  }

  // for selecting Submitted Value
  selectedItem(item) {
    this.clickedItem = '';
    if (item) {
      this.clickedItem = item.item.recruiter;

    }
  }

  // for assigned to value
  selectAssignedTo(item) {
    this.assignedToSelected = '';
    if (item) {
      this.assignedToSelected = item.item.recruiter;

    }
  }

  onActionClicked(id) {
    if (id) {
      let urlRoute = '/apps/recoverview';
      let url = urlRoute + '?requisitionid=' + id;
      this.router.navigateByUrl(url);
    }
  }

}
