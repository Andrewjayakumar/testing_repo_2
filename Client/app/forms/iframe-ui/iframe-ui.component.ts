import { Component, OnInit, Input, AfterViewInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-iframe-ui',
  templateUrl: './iframe-ui.component.html',
  styleUrls: ['./iframe-ui.component.scss']
})
export class IframeUiComponent implements OnInit, AfterViewInit {
  @Input() public data: any;
  @Input() public control: any;
  @Input() public access: string = 'write';
  // public control_id = null;
  constructor(private hostElement: ElementRef) { }

  ngOnInit() {
    // this.control_id = this.control.isTableView ? this.data['id'] + this.control.key : this.control.id;
  }

  ngAfterViewInit() {
    const iframe = this.hostElement.nativeElement.querySelector('iframe');
    iframe.src = this.control.src;
  }
}
