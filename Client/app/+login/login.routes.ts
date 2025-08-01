import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';

const routes: Routes = [
   { path: '', component: LoginComponent },
    {
        path: '', component: LoginComponent,
        children:
        [
            { path: ':id', component: LoginComponent }
        ]
    }
];

export const routing = RouterModule.forChild(routes);
