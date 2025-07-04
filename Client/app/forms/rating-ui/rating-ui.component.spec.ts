import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingUiComponent } from './rating-ui.component';

describe('RatingUiComponent', () => {
  let component: RatingUiComponent;
  let fixture: ComponentFixture<RatingUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RatingUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
