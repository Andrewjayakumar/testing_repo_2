import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoPopupComponent } from './co-popup.component';

describe('CoPopupComponent', () => {
  let component: CoPopupComponent;
  let fixture: ComponentFixture<CoPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoPopupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
