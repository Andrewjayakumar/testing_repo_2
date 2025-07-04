import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { DashboardService } from '../dashboard.service';


@Component({
  selector: 'app-recruiter-dm',
  templateUrl: './recruiter.component.html',
  styleUrls: ['./recruiter.component.scss'],
  providers: [DashboardService]
})
export class RecruiterComponent implements OnInit {

  constructor(private router: Router, private currentroute: ActivatedRoute, private DashboardService: DashboardService) { }

  alltopfiveskil: any;
  alltopclients: any;
  alltopjoblocations: any;
  alltopjobtitles: any;
  allMyRequistions: any;
  allmylinkedinChats: any;

  ngOnInit() {
    this.gettopfiveForecast();
    this.gettopfivejobtitles();
    this.getMyRequisitions();
    this.getmyLinkedInhats();
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

  getMyRequisitions() {


    this.DashboardService.getMyRequisitions().subscribe(
      (res) => {
        let resP = JSON.parse(res._body)["response"];
        this.allMyRequistions = resP;

      },
      () => {

      }
    );
  }

  getmyLinkedInhats() {


    this.DashboardService.getmyLinkedInhats().subscribe(
      (res) => {
        let resP = JSON.parse(res._body)["response"]['mailResponse'];
        this.allmylinkedinChats = resP;

      },
      () => {

      }
    );
  }
}
