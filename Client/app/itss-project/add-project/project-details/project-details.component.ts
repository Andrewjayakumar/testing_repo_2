import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy, Input, Output, SimpleChanges, EventEmitter, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Subject } from 'rxjs';
//import { NgbPaginationConfig } from '@ng-bootstrap/ng-bootstrap';
declare var $: any;
import { Observable } from 'rxjs';
import { ItssService } from '../../../itss-project/itss-list/itss.service';
import { WizardComponent } from 'angular-archwizard';
import { AddprojectService } from '../add-project.service';
import { AddProjSharedService } from '../../add-project/addProj.shared.service';
import { FormControl, Validators } from '@angular/forms';






@Component({
  selector: 'project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  providers: [AddprojectService],


})
export class ProjectdetailsComponent implements OnInit, AfterViewInit {

  busy: Subscription;
  itssprojectDetails: any;
  totalrecords: any;
  pagesize: number = 20;
  pageindex: number = 1;
  search: any;
  itssprojSearchDetails: any;
  errorMessage: any;
  projectStatus: any;
  projectType: any;
  @Output('deliveryModelUpdated') deliveryModelUpdated: EventEmitter<any> = new EventEmitter();
        

  billingType = [{ "name": " Fixed Price", "value": " Fixed Price" }, { "name": " T&M-Bulk", "value": " T&M-Bulk" }, { "name": "T&M-Individual", "value": "T&M-Individual" }];
  billingStatus = [{ "name": "Billed", "value": "Billed" }, { "name": "Unbilled", "value": "Unbilled" }, { "name": "Costed", "value": "Costed" }];

  leadSourcelist = [{ "name": "CES-DIRECT", "value": "CES-DIRECT" },
                      { "name": "ESG", "value": "ESG" },
                      { "name": "Regional", "value": "Regional" },
                      { "name": "SAT", "value": "SAT" },];

  technology = [{ "name": "Product Technology", "value": 1 },
                { "name": "Enterprise Technology", "value": 2 },
                 ];
                 
  deliveryModel = [{ "name": "US", "value": "US" },
    { "name": "Canada", "value": "Canada" },
  { "name": "India", "value": "India" },
  { "name": "LATAM", "value": "LATAM" },
  { "name": "Global", "value": "Global" },
  ];

  @ViewChild('projectDetailForm') form: any;
  nextClicked = false;
  @Output()
  onValidCheck: EventEmitter<any> = new EventEmitter(true);
  @Input('currentmode')
  mode: string = 'add';
  @ViewChild('editor') editor: ElementRef;
  @Input('isResetClicked') isResetClicked: boolean = false;
  @Input('activeRole') activeRole: string;
  



  constructor(private router: Router, private ItssService: ItssService, private AddprojectService: AddprojectService, private AddProjSharedService: AddProjSharedService) {

    this.AddProjSharedService.nextClick$.subscribe(
      () => {
        this.nextClicked = true;
        
        debugger;
        this.descriptionValidation();
        if (!this.form.valid || this.form.form.errors){
          this.onValidCheck.emit({ "isValid": false });
        }   
        else if (this.form.valid) {
          this.onValidCheck.emit({ "isValid": true, "datamodel": this.model });
        }
      }
    );
  }

  ngOnInit() {
    //  this.getAlltheItssProjects();
    this.getAllProjectStatus();
    this.getProjectTypes();
    // this.getDeliveryModelLists();
    // debugger;
  }

  getProjectTypes() {
    this.busy = this.ItssService.getProjectTypes()
      .subscribe(
        (res: any) => {
          debugger;
          this.projectType = JSON.parse(res._body)['response'];
        }
      )
  }

  getAlltheItssProjects() {
    this.search = '';

    this.busy = this.ItssService.getAlltheItssProjects()
      .subscribe(
        (res: any) => {
          this.itssprojectDetails = JSON.parse(res._body)['response'];
          if (this.itssprojectDetails && this.itssprojectDetails.length > 0) {
            this.totalrecords = this.itssprojectDetails.length;

          }
          else {
            this.errorMessage = "No Results Found!";

            setTimeout(() => {
              this.errorMessage = "";
            }, 5000);
          }
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

  getSearchResults() {


    this.busy = this.ItssService.getSearchResults(this.search)
      .subscribe(
        (res: any) => {
          this.itssprojectDetails = JSON.parse(res._body)['response'];
          if (this.itssprojectDetails && this.itssprojectDetails.length > 0) {
            this.totalrecords = this.itssprojectDetails.length;

          }
        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

  getAllProjectStatus() {


    this.busy = this.AddprojectService.getAllProjectStatus()
      .subscribe(
        (res: any) => {
          this.projectStatus = JSON.parse(res._body)['response'];

        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }

  getDeliveryModelLists() {
    this.busy = this.AddprojectService.getDeliveryModel()
      .subscribe
      (res => {
        let response = JSON.parse(res._body)['response'];
        // this.deliveryModel = response ? response : [];

      },
        err => {
          console.error("Couldnt fetch Delivery Models" + err);
        });
  }

  onDeliveryModelChange(event)
  {
    
    this.deliveryModelUpdated.emit(event.value);

  }
  exporttoexcelResults() {

    var param = {
      "searchtext": this.search
    }
    this.busy = this.ItssService.exporttoexcelResults(param)
      .subscribe(
        (res: any) => {

        },
        err => {
          console.log(err);
        },
        () => {
        }
      );
  }


  ngAfterViewInit(): void {

  }

  public model = {
    "projectid": "",
    "roleid": null,
    "projectname": null,
    "projectstatusid": null,
    "projecttype": null,
    "totalcontractnumber": new FormControl(null, [Validators.pattern(/^\d+(\.\d{1,2})?$/)]),
    "expensesbudget": null,
    "msprojecttype": null,
    "billingstatus": null,
    "noofpositions": null,
    "projectdescription": null,
    "location": null,
    "techcategory":null,
    "techcategoryid":null,
    "leadsource":null,

  };

  public resetModel () {

    this.model.projectid = "";
    this.model.roleid = null;
    this.model.projectname = null;
    this.model.projectstatusid = null;
    this.model.projecttype = null;
    this.model.totalcontractnumber = null;
    this.model.expensesbudget = null;
    this.model.msprojecttype = null;
    this.model.billingstatus = null;
    this.model.noofpositions= null;
    this.model.projectdescription = null;
    this.model.location = null;
    this.model.techcategory = null;
    this.model.techcategoryid = null;
    this.model.leadsource = null;

  };




  ngOnChanges(changes: SimpleChanges) {
    if (changes.mode) {
      debugger;
      if (changes.mode.currentValue === 'update' && changes.mode.previousValue === 'add') {
        let keys = Object.keys(this.model);
        let updateModel = this.AddProjSharedService.getFormData();
        keys.forEach(key => {
          if (updateModel[key] != null)
            this.model[key] = updateModel[key];
        });


      }

    }
    
    if(changes.isResetClicked){
      this.onReset();

    }
  }


  editorFocusOut(event) {
    let sourceEditorContent = event.srcElement.textContent.trim();
      let innerContent = event.srcElement.innerHTML.trim();

      this.model.projectdescription = innerContent; 
      if (innerContent) {
          if (innerContent.length < 500) {
              this.form.form.setErrors({ 'invalid': true });
          } else {
              this.form.form.setErrors(null);

              if (innerContent.indexOf('<') === -1 || innerContent.indexOf('>') == -1) 
              {
                  innerContent = `<p> ${innerContent} </p>`;
              }

              this.model.projectdescription = innerContent;
          }
          return;
      }
       else {
        this.form.form.setErrors({ 'invalid': true });
          return;
      }
   
  }


  descriptionValidation(){

    if(!this.model.projectdescription ){
   
      this.form.form.setErrors({ 'invalid': true });
      return false;

    }else{
      this.form.form.setErrors(null);
      return true;

    }

  }

  ValidationAllowOnlyNumber(event: any): void {
    // Allow only digits and decimal point with 1 or 2 digits after it.
    const regex = /^\d*\.?\d{0,2}$/;
  
    // Get the current value from the input
    let value = event.target.value;
  
    // Check if the value matches the regex pattern
    if (!regex.test(value)) {
      // If not, remove the last character
      value = value.slice(0, -1);
    }
  
    // Update the model with the valid value
    //this.model.totalcontractnumber = value;
    event.target.value = value;  // Sync input value with the model

   // console.log(name)
  }
  
  onTechCategory(data: any) {

    if (data) {
      this.model.techcategory = data.name;

    } else {
      this.model.techcategory = null;

    }

  }

  onProjectTypeChange(data: any) {
    if (data) {
      if (data.value === "Bulk Staffing") {
        this.model.techcategory = null;
        this.model.techcategoryid = null;
      }

    }

  }

  onReset(){
    this.form.reset();
    this.resetModel();
  }

}
