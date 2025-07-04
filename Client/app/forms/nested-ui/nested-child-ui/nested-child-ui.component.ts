import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../../../core/services/data.service';
import { FormControlService } from '../../form-control.service';

@Component({
  selector: 'app-nested-child-ui',
  templateUrl: './nested-child-ui.component.html',
  styleUrls: ['./nested-child-ui.component.scss']
})
export class NestedChildUiComponent implements OnInit {
  @Input() public nestedItems: any;
  @Input() public data: any;
  @Input() public AuthService: any;
  header: any = [];
  constructor(
    private _appService: DataService,
    private _controlservice: FormControlService
  ) { }

  ngOnInit() {
  }
  gethClass(i) {
    if (this.header[i]) {
      return this.header[i].hclass;
    } else {
      return "fa-plus-circle";
    }
  }
  getbClass(i) {
    if (this.header[i]) {
      return this.header[i].bclass;
    } else {
      if (this.nestedItems.children.length > 0)
        return "d-none";
      else
        return "";
    }
  }
  headeClick(index) {
    var header: any = {}
    if (!this.header[index] || this.header[index].hclass == "fa-plus-circle") {
      header.hclass = "fa-minus-circle"
      header.bclass = "d-block";
      this.header[index] = header;


    } else {
      header.hclass = "fa-plus-circle";
      if (this.nestedItems.children.length > 0)
        header.bclass = "d-none";

      this.header[index] = header;
    }
  }
}
