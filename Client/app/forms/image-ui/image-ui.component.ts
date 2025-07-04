import { Component, OnInit, Input } from '@angular/core';

import { FormGroup } from '@angular/forms';
@Component({
  selector: 'app-image-ui',
  templateUrl: './image-ui.component.html',
  styleUrls: ['./image-ui.component.scss']
})
export class ImageUiComponent implements OnInit {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public formGroup: FormGroup;
  @Input() public access: string = 'write';
  public control_id = null;
  constructor() { }

  ngOnInit() {
    this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
  }
 
}
