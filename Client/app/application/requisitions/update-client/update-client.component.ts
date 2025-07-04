
import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Subscription, Subject } from "rxjs";
import { NgForm, NgModelGroup } from "@angular/forms";
import {
  filter,
  distinctUntilChanged,
  switchMap,
  tap,
  catchError,
  debounceTime,
  concat,
  map,
} from "rxjs/operators";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable, ObservableInput } from "rxjs/Observable";
import { of } from "rxjs/observable/of";
import { RequisitionsService } from "../requisitions.service";
import { debug } from "console";

@Component({
  selector: 'app-update-client',
  templateUrl: './update-client.component.html',
  styleUrls: ['./update-client.component.scss'],
  providers: [RequisitionsService],
})

export class UpdateClientComponent implements OnInit {
  public clientinput$ = new Subject<string | null>();
  clientList: Observable<any>;

  public projectinput$ = new Subject<string | null>();
  projectList: Observable<any>;

  isClientLoading = false;
  isProjectLoading = false;

  //isCes: boolean = false; //

  selectedClient: any;
  selectedProject: any;
  selectedTower: any;
  reason: any;
  displayMessage: string = "";
  errorMessage: string = "";
  showSetButton: boolean = true;
  isUploading: boolean = false;
  clientCESObj; 
  clientList2;
  disableITSSFlag: boolean = false;

  public inputdata;
  public requisitionid;
  public candidateid;


  public towers = [
    { key: 1, value: "Platform Engineering" },
    { key: 2, value: "AI and Data Engineering"},
    { key: 3, value: "Enterprise Architecture" },
    { key: 4, value: "Quality Engineering"},
    { key: 5, value: "Enterprise Solutions"},
    { key: 6, value: "Digital Operation"},
    { key: 7, value: "ENgineering Management"},
  ];


  constructor(
    private currentRoute: ActivatedRoute,
    public activeModal: NgbActiveModal,
    private requisitionsService: RequisitionsService,
  ) {
    this.currentRoute.queryParams.subscribe((params) => {
      this.requisitionid = parseInt(params["requisitionid"]);
    });
    this.initializeTypeAheads();
  }

  ngOnInit() {  }

  // initialize type heads for search
  initializeTypeAheads() {
    this.clientList = this.clientList2 = this.clientinput$.pipe(
      filter((t) => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchClientName(term))
    );

    this.projectList = this.projectinput$.pipe(
      filter((t) => t && t.length > 1),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((term) => this.searchProjectName(term))
    );

  }

  searchClientName(term: string) {
    if (!term) return of([]);
    this.isClientLoading = true;
    return this.requisitionsService.getClientName(term).pipe(
      map((res: any) => {
        this.isClientLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.clients : [];
      })
    );
  }

  searchProjectName(term: string) {
    if(this.selectedClient){
      this.selectedClient = this.selectedClient;
    } else {
      this.selectedClient = "";
    }
    if (!term) return of([]);
    this.isProjectLoading = true;
    return this.requisitionsService.getProjectName(term, this.selectedClient).pipe(
      map((res: any) => {
        this.isProjectLoading = false;
        let resP = JSON.parse(res._body);
        return resP.response ? resP.response.relatedprojectnames : [];
      })
    );
  }

  //setCES(event) {
  //  this.isCes = false;
  //    if (event && event.itss) {
  //      this.isCes = true;
  //      this.disableITSSFlag = true;
  //  } else {
  //      this.disableITSSFlag = false;
  //}
  //}

  //onStateChanged(e) {
  //  this.isCes = !(this.isCes);
  //}

  onSubmit(form: NgForm) {
    let apiParam = {
      requisitionid: this.requisitionid,
      clientid: this.selectedClient,
      changereason: this.reason,
      // projectname: this.selectedProject,
      // practicetower: this.selectedTower,
     // ces: this.isCes
    }
    this.isUploading = true;
    this.requisitionsService.updateClient(apiParam).subscribe((res) => {
      debugger;
      let body = JSON.parse(res._body);
      if (body.response) {
        this.isUploading = false;
        this.displayMessage = body.message ? body.message : "";
        setTimeout(() => {
          this.displayMessage = "";
          this.activeModal.close("success");
        }, 2000);
      } else {
        this.errorMessage = body.message ? body.message : "";
        this.isUploading = false;
        setTimeout(() => {
          this.errorMessage = "";
        }, 2000);
      }
    });

  }
}
