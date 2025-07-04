import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-new',
   templateUrl: './dashboard.component.html',
 // template: `<router-outlet></router-outlet>`,
  providers: []
})
export class DashboardComponent implements OnInit {

  constructor(private router: Router, private currentroute: ActivatedRoute) { }

  ngOnInit() {
    //  this.currentroute.parent.params.subscribe(params => console.log(params)); 
  }


}
