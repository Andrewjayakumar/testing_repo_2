import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../core/authservice/auth.service";

@Component({
  selector: 'apps-update',
  templateUrl: './update.component.html',
  styleUrls: ['./update.component.scss']
})
export class UpdateComponent implements OnInit {

  constructor(private auth: AuthService) { }

  ngOnInit() {
   
  }

}
