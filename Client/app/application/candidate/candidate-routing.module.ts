import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewCandidateSearchComponent } from './new-candidate-search/new-candidate-search.component';
import { CandidateComponent } from './candidate.component';
import { GoogleskysearchComponent } from './googleskysearch/googleskysearch.component';
import { AdvancedsearchComponent } from './advancedsearch/advancedsearch.component';



const candRoutes: Routes = [
    { path: '', component: CandidateComponent },
    { path: "advancedsearch", component: AdvancedsearchComponent },
    { path: 'dashboardsearch', component: NewCandidateSearchComponent },
    { path: "xraysearch", component: GoogleskysearchComponent }
    
];

@NgModule({
    imports: [RouterModule.forChild(candRoutes)],
  exports: [RouterModule]
})
export class CandidateRoutingModule { }
