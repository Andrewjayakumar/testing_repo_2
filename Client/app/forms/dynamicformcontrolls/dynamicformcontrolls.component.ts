import { Component, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DataService } from '../../core/services/data.service';

@Component({
    selector: 'app-dynamicformcontrolls',
    templateUrl: './dynamicformcontrolls.component.html',
    styleUrls: ['./dynamicformcontrolls.component.scss']
})
export class DynamicformcontrollsComponent implements OnChanges {
    @Input() public data: any;
    @Input() public control: any;
    @Input() public formGroup: FormGroup;
    @Input() public access: string = 'write';
    @Input() public sidebar: boolean = false;
    @Input() public filterdata: any = [];
    @Input() public appid: any = "";
    @Input() public formdata: any = {};
    @Input() public AuthService;
    @Input() public disabled: boolean = false;
    @Output() public controlEvent = new EventEmitter<any>();

    constructor(private _appService: DataService) { }

    ngOnChanges() {
      if (this.AuthService) {
        if (this.AuthService.accessTokenExpiryDate) {
          const diff: number = Math.abs(this.AuthService.accessTokenExpiryDate.getTime() - new Date().getTime());
          if (diff < 120000) {
            this._appService.getnewtoken();
          }
        }
      }
    }
    controlClick() {
        this.controlEvent.emit();
    }
}
