import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer, SafeStyle, SafeHtml } from '@angular/platform-browser';
@Component({
    selector: 'app-card-ui',
    templateUrl: './card-ui.component.html',
    styleUrls: ['./card-ui.component.scss']
})
export class CardUiComponent implements OnInit {
    @Input() public control: any;
    @Input() public buttons: any;
    @Input() public data: any;
    @Output() add: any = new EventEmitter<any>();
    @Output() edit: any = new EventEmitter<any>();
    @Output() delete: any = new EventEmitter<any>();
    @Output() moveup: any = new EventEmitter<any>();
    @Output() movedown: any = new EventEmitter<any>();
    player: any;
    constructor(private _sanitizer: DomSanitizer) { }

    ngOnInit() {

    }
    getBackground(image) {
        return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
    }
    safehtml(value) {
        return this._sanitizer.bypassSecurityTrustHtml(value);
        // return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
    }
    Addrow(data: any) {
        this.add.next(data);
    }
    Editrow(data: any) {
        this.edit.next(data);
    }
    Deleterow(data: any) {
        this.delete.next(data);
    }
    Moveuprow(data: any) {
        this.moveup.next(data);
    }
    Movedownrow(data: any) {
        this.movedown.next(data);
    }
    savePlayer(player) {
        this.player = player;
        console.log('player instance', player)
    }
    onStateChange(event) {
        console.log('player state', event.data);
    }
}
