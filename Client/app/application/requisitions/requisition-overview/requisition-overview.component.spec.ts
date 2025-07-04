import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionOverviewComponent } from './requisition-overview.component';

describe('RequisitionOverviewComponent', () => {
  let component: RequisitionOverviewComponent;
  let fixture: ComponentFixture<RequisitionOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitionOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
