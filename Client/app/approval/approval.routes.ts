import { Routes, RouterModule } from '@angular/router';

import { SubmissionApproveComponent } from './submission-approve/submission-approve.component';
import { SubmissionRejectComponent } from './submission-reject/submission-reject.component';


const routes: Routes = [
 
  {
    path: '',
        component: SubmissionApproveComponent
  },
  {
      path: 'approve', component: SubmissionApproveComponent,
      children: [{ path: ':Id', component: SubmissionApproveComponent}]
  }
  ,
  {
      path: 'reject', component: SubmissionRejectComponent,
      children: [{ path: ':Id', component: SubmissionRejectComponent}]
  }
];

export const routingvalues = RouterModule.forChild(routes);
