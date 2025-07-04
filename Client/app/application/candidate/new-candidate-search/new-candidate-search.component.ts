import { Component, OnInit } from '@angular/core';
import { JobboardsearchService } from '../../jobboardsearch/jobboardsearch.service';
import { AuthService } from '../../../core/authservice/auth.service';

@Component({
  selector: 'app-new-candidate-search',
  templateUrl: './new-candidate-search.component.html',
  styleUrls: ['./new-candidate-search.component.scss'],
  providers: [JobboardsearchService]
})

export class NewCandidateSearchComponent implements OnInit {

  isNewCandidateSearch: boolean = true;
  
  constructor(public auth: AuthService) {}

  ngOnInit() {
  }

}
