import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { JobboardsearchService } from '../jobboardsearch.service';
import { DomSanitizer } from '@angular/platform-browser';
//import { ChartsModule } from 'ng2-charts';
import { BaseChartDirective } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';

//import { SingleDataSet, Label, monkeyPatchChartJsLegend } from 'ng2-charts';


//import { BaseChartDirective } from 'ng2-charts/ng2-charts';


@Component({
  selector: 'app-match-reason',
  templateUrl: './match-reason.component.html',
    styleUrls: ['./match-reason.component.scss'],
    providers: [JobboardsearchService]
})
export class MatchReasonComponent implements OnInit {
    //variables to be passed from parent
    public candidateId;
    public requisitionId;
    public candidateFullName;
     candidateMatching = false;
    reqName = null;
    reqDescription = null;

    //component global varibales
    @ViewChild(BaseChartDirective) chart: BaseChartDirective;
    public pieChartLabels: string[];
    public pieChartData: number[];
    public pieChartColor: any[];
    public pieChartType : ChartType = 'pie';

    matchingScoreDetails: any;
    busy: Subscription;
    educationDetails: any = null;
    skillsDetails: any = null;
    jobTitleDetails: any = null;
    industryDetails: any = null;
    managementDetails: any = null;
    languageDetails: any = null;
    sovrenScore: number = null;

    candidateResumeDetails: any;
    candidateresume: any;
    resumenotFound = false;
    loadingMessage: any;

    dataSets: { data: number[]; label: string; }[];
    chartOptions: { responsive: true; };
 /**   public pieChartOptions: ChartOptions = {
        responsive: true,
    };**/

    

    constructor(public modal: NgbActiveModal, private jobboardsearchService: JobboardsearchService, private sanitizer: DomSanitizer) {
        this.matchingScoreDetails = null;

        this.pieChartLabels = ['Skills', 'Job Titles', 'Education', 'Industries', 'Management', 'Languages', 'No-match'];


        this.pieChartColor = [
            {
                backgroundColor: [
                    'rgb(255, 99, 132)',
                    'rgb(75, 192, 192)',
                    'rgb(54,162,235)',
                    //'rgb(255, 159, 64)',
                    'rgb(255, 205, 86)',
                    'rgb(93, 192, 75)',
                    'rgb(255, 76, 8)',
                    'rgb(211, 211, 211)'
                ]
            }
        ];
    }

    ngOnInit() {
       

        this.pieChartData = [0, 0, 0, 0, 0, 0, 100];
        this.dataSets = [
            {
                data: this.pieChartData,
                label: 'Match Reason'
             }
        ];
        // if it is candidate matching to given requisition i.e on candidate card
        if (!this.candidateMatching) {
            this.getCandidateResume();
            this.jobboardsearchService.getSovrenMatchDetailsByCandidate(this.candidateId, this.requisitionId).subscribe(
                (res: any) => {
                    let response = JSON.parse(res._body).response;
                    this.drawChart(response);

                },
                () => { }
            );
        }

        else { // if requisitions are matching to given candidate i.e on req card
            this.showReqDescription();
            this.jobboardsearchService.getSovrenScoreDetailsForCandidate(this.candidateId, this.requisitionId).subscribe(
                (res: any) => {
                    let response = JSON.parse(res._body).response;
                    this.drawChart(response);

                },
                () => { }
            );
        }
       
    }
  
    drawChart(response) {

        if (response) {
            this.matchingScoreDetails = response.d ? response.d.result : null;
            if (this.matchingScoreDetails) {
                this.sovrenScore = this.matchingScoreDetails.sovScore;
                this.educationDetails = this.matchingScoreDetails.education;
                this.jobTitleDetails = this.matchingScoreDetails.jobTitle;
                this.skillsDetails = this.matchingScoreDetails.skills;
                this.industryDetails = this.matchingScoreDetails.industries;
                this.managementDetails = this.matchingScoreDetails.managementLevel;

                let skillScore = this.skillsDetails ? this.skillsDetails.score : 0;
                let jobtitleScore = this.jobTitleDetails ? this.jobTitleDetails.score : 0;
                let educationScore = this.educationDetails ? this.educationDetails.score : 0;
                let industryScore = this.industryDetails ? this.industryDetails.score : 0;
                let managementexpScore = this.managementDetails ? this.managementDetails.score : 0;
                let languageScore = this.languageDetails ? this.languageDetails.score : 0;

                const grayPart = 100 - (skillScore + jobtitleScore + educationScore + industryScore + managementexpScore + languageScore);
                this.pieChartData = [Math.round(skillScore), Math.round(jobtitleScore), Math.round(educationScore), Math.round(industryScore), Math.round(managementexpScore), Math.round(languageScore), Math.round(grayPart)];
            }

        }
    }

    getCandidateResume() {
        this.loadingMessage = true;
        this.busy = this.jobboardsearchService.getCandidateResume(this.candidateId,true)
          .subscribe(
            (res: any) => {
              this.candidateResumeDetails = JSON.parse(res._body)['response'];
              if (this.candidateResumeDetails.resume) {
                this.candidateresume = this.sanitizer.bypassSecurityTrustHtml(this.candidateResumeDetails.resume);
                this.resumenotFound = false;
                this.loadingMessage = false;
    
              }
              else {
                this.resumenotFound = true;
                this.loadingMessage = false;
    
              }
           },
            err => {
              console.log(err);
              this.loadingMessage = false;
    
            },
            () => {
            }
          );
    }

    showReqDescription() {
        // req description not available in req card
        // TODO call edit req API to fetch the details
    }


    public chartClicked(e: any): void {
      //  console.log(e);
    }

    public chartHovered(e: any): void {
      //  console.log(e);
    }

}
