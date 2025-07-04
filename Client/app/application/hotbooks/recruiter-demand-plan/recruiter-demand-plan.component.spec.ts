import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecruiterDemandPlanComponent } from './recruiter-demand-plan.component';

describe('RecruiterDemandPlanComponent', () => {
  let component: RecruiterDemandPlanComponent;
  let fixture: ComponentFixture<RecruiterDemandPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecruiterDemandPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecruiterDemandPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
