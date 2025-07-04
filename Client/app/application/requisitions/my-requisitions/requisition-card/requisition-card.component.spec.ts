import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisitionCardComponent } from './requisition-card.component';

describe('RequisitionCardComponent', () => {
  let component: RequisitionCardComponent;
  let fixture: ComponentFixture<RequisitionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequisitionCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisitionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
