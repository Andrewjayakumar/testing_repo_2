import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequisitionComponent } from './add-requisition.component';

describe('AddRequisitionComponent', () => {
  let component: AddRequisitionComponent;
  let fixture: ComponentFixture<AddRequisitionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRequisitionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequisitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
