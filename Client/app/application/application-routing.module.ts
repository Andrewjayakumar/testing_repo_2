import { Routes, RouterModule } from "@angular/router";
import { ApplicationComponent } from "./application.component";
import { AppsComponent } from "./apps/apps.component";
import { CandidateComponent } from "./candidate/candidate.component";
import { RequisitionsComponent } from "./requisitions/requisitions.component";
import { AddRequisitionComponent } from "./requisitions/add-requisition/add-requisition.component";
import { RequisitionOverviewComponent } from "./requisitions/requisition-overview/requisition-overview.component";
import { MyRequisitionsComponent } from "./requisitions/my-requisitions/my-requisitions.component";
import { RequisitionAdvancedSearchComponent } from "./requisitions/req-adb-search/requisition-advanced-search.component";
import { GoogleskysearchComponent } from "./candidate/googleskysearch/googleskysearch.component";
import { AuthGuard } from "../core/authservice/auth-guard.service";
import { HotBooksComponent } from "./hotbooks/hotbooks.component";
import { CandidatelistHotbooksComponent } from "./hotbooks/candidatelist-hotbooks/candidatelist-hotbooks.component";
import { HotbooksDashboardComponent } from "./hotbooks/hotbooks-dashboard/hotbooks-dashboard.component";
import { DemandPlanningComponent } from "./hotbooks/demand-planning/demand-planning.component";
import { CandidateMatchingComponent } from "./requisitions/candidate-matching/candidate-matching.component";
import { CandidateAssignmentComponent } from "./campaigns/candidate-assignment/candidate-assignment.component";
import { CampaignsComponent } from "./campaigns/campaigns.component";
import { TagdashboardComponent } from './taguser/tagdashboard/tagdashboard.component';
import { MypoolComponent } from './taguser/mypool/mypool.component';
import { TaguserComponent } from './taguser/taguser.component';
import { NewCandidateSearchComponent } from './candidate/new-candidate-search/new-candidate-search.component';
import { AdvancedsearchComponent } from './candidate/advancedsearch/advancedsearch.component';
import { RedeploymentComponent } from './redeployment/redeployment.component';
import { CandidatetoReqComponent } from './redeployment/candidatetoreq/candidatetoreq.component';
import { InterviewComponent } from "./interview/interview.component";
import { AiRequisitionMatchComponent } from './requisitions/ai-requisition-match/ai-requisition-match.component';
import { DashboardComponent } from '../../../Client/app/application/dashboard/dashboard.component';
import { NewAddRequisitionComponent } from '../../../Client/app/application/requisitions/new-add-requisition/new-add-requisition.component';

 
const ApplicationRouting: Routes = [
  {
    path: "apps",
    component: ApplicationComponent,
    children: [],
  },
    {
       path: "candidate",
        component: CandidateComponent,
        canActivate: [AuthGuard],
        children: [
            { path: "", component: CandidateComponent },
            { path: "advancedsearch", component: AdvancedsearchComponent},
            { path: "dashboardsearch", component: NewCandidateSearchComponent },
            { path: "xraysearch", component: GoogleskysearchComponent }
        ]

  },

    {
        path: "requisitionspage",
        component: RequisitionsComponent,
        children: [
      { path: "overview", component: RequisitionOverviewComponent },
      { path: "aimatch" , component: AiRequisitionMatchComponent},
      { path: "addupdate", component: AddRequisitionComponent },
      { path: "", component: MyRequisitionsComponent },
      { path: "myrequisitions", component: MyRequisitionsComponent },
      { path: "advancesearch", component: RequisitionAdvancedSearchComponent },
      { path: "candidate-matching", component: CandidateMatchingComponent },
      { path: "newaddupdate", component: NewAddRequisitionComponent },

    ]
  },
  {
    path: "interview",
    canActivate: [AuthGuard],
    component: InterviewComponent,
    children: [],
  },
  {
    path: "hotbooks",
    canActivate: [AuthGuard],
    component: HotBooksComponent,
    children: [
      { path: "", component: CandidatelistHotbooksComponent },
      { path: "dashboard", component: HotbooksDashboardComponent },
      { path: "demandplanning", component: DemandPlanningComponent },
    ],
  },
  {
    path: "redeployment",
    canActivate: [AuthGuard],
    component: RedeploymentComponent,
    children: [
      { path: "candidatetoreq", component: CandidatetoReqComponent },

    ],
  },
  {
    path: "campaigns",
    component: CampaignsComponent,
    children: [
      { path: 'candidatesassignment', component: CandidateAssignmentComponent }
    ],
    },
    {
        path: "tag",
        canActivate: [AuthGuard],
        component: TaguserComponent,
        children: [
            { path: "", component: TagdashboardComponent },
            { path: 'dashboard', component: TagdashboardComponent },
            { path: 'mypool', component: MypoolComponent },
        ]
  },
  {
    path: "newdashboard",
    component: DashboardComponent,
    children: [
      { path: "", component: DashboardComponent },

    ],
  },
  {
    path: "**",
    component: AppsComponent,
    children: [],
  },
  //,
  //{
  //  path: 'apps/:model/:action/:id/:dataid', component: ApplicationComponent,
  //  children: []
  //}
];
//export class ApplicantRoutingModule { }
export const Applicationrouting = RouterModule.forChild(ApplicationRouting);
