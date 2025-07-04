import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddRequisitionComponent } from "./add-requisition/add-requisition.component";
import { RequisitionOverviewComponent } from "./requisition-overview/requisition-overview.component";
import { MyRequisitionsComponent } from "./my-requisitions/my-requisitions.component";
import { RequisitionAdvancedSearchComponent } from "./req-adb-search/requisition-advanced-search.component";
import { CandidateMatchingComponent } from "./candidate-matching/candidate-matching.component";
import { UploadRecordingComponent } from "./upload-recording/upload-recording.component";
import { AiRequisitionMatchComponent } from './ai-requisition-match/ai-requisition-match.component';
import { NewAddRequisitionComponent } from "../requisitions/new-add-requisition/new-add-requisition.component";


const reqRoutes: Routes = [
  { path: "", component: MyRequisitionsComponent }, //redirectTo: 'myrequisitions', pathMatch: 'full'
  { path: "addupdate", component: AddRequisitionComponent },
  { path: "aimatch", component: AiRequisitionMatchComponent },
  { path: "overview", component: RequisitionOverviewComponent },
  { path: "myrequisitions", component: MyRequisitionsComponent },
  { path: "advancesearch", component: RequisitionAdvancedSearchComponent },
  { path: "candidate-matching", component: CandidateMatchingComponent },
  { path: "upload-recording", component: UploadRecordingComponent },  // apps/requisitionspage/upload-recording
  { path: "newaddupdate", component: NewAddRequisitionComponent },

];

@NgModule({
  imports: [RouterModule.forChild(reqRoutes)],
  exports: [RouterModule],
})
export class RequisitionsRoutingModule {}
