import { Component, OnInit } from '@angular/core';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
import { AuthService } from '../../../core/authservice/auth.service';

@Component({
  selector: 'app-demand-planning',
  templateUrl: './demand-planning.component.html',
  styleUrls: ['./demand-planning.component.scss']
})
export class DemandPlanningComponent implements OnInit {

    current_user_role: any = 8;

    constructor(private localStorage: LocalStoreManager, private _authservice: AuthService,) {
        let current_user = this.localStorage.getData('current_user');

        this.current_user_role = current_user.activerole;
        let index = current_user.email.indexOf('@');
        //this.current_userid = current_user.email.substring(0, index);}
    }
  ngOnInit() {
  }

}
