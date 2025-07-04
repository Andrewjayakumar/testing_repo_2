import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RedeploymentComponent } from '../redeployment/redeployment.component';
import { CandidatetoReqComponent } from '../redeployment/candidatetoreq/candidatetoreq.component';
//import { ReqVerificationComponent } from '../redeployment/req-verification/req-verification.component';



const reqRoutes: Routes = [
  { path: "", component: RedeploymentComponent },
  { path: "candidatetoreq", component: CandidatetoReqComponent },
  //{ path: "advancedsearch", component: ReqVerificationComponent }

 
];

@NgModule({
  imports: [RouterModule.forChild(reqRoutes)],
  exports: [RouterModule],
})
export class RedeploymentRoutingModule { }
