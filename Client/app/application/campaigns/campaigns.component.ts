import {
    Component, OnInit, Input, ViewChild, AfterViewInit,
    ChangeDetectorRef, OnDestroy
  } from '@angular/core'; import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { CampaignsService } from './campaigns.service';
  
  @Component({
    selector: 'app-campaigns',
    template: `<router-outlet></router-outlet>`,
    providers: [CampaignsService],
  
  
  })
  export class CampaignsComponent implements OnInit {
    
    constructor( public route: Router) {  }
  
    ngOnInit() {
    
    }
    
  
    
   
    
  }
  