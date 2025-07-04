import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidatelistHotbooksComponent } from './candidatelist-hotbooks/candidatelist-hotbooks.component';
import { HotbooksDashboardComponent } from './hotbooks-dashboard/hotbooks-dashboard.component';
import { DemandPlanningComponent } from './demand-planning/demand-planning.component';


const hbRoutes: Routes = [
    { path: '', component: CandidatelistHotbooksComponent },
    
    { path: 'dashboard', component: HotbooksDashboardComponent },

    { path: 'demandplanning', component: DemandPlanningComponent }

    
];

@NgModule({
    imports: [RouterModule.forChild(hbRoutes)],
  exports: [RouterModule]
})
export class HotbooksRoutingModule { }
