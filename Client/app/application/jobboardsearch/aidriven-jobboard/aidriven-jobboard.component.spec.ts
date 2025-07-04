import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AidrivenJobboardComponent } from './aidriven-jobboard.component';

describe('AidrivenJobboardComponent', () => {
  let component: AidrivenJobboardComponent;
  let fixture: ComponentFixture<AidrivenJobboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AidrivenJobboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AidrivenJobboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
