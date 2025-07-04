import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GooglePlacesUiComponent } from './google-places-ui.component';

describe('GooglePlacesUiComponent', () => {
  let component: GooglePlacesUiComponent;
  let fixture: ComponentFixture<GooglePlacesUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GooglePlacesUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GooglePlacesUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
