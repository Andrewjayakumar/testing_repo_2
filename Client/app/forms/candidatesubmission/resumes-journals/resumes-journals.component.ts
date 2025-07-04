import { Component, OnInit, Input } from '@angular/core';
import { Subscription, Subject } from 'rxjs';
import { SubmitcandidateService } from "../submitcandidate.service";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-resumes-journals',
  templateUrl: './resumes-journals.component.html',
  styleUrls: ['./resumes-journals.component.scss'],
  providers: [SubmitcandidateService]
})
export class ResumesJournalsComponent implements OnInit {

  busy: Subscription;
  @Input("requisitionid") public requisitionid: any = 0;
  @Input("candidateid") public candidateid: any = 0;
  @Input("pageerrors") public pageerrors = "";
  metalResumeDetails: any;
  metalresume: any;
  monsterResumeDetails: any;
  monsterresume: any;
  noMetalResume = false;
  noMonsterResume = false;
  noCBResume = false;
  noDiceResume = false;
  loadingMetal: any;
  loadingMonster: any;
  loadingCB: any;
  cbResumeDetails: any;
  cbresume: any;
  loadingDice: any;
  diceResumeDetails: any;
  diceresume: any;
  journalDetails: any = null;
  mainJournalType: any;
  subJournalType: any;
  journalTypeList: any = null;
  subJournalTypeList: any = null;
  statusList: any = null;
  statusType: any = null;
  reqList: any = null;

  journalData = {
    "candidateId": 0,
    "mainJournalType": [],
    "subJournalType": []
  }

  constructor(public _service: SubmitcandidateService, private sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getMetalResume();
    this.getMainJournalsList();
    this.getReqs();
    this.getStatus();
  }

  getMetalResume() {
    this.loadingMetal = true;
    this.busy = this._service.getResume(this.candidateid,70,true)
      .subscribe(
        (res: any) => {
          this.metalResumeDetails = JSON.parse(res._body)['response'];
          if (this.metalResumeDetails.resume) {
            this.metalresume = this.sanitizer.bypassSecurityTrustHtml(this.metalResumeDetails.resume);
            this.noMetalResume = false;
            this.loadingMetal = false;

          }
          else {
            this.noMetalResume = true;
            this.loadingMetal = false;

          }
       },
        err => {
          console.log(err);
          this.loadingMetal = false;

        },
        () => {
        }
      );
}

getMonsterResume() {
  this.loadingMonster = true;
  this.busy = this._service.getResume(this.candidateid,4,true)
    .subscribe(
      (res: any) => {
        this.monsterResumeDetails = JSON.parse(res._body)['response'];
        if (this.monsterResumeDetails.resume) {
          this.monsterresume = this.sanitizer.bypassSecurityTrustHtml(this.monsterResumeDetails.resume);
          this.noMonsterResume = false;
          this.loadingMonster = false;

        }
        else {
          this.noMonsterResume = true;
          this.loadingMonster = false;

        }
     },
      err => {
        console.log(err);
        this.loadingMonster = false;

      },
      () => {
      }
    );
}

getCbResume() {
  this.loadingCB = true;
  this.busy = this._service.getResume(this.candidateid,2,true)
    .subscribe(
      (res: any) => {
        this.cbResumeDetails = JSON.parse(res._body)['response'];
        if (this.cbResumeDetails.resume) {
          this.cbresume = this.sanitizer.bypassSecurityTrustHtml(this.cbResumeDetails.resume);
          this.noCBResume = false;
          this.loadingCB = false;

        }
        else {
          this.noCBResume = true;
          this.loadingCB = false;

        }
     },
      err => {
        console.log(err);
        this.loadingCB = false;

      },
      () => {
      }
    );
}

getDiceResume() {
  this.loadingDice = true;
  this.busy = this._service.getResume(this.candidateid,3,true)
    .subscribe(
      (res: any) => {
        this.diceResumeDetails = JSON.parse(res._body)['response'];
        if (this.diceResumeDetails.resume) {
          this.diceresume = this.sanitizer.bypassSecurityTrustHtml(this.diceResumeDetails.resume);
          this.noDiceResume = false;
          this.loadingDice = false;

        }
        else {
          this.noDiceResume = true;
          this.loadingDice = false;

        }
     },
      err => {
        console.log(err);
        this.loadingDice = false;

      },
      () => {
      }
    );
}

getMainJournalsList() {
  this.busy = this._service.getMainJournals().subscribe(
    (res: any) => {
      let body = JSON.parse(res["_body"]);
      if (body.response) {
        this.journalTypeList = body.response ? body.response : "";
      }
    }
  );
}

getSubJournals(event) {
  let GroupId = event.categoryid;
  this.busy = this._service.getSubJournals(GroupId).subscribe(
    (res: any) => {
      let body = JSON.parse(res["_body"]);
      if (body.response) {
        this.subJournalTypeList = body.response ? body.response : "";
      }
    }
  );
}

getJournals() {
  this.journalData.candidateId = this.candidateid ? this.candidateid : 0;
  if(this.mainJournalType) {
    this.journalData['mainJournalType'].push(this.mainJournalType);
  } else {
    this.journalData.mainJournalType = [];
  }

  if(this.subJournalType) {
    this.journalData['subJournalType'].push(this.subJournalType);
  } else {
    this.journalData.subJournalType = [];
  }

  this.busy = this._service.getJournals(this.journalData).subscribe(
    (res: any) => {
      let body = JSON.parse(res["_body"]);
      if (body.response) {
        let journals = body.response ? body.response : "";
        this.journalDetails = journals.matchJournals;
      }
    }
  );
}

resetJournals() {
  this.mainJournalType =  null;
  this.subJournalType = null;
  this.getJournals();
}

getStatus() {
  this.busy = this._service.getStatus().subscribe(
    (res: any) => {
      let body = JSON.parse(res["_body"]);
      if (body.response) {
        this.statusList = body.response ? body.response : "";
      }
    }
  );
}


getReqs() {
  this.busy = this._service.getReqs(this.candidateid, this.statusType).subscribe(
    (res: any) => {
      let body = JSON.parse(res["_body"]);
      if (body.response) {
        this.reqList = body.response ? body.response : "";
      }
    }
  );
}

resetReqs() {
this.statusType = null;
this.getReqs();
}

}
