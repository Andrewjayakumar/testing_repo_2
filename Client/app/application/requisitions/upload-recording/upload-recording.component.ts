import { Component, Input, OnInit } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Router, ActivatedRoute } from "@angular/router";
import { RequisitionsService } from "./../requisitions.service";

@Component({
  selector: "app-upload-recording",
  templateUrl: "./upload-recording.component.html",
  styleUrls: ["./upload-recording.component.scss"],
  providers: [RequisitionsService],
})

export class UploadRecordingComponent implements OnInit {
  fileToUpload: File | string = "";
  link: any;
  notes: any;
  fileType: any;
  isUploadVideo: boolean = false;
  videoFile: any;
  fileName: any;
  isUploading: boolean = false;
  displayMessage: string = "";
  errorMessage: string = "";
  warningMessage: string = "";

  public inputdata;
  public requisitionid;
  public candidateid;
  @Input() candId;
  public reqId;

  constructor(
    private currentRoute: ActivatedRoute,
    public activeModal: NgbActiveModal,
    public RequisitionsService: RequisitionsService,
    private route: ActivatedRoute
  ) {
    this.reqId = this.route.snapshot.queryParams['requisitionid'];
  }

  ngOnInit() {
    if (Array.isArray(this.inputdata)) {
      this.inputdata.forEach((x) => {
        if (x.key == "candidateid") {
          this.candidateid = x.value;
        } else if (x.key == "id" || "requisitionid") {
          this.requisitionid = x.value;
        }
      });
    }

    if (this.candId) {
      this.candidateid = this.candId;
    }
    if (this.reqId) {
      this.requisitionid = this.reqId;
    }
  }

  handleFileInput(files: FileList) {
    this.warningMessage = "";
    this.fileToUpload = files.item(0);
    if(this.fileToUpload.size > 104857600) {
      this.warningMessage = "File is too big! Maximum file size allowed is 100 MB"
      this.fileToUpload = "";
    } else {
      this.fileName = this.fileToUpload.name;
    }
  }

  onStateChanged(e) {
    // // this.state = !(this.state);
    debugger;
    this.isUploadVideo = !(this.isUploadVideo);
  }

  closePopup() {
    this.fileToUpload = "";
    this.link = null;
    this.notes = null;
    this.activeModal.close();
  }

  uploadFile() {
    if(this.isUploadVideo) {
     this.link = null;
     this.fileType = "Video";
    } else {
      this.fileToUpload = "";
      this.fileType = "Link";
    }
    this.isUploading = true;
    const formData = new FormData();
    formData.append("file", this.fileToUpload);
    formData.append("ResumeLink", this.link);
    formData.append("CandidateId", this.candidateid);
    formData.append("RequisitionId", this.requisitionid);
    formData.append("Comments", this.notes);
    formData.append("FileType", this.fileType);

    this.RequisitionsService.postFile(formData).subscribe((res) => {
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
        this.isUploading = false;
        this.errorMessage = body.message ? body.message : "";
        setTimeout(() => {
          this.errorMessage = "";
        }, 2000);
      }
    });
  }
}

