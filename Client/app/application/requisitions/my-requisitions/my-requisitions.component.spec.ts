import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRequisitionsComponent } from './my-requisitions.component';

describe('MyRequisitionsComponent', () => {
  let component: MyRequisitionsComponent;
  let fixture: ComponentFixture<MyRequisitionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyRequisitionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRequisitionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
