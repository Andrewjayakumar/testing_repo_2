import { Routes, RouterModule } from '@angular/router';

import { ThankyouComponent } from './thank-you/thankyou.component';

const routes: Routes = [
  {
    path: '',
    component: ThankyouComponent
  },
  {
    path: 'action',
    component: ThankyouComponent
  },
  {
    path: '', component: ThankyouComponent,
    children: [{path: ':vendorAttestationId', component: ThankyouComponent}]
  }
  ,
  {
    path: '', component: ThankyouComponent,
    children: [{path: ':candidateattestationid', component: ThankyouComponent}]
  }
];

export const routing = RouterModule.forChild(routes);
