import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidatelistHotbooksComponent } from './candidatelist-hotbooks.component';

describe('CandidatelistHotbooksComponent', () => {
  let component: CandidatelistHotbooksComponent;
  let fixture: ComponentFixture<CandidatelistHotbooksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidatelistHotbooksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatelistHotbooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
