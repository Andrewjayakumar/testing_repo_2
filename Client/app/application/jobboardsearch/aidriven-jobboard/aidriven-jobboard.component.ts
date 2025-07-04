import { Component, OnInit, Input } from '@angular/core';
import { JobboardsearchService } from '../jobboardsearch.service';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
import { DBkeys } from '../../../core/authservice/db-Keys';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-aidriven-jobboard',
  templateUrl: './aidriven-jobboard.component.html',
  styleUrls: ['./aidriven-jobboard.component.scss'],
  providers: [JobboardsearchService]
})
export class AidrivenJobboardComponent implements OnInit {
    @Input('requisitionid') requisitionid: any = null;
    viewMore: boolean = false;
    currentTab: string = 'metal_match';
    isAIDrivenUser = true;
    boolean_searchQuery = "";
    busy:Subscription;

    metalmatchdata = { "requisitionid": null };
    tab: number = 1;
    showDice = false;
 
    constructor(private localstorage: LocalStoreManager, private jobboardservice:JobboardsearchService) {
        let dicestatus = this.localstorage.getData('showdice');
        this.showDice = dicestatus === 'true';
    }

  ngOnInit() {
    debugger;
        if (!this.isAIDrivenUser) {
            this.boolean_searchQuery = this.localstorage.getData(DBkeys.SEARCH_QUERY);
            if (this.boolean_searchQuery) {
                this.currentTab = "metal_boolean";
            }
        }

        else {
          this.getBooleanSearchQuery();
          
        }

        this.metalmatchdata.requisitionid = this.requisitionid ? this.requisitionid : null;
  }



  getBooleanSearchQuery() {

    this.busy = this.jobboardservice.getBooleanQuery(this.requisitionid)
      .subscribe(
        (res: any) => {
          if(res){
          this.boolean_searchQuery = JSON.parse(res._body)['response'][0]['booleanquery'];
          }

        },
        err => {
          console.log(err);

        },

      );

  }

  

  //will execute only if Boolean searchQuery not generated instantly on creation of req in some cases
  getSearchQuery(){
    if(!this.boolean_searchQuery && this.isAIDrivenUser){
      this.getBooleanSearchQuery();
    }
  }
}
