import {
  Component, OnInit, Input, ViewChild, AfterViewInit,
  ChangeDetectorRef, OnDestroy
} from '@angular/core'; import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from "../../core/authservice/auth.service";
import { UUID } from "angular2-uuid";
import { Subscription, Subject } from 'rxjs';
import { LocalStoreManager } from '../../core/authservice/local-store-manager.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';

import { DBkeys } from '../../core/authservice/db-Keys';
import { Location } from '@angular/common';
import { DataService } from '../../core/services/data.service';
import { TagdashboardService } from './tagdashboard.service';


@Component({
  selector: 'app-taguser',

    template: `<router-outlet></router-outlet>`,
    providers: [TagdashboardService]

})
export class TaguserComponent implements OnInit {
  
    constructor(public route: Router) {
        
    }

  ngOnInit() {
     
  }
  

  
 
  
}
