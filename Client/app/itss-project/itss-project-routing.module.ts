
import { Routes, RouterModule } from '@angular/router';
import { ItssprojectComponent } from './itss-project.component';
import { ItsslistComponent } from './itss-list/itss-list.component';
import { AddprojectComponent } from './add-project/add-project.component';
import { Projectsummarycomponent } from './project-summary/project-summary.component';





const itssProjectRouting: Routes = [
  {
    path: 'itss', component: ItssprojectComponent,
    children: [
    ]
  },
  {
    path: 'search', component: ItsslistComponent,
    children: []
  },
  {
    path: 'addupdate', component: AddprojectComponent,
  },
  {
    path: 'summary', component: Projectsummarycomponent
  }
];
//export class ApplicantRoutingModule { }
export const itssprojectrouting = RouterModule.forChild(itssProjectRouting);
