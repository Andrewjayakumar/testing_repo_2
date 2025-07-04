import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AiRequisitionMatchComponent } from './ai-requisition-match.component';

describe('AiRequisitionMatchComponent', () => {
  let component: AiRequisitionMatchComponent;
  let fixture: ComponentFixture<AiRequisitionMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AiRequisitionMatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AiRequisitionMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
