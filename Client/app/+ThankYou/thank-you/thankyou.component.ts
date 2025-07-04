import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../core/services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.scss']
})
export class ThankyouComponent implements OnInit {
  Message: string = "";
  busy: Subscription;
  constructor(private _Router: Router,
    public route: ActivatedRoute,
    public _appService: DataService) { }

  ngOnInit() {
    debugger;
    const urlParams = this._Router.url.split("?");
    if (urlParams.length > 1) {
      for (let i = 1; i < urlParams.length; i++) {
        var param = urlParams[i].split("=");
        if (param[0].toLowerCase() == "candidateattestationid") {
          this.callCandidateattestation(param[1]);
        } else if (param[0].toLowerCase() == "vendorattestationid") {
          this.callVendorAttestation(param[1]);
        } else if (param[0].toLowerCase() == "recruiterattestationid") {
          this.callRecruiterAttestation(param[1]);
        } else if (param[0].toLowerCase() == "candidatemuliattestationid") {
          this.CallMultipleAttestationStatusAsync(param[1]);
        } else if (param[0].toLowerCase() == "recruitermuliattestationid") {
          this.CallRecruiterMultipleAttestationStatusAsync(param[1]);
        }
      }
    }
  }
  callVendorAttestation(id) {
    let apiparam: any = {};
    apiparam.vendorAttestationId = id;
    this.busy = this._appService.get("http://baseurl/api/candidate/UpdateVendorAttestationStatusAsync", apiparam)
      .subscribe(
      (res: any) => {
        this.Message = res.data;
      },
      err => {
        console.log(err);
      },
      () => {
        
      }
      );
  }
  callCandidateattestation(id) {
    let apiparam: any = {};
    apiparam.candidateattestationid = id;
    this.busy = this._appService.get("http://baseurl/api/Candidate/UpdateAttestationStatusAsync", apiparam)
      .subscribe(
      (res: any) => {
        this.Message = res.data;
      },
      err => {
        console.log(err);
      },
      () => {
        //console.log("done");
      }
      );
  }
  callRecruiterAttestation(id) {
    let apiparam: any = {};
    apiparam.candidateAttestationId = id;
    this.busy = this._appService.get("http://baseurl/api/candidate/UpdateRecruiterAttestationStatusAsync", apiparam)
      .subscribe(
      (res: any) => {
        this.Message = res.data;
      },
      err => {
        console.log(err);
      },
      () => {
        //console.log("done");
      }
      );
  }
  CallRecruiterMultipleAttestationStatusAsync(id) {
    let apiparam: any = {};
    apiparam.candidateMulitpleAttestatonId = id;
    this.busy = this._appService.get("http://baseurl/api/candidate/UpdateRecruiterMultipleAttestationStatusAsync", apiparam)
      .subscribe(
      (res: any) => {
        this.Message = res.data;
      },
      err => {
        console.log(err);
      },
      () => {
        //console.log("done");
      }
      );
  }
  CallMultipleAttestationStatusAsync(id) {
    let apiparam: any = {};
    apiparam.candidateMulitpleAttestationId = id;
    ///api/Candidate/UpdateMultipleAttestationStatusAsync?candidateMulitpleAttestationId =&#39; string value&#39;
    this.busy = this._appService.get("http://baseurl/api/candidate/UpdateMultipleAttestationStatusAsync", apiparam)
      .subscribe(
      (res: any) => {
        this.Message = res.data;
      },
      err => {
        console.log(err);
      },
      () => {
        //console.log("done");
      }
      );
  }
}
