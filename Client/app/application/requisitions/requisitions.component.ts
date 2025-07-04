import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { RequisitionsService } from './requisitions.service';

@Component({
    selector: 'app-requisitions',
 //   templateUrl: './requisitions.component.html',
    template: `<router-outlet></router-outlet>`,
    providers: [RequisitionsService]
})
export class RequisitionsComponent implements OnInit {

    constructor(private router:Router, private currentroute: ActivatedRoute) { }

    ngOnInit() {
      //  this.currentroute.parent.params.subscribe(params => console.log(params)); 
  }

    HandleRouterChange(event) {
        let urlRoute = event.url;
        let param = event.param;
        switch (urlRoute) {
            case '/apps/recoverview':
                let url = urlRoute + '?requisitionid=' + param;
                this.router.navigateByUrl(url);
                break;

            case '/apps/requisitions':
                this.router.navigateByUrl(urlRoute);
                break;
            default: break;
        }
    }
}
