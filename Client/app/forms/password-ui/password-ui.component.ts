import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-password-ui',
    templateUrl: './password-ui.component.html',
    styleUrls: ['./password-ui.component.scss']
})
export class PasswordUiComponent implements OnInit {

    @Input() public data: any;
    @Input() public control: any;
    @Input() public formGroup: FormGroup;
    public control_id = null;
    constructor() { }

    ngOnInit() {
        this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
    }
}
