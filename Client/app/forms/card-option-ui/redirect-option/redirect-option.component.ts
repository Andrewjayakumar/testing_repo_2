import { Component, OnInit, Input} from '@angular/core';

@Component({
    selector: 'app-redirect-option',
    templateUrl: './redirect-option.component.html',
    styleUrls: ['./redirect-option.component.scss']
})
export class RedirectOptionComponent implements OnInit {
    @Input() public data: any;
    @Input() public control: any;
    redirectOptions: any = {};
    constructor() { }

    ngOnInit() {
        
        this.redirectOptions = this.data[this.control.key];
    }

}
