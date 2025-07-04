import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateoutlineForPopupComponent } from './candidateoutline-for-popup.component';

describe('CandidateoutlineForPopupComponent', () => {
  let component: CandidateoutlineForPopupComponent;
  let fixture: ComponentFixture<CandidateoutlineForPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateoutlineForPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateoutlineForPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
