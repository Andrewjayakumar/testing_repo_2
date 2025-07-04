import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinToReqPopupComponent } from './pin-to-req-popup.component';

describe('PinToReqPopupComponent', () => {
  let component: PinToReqPopupComponent;
  let fixture: ComponentFixture<PinToReqPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinToReqPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinToReqPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
