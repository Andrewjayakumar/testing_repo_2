import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDemandPlanComponent } from './add-demand-plan.component';

describe('AddDemandPlanComponent', () => {
  let component: AddDemandPlanComponent;
  let fixture: ComponentFixture<AddDemandPlanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDemandPlanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDemandPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
