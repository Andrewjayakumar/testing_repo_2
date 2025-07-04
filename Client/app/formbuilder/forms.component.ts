import { Component, OnInit } from '@angular/core';
import { AuthService } from "../core/authservice/auth.service";
@Component({
  selector: 'apps-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.scss']
})
export class FormsComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
    
  }

}
