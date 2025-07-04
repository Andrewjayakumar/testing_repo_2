import { Component, OnInit, AfterViewInit, NgZone,Input} from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AuthService } from '../../core/authservice/auth.service';
import { AddCandidate } from '../../application/candidate/add-candidate/add-candidate.component';
import { LocalStoreManager } from '../../core/authservice/local-store-manager.service';
import { User } from '../../core/models/user.model';
import { Subscription } from "rxjs/Subscription";
import { DataService } from '../../core/services/data.service';




@Component({
    selector: 'appc-footer',
    styleUrls: ['./footer.component.scss'],
    templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit, AfterViewInit {
  showChatGPTButton: boolean = false;
  @Input('showreqmenuItem') showreqmenuItem: boolean;
  busy: Subscription;
  Roles: any;




  constructor(public router: Router, public _modalService: NgbModal, private auth: AuthService, private localStorage: LocalStoreManager, private _appService: DataService) {

 
}

    actionDashboardMenu: boolean = false;
    userLoggedIn: boolean = false;
    showaddreqoption: boolean;
    current_user_obj: any;

  ngOnInit() {
    debugger;
  
    this.current_user_obj = JSON.parse(localStorage.getItem('allowrequisitioncreation'));

  }

    ngAfterViewInit(): void {
        if (this.auth.isLoggedIn)
            this.userLoggedIn = true;

      let current_user: User = this.localStorage.getData('çurrent_user');
        
      this.showChatGPTButton = current_user ? current_user.activerole == '13' : false;

  }



    goToAddRec() {
        this.router.navigateByUrl("apps/requisitionspage/addupdate");
        this.actionDashboardMenu = false;
    }

    addCandidate() {
        let ngbModalOptions: NgbModalOptions = {
            backdrop: 'static',
            keyboard: false,
            size: 'lg',
            windowClass: 'activity-modal'
            //  scrollable: true
        };
        const modalRef = this._modalService.open(AddCandidate, ngbModalOptions);
        modalRef.componentInstance.name = 'addcandidate';
        this.actionDashboardMenu = false;
    }

    goToAIChatGPT() {
        this.router.navigateByUrl("apps/requisitionspage/createedit");
  }

  openMenu() {
    let hideoption = JSON.parse(localStorage.getItem('allowrequisitioncreation'));
    if (hideoption) {

    }
    console.log("getting in open menu", this.current_user_obj);
    console.log("getting in open menu", hideoption);

    this.current_user_obj = hideoption;
    console.log("getting in open menu", this.current_user_obj);


  }


  goNewToAddRec() {
    this.router.navigateByUrl("apps/requisitionspage/newaddupdate");
  }


}
