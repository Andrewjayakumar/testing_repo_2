import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MypoolComponent } from './mypool/mypool.component';
import { TagdashboardComponent } from './tagdashboard/tagdashboard.component';


const tagRoutes: Routes = [
    { path: "", component: TagdashboardComponent }, 
    { path: "dashboard", component: TagdashboardComponent },
    { path: "mypool", component: MypoolComponent }
  
];

@NgModule({
  imports: [RouterModule.forChild(tagRoutes)],
  exports: [RouterModule],
})
export class TagRoutingModule {}
