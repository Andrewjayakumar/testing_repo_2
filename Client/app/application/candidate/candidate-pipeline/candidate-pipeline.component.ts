import { Component, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { CandidatepipelineService } from '../candidatepipeline.service';
import { PipelineCardComponent } from '../pipeline-card/pipeline-card.component';

@Component({
  selector: 'app-candidate-pipeline',
  templateUrl: './candidate-pipeline.component.html',
    styleUrls: ['./candidate-pipeline.component.scss'],
    providers: [CandidatepipelineService]
})
export class CandidatePipelineComponent implements OnInit{
  allcandidates: any = [];
  @ViewChild(PipelineCardComponent) pipelineCard: PipelineCardComponent;


  constructor(public cpservice: CandidatepipelineService) {
    debugger;
  }

  @Input('requisitionid') requisitionid = null;
  @Input('requisitionDetails') requisitionDetails = null;

    listofCandidates:any [];
    public sourcedCandidates = [];
    public submitCandidates = [];
    public interviewCandidates = [];
    public hiredCandidates = [];
    public rejectedCandidates = [];

  ngOnInit() {
    debugger;
      this.getCandidateList();
  }



    refreshCAndidateList() {
        this.getCandidateList();
    }

    getCandidateList() {
      this.cpservice.getAllPipelineCandidates(this.requisitionid).subscribe(
        (res:any) => {
            let response = JSON.parse(res._body)["response"];

            let allcandidates = response ? response : [];
            if (allcandidates.length > 0) {
                this.sourcedCandidates = allcandidates.filter(x => x.candidatestatus.toLowerCase() == 'sourced');
                this.submitCandidates = allcandidates.filter(x => x.candidatestatus.toLowerCase() == 'in process');
                this.interviewCandidates = allcandidates.filter(x => x.candidatestatus.toLowerCase() == 'interview');
                this.rejectedCandidates = allcandidates.filter(x => x.candidatestatus.toLowerCase() == 'rejected');
                this.hiredCandidates = allcandidates.filter(x => x.candidatestatus.toLowerCase() == 'hired');
            }
                
        }
      );
    }

}
