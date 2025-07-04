import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from "../../../core/authservice/auth.service";
import { UtilityService } from '../../../core/services/utility.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  @Input() private navItems: any;
  @Input() private headerType: any;
    @Input() private nochat: boolean = false;
  
  constructor(private utilityService: UtilityService, private auth: AuthService) { }

  ngOnInit() {

  }
  chat() {
    this.utilityService.loadScript('./assets/js/aria-chat-script.js');
    (<any>window).intercomSettings = {
      // app_id: "upqlfony",
      app_id: "ca3cptoy",
      name: this.auth.currentUser ? this.auth.currentUser.Fist_name : '', // Full name
      email: this.auth.currentUser ? this.auth.currentUser.email : '', // Email address
      custom_launcher_selector: "#chatLink",
      application: "METal"
    };
    }

    notifyParentLink(event) {
        
        debugger;
       
        let parents = event.path;

        let menuheader = parents.find(this.getSidebar);
        if (menuheader) {
            let existingHighlight = menuheader.getElementsByClassName('current-selection');

            existingHighlight.forEach(x => {
                x.classList.remove('current-selection');
            });
        }
        let parentDropdown = parents.find(this.getParentElement);
        if (parentDropdown) {
            let iconLink = parentDropdown.getElementsByClassName('nav-link')[0];
            iconLink.classList.add('current-selection');
        }
       
    }

    getSidebar = function (el) {
        if (el.outerHTML.indexOf('app-header-with-sidebar') > -1) { return el; }
    }

    getParentElement = function (el) {
        if (el.classList && el.className.indexOf('custom-dropdown') >-1) { return el; }
    }
}
