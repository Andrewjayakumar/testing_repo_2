import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CandidateAssignmentComponent } from './candidate-assignment/candidate-assignment.component';

const hbRoutes: Routes = [

    { path: 'candidatesassignment', component: CandidateAssignmentComponent }

];

@NgModule({
    imports: [RouterModule.forChild(hbRoutes)],
  exports: [RouterModule]
})
export class CampaignsRoutingModule { }
