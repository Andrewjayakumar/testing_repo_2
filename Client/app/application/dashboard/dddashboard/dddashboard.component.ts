import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'app-dashboard-dd',
  templateUrl: './dddashboard.component.html',
  // template: `<router-outlet></router-outlet>`,
  providers: [DashboardService]
})
export class DddashboardComponent implements OnInit {

  constructor(private router: Router, private currentroute: ActivatedRoute, private DashboardService: DashboardService) { }

  alltopfiveskil: any;
  alltopclients: any;
  alltopjoblocations: any;
  alltopjobtitles: any;

  ngOnInit() {

    this.gettopfiveForecast();
    this.gettopfivejobtitles();
    this.gettopfiveClientst();
    this.gettopfiveLocations();
  }


  gettopfiveForecast() {


    this.DashboardService.gettopfiveForecast().subscribe(
      (res) => {
        let resP = JSON.parse(res._body);
        this.alltopfiveskil = [
          {
            "img": "https://collaberablobmetalprd.blob.core.windows.net/metaldashboard/top-skill-1.png",
            "kpi": "Management-1"
          },
          {
            "img": "https://collaberablobmetalprd.blob.core.windows.net/metaldashboard/top-skill-2.png",
            "kpi": "Engineering-1"
          },
          {
            "img": "https://collaberablobmetalprd.blob.core.windows.net/metaldashboard/top-skill-3.png",
            "kpi": "Sql-1"
          },
          {
            "img": "https://collaberablobmetalprd.blob.core.windows.net/metaldashboard/top-skill-4.png",
            "kpi": "Java-1"
          },
          {
            "img": "https://collaberablobmetalprd.blob.core.windows.net/metaldashboard/top-skill-5.png",
            "kpi": "Architecture-1"
          }
        ]

      },
      () => {

      }
    );
  }

  gettopfivejobtitles() {


    this.DashboardService.gettopfivejobtitles().subscribe(
      (res) => {
        let resP = JSON.parse(res._body);
        this.alltopjobtitles = [
          {
            "img": "https://collaberablobmetalprd.blob.core.windows.net/metaldashboard/top-job-title-1.png",
            "kpi": "Developer"
          },
          {
            "img": "https://collaberablobmetalprd.blob.core.windows.net/metaldashboard/top-job-title-2.png",
            "kpi": "Business Analyst"
          },
          {
            "img": "https://collaberablobmetalprd.blob.core.windows.net/metaldashboard/top-job-title-3.png",
            "kpi": "Project Manager"
          },
          {
            "img": "https://collaberablobmetalprd.blob.core.windows.net/metaldashboard/top-job-title-4.png",
            "kpi": "Data Analyst"
          },
          {
            "img": "https://collaberablobmetalprd.blob.core.windows.net/metaldashboard/top-job-title-5.png",
            "kpi": "Software Developer"
          }
        ]

      },
      () => {

      }
    );
  }

  gettopfiveLocations() {

    
    this.DashboardService.gettopfiveLocations().subscribe(
      (res) => {
        let resP = JSON.parse(res._body);
        this.alltopjoblocations = [
          {
            "img": "https://collaberablobstrg.blob.core.windows.net/metalblobcontainer/clientlogos/client_icon.png",
            "kpi": "Charlotte"
          },
          {
            "img": "https://collaberablobstrg.blob.core.windows.net/metalblobcontainer/clientlogos/client_icon.png",
            "kpi": "Seattle"
          },
          {
            "img": "https://collaberablobstrg.blob.core.windows.net/metalblobcontainer/clientlogos/client_icon.png",
            "kpi": "Redmond"
          },
          {
            "img": "https://collaberablobstrg.blob.core.windows.net/metalblobcontainer/clientlogos/client_icon.png",
            "kpi": "Chicago"
          },
          {
            "img": "https://collaberablobstrg.blob.core.windows.net/metalblobcontainer/clientlogos/client_icon.png",
            "kpi": "New York"
          }
        ]

      },
      () => {

      }
    );
  }

  gettopfiveClientst() {


    this.DashboardService.gettopfiveClientst().subscribe(
      (res) => {
        let resP = JSON.parse(res._body);
        this.alltopclients = [
          {
            "img": "https://collaberablobstrg.blob.core.windows.net/metalblobcontainer/clientlogos/client_icon.png",
            "kpi": "Accenture"
          },
          {
            "img": "https://collaberablobstrg.blob.core.windows.net/metalblobcontainer/clientlogos/client_icon.png",
            "kpi": "Ibm"
          },
          {
            "img": "https://collaberablobstrg.blob.core.windows.net/metalblobcontainer/clientlogos/client_icon.png",
            "kpi": "Wells Fargo"
          },
          {
            "img": "https://collaberablobstrg.blob.core.windows.net/metalblobcontainer/clientlogos/client_icon.png",
            "kpi": "Pontoon-Bank Of America  (Fka Adecco-Boa)"
          },
          {
            "img": "https://collaberablobstrg.blob.core.windows.net/metalblobcontainer/clientlogos/client_icon.png",
            "kpi": "Microsoft Contractor Hub-Ags"
          }
        ]

      },
      () => {

      }
    );
  }
}
