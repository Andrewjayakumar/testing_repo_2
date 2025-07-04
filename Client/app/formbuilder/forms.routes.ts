/// <reference path="update/update.component.ts" />
import { Routes, RouterModule } from '@angular/router';

import { FormsComponent } from './forms.component';
// import { FormeditorComponent } from '../forms/formeditor/formeditor.component';
import { UpdateComponent } from './update/update.component';
const routes: Routes = [
  {
    path: '', component: UpdateComponent, //default load forms list 
  },
  {
    path: '', component: FormsComponent,
    children: [
      { path: 'Edit', component: FormsComponent }
    ]
  },
  {
    path: 'forms', component: FormsComponent,
    children: [
      { path: 'Edit', component: FormsComponent }
    ]
  },
  {
    path: 'forms', component: FormsComponent, //Navigate to formBuilder
    children: [
      { path: 'Edit/:id', component: FormsComponent }
    ]
  },
  {
    path: '', component: FormsComponent, //Navigate to formBuilder
    children: [
      { path: 'Edit/:id', component: FormsComponent }
    ]
  }
];

export const routing = RouterModule.forChild(routes);
