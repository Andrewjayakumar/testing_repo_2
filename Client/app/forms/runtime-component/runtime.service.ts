import { Injectable } from '@angular/core';
import { MetalMatchComponent } from '../../application/jobboardsearch/metal-match/metal-match.component';
import { HotbooksDashboardComponent } from '../../application/hotbooks/hotbooks-dashboard/hotbooks-dashboard.component';


@Injectable()
export class RuntimeService {

    constructor() { }

    /**
     * CAll the below method from panel-ui.component 
     *  Point to NOTE - if the componenet is a modal it cant be rendered inside the panel
     * @param classname
     */

    getComponent(classname) {
        debugger;
        switch (classname) {
          
           /* case 'CandidatesubmissionComponent':  
                return CandidatesubmissionComponent;
                break; */
            case 'MetalMatchComponent':
                return MetalMatchComponent;
            case 'HotbooksDashboardComponent':
                return HotbooksDashboardComponent;
               
            default:
                //break;
                return null;
        }
    }

}
