import { Component, OnInit } from '@angular/core';
import { DataService } from '../core/services/data.service';
import { routerTransition, hostStyle } from '../router.animations';

@Component({
  selector: 'appc-home',
  styleUrls: ['./home.component.scss'],
  templateUrl: './home.component.html',
  animations: [routerTransition()],
  // tslint:disable-next-line:use-host-property-decorator
  host: hostStyle()
})
export class HomeComponent implements OnInit {
    formBuilderJson: any
    OnboardJson: any;
    ErrorMsg: string;
    DataJson: any = {
        "CreateEndpointParams": [],
        "UpdateEndpointParams": [],
        "GetEndpointParams": [],
        "DeleteEndpointParams": [],
        "ListEndpointParams": [],
        "id": "8a4163bd-d6f7-42b2-847f-1bc29f66ece4"
    }
    id: string = "8a4163bd-d6f7-42b2-847f-1bc29f66ece4";
    constructor(public _appService: DataService) {
        //this.GetMetadata(this.id);
        // this.GetOnboardProfile();
    }
    ngOnInit() {
          
    }

    GetOnboardProfile() {

        this._appService.get("api/manage/getonboard")
            .subscribe(
            data => {
                this.OnboardJson = data;

            });
    }
    GetMetadata(id: string) {
        //this.formBuilderJson = null
        //let apiparam = {};
        //apiparam.id = id;
        //this._appService.get("api/AppData/get", apiparam)
        //    .subscribe(
        //    data => {
        //        this.formBuilderJson = data
        //    },
        //    err => {
        //        console.log(err);
        //        this.ErrorMsg = err;
        //    },
        //    () => {
        //        console.log("done")
        //    }
        //    );
    }
}
