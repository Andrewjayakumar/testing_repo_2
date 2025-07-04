import { Component, OnInit, Input } from '@angular/core';
import { JobboardsearchService } from '../jobboardsearch.service';
import { LocalStoreManager } from '../../../core/authservice/local-store-manager.service';
import { DBkeys } from '../../../core/authservice/db-Keys';

@Component({
  selector: 'app-jobboard-parent',
  templateUrl: './jobboard-parent.component.html',
    styleUrls: ['./jobboard-parent.component.scss'],
    providers: [JobboardsearchService]
})
export class JobboardParentComponent implements OnInit {
    @Input('requisitionid') requisitionid: any = null;
    @Input() isNewCandidateDashboard: boolean = false;
    currentTab: string = 'metal_match';
    showClassic: boolean = true;
    boolean_searchQuery = "";

    metalmatchdata = { "requisitionid": null };
    tab: number = 1;
    showDice = false;
     

    constructor(private jobboardService: JobboardsearchService, private localstorage: LocalStoreManager) {

        let dicestatus = this.localstorage.getData('showdice');
        this.showDice = dicestatus === 'true';
    }

    ngOnInit() {
        this.boolean_searchQuery = this.localstorage.getData(DBkeys.SEARCH_QUERY);
        if (this.isNewCandidateDashboard || this.boolean_searchQuery) {
          this.currentTab = "metal_boolean";
          }
        this.metalmatchdata.requisitionid = this.requisitionid ? this.requisitionid : null;
  }

  clickTab(stepValue) {
    //console.log("DATA", stepValue);
  }
}
