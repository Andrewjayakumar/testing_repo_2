import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecdetailsComponent } from './recdetails.component';

describe('RecdetailsComponent', () => {
  let component: RecdetailsComponent;
  let fixture: ComponentFixture<RecdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
