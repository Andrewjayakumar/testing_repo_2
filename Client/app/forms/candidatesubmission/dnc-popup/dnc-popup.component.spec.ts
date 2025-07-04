import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DncPopupComponent } from './dnc-popup.component';

describe('DncPopupComponent', () => {
  let component: DncPopupComponent;
  let fixture: ComponentFixture<DncPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DncPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DncPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
