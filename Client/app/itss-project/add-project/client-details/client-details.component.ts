import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Input, Output, SimpleChanges, EventEmitter, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
//import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import { AddprojectService } from '../add-project.service';
import { of } from 'rxjs/observable/of';
import { Observable, ObservableInput } from 'rxjs/Observable';
import { filter, distinctUntilChanged, switchMap, tap, catchError, debounceTime, concat, map } from 'rxjs/operators';
import { Subscription, Subject } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { setTimeout } from 'timers';
import { AddProjSharedService } from '../../add-project/addProj.shared.service';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';




@Component({
  selector: 'client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.scss'],
  providers: [AddprojectService],


})
export class ClientdetailsComponent implements OnInit {

  busy: Subscription;
  clientlocDetails: any;
  public clientdatainput$ = new Subject<string | null>();

  public clientdata$: Observable<any>;
  isClientLoading = false;
  public hiringManagerNameinput$ = new Subject<string | null>();
  public hiringManagerName$: Observable<any>;
  
  isPracticeTowerDisabled = false;
  isHiringManagerDisabled = false;
  projectId:any;
  isClientNameLoading = false;
  clientlobDetails: any;
  clientRegionDetails: any;
  hiringManagerDetails: any;
  clientCode: any;
  otherMgrDetails: any;
  getAlltheMgrDetails: any;
  projectStatus: any;
  smclientcode:any;
  opportunityList:any;
  opportunityid:any;
  opportunityowner:any;
  saveButtonClicked:boolean = false;
  sowfileData:any;
  internalAccount:boolean = false;
  @ViewChild('clientdetailForm') form: any;
  @Output()
  onValidCheck: EventEmitter<any> = new EventEmitter();

  @Input('currentmode')
  mode: string = 'add';
  userid: any;
  
  @Input('deliverymodel') deliverymodel: any=null;

  practiceTower = [
    { "name": "Enterprise Architecture", "value": "Enterprise Architecture" },
    { "name": "Platform Engineering", "value": "Platform Engineering" },
    { "name": "Data and Insights", "value": "Data and Insights" },
    { "name": "Quality Engineering", "value": "Quality Engineering" },
    { "name": "Enterprise Solutions", "value": "Enterprise Solutions" },
    { "name": "Platform Operations", "value": "Platform Operations" },
    { "name": "Experience Engineering", "value": "Experience Engineering" },
    { "name": "Web3 & Gaming", "value": "Web3 & Gaming" },
    { "name": "AI & Data Science", "value": "AI & Data Science" },
    { "name": "Ascendion Products", "value": "Ascendion Products" },
    { "name": "Others", "value": "Others" }

   // { "name": "AI & Data Engineering", "value": "AI & Data Engineering" },
    //{ "name": "Generative AI", "value": "Generative AI" },
    //{ "name": "Engineering Management", "value": "Engineering Management" }
      ];   

  constructor(private router: Router, private AddprojectService: AddprojectService, private AddProjSharedService: AddProjSharedService, private localStorage: LocalStoreManager) {
    this.initializeTypeAheads();
    let current_user = this.localStorage.getData('current_user');
    if (current_user.email) {
      this.userid = current_user.email.split('@')[0];

    }
  }

  ngOnInit() {
    this.getSearchResults();
    this.gettheLOBDetails();
    this.gettheRegionDetails();
    this.getAlltheEmployeeDetails();
  }
  

  initializeTypeAheads() {

    this.clientdata$ = this.clientdatainput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchClientName(term))

    );


    this.hiringManagerName$ = this.hiringManagerNameinput$.pipe(
      filter(t => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.getHiringManager(term))

    );
  }

  searchClientName(term: string): ObservableInput<any> {
    if (!term)
      return of([]);

    this.isClientLoading = true;
    return this.AddprojectService.searchClientName(term, this.userid).pipe(
      map((res: any) => {
        this.isClientLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.clients : []
      })

    );
  }

  getSearchResults() {


    this.busy = this.AddprojectService.gettheClientLoc()
      .subscribe(
        (res: any) => {
          this.clientlocDetails = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

  gettheLOBDetails() {


    this.busy = this.AddprojectService.gettheLOBDetails()
      .subscribe(
        (res: any) => {
          this.clientlobDetails = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }
  gettheRegionDetails() {


    this.busy = this.AddprojectService.gettheRegionDetails()
      .subscribe(
        (res: any) => {
          this.clientRegionDetails = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }



  OnClientChanged(event) {
    if (event) {
      this.model.clientid = event.clientcode;
      this.model.smclientcode = event.smclientcode;

      this.internalAccount= event.internalaccount;


    } else {
      this.model.clientid = null;
      this.model.smclientcode = null;
      this.model.opportunityid = null;
      this.model.opportunityname = null;
      this.model.opportunityowner = null;
      this.model.managername = null;
      this.model.managercontactno = "";
      this.model.manageremail = "";
      this.model.managertitle = "";
      this.model.practicetype = null;


      this.resetHiringManagerList();
    }

    this.getOpportunityList(this.model.smclientcode);
  }
  


  OnMgrNameChanged(event) {

    if (event) {
      this.model.hiringmanagerid = event.hiringmanagerid;
      this.model.manageremail = event.hiringmanageremail;
      this.model.managercontactno =event.hiringmanagerphone;
      this.resetHiringManagerList();
    }else{
      this.model.hiringmanagerid =null;
      this.model.manageremail = "";
      this.model.managercontactno = "";
      this.model.managertitle= "";
      this.resetHiringManagerList();
    

    }

  }
  resetHiringManagerList(): void {
    this.hiringManagerName$ = this.hiringManagerNameinput$.pipe(
      switchMap((term: string) => {
        return this.getHiringManager(term);
      })
    );
  }


  getAlltheEmployeeDetails() {


    this.busy = this.AddprojectService.getAlltheEmployeeDetails()
      .subscribe(
        (res: any) => {
          this.getAlltheMgrDetails = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

  fileChange(event): void {


    const fileInput = event.target; 
    const file = fileInput.files[0];   

    if (file) {
      this.model.sowfilename = file.name;
      this.model.sowfilepath = window.URL.createObjectURL(file); 
      this.sowfileData =file;
     
    } else {
      this.model.sowfilename = ''; 
      this.model.sowfilepath = '';
      this.sowfileData =null;
    }
  }


  
  clearFile() {
    this.model.sowfilename = '';
    this.model.sowfilepath = '';
    this.sowfileData =null;
  }

      


  

  ngAfterViewInit(): void {

  }


  public model = {

    "clientname": null,
    "clientid": "",
    "clientlocation": null,
    "region": null,
    "lob": null,
    "hiringmanagerid": null,
    "managername": null,
    "managertitle": "",
    "manageremail": "",
    "managercontactno": "",
    "msbusinessdevelopmentmanager": null,
    "msengagementmanager": null,
    "collaberaprojectlead": null,
    "regionalam": null,
    "deliverymanager": null,
    "assignmentregion": "",
    "assignmentregionid": null,
    "sowfilepath": "",
    "sowfilename": "",
    "smclientcode":"",
    "opportunityid": null,
    "opportunityowner":"",
    "opportunityname":null,
    "practicetype": null,

  }

   resetModel () {

    this.model.clientname= null;
    this.model.clientid= "";
    this.model.clientlocation= null;
    this.model.region= null;
    this.model.lob= null;
    this.model.hiringmanagerid= null;
    this.model.managername= null;
    this.model.managertitle="";
    this.model.manageremail = "";
    this.model.managercontactno = "";
    this.model.msbusinessdevelopmentmanager= null;
    this.model.msengagementmanager = null;
    this.model.collaberaprojectlead = null;
    this.model.regionalam = null;
    this.model.deliverymanager = null;
    this.model.assignmentregion="";
    this.model.assignmentregionid = null;
    this.model.sowfilepath="";
    this.model.sowfilename = "";
    this.model.smclientcode="";
    this.model.opportunityid = null;
    this.model.opportunityowner = "";
    this.model.opportunityname=null;
    this.model.practicetype = null;

  }




  createProject() {
    this.saveButtonClicked = true;
    if (!this.form.valid){
      this.onValidCheck.emit({ "isValid": false });
    }
   
    else if (this.form.valid){
      //this.model['smclientcode'] = this.model.smclientcode;
    this.onValidCheck.emit({ "isValid": true, "datamodel": this.model, "sowfile": this.sowfileData });
    }
  }

  getOpportunityList(smclientcode){
    // let smclientcode= "SM-00326";
    this.busy = this.AddprojectService.getlinkedOpportunities(smclientcode,this.deliverymodel)
      .subscribe(
        (res: any) => {
          this.opportunityList = JSON.parse(res._body)['response']['opportunitylist'];

        },
        err => {
          console.log(err);
        },)


  }

  onOpportunity(event){
    if(event){

      const { opportunityid, opportunityowner,opportunityPracticeTower,opportunityHiringManagerId } = event;
      this.model.opportunityid = opportunityid;
      this.model.opportunityowner = opportunityowner;
     
      if(opportunityPracticeTower)
      {
        let practicetower =this.practiceTower.find(item => item.value == opportunityPracticeTower);
        if(practicetower)
         this.model.practicetype = opportunityPracticeTower;
       else
         this.model.practicetype = "Others";

         this.isPracticeTowerDisabled = true;

      }
      else
      {
        this.isPracticeTowerDisabled = false;
        this.model.practicetype = null;
      }

      if (opportunityHiringManagerId) {

        this.getHiringManagerBasedOnOpportunity(opportunityHiringManagerId);
  
      }
      else
      {
        this.model.managername= null;
        this.model.manageremail =null;
        this.model.managercontactno = null;
        this.isHiringManagerDisabled = false;

      }



    }else{

      this.model.opportunityid = null;
      this.model.opportunityowner = "";
      this.model.practicetype = null;
      this.model.hiringmanagerid=null;
      this.model.managername= null;
      this.model.manageremail =null;
      this.model.managercontactno = null;
      
      this.isHiringManagerDisabled = false;
      this.isPracticeTowerDisabled = false;

    }

  }


  getHiringManagerBasedOnOpportunity(opportunityHiringManagerId) {

      this.isClientNameLoading = true;
     this.AddprojectService.searchHiringManagerFrmSalesforce("", this.model.smclientcode,opportunityHiringManagerId).subscribe(
      (res: any) => {
      let  detail=JSON.parse(res._body)['response']['managerlist'];

      if(detail.length>0)
      {
        this.isClientNameLoading = false;
        this.isHiringManagerDisabled = true;
        this.model.hiringmanagerid=detail[0].hiringmanagerid;
        this.model.managername= detail[0].hiringmanagername;
        this.model.manageremail = detail[0].hiringmanageremail;
        this.model.managercontactno = detail[0].hiringmanagerphone;
      }
      else
      {
        this.isClientNameLoading = false;

        this.isHiringManagerDisabled = false;
      }

      },
      err => {
        this.isClientNameLoading = false;
        this.isHiringManagerDisabled = false;

      },)
      
  }


  onAssignmentRegion(region:any){
    
    if(region){
      this.model.assignmentregion = region.region;
    }else{
      this.model.assignmentregion = "";

    }

  }


  ngOnChanges(changes: SimpleChanges) {
 
    if (changes.mode) {
      debugger;
      
      let keys = Object.keys(this.model);
      let updateModel = this.AddProjSharedService.getFormData();
      keys.forEach(key => {
        if (updateModel[key] != null)
          this.model[key] = updateModel[key];
      });

      if (changes.mode.currentValue === 'update' && changes.mode.previousValue === 'add') {
        
        this.getOpportunityList(this.model.smclientcode)

          if(this.model.opportunityname!="No Opportunity Available")
          {
            this.isHiringManagerDisabled = true;
          }

      }
   
      

    }

    if(changes.deliverymodel)
      {    
        if(changes.deliverymodel.previousValue!=changes.deliverymodel.currentValue)
        {
          this.model.opportunityid=null;
          this.model.opportunityname = null;
          this.model.opportunityowner =null;
          this.model.managername= null;
          this.model.manageremail =null;
          this.model.managercontactno = null;
          this.isHiringManagerDisabled = false;
    
          this.getOpportunityList(this.model.smclientcode)
    
        }
       
      }

  }

 
  getHiringManager(term: string): ObservableInput<any> {
    if (!term) {
      this.isClientNameLoading = false;
      return of([]);
    }

    if (term) {
      this.isClientNameLoading = true;
      return this.AddprojectService.searchHiringManagerFrmSalesforce(term, this.model.smclientcode).pipe(
        map((res: any) => {
          this.isClientNameLoading = false;
          let resP = JSON.parse(res._body);
          return resP.response ? resP.response.managerlist : []

        })

      );

    }

  }

  OnReset(){
    this.form.reset();
    this.resetModel();
  }


}
