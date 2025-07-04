import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerDemandPlanComponent } from './owner-demand-plan.component';

describe('OwnerDemandPlanComponent', () => {
  let component: OwnerDemandPlanComponent;
  let fixture: ComponentFixture<OwnerDemandPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OwnerDemandPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerDemandPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
