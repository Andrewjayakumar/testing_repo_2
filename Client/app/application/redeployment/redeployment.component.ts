import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RedeploymentService } from '../redeployment/redeployment.service';

@Component({
  selector: 'app-redeployment',
  template: `<router-outlet></router-outlet>`,
  providers: [RedeploymentService]
})
export class RedeploymentComponent implements OnInit {

  constructor(private router: Router, private currentroute: ActivatedRoute) { }

  ngOnInit() {

  }

}
