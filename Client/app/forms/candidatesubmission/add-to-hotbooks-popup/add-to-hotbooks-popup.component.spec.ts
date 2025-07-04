import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddToHotbooksPopupComponent } from './add-to-hotbooks-popup.component';

describe('AddToHotbooksPopupComponent', () => {
  let component: AddToHotbooksPopupComponent;
  let fixture: ComponentFixture<AddToHotbooksPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddToHotbooksPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddToHotbooksPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
