import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateoutlineComponent } from './candidateoutline.component';

describe('CandidateoutlineComponent', () => {
  let component: CandidateoutlineComponent;
  let fixture: ComponentFixture<CandidateoutlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateoutlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateoutlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
