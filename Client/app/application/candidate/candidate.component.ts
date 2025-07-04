import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { AuthService } from "../../core/authservice/auth.service";
import { UtilityService } from '../../core/services/utility.service';
import { UUID } from "angular2-uuid";

@Component({
    selector: 'app-candidate',
    templateUrl: './candidate.component.html',
    styleUrls: ['./candidate.component.scss']
})
export class CandidateComponent implements OnInit {

    constructor(private auth: AuthService, public route: Router, public utilityService: UtilityService) { }

    ngOnInit() {
      //  console.log("Candidate COmponent Instantiated");
    }

    HandleRouterChange(event, urlRoute, param) {
        switch (urlRoute) {
            case '/apps/recoverview':
                let url = urlRoute + '?requisitionid=' + param;
                this.route.navigateByUrl(url);
                break;
            default: break;
        }
    }

    PinItem(data: any) {
        /**
         * data = { id :3124 , name: "CAndidate Name" , category : "candidate"}
         * */
        let objid = data.id;
        let objname = data.name;
        let category = data.category;
        if (category === "candidate") {
            var candidate = {
                "id": UUID.UUID(),
                "url": "apps/candidateprofile",
                "title": objname,
                "subtitle": "candidate profile",
                "icon": "user-o",
                "params": [
                    { "name": "candidateid", "id": UUID.UUID(), "value": objid } //ae6778e4-f270-9eaa-2572-4b9e64862419
                ],
                "openinpopup": true,
                "popupparams": { value: objid, key: "candidateid", formid: "d7a61781-95a4-49cd-ad15-824de4462233" }
            };
            this.pinClickedHandler(candidate, objid);
        }
        else if (category === "requisition") {
            var requisition = {
                "icon": "fa fa-list-alt",
                "id": UUID.UUID(),
                "title": objname,
                "subtitle": "jobtitle",
                "params": [{ "name": "requisitionid", "id": "5c5c593a-e4aa-8ed9-437e-fa6947a15e38", "value": objid }],
                "url": "apps/recoverview"
            };
            this.pinClickedHandler(requisition, objid);
        }
    }

    public pinClickedHandler(pinObject: any, uniqid: Number) {

        if (pinObject && pinObject.params) {
            let primaryKey = pinObject.params[0].name;
            let primaryKeyValue = pinObject.params[0].value;
            //  if (!this.isbookmarked(pinObject, primaryKey, primaryKeyValue)) {
            //      this.auth.AddtoBookmark(pinObject);
            //  }
            this.auth.AddtoBookmark(pinObject);
        }
    }

}
