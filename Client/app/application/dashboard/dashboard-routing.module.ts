import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from '../dashboard/dashboard.component';
import { DddashboardComponent } from '../dashboard/dddashboard/dddashboard.component';
import { DmdashboardComponent } from '../dashboard/dmdashboard/dmdashboard.component';
import { RecruiterComponent } from '../dashboard/recruiter/recruiter.component';





const reqRoutes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'dddashboardnew', component: DddashboardComponent },
  { path: 'dmdashboardnew', component: DmdashboardComponent },
  { path: 'recruiterdashboardnew', component: RecruiterComponent },


];

@NgModule({
  imports: [RouterModule.forChild(reqRoutes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule { }
