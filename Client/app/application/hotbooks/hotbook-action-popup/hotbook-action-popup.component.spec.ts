import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HotbookActionPopupComponent } from './hotbook-action-popup.component';

describe('HotbookActionPopupComponent', () => {
  let component: HotbookActionPopupComponent;
  let fixture: ComponentFixture<HotbookActionPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HotbookActionPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HotbookActionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
