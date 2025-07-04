import { Component, OnInit } from "@angular/core";
import { AddprojectService } from "../add-project/add-project.service";
import { Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { LocalStoreManager } from "../../core/authservice/local-store-manager.service";


@Component({
    selector: 'project-summary',
    templateUrl: './project-summary.component.html',
    styleUrls: ['./project-summary.component.scss'],
    providers: [ AddprojectService],
  
  
  })
  export class Projectsummarycomponent implements OnInit {
    activeRole:number;
    isPageLoading:boolean =false;
    busy:Subscription;
    projectid:any;
    projectDetails:any;
    reqLists:any;
    currentTab: string = 'summaryTab';
    projecttype:string;
    currentPage: number = 1;
    totalReqLists: number ;
    currentPageList:any;
    maxSize=10;
    pageSize = 10;
  showreqButton: any;
  
   

    constructor(private projectService: AddprojectService, private router: Router, private localStore:LocalStoreManager, private activeRoute:ActivatedRoute){}
    ngOnInit(): void {

      this.activeRoute.queryParams.subscribe(params => {
        this.projectid = parseInt(params['projectid']);
      });

      let current_user_data = this.localStore.getData('current_user');
      this.activeRole = current_user_data.activerole;
        current_user_data.roles.forEach((element) => {
          if (current_user_data.activerolename == element.rolename) {
            if (element.allowaddprojectrequisition == "true") {

            this.showreqButton = true;
          } else {
            this.showreqButton = false;

          }
        }
      });
   

      this. getProjectDetails();

    }
 
  

    getProjectDetails(){
      this.isPageLoading = true;
      this.busy =
        this.projectService.getProjectDetailsById(this.projectid).subscribe(
          (res: any) => {

            this.projectDetails = JSON.parse(res._body).response;
            this.projecttype=this.projectDetails.projecttype 

           
          },
          () => {
            this.isPageLoading = false;
          }
        );
    }

    getReqLists(){
      this.isPageLoading = true;
      this.busy =
        this.projectService.getReqListById(this.projectid).subscribe(
          (res: any) => {

            this.reqLists = JSON.parse(res._body).response;
            this.totalReqLists = this.reqLists.length;
            this.onPageChange(this.currentPage);
     
           
          },
          () => {
            this.isPageLoading = false;
          }
        );
    }
    
    onPageChange(page:any) {
      this.currentPage = page;
      const startIndex = (page - 1) * this.pageSize;
      const endIndex = startIndex + this.pageSize;
      this.currentPageList = this.reqLists.slice(startIndex, endIndex);
   
   
    }

    showAlert(req: any): void {
      const confirmation = window.confirm('Are you sure you want to leave this page?');
      
      if (confirmation) {
      
        const queryParams = { requisitionid: req.requisitionid };
       
        this.router.navigate(['/apps/recoverview'], { queryParams });
      }
    }
    }
