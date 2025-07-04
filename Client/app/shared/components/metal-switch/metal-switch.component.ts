import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-metal-switch',
  templateUrl: './metal-switch.component.html',
  styleUrls: ['./metal-switch.component.scss']
})
export class MetalSwitchComponent implements OnInit {

  @Input('state')
  public state: boolean = true;
  @Output('stateChange')
  public stateChange = new EventEmitter();
  @Input('labelname')
    public labelname: string;
    @Input('position')
    public position: string = 'after'; // after, justify


  @Input()
  public uniqueid : string = "checkbox1";

    @Input()
    public isdisable: boolean = false;

  constructor() { }

  ngOnInit() {
  
   
  }
    ngAfterViewInit() {
    
    }

    onStateChanged($event) {
     // this.state = !(this.state);
     
      this.stateChange.emit(this.state);
    }

    //assuming called when reset is cliked
    writeValue(obj: any): void {
        if (obj === null) {
            this.state = false;
        }
        this.stateChange.emit(this.state);
    }
}
